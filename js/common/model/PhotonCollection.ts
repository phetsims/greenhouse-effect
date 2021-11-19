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
import PhotonAbsorbingEmittingLayer, { PhotonAbsorbingEmittingLayerOptions } from './PhotonAbsorbingEmittingLayer.js';

// constants
const SUN_PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)

type PhotonCollectionOptions = {
  photonAbsorbingEmittingLayerOptions?: PhotonAbsorbingEmittingLayerOptions
}

class PhotonCollection {

  readonly photons: ObservableArray<Photon> = createObservableArray();
  private readonly sunEnergySource: SunEnergySource;
  private readonly groundLayer: GroundLayer;
  private readonly atmosphereToPhotonAbsorbingEmittingLayersMap: Map<AtmosphereLayer, PhotonAbsorbingEmittingLayer>;
  private photonCreationCountdown: number = 0;
  private groundPhotonProductionRate: number = 0;
  private groundPhotonProductionTimeAccumulator: number = 0;

  constructor( sunEnergySource: SunEnergySource,
               groundLayer: GroundLayer,
               atmosphereLayers: AtmosphereLayer[],
               providedOptions?: PhotonCollectionOptions ) {

    const options = merge( {

      // options passed to the instances of PhotonAbsorbingEmittingLayer, see the class definition for details
      photonAbsorbingEmittingLayerOptions: {
        photonMaxLateralJumpProportion: 0.01,
        photonAbsorptionTime: 0.1
      }
    }, providedOptions ) as PhotonCollectionOptions;

    this.sunEnergySource = sunEnergySource;
    this.groundLayer = groundLayer;

    this.atmosphereToPhotonAbsorbingEmittingLayersMap = new Map<AtmosphereLayer, PhotonAbsorbingEmittingLayer>();
    atmosphereLayers.forEach( atmosphereLayer => {
      this.atmosphereToPhotonAbsorbingEmittingLayersMap.set(
        atmosphereLayer,
        new PhotonAbsorbingEmittingLayer( options.photonAbsorbingEmittingLayerOptions )
      );
    } );
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
        this.photonCreationCountdown += 1 / SUN_PHOTON_CREATION_RATE;
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

        // This photon is moving downward and has reached the ground.  Remove it, thus simulating that it has been
        // absorbed by the ground.
        photonsToRemove.push( photon );
      }
      else {
        const preMoveAltitude = photon.positionProperty.value.y;
        photon.step( dt );
        const postMoveAltitude = photon.positionProperty.value.y;
        if ( photon.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {

          // Check if this photon crossed any atmosphere layers this step.
          const crossedAtmosphereLayer = this.findCrossedAtmosphereLayer( preMoveAltitude, postMoveAltitude );

          if ( crossedAtmosphereLayer ) {

            // The photon crossed a layer.  Decide whether it should interact or pass right through.
            if ( dotRandom.nextDouble() < crossedAtmosphereLayer.energyAbsorptionProportionProperty.value ) {

              // For the interaction, reverse it with 50% probability.
              if ( dotRandom.nextBoolean() ) {
                photon.velocity = new Vector2( photon.velocity.x, -photon.velocity.y );
                photon.positionProperty.set( new Vector2( photon.positionProperty.value.x, crossedAtmosphereLayer.altitude ) );
              }
            }
          }
        }
      }
    } );

    // Update the rate at which the ground is producing IR photons.
    this.groundPhotonProductionRate = PhotonCollection.groundTemperatureToPhotonProductionRate(
      this.groundLayer.temperatureProperty.value
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

    // And and remove photons from our list.
    photonsToRemove.forEach( photon => { this.photons.remove( photon ); } );
    photonsToAdd.forEach( photon => { this.photons.push( photon ); } );
  }

  /**
   * Restore initial state.
   */
  reset() {
    this.photons.clear();
    this.groundPhotonProductionRate = 0;
    this.groundPhotonProductionTimeAccumulator = 0;
  }

  /**
   * Find a layer, if there is one, that would be crossed by an object traveling from the start altitude to the end
   * altitude.  If there are none, null is returned.  If there are several, the first one that would be crossed is
   * returned.
   *
   * Comparisons are exclusive for the first altitude, inclusive for the second.  See the code for details.
   *
   * This is intended to be pretty efficient, hence the use of regular 'for' loops and 'break' statements.
   *
   * TODO: This is temporary on 11/19/2021, need to replace with the right thing.
   */
  protected findCrossedAtmosphereLayer( startAltitude: number, endAltitude: number ): AtmosphereLayer | null {
    const atmosphereLayers = Array.from( this.atmosphereToPhotonAbsorbingEmittingLayersMap.keys() );
    let crossedLayer = null;
    if ( startAltitude < endAltitude ) {
      for ( let i = 0; i < atmosphereLayers.length; i++ ) {
        const atmosphereLayer = atmosphereLayers[ i ];
        if ( atmosphereLayer.isActiveProperty.value &&
             startAltitude < atmosphereLayer.altitude &&
             endAltitude >= atmosphereLayer.altitude ) {

          crossedLayer = atmosphereLayer;
          break;
        }
      }
    }
    else if ( startAltitude > endAltitude ) {
      for ( let i = atmosphereLayers.length - 1; i >= 0; i-- ) {
        const atmosphereLayer = atmosphereLayers[ i ];
        if ( atmosphereLayer.isActiveProperty.value &&
             startAltitude > atmosphereLayer.altitude &&
             endAltitude <= atmosphereLayer.altitude ) {

          crossedLayer = atmosphereLayer;
          break;
        }
      }
    }
    return crossedLayer;
  }

  /**
   * Calculate the rate of photon production for the ground based on its temperature.
   * @param groundTemperature
   */
  static groundTemperatureToPhotonProductionRate( groundTemperature: number ) {

    // The formula used here was empirically determined to get the desired density of photons.
    return Math.max( 0, ( groundTemperature - GroundLayer.MINIMUM_TEMPERATURE ) / 5 );
  }
}

greenhouseEffect.register( 'PhotonCollection', PhotonCollection );
export default PhotonCollection;