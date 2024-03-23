// Copyright 2021-2024, University of Colorado Boulder

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
import Disposable from '../../../../axon/js/Disposable.js';

class EMEnergyPacket {

  // wavelength of the energy in this packet, in meters
  public readonly wavelength: number;

  // energy in this packet, in joules
  public energy: number;

  // altitude in meters
  public altitude: number;
  public previousAltitude: number;

  // direction in which this energy is moving
  public direction: EnergyDirection;

  /**
   * @param wavelength - in meters
   * @param energy - in joules
   * @param initialAltitude - in meters
   * @param direction
   */
  public constructor( wavelength: number, energy: number, initialAltitude: number, direction: EnergyDirection ) {
    this.wavelength = wavelength;
    this.energy = energy;
    this.altitude = initialAltitude;
    this.previousAltitude = initialAltitude;
    this.direction = direction;
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

  // Instances of this class are intended to be lightweight and own no Property instances, so disposal is unneeded and
  // not supported.
  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  /**
   * EMEnergyPacketIO implements data type serialization as described in
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   * This is appropriate because EMEnergyPacket instances are not PhetioObjects, and they come and go as the sim
   * evolves, and creating new instances during deserialization works fine.
   */
  public static readonly EMEnergyPacketIO = new IOType<EMEnergyPacket, EMEnergyPacketStateObject>( 'EMEnergyPacketIO', {
    valueType: EMEnergyPacket,
    stateSchema: {
      wavelength: NumberIO,
      energy: NumberIO,
      altitude: NumberIO,
      direction: EnumerationIO( EnergyDirection ),

      // Fields that begin with '_' will not be shown in Studio.
      _previousAltitude: NumberIO
    },
    fromStateObject: ( stateObject: EMEnergyPacketStateObject ) => {
      const emEnergyPacket = new EMEnergyPacket(
        stateObject.wavelength,
        stateObject.energy,
        stateObject.altitude,
        EnumerationIO( EnergyDirection ).fromStateObject( stateObject.direction )
      );
      emEnergyPacket.previousAltitude = stateObject._previousAltitude;
      return emEnergyPacket;
    }
  } );
}

export type EMEnergyPacketStateObject = {
  wavelength: number;
  energy: number;
  altitude: number;
  _previousAltitude: number;
  direction: EnergyDirection;
};

greenhouseEffect.register( 'EMEnergyPacket', EMEnergyPacket );
export default EMEnergyPacket;