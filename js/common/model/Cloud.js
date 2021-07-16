// Copyright 2021, University of Colorado Boulder

/**
 * The Cloud class is a simple model of a cloud in the atmosphere.  Clouds can interact with light, generally reflecting
 * it in both the up and down directions.  The shape of the cloud is modelled as an elliptical shape that is created from the provided width, height
 * and center position.
 *
 * @author Jesse Greenberg
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';

// constants
const VISIBLE_LIGHT_REFLECTIVITY = 0.3; // proportion from 0 to 1 that controls how much visible light is reflected
const INFRARED_REFLECTIVITY = 0; // proportion from 0 to 1 that controls how much infrared radiation is reflected

class Cloud {

  /**
   * @param {Vector2} position
   * @param {number} width - in meters
   * @param {number} height - in meters
   */
  constructor( position, width, height ) {

    // parameter checking
    assert && assert( width <= GreenhouseEffectConstants.SUNLIGHT_SPAN, 'cloud can\'t exceed the sunlight span' );

    // @public (read-only) {Vector2}
    this.position = position;

    // @public (read-only) {number}
    this.width = width;
    this.height = height;

    // @public - controls whether the cloud is interacting with light
    this.enabledProperty = new BooleanProperty( false );

    // @public (read-only) {Shape} - elliptical shape that defines the space which the cloud occupies
    this.modelShape = Shape.ellipse( position.x, position.y, width / 2, height / 2 );

    // @private - Map of EM wavelengths to total reflectivity proportion for this cloud.  The reflectivity for a given
    // wavelength is the proportion of light that this cloud will reflect, and is based on the reflectivity
    // characteristics of the cloud and its width relative to the span of the incoming sunlight.
    this.reflectivityTable = new Map( [
      [
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        width / GreenhouseEffectConstants.SUNLIGHT_SPAN * VISIBLE_LIGHT_REFLECTIVITY
      ],
      [
        GreenhouseEffectConstants.INFRARED_WAVELENGTH,
        width / GreenhouseEffectConstants.SUNLIGHT_SPAN * INFRARED_REFLECTIVITY
      ]
    ] );
  }

  /**
   * Interact with the provided energy.  Energy may be partially reflected.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt - delta time, in seconds
   * @public
   */
  interactWithEnergy( emEnergyPackets, dt ) {

    emEnergyPackets.forEach( energyPacket => {

      // convenience variable
      const altitude = this.position.y;

      // Check for energy that may be interacting with this cloud.
      if ( this.enabledProperty.value &&
           ( ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ||
             ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ) ) {

        assert && assert( this.reflectivityTable.has( energyPacket.wavelength ) );

        // Calculate the amount of energy reflected by the cloud.
        const reflectedEnergy = energyPacket.energy * this.reflectivityTable.get( energyPacket.wavelength );

        if ( reflectedEnergy > 0 ) {

          // Attenuate the amount of energy in the non-reflected packet by the amount the was reflected.
          energyPacket.energy = energyPacket.energy - reflectedEnergy;

          // Create a new packet of the same type with the reflected energy, heading in the opposite direction.
          const reflectedEnergyPacket = new EMEnergyPacket(
            energyPacket.wavelength,
            reflectedEnergy,
            altitude + ( altitude - energyPacket.altitude ),
            energyPacket.directionOfTravel === EnergyDirection.UP ? EnergyDirection.DOWN : EnergyDirection.UP
          );
          emEnergyPackets.push( reflectedEnergyPacket );
        }
      }
    } );
  }

  /**
   * Get the reflectivity of the cloud for the provided wavelength.
   * @param {number} wavelength
   * @returns {number} - a normalized value between 0 and 1, which 1 is max reflectivity
   * @public
   */
  getReflectivity( wavelength ) {
    assert && assert( this.reflectivityTable.has( wavelength ) );
    return this.reflectivityTable.get( wavelength );
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;