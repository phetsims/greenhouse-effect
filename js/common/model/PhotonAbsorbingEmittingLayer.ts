// Copyright 2021-2022, University of Colorado Boulder

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
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import Photon from './Photon.js';

// enum that enumerates the possible results when testing whether a photon crossed a layer
class PhotonCrossingTestResult extends EnumerationValue {
  static FULLY_ABOVE = new PhotonCrossingTestResult();
  static FULLY_BELOW = new PhotonCrossingTestResult();
  static CROSSED_BUT_IGNORED = new PhotonCrossingTestResult();
  static CROSSED_AND_ABSORBED = new PhotonCrossingTestResult();
  static NONE = new PhotonCrossingTestResult();

  static enumeration = new Enumeration( PhotonCrossingTestResult );
}

type PhotonAbsorbingEmittingLayerOptions = {

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

class PhotonAbsorbingEmittingLayer {
  public readonly thickness: number;
  private readonly photonAbsorptionTime: number;
  private readonly photonMaxJumpDistance: number;
  private readonly absorbanceMultiplier: number;
  private readonly photonToAbsorbedTimeMap: Map<Photon, number>;
  public readonly photons: ObservableArray<Photon>;
  private atmosphereLayer: AtmosphereLayer;
  public atLeastOnePhotonAbsorbedProperty: BooleanProperty;

  public constructor( photons: ObservableArray<Photon>,
                      atmosphereLayer: AtmosphereLayer,
                      providedOptions?: PhotonAbsorbingEmittingLayerOptions ) {

    const options = optionize<PhotonAbsorbingEmittingLayerOptions>()( {
      thickness: 0,
      photonMaxLateralJumpProportion: 0.01,
      photonAbsorptionTime: 0.1,
      absorbanceMultiplier: 1
    }, providedOptions );

    this.photons = photons;
    this.atmosphereLayer = atmosphereLayer;
    this.atLeastOnePhotonAbsorbedProperty = new BooleanProperty( false );
    this.thickness = options.thickness;

    // a Map that is used to track the amount of time that an absorbed photon has been absorbed into this layer
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

    // TODO: The design team is working on improving how the absorption and re-emission of photons looks.  On 6/1/2022
    //       the thickness of the layers was adjusted to be quite thin so that the photons didn't appear to jump across
    //       the layers.  This will need to be refined once the visual portrayal is finalized.  See
    //       https://github.com/phetsims/greenhouse-effect/issues/167.
    const bottomOfLayerAltitude = layerAltitude - this.thickness * 0.0001;
    const topOfLayerAltitude = layerAltitude + this.thickness * 0.0001;

    // TODO: This is a little hard to read, consider CROSSED_INDETERMINATE in the first portion, then post process, or something.
    if ( previousPhotonAltitude < bottomOfLayerAltitude ) {
      if ( currentPhotonAltitude < bottomOfLayerAltitude ) {
        result = PhotonCrossingTestResult.FULLY_BELOW;
      }
      else {
        result = PhotonCrossingTestResult.CROSSED_BUT_IGNORED;
      }
    }
    else if ( previousPhotonAltitude > topOfLayerAltitude ) {
      if ( currentPhotonAltitude > topOfLayerAltitude ) {
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
        photon.velocity.set( PhotonAbsorbingEmittingLayer.createPhotonReleaseVelocity() );
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
   * but the direction can be generally up or down and within a "code" of possible directions.
   */
  private static createPhotonReleaseVelocity(): Vector2 {
    const velocity = new Vector2( 0, GreenhouseEffectConstants.SPEED_OF_LIGHT );

    // Randomly determine if the general direction should be up or down.
    if ( dotRandom.nextBoolean() ) {
      velocity.setY( -velocity.y );
    }

    // Add some randomness to the general direction.
    velocity.rotate( dotRandom.nextDoubleBetween( -1, 1 ) * Math.PI / 4 );

    return velocity;
  }
}

export type { PhotonAbsorbingEmittingLayerOptions };
export { PhotonCrossingTestResult };

greenhouseEffect.register( 'PhotonAbsorbingEmittingLayer', PhotonAbsorbingEmittingLayer );
export default PhotonAbsorbingEmittingLayer;