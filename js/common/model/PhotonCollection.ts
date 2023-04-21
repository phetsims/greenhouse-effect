// Copyright 2021-2023, University of Colorado Boulder

/**
 * The PhotonCollection class is used to manage a set of photons in the Greenhouse Effect model.  This includes
 * creating the visible-light photons that come from the sun, creating the infrared photons that radiate from the Earth,
 * moving the photons through the atmosphere, and managing their interaction with the energy-absorbing-and-emitting
 * layers in the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import GroundLayer from './GroundLayer.js';
import LayersModel from './LayersModel.js';
import Photon, { PhotonStateObject } from './Photon.js';
import PhotonAbsorbingEmittingLayer, { PhotonAbsorbingEmittingLayerOptions, PhotonCrossingTestResult } from './PhotonAbsorbingEmittingLayer.js';
import SunEnergySource from './SunEnergySource.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const SUN_NOMINAL_PHOTON_CREATION_RATE = 10; // photons created per second (from the sun)
const DEFAULT_PROPORTION_OF_INVISIBLE_PHOTONS = 5; // ratio of invisible to visible photons when NOT showing all photons
assert && assert( Number.isInteger( DEFAULT_PROPORTION_OF_INVISIBLE_PHOTONS ), 'value must be an integer' );

// The following Range is used to help decide where to reflect photons when a glacier is present.  It is in meters, and
// defines the x-range on the ground where the glacier exists.  This value must be manually coordinated with the
// artwork.
const GLACIER_X_RANGE = new Range( 12500, 42500 );

type SelfOptions = {

  // options passed to the instances of PhotonAbsorbingEmittingLayer, see the class definition for details
  photonAbsorbingEmittingLayerOptions?: PhotonAbsorbingEmittingLayerOptions;

  // whether a glacier is present, which will affect how photons are reflected from the ground
  glacierPresentProperty?: TReadOnlyProperty<boolean>;

  // phet-io
  tandem: Tandem;
};
type PhotonCollectionOptions = SelfOptions & PhetioObjectOptions;

class PhotonCollection extends PhetioObject {

  public readonly photons: ObservableArray<Photon>;
  public readonly photonAbsorbingEmittingLayers: PhotonAbsorbingEmittingLayer[];
  public readonly showAllSimulatedPhotonsInViewProperty: BooleanProperty;
  private readonly sunEnergySource: SunEnergySource;
  private readonly groundLayer: GroundLayer;
  private readonly glacierPresentProperty: TReadOnlyProperty<boolean>;
  private photonCreationCountdown: number;
  private groundPhotonProductionRate: number;
  private groundPhotonProductionTimeAccumulator: number;
  private visiblePhotonCreationCount: number;
  private infraredPhotonCreationCount: number;

  public constructor( sunEnergySource: SunEnergySource,
                      groundLayer: GroundLayer,
                      atmosphereLayers: AtmosphereLayer[],
                      providedOptions?: PhotonCollectionOptions ) {

    const options = optionize<PhotonCollectionOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: PhotonCollection.PhotonCollectionIO,
      glacierPresentProperty: new BooleanProperty( false ),
      photonAbsorbingEmittingLayerOptions: {
        photonMaxLateralJumpProportion: 0.1,
        photonAbsorptionTime: 1.0
      }
    }, providedOptions );

    super( options );

    // Some of the code in this class depends on the atmosphere layers being in ascending order of altitude, so verify
    // that this is true.
    if ( assert && atmosphereLayers.length > 1 ) {
      let layersInAscendingOrder = true;
      for ( let i = 1; i < atmosphereLayers.length; i++ ) {
        if ( atmosphereLayers[ i ].altitude <= atmosphereLayers[ i - 1 ].altitude ) {
          layersInAscendingOrder = false;
          break;
        }
      }
      assert( layersInAscendingOrder, 'atmosphere layers must be in order of ascending altitude' );
    }

    this.sunEnergySource = sunEnergySource;
    this.groundLayer = groundLayer;
    this.glacierPresentProperty = options.glacierPresentProperty;

    // Create the observable array where the photons will be kept.
    this.photons = createObservableArray();

    // Initialize the counters and other values that control the photon production rate.
    this.photonCreationCountdown = 0;
    this.groundPhotonProductionRate = 0;
    this.groundPhotonProductionTimeAccumulator = 0;
    this.visiblePhotonCreationCount = 0;
    this.infraredPhotonCreationCount = 0;

    // There is a requirement in the sim design to support a mode where there are lots of visible photons and one where
    // there are relatively few.  This property is the one that controls which of those to modes this photon collection
    // is in.
    this.showAllSimulatedPhotonsInViewProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'showAllSimulatedPhotonsInViewProperty' )
    } );

    // For each of the energy-absorbing-and-emitting layers in the atmosphere, create a layer that will absorb and emit
    // photons.
    this.photonAbsorbingEmittingLayers = atmosphereLayers.map(
      atmosphereLayer => new PhotonAbsorbingEmittingLayer(
        this.photons,
        atmosphereLayer,
        options.photonAbsorbingEmittingLayerOptions
      )
    );
  }

  /**
   * Step the object forward in time.
   * @param dt - time in seconds
   */
  public step( dt: number ): void {

    if ( this.sunEnergySource.isShiningProperty.value ) {

      // Create photons from the sun if it's time to do so.
      this.photonCreationCountdown -= dt;
      const photonCreationRate = SUN_NOMINAL_PHOTON_CREATION_RATE *
                                 this.sunEnergySource.proportionateOutputRateProperty.value;
      while ( this.photonCreationCountdown <= 0 ) {
        this.photons.push( new Photon(
          new Vector2(
            -LayersModel.SUNLIGHT_SPAN.width / 2 + dotRandom.nextDouble() * LayersModel.SUNLIGHT_SPAN.width,
            LayersModel.HEIGHT_OF_ATMOSPHERE
          ),
          Photon.VISIBLE_WAVELENGTH,
          {
            initialVelocity: new Vector2( 0, -Photon.SPEED ),
            showState: this.visiblePhotonCreationCount === 0 ?
                       Photon.ShowState.ALWAYS :
                       Photon.ShowState.ONLY_IN_MORE_PHOTONS_MODE
          }
        ) );
        this.visiblePhotonCreationCount = ( this.visiblePhotonCreationCount + 1 ) % DEFAULT_PROPORTION_OF_INVISIBLE_PHOTONS;
        this.photonCreationCountdown += 1 / photonCreationRate;
      }
    }

    const photonsToRemove: Photon[] = [];
    const photonsToAdd: Photon[] = [];

    // Update each of the individual photons.
    this.photons.forEach( photon => {
      if ( photon.positionProperty.value.y >= LayersModel.HEIGHT_OF_ATMOSPHERE && photon.velocity.y > 0 ) {

        // This photon is moving upwards and is out of the simulated area, so remove it.
        photonsToRemove.push( photon );
      }
      else if ( photon.positionProperty.value.y < 0 && photon.velocity.y < 0 ) {

        // This photon is moving downward and has reached the ground.  Decide whether to reflect or absorb it.

        // Figure out what albedo value to use for potential reflection.
        let albedo = this.groundLayer.albedoProperty.value;
        if ( this.glacierPresentProperty.value ) {

          // The glacier is present, so the reflection is concentrated in the area where the glacier resides.
          albedo = GLACIER_X_RANGE.contains( photon.positionProperty.value.x ) ?
                   Math.min( albedo / ( GLACIER_X_RANGE.getLength() / GroundLayer.WIDTH ), 1 ) :
                   0;
        }

        // Decide whether it should be absorbed or reflected.
        if ( photon.isVisible && dotRandom.nextDouble() < albedo ) {

          // The photon should be reflected.  Simulate this by reversing its vertical velocity.
          photon.velocity.setXY( photon.velocity.x, -photon.velocity.y );
        }
        else {

          // The photon should be absorbed.  Simulate this by removing it.
          photonsToRemove.push( photon );
        }
      }
      else {

        // Move the photon.
        photon.step( dt );

        // Test the photon against all the layers to see if it should be absorbed.  This loop is written for efficiency
        // so that it does the least number of comparisons possible, hence the use of old-style C for loops and `break`
        // statements.

        // If this is an infrared photon, test is against the atmosphere layers to see if it should be absorbed.
        if ( photon.isInfrared ) {

          // the following comparison loops are written for efficiency so that it does the least number of comparisons
          // possible, hence the use of classic C-style for loops and `break` statements.
          const photonMovingDown = photon.previousPosition.y > photon.positionProperty.value.y;
          if ( photonMovingDown ) {
            for ( let i = this.photonAbsorbingEmittingLayers.length - 1; i >= 0; i-- ) {
              const photonAbsorbingEmittingLayer = this.photonAbsorbingEmittingLayers[ i ];

              // Test the photon against this layer.  This may end up absorbing the photon.
              const photonCrossingTestResult = photonAbsorbingEmittingLayer.checkForPhotonInteraction( photon );

              // Continue only to the point where the photon has been absorbed, has crossed a layer without being
              // absorbed, or still has a chance of crossing another layer in the direction it's heading.
              if ( photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_BUT_IGNORED ||
                   photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_AND_ABSORBED ||
                   photonCrossingTestResult === PhotonCrossingTestResult.FULLY_ABOVE ) {
                break;
              }
            }
          }
          else {
            for ( let i = 0; i < this.photonAbsorbingEmittingLayers.length; i++ ) {
              const photonAbsorbingEmittingLayer = this.photonAbsorbingEmittingLayers[ i ];

              // Test the photon against this layer.  This may end up absorbing the photon.
              const photonCrossingTestResult = photonAbsorbingEmittingLayer.checkForPhotonInteraction( photon );

              // Continue only to the point where the photon has been absorbed, has crossed a layer without being
              // absorbed, or still has a chance of crossing another layer in the direction it's heading.
              if ( photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_BUT_IGNORED ||
                   photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_AND_ABSORBED ||
                   photonCrossingTestResult === PhotonCrossingTestResult.FULLY_BELOW ) {
                break;
              }
            }
          }
        }
      }
    } );

    // Update the rate at which the ground is producing IR photons.
    this.groundPhotonProductionRate = PhotonCollection.groundTemperatureToIRPhotonProductionRate(
      this.groundLayer.temperatureProperty.value,
      this.groundLayer.minimumTemperature
    );

    // Produce photons from the ground based on its temperature.
    if ( this.groundPhotonProductionRate > 0 ) {

      this.groundPhotonProductionTimeAccumulator += dt;

      while ( this.groundPhotonProductionTimeAccumulator >= 1 / this.groundPhotonProductionRate ) {

        // Add an IR photon that is radiating from the ground.
        photonsToAdd.push( new Photon(
          new Vector2(
            dotRandom.nextDoubleBetween( -LayersModel.SUNLIGHT_SPAN.width / 2, LayersModel.SUNLIGHT_SPAN.width / 2 ),
            0
          ),
          Photon.IR_WAVELENGTH,
          {
            initialVelocity: new Vector2( 0, Photon.SPEED ).rotated( ( dotRandom.nextDouble() - 0.5 ) * Math.PI / 8 ),
            showState: this.infraredPhotonCreationCount++ === 0 ?
                       Photon.ShowState.ALWAYS :
                       Photon.ShowState.ONLY_IN_MORE_PHOTONS_MODE
          }
        ) );

        // Update the counter that is used to decide the "show state" for the IR photons.
        this.infraredPhotonCreationCount = ( this.infraredPhotonCreationCount + 1 ) % DEFAULT_PROPORTION_OF_INVISIBLE_PHOTONS;

        // Reduce the accumulator to reflect that a photon has been produced.
        this.groundPhotonProductionTimeAccumulator -= 1 / this.groundPhotonProductionRate;
      }
    }

    // Add and remove photons from our list.
    photonsToRemove.forEach( photon => { this.photons.remove( photon ); } );
    photonsToAdd.forEach( photon => { this.photons.push( photon ); } );

    // Test for photon interactions with the layers.
    this.photonAbsorbingEmittingLayers.forEach( layer => layer.step( dt ) );
  }

  /**
   * Serialize this instance to a state object, used for phet-io.
   */
  public toStateObject(): PhotonCollectionStateObject {
    return {
      photonStateObjects: ArrayIO( Photon.PhotonIO ).toStateObject( this.photons )
    };
  }

  /**
   * Set the state of this instance based on the provided state object, used for phet-io.
   */
  public applyState( stateObject: PhotonCollectionStateObject ): void {
    this.photons.clear();
    this.photons.push(
      ...ArrayIO( Photon.PhotonIO ).fromStateObject( stateObject.photonStateObjects )
    );
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.photons.clear();
    this.photonAbsorbingEmittingLayers.forEach( layer => layer.reset() );
    this.groundPhotonProductionRate = 0;
    this.groundPhotonProductionTimeAccumulator = 0;
    this.showAllSimulatedPhotonsInViewProperty.reset();
    this.visiblePhotonCreationCount = 0;
    this.infraredPhotonCreationCount = 0;
  }

  /**
   * Calculate the rate of infrared photon production for the ground based on its temperature.
   */
  public static groundTemperatureToIRPhotonProductionRate( groundTemperature: number, cutoffTemperature: number ): number {

    let photonProductionRate = 0;

    // The following computation is designed to produce no photons below the minimum cutoff temperature, and above that
    // to produce a quantity that makes sense - at least roughly - compared to the number of photons coming in from the
    // sun.  See https://github.com/phetsims/greenhouse-effect/issues/116 for more background on this.
    const visibleToInfraredRatio = 5;
    if ( groundTemperature > cutoffTemperature ) {
      const radiatedEnergyPerUnitSurfaceArea = Math.pow( groundTemperature, 4 ) *
                                               GreenhouseEffectConstants.STEFAN_BOLTZMANN_CONSTANT;

      // The divisor used in the following calculation was empirically determined to equal the radiated energy value
      // when the Earth is at 288K, which is the current average surface temperature.  Thus, the first portion of the
      // calculation is 1 at this temperature.
      photonProductionRate = radiatedEnergyPerUnitSurfaceArea / 390 *
                             visibleToInfraredRatio * SUN_NOMINAL_PHOTON_CREATION_RATE;
    }

    return photonProductionRate;
  }

  public static readonly PhotonCollectionIO = new IOType( 'PhotonCollectionIO', {
    valueType: PhotonCollection,
    stateSchema: {
      photonStateObjects: ArrayIO( Photon.PhotonIO )
    },
    toStateObject: ( photonCollection: PhotonCollection ) => photonCollection.toStateObject(),
    applyState: ( photonCollection: PhotonCollection, stateObject: PhotonCollectionStateObject ) => photonCollection.applyState( stateObject ),
    defaultDeserializationMethod: 'applyState'
  } );
}

type PhotonCollectionStateObject = {
  photonStateObjects: PhotonStateObject[];
};

greenhouseEffect.register( 'PhotonCollection', PhotonCollection );
export default PhotonCollection;