// Copyright 2021-2022, University of Colorado Boulder

/**
 * EMEnergyPacket models a packet or bundle of electromagnetic energy.  It's kind of like a really big photon.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyDirection from './EnergyDirection.js';

class EMEnergyPacket {

  // wavelength of the energy in this packet, in meters
  readonly wavelength: number;

  // energy in this packet, in joules
  energy: number;

  // altitude in meters
  altitude: number;
  previousAltitude: number;

  // direction in which this energy is moving
  direction: EnergyDirection;

  /**
   * @param wavelength - in meters
   * @param energy - in joules
   * @param initialAltitude - in meters
   * @param direction
   */
  constructor( wavelength: number, energy: number, initialAltitude: number, direction: EnergyDirection ) {
    this.wavelength = wavelength;
    this.energy = energy;
    this.altitude = initialAltitude;
    this.previousAltitude = initialAltitude;
    this.direction = direction;
  }

  /**
   * convenience method for determining whether the EM energy contained in this packet is in the visible light range
   */
  public get isVisible(): boolean {
    return this.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
  }

  /**
   * convenience method for determining whether the EM energy contained in this packet is in the infrared light range
   */
  public get isInfrared(): boolean {
    return this.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH;
  }

  /**
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {
    this.previousAltitude = this.altitude;

    if ( this.direction === EnergyDirection.UP ) {
      this.altitude += dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
    else {
      this.altitude -= dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
  }

  /**
   * Serializes this EMEnergyPacket instance.
   */
  public toStateObject(): EMEnergyPacketStateObject {
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
   */
  static fromStateObject( stateObject: EMEnergyPacketStateObject ): EMEnergyPacket {
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
   */
  public static get STATE_SCHEMA(): { [ key: string ]: IOType } {
    return {
      wavelength: NumberIO,
      energy: NumberIO,
      altitude: NumberIO,
      previousAltitude: NumberIO,
      direction: EnumerationIO( EnergyDirection )
    };
  }

  /**
   * EMEnergyPacketIO handles PhET-iO serialization of EMEnergyPacket. Because serialization involves accessing private
   * members, it delegates to EMEnergyPacket. The methods that EMEnergyPacketIO overrides are typical of 'Dynamic element
   * serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  static EMEnergyPacketIO = IOType.fromCoreType( 'EMEnergyPacketIO', EMEnergyPacket );
}

type EMEnergyPacketStateObject = {
  wavelength: number;
  energy: number;
  altitude: number;
  previousAltitude: number;
  direction: EnergyDirection;
};

greenhouseEffect.register( 'EMEnergyPacket', EMEnergyPacket );
export default EMEnergyPacket;
