// Copyright 2021, University of Colorado Boulder

/**
 * The PhotonCollection class is used to manage a set of photons in the Greenhouse Effect model.  This includes
 * creating the visible-light photons that come from the sun, creating the infrared photons that radiate from the Earth,
 * moving the photons through the atmosphere, and managing their interaction with the energy-absorbing-and-emitting
 * layers in the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SunEnergySource from './SunEnergySource.js';
import GroundLayer from './GroundLayer.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import Photon from './Photon.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import LayersModel from './LayersModel.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import PhotonAbsorbingEmittingLayer, { PhotonAbsorbingEmittingLayerOptions, PhotonCrossingTestResult } from './PhotonAbsorbingEmittingLayer.js';

// constants
const SUN_NOMINAL_PHOTON_CREATION_RATE = 1; // photons created per second (from the sun)

type PhotonCollectionOptions = {
  photonAbsorbingEmittingLayerOptions?: PhotonAbsorbingEmittingLayerOptions
}

class PhotonCollection {

  readonly photons: ObservableArray<Photon> = createObservableArray();
  private readonly sunEnergySource: SunEnergySource;
  private readonly groundLayer: GroundLayer;
  private photonCreationCountdown: number = 0;
  private groundPhotonProductionRate: number = 0;
  private groundPhotonProductionTimeAccumulator: number = 0;
  public readonly photonAbsorbingEmittingLayers: PhotonAbsorbingEmittingLayer[];

  constructor( sunEnergySource: SunEnergySource,
               groundLayer: GroundLayer,
               atmosphereLayers: AtmosphereLayer[],
               providedOptions?: PhotonCollectionOptions ) {

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

    const options = merge( {

      // options passed to the instances of PhotonAbsorbingEmittingLayer, see the class definition for details
      photonAbsorbingEmittingLayerOptions: {
        photonMaxLateralJumpProportion: 0.1,
        photonAbsorptionTime: 1.0
      }
    }, providedOptions ) as PhotonCollectionOptions;

    this.sunEnergySource = sunEnergySource;
    this.groundLayer = groundLayer;

    // For each of the energy-absorbing-and-emitting layers in the atmosphere, create a layer that will absorb and emit
    // photons.
    this.photonAbsorbingEmittingLayers = atmosphereLayers.map(
      atmosphereLayer => new PhotonAbsorbingEmittingLayer(
        this.photons,
        atmosphereLayer,
        options.photonAbsorbingEmittingLayerOptions
      ) );
  }

  step( dt: number ) {

    if ( this.sunEnergySource.isShiningProperty.value ) {

      // Create photons from the sun if it's time to do so.
      this.photonCreationCountdown -= dt;
      while ( this.photonCreationCountdown <= 0 ) {
        this.photons.push( new Photon(
          new Vector2(
            -LayersModel.SUNLIGHT_SPAN / 2 + dotRandom.nextDouble() * LayersModel.SUNLIGHT_SPAN,
            LayersModel.HEIGHT_OF_ATMOSPHERE
          ),
          Photon.VISIBLE_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, -Photon.SPEED ) }
        ) );
        const photonCreationRate = SUN_NOMINAL_PHOTON_CREATION_RATE *
                                   this.sunEnergySource.proportionateOutputRateProperty.value;
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

        // This photon is moving downward and has reached the ground. Decide whether it should be absorbed or reflected.
        if ( photon.isVisible && dotRandom.nextDouble() < this.groundLayer.albedoProperty.value ) {

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
              // @ts-ignore
              if ( photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_BUT_IGNORED ||
                   // @ts-ignore
                   photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_AND_ABSORBED ||
                   // @ts-ignore
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
              // @ts-ignore
              if ( photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_BUT_IGNORED ||
                   // @ts-ignore
                   photonCrossingTestResult === PhotonCrossingTestResult.CROSSED_AND_ABSORBED ||
                   // @ts-ignore
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
            dotRandom.nextDoubleBetween( -GreenhouseEffectConstants.SUNLIGHT_SPAN / 2, GreenhouseEffectConstants.SUNLIGHT_SPAN / 2 ),
            0
          ),
          Photon.IR_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, Photon.SPEED ).rotated( ( dotRandom.nextDouble() - 0.5 ) * Math.PI / 8 ) }
        ) );

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
   * Restore initial state.
   */
  reset() {
    this.photons.clear();
    this.photonAbsorbingEmittingLayers.forEach( layer => layer.reset() );
    this.groundPhotonProductionRate = 0;
    this.groundPhotonProductionTimeAccumulator = 0;
  }

  /**
   * Calculate the rate of infrared photon production for the ground based on its temperature.
   */
  static groundTemperatureToIRPhotonProductionRate( groundTemperature: number, cutoffTemperature: number ) {

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
}

greenhouseEffect.register( 'PhotonCollection', PhotonCollection );
export default PhotonCollection;