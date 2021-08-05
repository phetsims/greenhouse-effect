// Copyright 2021, University of Colorado Boulder

/**
 * SpaceEnergySink a place where outgoing energy can be sent if we don't want to do anything with it.  It exists
 * primarily as a place for the top energy absorbing/emitting layer in a stack to send its energy.  In a sense, it
 * "complete the circuit", and thus enables the code to have assertions in place that make sure something is being done
 * with all energy outputs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';

class SpaceEnergySink {

  /**
   * @param {number} altitude
   * @param {Tandem} tandem
   */
  constructor( altitude, tandem ) {

    // @private
    this.altitude = altitude;

    // @public {read-only} - energy rate tracking for incoming upward-moving energy, used for debugging
    this.incomingUpwardMovingEnergyRateTracker = new EnergyRateTracker( {
      tandem: tandem.createTandem( 'incomingUpwardMovingEnergyRateTracker' )
    } );
  }

  /**
   * Check for interaction with the provided energy.  In this case, energy that is emitted into space is removed.
   * @param {PhetioGroup.<EMEnergyPacket>} emEnergyPacketGroup
   * @param {number} dt
   * @public
   */
  interactWithEnergy( emEnergyPacketGroup, dt ) {

    let energyEmittedIntoSpace = 0;
    const packetsToDispose = [];

    emEnergyPacketGroup.forEach( energyPacket => {

      if ( energyPacket.altitude >= this.altitude && energyPacket.directionOfTravel === EnergyDirection.UP ) {
        energyEmittedIntoSpace += energyPacket.energy;
        packetsToDispose.push( energyPacket );
      }
    } );

    packetsToDispose.forEach( energyPacket => {
      emEnergyPacketGroup.disposeElement( energyPacket );
    } );

    // Track the incoming energy rate.
    this.incomingUpwardMovingEnergyRateTracker.addEnergyInfo( energyEmittedIntoSpace, dt );
  }
}

greenhouseEffect.register( 'SpaceEnergySink', SpaceEnergySink );
export default SpaceEnergySink;
