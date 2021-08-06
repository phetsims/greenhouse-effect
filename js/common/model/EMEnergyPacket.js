// Copyright 2021, University of Colorado Boulder

/**
 * EMEnergyPacket models a packet or bundle of electromagnetic energy.  It's kind of like a really big photon.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

class EMEnergyPacket {

  /**
   * @param {number} wavelength - in meters
   * @param {number} energy - in joules
   * @param {number} initialAltitude - in meters
   * @param {Vector2} directionOfTravel
   */
  constructor( wavelength, energy, initialAltitude, directionOfTravel ) {

    // @public (read-only) {number}
    this.wavelength = wavelength;

    // @public {number}
    this.energy = energy;

    // @public (read-only) {number} - altitude in meters
    this.altitude = initialAltitude;

    // @public (read-only) {number} - the altitude at the previous step, in meters
    this.previousAltitude = initialAltitude;

    // @public (read-only) {EnergyDirection} - the direction in which this energy packet is moving
    this.directionOfTravel = directionOfTravel;
  }

  /**
   * @param {number} dt - time, in seconds
   * @public
   */
  step( dt ) {
    this.previousAltitude = this.altitude;

    // The following is optimized for speed, and make some assumptions about the direction of travel.
    if ( this.directionOfTravel.y > 0 ) {
      this.altitude += dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
    else {
      this.altitude -= dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
  }

  /**
   * Serializes this EMEnergyPacket instance.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      wavelength: NumberIO.toStateObject( this.wavelength ),
      energy: NumberIO.toStateObject( this.energy ),
      altitude: NumberIO.toStateObject( this.altitude ),
      previousAltitude: NumberIO.toStateObject( this.previousAltitude ),
      directionOfTravel: Vector2.Vector2IO.toStateObject( this.directionOfTravel )
    };
  }

  /**
   * for phet-io
   * @public
   */
  static fromStateObject( stateObject ) {
    return new EMEnergyPacket(
      stateObject.wavelength,
      stateObject.energy,
      stateObject.altitude,
      stateObject.directionOfTravel
    );
  }
}

/**
 * @public
 * EMEnergyPacketIO handles PhET-iO serialization of EMEnergyPacket. Because serialization involves accessing private
 * members, it delegates to EMEnergyPacket. The methods that EMEnergyPacketIO overrides are typical of 'Dynamic element
 * serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
EMEnergyPacket.EMEnergyPacketIO = IOType.fromCoreType( 'EMEnergyPacketIO', EMEnergyPacket, {
  stateSchema: {
    wavelength: NumberIO,
    energy: NumberIO,
    altitude: NumberIO,
    previousAltitude: NumberIO,
    directionOfTravel: Vector2.Vector2IO
  }
} );

greenhouseEffect.register( 'EMEnergyPacket', EMEnergyPacket );
export default EMEnergyPacket;
