// Copyright 2021, University of Colorado Boulder

/**
 * EMEnergyPacket models a packet or bundle of electromagnetic energy.  It's kind of like a really big photon.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import EnumerationIO from '../../../../phet-core/js/EnumerationIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyDirection from './EnergyDirection.js';

// TODO: The direction should be of type EnergyDirection, but PhET's approach for enums isn't worked out yet, so it's
//       using the 'any' type.  This will need to be fixed up.
class EMEnergyPacket {
  readonly wavelength: number;
  energy: number;
  altitude: number;
  previousAltitude: number;
  readonly direction: any; // TODO: Should be EnergyDirection once TS enums are worked out.

  /**
   * @param {number} wavelength - in meters
   * @param {number} energy - in joules
   * @param {number} initialAltitude - in meters
   * @param {EnergyDirection} direction
   */
  constructor( wavelength: number, energy: number, initialAltitude: number, direction: any ) {

    // @public (read-only) {number}
    this.wavelength = wavelength;

    // @public {number}
    this.energy = energy;

    // @public (read-only) {number} - altitude in meters
    this.altitude = initialAltitude;

    // @public (read-only) {number} - the altitude at the previous step, in meters
    this.previousAltitude = initialAltitude;

    // @public (read-only) {EnergyDirection} - The direction in which this energy packet is moving, constrained to up
    //                                         or down.
    this.direction = direction;
  }

  /**
   * @param {number} dt - time, in seconds
   * @public
   */
  step( dt: number ) {
    this.previousAltitude = this.altitude;

    // @ts-ignore
    if ( this.direction === EnergyDirection.UP ) {
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
      direction: EnumerationIO( EnergyDirection ).toStateObject( this.direction )
    };
  }

  /**
   * for phet-io
   * @public
   */
  static fromStateObject( stateObject: EMEnergyPacketStateObject ) {
    const emEnergyPacket = new EMEnergyPacket(
      NumberIO.fromStateObject( stateObject.wavelength ),
      NumberIO.fromStateObject( stateObject.energy ),
      NumberIO.fromStateObject( stateObject.altitude ),
      EnumerationIO( EnergyDirection ).fromStateObject( stateObject.direction )
    );
    emEnergyPacket.previousAltitude = NumberIO.fromStateObject( stateObject.previousAltitude );
    return emEnergyPacket;
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  static get STATE_SCHEMA() {
    return {
      wavelength: NumberIO,
      energy: NumberIO,
      altitude: NumberIO,
      previousAltitude: NumberIO,
      direction: EnumerationIO( EnergyDirection )
    };
  }

  /**
   * @public
   * EMEnergyPacketIO handles PhET-iO serialization of EMEnergyPacket. Because serialization involves accessing private
   * members, it delegates to EMEnergyPacket. The methods that EMEnergyPacketIO overrides are typical of 'Dynamic element
   * serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  static EMEnergyPacketIO = IOType.fromCoreType( 'EMEnergyPacketIO', EMEnergyPacket );
}

type EMEnergyPacketStateObject = {
  wavelength: number,
  energy: number,
  altitude: number,
  previousAltitude: number,
  direction: any
};

greenhouseEffect.register( 'EMEnergyPacket', EMEnergyPacket );
export default EMEnergyPacket;
