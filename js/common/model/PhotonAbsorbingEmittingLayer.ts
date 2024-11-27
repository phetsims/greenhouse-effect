// Copyright 2021-2023, University of Colorado Boulder

/**
 * PhotonAbsorbingEmittingLayer is a model element that is responsible for absorbing and re-emitting individual photons
 * at the altitude where an AtmosphereLayer exists.  It does this based on the absorbance of the atmosphere layer.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO, { MapStateObject } from '../../../../tandem/js/types/MapIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import Photon from './Photon.js';

// enum that enumerates the possible results when testing whether a photon crossed a layer
class PhotonCrossingTestResult extends EnumerationValue {

  // The tested photon was fully above the layer against which it was tested.
  public static readonly FULLY_ABOVE = new PhotonCrossingTestResult();

  // The tested photon was fully below the layer against which it was tested.
  public static readonly FULLY_BELOW = new PhotonCrossingTestResult();

  // The tested photon crossed the layer against which it was tests but was ignored (i.e. not absorbed).
  public static readonly CROSSED_BUT_IGNORED = new PhotonCrossingTestResult();

  // The tested photon crossed the layer against which it was tested and was absorbed.
  public static readonly CROSSED_AND_ABSORBED = new PhotonCrossingTestResult();

  // No result, generally used as an initial value that is updated during the testing process.
  public static readonly NONE = new PhotonCrossingTestResult();

  public static readonly enumeration = new Enumeration( PhotonCrossingTestResult );
}

// This constant defines the range of angles at which photons can be radiated from a layer in either the up or down
// direction.  Think of it as the angular with of the cone above and below the layer where the photon can travel.
const PHOTON_EMISSION_ZONE_WIDTH = Math.PI / 2;

// The minimum amount of deflection that a photon should experience when being re-radiated after being absorbed.
const MIN_POST_ABSORPTION_ANGLE_CHANGE = Math.PI / 6;

type SelfOptions = {

  // thickness of the layer, in meters
  thickness?: number;

  // This value represents the maximum lateral distance, expressed in proportion of the total layer width, between
  // where a photon is absorbed in a layer to where it is re-emitted.
  photonMaxLateralJumpProportion?: number;

  // the time that a photon is absorbed into a layer before being re-emitted
  photonAbsorptionTime?: number;

  // A multiplier that is used on the layer's absorbance value when deciding whether to absorb a photon.  This can be
  // used to increase or decrease the amount of photons absorbed beyond what happens "naturally", i.e. based on the
  // absorbance of the corresponding AtmosphereLayer.  Note that this does *not* change the energy absorbance behavior,
  // and thus would have no impact on the temperature values.
  absorbanceMultiplier?: number;
};

export type PhotonAbsorbingEmittingLayerOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

class PhotonAbsorbingEmittingLayer extends PhetioObject {

  // thickness of this layer in meters
  public readonly thickness: number;

  // time, in seconds, for which photons are absorbed by this layer
  private readonly photonAbsorptionTime: number;

  // max horizontal distance that a photon will "jump" between absorption and re-emission
  private readonly photonMaxJumpDistance: number;

  // see options description for this one
  private readonly absorbanceMultiplier: number;

  // a Map that is used to track the amount of time that an absorbed photon has been absorbed into this layer
  private readonly photonToAbsorbedTimeMap: Map<Photon, number>;

  // photons that are moving around in the model and could potentially cross and be absorbed by this layer
  public readonly photons: ObservableArray<Photon>;

  // the atmosphere layer in the model to which this layer corresponds
  private atmosphereLayer: AtmosphereLayer;

  // a Property that transitions from false to true when the first photon is absorbed by this layer
  public atLeastOnePhotonAbsorbedProperty: BooleanProperty;

  public constructor( photons: ObservableArray<Photon>,
                      atmosphereLayer: AtmosphereLayer,
                      providedOptions: PhotonAbsorbingEmittingLayerOptions ) {

    const options = optionize<PhotonAbsorbingEmittingLayerOptions, SelfOptions, PhetioObjectOptions>()( {
      thickness: 0,
      photonMaxLateralJumpProportion: 0.01,
      photonAbsorptionTime: 0.1,
      absorbanceMultiplier: 1,
      phetioType: PhotonAbsorbingEmittingLayer.PhotonAbsorbingEmittingLayerIO,

      // To date there hasn't been a need to dispose instances of this class, so disposal is currently unsupported.
      isDisposable: false
    }, providedOptions );

    super( options );

    this.photons = photons;
    this.atmosphereLayer = atmosphereLayer;
    this.thickness = options.thickness;
    this.atLeastOnePhotonAbsorbedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'atLeastOnePhotonAbsorbedProperty' ),
      phetioReadOnly: true
    } );

    this.photonToAbsorbedTimeMap = new Map<Photon, number>();

    // options that control various aspects of the photon re-emission process
    this.photonAbsorptionTime = options.photonAbsorptionTime;
    this.photonMaxJumpDistance = options.photonMaxLateralJumpProportion * AtmosphereLayer.WIDTH;
    this.absorbanceMultiplier = options.absorbanceMultiplier;
  }

  /**
   * Check a photon for whether it has crossed this layer and, if so, decide based on the layer's absorbance and some
   * random factors whether the photon should be absorbed and, if so, do the absorption.
   * @param photon - the photon to be tested
   * @returns - an enum value indicating the type of interaction that occurred
   */
  public checkForPhotonInteraction( photon: Photon ): PhotonCrossingTestResult {
    let result = PhotonCrossingTestResult.NONE;
    const previousPhotonAltitude = photon.previousPosition.y;
    const currentPhotonAltitude = photon.positionProperty.value.y;
    const layerAltitude = this.atmosphereLayer.altitude;

    // Determine the initial crossing test result.  At this stage of the process, all crossings are designated as
    // CROSSED_BUT_IGNORED, but this may be changed to CROSSED_AND_ABSORBED by the subsequent code.
    if ( previousPhotonAltitude < layerAltitude ) {
      if ( currentPhotonAltitude < layerAltitude ) {
        result = PhotonCrossingTestResult.FULLY_BELOW;
      }
      else {
        result = PhotonCrossingTestResult.CROSSED_BUT_IGNORED;
      }
    }
    else if ( previousPhotonAltitude > layerAltitude ) {
      if ( currentPhotonAltitude > layerAltitude ) {
        result = PhotonCrossingTestResult.FULLY_ABOVE;
      }
      else {
        result = PhotonCrossingTestResult.CROSSED_BUT_IGNORED;
      }
    }

    // If the photon has crossed this layer, check whether it should be absorbed.
    if ( this.atmosphereLayer.isActiveProperty.value && result === PhotonCrossingTestResult.CROSSED_BUT_IGNORED ) {

      // Decide whether to absorb the photon based on the absorption proportion and a random value.
      if ( dotRandom.nextDouble() <=
           ( this.atmosphereLayer.energyAbsorptionProportionProperty.value * this.absorbanceMultiplier ) ) {

        // Absorb the photon by removing it from the list and adding it to the local map that will track the time for
        // which it has been absorbed in this layer.
        this.photons.remove( photon );
        this.photonToAbsorbedTimeMap.set( photon, 0 );
        this.atLeastOnePhotonAbsorbedProperty.set( true );
        result = PhotonCrossingTestResult.CROSSED_AND_ABSORBED;
      }
    }

    return result;
  }

  /**
   * Re-emit any previously absorbed photons that are ready.
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {

    // For each of the photons that have been absorbed into this layer, decide whether it should be re-emitted and, if
    // so, decide where and in what direction.  If not, update the absorbed time.
    for ( const [ photon, absorptionTime ] of this.photonToAbsorbedTimeMap ) {
      const updatedAbsorptionTime = absorptionTime + dt;
      if ( updatedAbsorptionTime > this.photonAbsorptionTime ) {

        // This photon has been around long enough, and it's time to release it.
        photon.velocity.set( PhotonAbsorbingEmittingLayer.createPhotonReleaseVelocity( photon.velocity ) );
        photon.positionProperty.set( this.createPhotonReleasePosition( photon ) );
        photon.resetPreviousPosition();
        this.photonToAbsorbedTimeMap.delete( photon );
        this.photons.push( photon );
      }
      else {
        this.photonToAbsorbedTimeMap.set( photon, updatedAbsorptionTime );
      }
    }
  }

  public reset(): void {
    this.photonToAbsorbedTimeMap.clear();
    this.atLeastOnePhotonAbsorbedProperty.reset();
  }

  /**
   * Create a release position that is random and based on the option that specifies the horizontal variation and the
   * altitude of the layer.
   */
  private createPhotonReleasePosition( photon: Photon ): Vector2 {
    const jump = this.photonMaxJumpDistance * dotRandom.nextDoubleBetween( -1, 1 );
    return new Vector2( photon.positionProperty.value.x + jump, this.atmosphereLayer.altitude );
  }

  /**
   * Create the release velocity for this photon.  The speed must be the simulation's value for the speed of light,
   * but the direction can be generally up or down and within a "cone" of possible directions.
   */
  private static createPhotonReleaseVelocity( previousVelocity: Vector2 ): Vector2 {

    // Create a velocity vector at the speed of light (in this sim).
    // const photonReleaseVelocity = new Vector2( 0, GreenhouseEffectConstants.SPEED_OF_LIGHT );
    // const photonReleaseVelocity = previousVelocity.copy();
    let photonReleaseVelocity;

    // Randomly determine whether to flip the up/down direction.
    if ( dotRandom.nextBoolean() ) {

      // We are flipping it.  This is the easier case, since we don't have to be concerned about a minimum deflection.
      // Start by creating a velocity vector that is straight up or down.
      const yDirectionMultiplier = previousVelocity.y > 0 ? -1 : 1;
      photonReleaseVelocity = new Vector2( 0, yDirectionMultiplier * GreenhouseEffectConstants.SPEED_OF_LIGHT );

      // Add some randomness to the general direction.
      photonReleaseVelocity.rotate( dotRandom.nextDoubleBetween( -1, 1 ) * PHOTON_EMISSION_ZONE_WIDTH / 2 );
    }
    else {

      // The direction is NOT going to be flipped.  In this case, we need to make sure that there is a minimum amount
      // of deflection of the photon's path so that it is easier for users to see that some interaction has occurred.
      photonReleaseVelocity = previousVelocity.copy();

      const minPositiveAngle = Math.PI / 2 - PHOTON_EMISSION_ZONE_WIDTH / 2;
      const maxPositiveAngle = Math.PI / 2 + PHOTON_EMISSION_ZONE_WIDTH / 2;

      const currentAngleAbsVal = Math.abs( previousVelocity.getAngle() );

      // Calculate the max amount of deflection that can occur in each direction (clockwise and counterclockwise) and
      // still stay within the allowable range of photon paths.
      const maxCounterclockwiseDeflection = maxPositiveAngle - currentAngleAbsVal;
      const maxClockwiseDeflection = minPositiveAngle - currentAngleAbsVal;

      // Based on the photon's original path, it may have either one or two possible deflections that can occur that
      // allow it to both stay within the allowed angle range and have the minimum deflection amount.  These are
      // calculated here.
      const candidateDeflectionAngles = [];
      if ( maxCounterclockwiseDeflection > MIN_POST_ABSORPTION_ANGLE_CHANGE ) {

        // There is enough room for a deflection in this direction, so randomly generate an angle in the allowed range
        // and add it to the list of candidate deflections.
        candidateDeflectionAngles.push(
          dotRandom.nextDoubleBetween( MIN_POST_ABSORPTION_ANGLE_CHANGE, maxCounterclockwiseDeflection )
        );
      }
      if ( Math.abs( maxClockwiseDeflection ) > MIN_POST_ABSORPTION_ANGLE_CHANGE ) {

        // There is enough room for a deflection in this direction, so randomly generate an angle in the allowed range
        // and add it to the list of candidate deflections.
        candidateDeflectionAngles.push(
          -dotRandom.nextDoubleBetween( MIN_POST_ABSORPTION_ANGLE_CHANGE, -maxClockwiseDeflection )
        );
      }

      // There should always be at least one deflection, otherwise something is wrong with the logic above.
      assert && assert( candidateDeflectionAngles.length > 0, 'Logic error - no candidate deflection angles' );

      // Randomly pick one of the deflections.
      let deflection = dotRandom.sample( candidateDeflectionAngles );

      // The code above works with the absolute value of the angle, which effectively means it translates any downward
      // moving vectors to be upward moving.  This is where that is compensated for if needed.
      if ( previousVelocity.y < 0 ) {
        deflection = -deflection;
      }

      photonReleaseVelocity = previousVelocity.rotated( deflection );
    }

    return photonReleaseVelocity;
  }

  /**
   * PhotonAbsorbingEmittingLayerIO uses reference serialization because these are PhetIOObjects and endure for the life
   * of the sim.
   */
  public static readonly PhotonAbsorbingEmittingLayerIO =
    new IOType<PhotonAbsorbingEmittingLayer, PhotonAbsorbingEmittingLayerStateObject>(
      'PhotonAbsorbingEmittingLayerIO',
      {
        valueType: PhotonAbsorbingEmittingLayer,
        stateSchema: {
          photonToAbsorbedTimeMap: MapIO( Photon.PhotonIO, NumberIO )
        }
      }
    );
}

export { PhotonCrossingTestResult };

type PhotonAbsorbingEmittingLayerStateObject = {
  photonToAbsorbedTimeMap: MapStateObject<Photon, number>;
};

export type { PhotonAbsorbingEmittingLayerStateObject };

greenhouseEffect.register( 'PhotonAbsorbingEmittingLayer', PhotonAbsorbingEmittingLayer );
export default PhotonAbsorbingEmittingLayer;