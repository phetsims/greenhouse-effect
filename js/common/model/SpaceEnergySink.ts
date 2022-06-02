// Copyright 2021-2022, University of Colorado Boulder

/**
 * SpaceEnergySink a place where outgoing energy can be sent if we don't want to do anything with it.  It exists
 * primarily as a place for the top energy absorbing/emitting layer in a stack to send its energy.  In a sense, it
 * "complete the circuit", and thus enables the code to have assertions in place that make sure something is being done
 * with all energy outputs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EMEnergyPacket from './EMEnergyPacket.js';

class SpaceEnergySink extends PhetioObject {
  private readonly altitude: number;
  readonly incomingUpwardMovingEnergyRateTracker: EnergyRateTracker;

  constructor( altitude: number, tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioType: SpaceEnergySink.SpaceEnergySinkIO
    } );

    this.altitude = altitude;

    // {read-only} - energy rate tracking for incoming upward-moving energy, used for debugging
    this.incomingUpwardMovingEnergyRateTracker = new EnergyRateTracker( {
      tandem: tandem.createTandem( 'incomingUpwardMovingEnergyRateTracker' )
    } );
  }

  /**
   * Check for interaction with the provided energy.  In this case, energy that is emitted into space is removed.
   */
  public interactWithEnergy( emEnergyPackets: EMEnergyPacket[], dt: number ): void {

    let energyEmittedIntoSpace = 0;

    emEnergyPackets.forEach( energyPacket => {

      if ( energyPacket.altitude >= this.altitude && energyPacket.direction === EnergyDirection.UP ) {
        energyEmittedIntoSpace += energyPacket.energy;
        energyPacket.energy = 0; // reduce energy to zero, which will cause this one to be removed from the list
      }
    } );

    // Remove all the fully absorbed energy packets.
    _.remove( emEnergyPackets, emEnergyPacket => emEnergyPacket.energy === 0 );

    // Track the incoming energy rate.
    this.incomingUpwardMovingEnergyRateTracker.addEnergyInfo( energyEmittedIntoSpace, dt );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static get STATE_SCHEMA(): { [ key: string ]: IOType } {
    return {
      incomingUpwardMovingEnergyRateTracker: EnergyRateTracker.EnergyRateTrackerIO
    };
  }

  /**
   * SpaceEnergySinkIO handles PhET-iO serialization of the SpaceEnergySink. Because serialization involves accessing
   * private members, it delegates to SpaceEnergySink. The methods that SpaceEnergySinkIO overrides are typical of
   * 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  static SpaceEnergySinkIO = IOType.fromCoreType( 'SpaceEnergySinkIO', SpaceEnergySink );
}

greenhouseEffect.register( 'SpaceEnergySink', SpaceEnergySink );
export default SpaceEnergySink;
