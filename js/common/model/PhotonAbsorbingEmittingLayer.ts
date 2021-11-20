// Copyright 2021, University of Colorado Boulder

/**
 * PhotonAbsorbingEmittingLayer is a model element that is responsible for absorbing and re-emitting individual photons
 * at the altitude where an AtmosphereLayer exists.  It does this based on the absorbance of the atmosphere layer.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Photon from './Photon.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// enum that enumerates the possible results when testing whether a photon crossed a layer
const PhotonCrossingTestResult = Enumeration.byKeys( [
  'FULLY_ABOVE', 'FULLY_BELOW', 'CROSSED_BUT_IGNORED', 'CROSSED_AND_ABSORBED' ]
);

type PhotonAbsorbingEmittingLayerOptions = {
  photonMaxLateralJumpProportion: number;
  photonAbsorptionTime: number;
};

class PhotonAbsorbingEmittingLayer {
  private readonly photonAbsorptionTime: number;
  private readonly photonMaxJumpDistance: number;
  private readonly photonToAbsorbedTimeMap: Map<Photon, number>;
  private readonly photons: ObservableArray<Photon>;
  private atmosphereLayer: AtmosphereLayer;

  constructor( photons: ObservableArray<Photon>,
               atmosphereLayer: AtmosphereLayer,
               providedOptions?: PhotonAbsorbingEmittingLayerOptions ) {

    const options = merge( {

      // This value represents the maximum lateral distance, expressed in proportion of the total layer width, between
      // where a photon is absorbed in a layer to where it is re-emitted.
      photonMaxLateralJumpProportion: 0.01,

      // the time that a photon is absorbed into a layer before being re-emitted
      photonAbsorptionTime: 0.1

    }, providedOptions ) as Required<PhotonAbsorbingEmittingLayerOptions>;

    this.photons = photons;
    this.atmosphereLayer = atmosphereLayer;

    // a Map that is used to track the amount of time that an absorbed photon has been absorbed into this layer
    this.photonToAbsorbedTimeMap = new Map<Photon, number>();

    // options that control various aspects of the photon re-emission process
    this.photonAbsorptionTime = options.photonAbsorptionTime;
    this.photonMaxJumpDistance = options.photonMaxLateralJumpProportion * AtmosphereLayer.WIDTH;
  }

  /**
   * Check a photon for whether it has crossed this layer and, if so, decide based on the layer's absorbance and some
   * random factors whether the photon should be absorbed and, if so, do the absorption.
   * @param photon - the photon to be tested
   */
  public checkForPhotonInteraction( photon: Photon ): any {
    let result;
    const previousPhotonAltitude = photon.previousPosition.y;
    const currentPhotonAltitude = photon.positionProperty.value.y;
    const layerAltitude = this.atmosphereLayer.altitude;
    if ( previousPhotonAltitude < layerAltitude ) {
      if ( currentPhotonAltitude < layerAltitude ) {
        // @ts-ignore
        result = PhotonCrossingTestResult.FULLY_BELOW;
      }
      else {
        // @ts-ignore
        result = PhotonCrossingTestResult.CROSSED_BUT_IGNORED;
      }
    }
    else if ( previousPhotonAltitude > layerAltitude ) {
      if ( currentPhotonAltitude > layerAltitude ) {
        // @ts-ignore
        result = PhotonCrossingTestResult.FULLY_ABOVE;
      }
      else {
        // @ts-ignore
        result = PhotonCrossingTestResult.CROSSED_BUT_IGNORED;
      }
    }

    // @ts-ignore
    if ( this.atmosphereLayer.isActiveProperty.value && result === PhotonCrossingTestResult.CROSSED_BUT_IGNORED ) {

      // The photon has crossed this layer.  Decide whether to absorb it.
      if ( dotRandom.nextDouble() <= this.atmosphereLayer.energyAbsorptionProportionProperty.value ) {

        // Absorb the photon by removing it from the list and adding it to the local map that will track the time for
        // which it has been absorbed in this layer.
        this.photons.remove( photon );
        this.photonToAbsorbedTimeMap.set( photon, 0 );
        // @ts-ignore
        result = PhotonCrossingTestResult.CROSSED_AND_ABSORBED;
      }
    }

    return result;
  }

  /**
   * Re-emit any previously absorbed photons that are ready.
   * @param dt - delta time, in seconds
   */
  step( dt: number ) {

    // For each of the photons that have been absorbed into this layer, decide whether it should be re-emitted and, if
    // so, decide where and in what direction.  If not, update the absorbed time.
    for ( const [ photon, absorptionTime ] of this.photonToAbsorbedTimeMap ) {
      const updatedAbsorptionTime = absorptionTime + dt;
      if ( updatedAbsorptionTime > this.photonAbsorptionTime ) {

        // This photon has been around long enough, and it's time to release it.
        photon.positionProperty.set( this.createPhotonReleasePosition( photon ) );
        photon.velocity.set( PhotonAbsorbingEmittingLayer.createPhotonReleaseVelocity() );
        photon.resetPreviousPosition();
        this.photonToAbsorbedTimeMap.delete( photon );
        this.photons.push( photon );
      }
      else {
        this.photonToAbsorbedTimeMap.set( photon, updatedAbsorptionTime );
      }
    }
  }

  reset() {
    this.photonToAbsorbedTimeMap.clear();
  }

  /**
   * Create a release position that is random and based on the option that specifies the horizontal variation and the
   * altitude of the layer.
   * @private
   */
  private createPhotonReleasePosition( photon: Photon ): Vector2 {
    const jump = this.photonMaxJumpDistance * dotRandom.nextDoubleBetween( -1, 1 );
    return new Vector2( photon.positionProperty.value.x + jump, this.atmosphereLayer.altitude );
  }

  /**
   * Create the release velocity for this photon.  The speed must be the simulation's value for the speed of light,
   * but the direction can be generally up or down and within a "code" of possible directions.
   * @private
   */
  private static createPhotonReleaseVelocity(): Vector2 {
    const velocity = new Vector2( 0, GreenhouseEffectConstants.SPEED_OF_LIGHT );

    // Randomly determine if the general direction should be up or down.
    if ( dotRandom.nextBoolean() ) {
      velocity.setY( -velocity.y );
    }

    // Add some randomness to the general direction.
    velocity.rotate( dotRandom.nextDoubleBetween( -1, 1 ) * Math.PI / 8 );

    return velocity;
  }
}

export { PhotonAbsorbingEmittingLayerOptions };
export { PhotonCrossingTestResult };

greenhouseEffect.register( 'PhotonAbsorbingEmittingLayer', PhotonAbsorbingEmittingLayer );
export default PhotonAbsorbingEmittingLayer;