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
const REFLECTIVITY = 0.5; // This is a proportion from 0 to 1 that controls how much incident light is reflected.

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

    // @private - The total reflectivity is the proportion of light that this will reflect, and is based on the
    // reflectivity characteristic of the cloud and its width relative to the span of the incoming sunlight.
    this.totalReflectivity = width / GreenhouseEffectConstants.SUNLIGHT_SPAN * REFLECTIVITY;

    // sanity check
    assert && assert( this.totalReflectivity <= 1, 'total reflectivity should never exceed 1' );
  }

  /**
   * Interact with the provided energy.  Energy may be partially reflected.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt - delta time, in seconds
   * @public
   */
  interactWithEnergy( emEnergyPackets, dt ) {

    emEnergyPackets.forEach( energyPacket => {

      // TODO: The following code reflects all downward moving energy based on the cloud's reflectivity and does nothing
      //       with the upward-moving energy.  This is temporary, and I (jbphet) need to work with the designers to find
      //       out exactly what the cloud should really do.

      // convenience variable
      const altitude = this.position.y;

      // Check for energy that may be interacting with this cloud.
      if ( this.enabledProperty.value &&
           ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ) {

        // This energy packet has reached or crossed through the cloud.  Reflect it.
        const reflectedEnergy = energyPacket.energy * this.totalReflectivity;

        // Reduce the amount of energy in the reflected packet by the amount the was reflected.
        energyPacket.energy = energyPacket.energy - reflectedEnergy;

        // Create a new packet of the same type with the reflected energy, heading in the opposite direction.
        const reflectedEnergyPacket = new EMEnergyPacket(
          energyPacket.wavelength,
          reflectedEnergy,
          altitude + ( altitude - energyPacket.altitude ),
          EnergyDirection.UP
        );
        emEnergyPackets.push( reflectedEnergyPacket );
      }
    } );
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;