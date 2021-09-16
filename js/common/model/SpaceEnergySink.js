// Copyright 2021, University of Colorado Boulder

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

class SpaceEnergySink extends PhetioObject {

  /**
   * @param {number} altitude
   * @param {Tandem} tandem
   */
  constructor( altitude, tandem ) {

    super( {
      tandem: tandem,
      phetioType: SpaceEnergySink.SpaceEnergySinkIO
    } );

    // @private
    this.altitude = altitude;

    // @public {read-only} - energy rate tracking for incoming upward-moving energy, used for debugging
    this.incomingUpwardMovingEnergyRateTracker = new EnergyRateTracker( {
      tandem: tandem.createTandem( 'incomingUpwardMovingEnergyRateTracker' )
    } );
  }

  /**
   * Check for interaction with the provided energy.  In this case, energy that is emitted into space is removed.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt
   * @public
   */
  interactWithEnergy( emEnergyPackets, dt ) {

    let energyEmittedIntoSpace = 0;

    emEnergyPackets.forEach( energyPacket => {

      if ( energyPacket.altitude >= this.altitude && energyPacket.directionOfTravel === EnergyDirection.UP ) {
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
   * TODO: stateSchema default applyState doesn't know if composite keys should call applyState or fromStateObject, https://github.com/phetsims/tandem/issues/245
   * for phet-io
   * @public
   */
  applyState( stateObject ) {
    EnergyRateTracker.EnergyRateTrackerIO.applyState( this.incomingUpwardMovingEnergyRateTracker, stateObject.incomingUpwardMovingEnergyRateTracker );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  static get STATE_SCHEMA() {
    return {
      incomingUpwardMovingEnergyRateTracker: EnergyRateTracker.EnergyRateTrackerIO
    };
  }
}

/**
 * @public
 * SpaceEnergySinkIO handles PhET-iO serialization of the SpaceEnergySink. Because serialization involves accessing
 * private members, it delegates to SpaceEnergySink. The methods that SpaceEnergySinkIO overrides are typical of
 * 'Dynamic element serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
SpaceEnergySink.SpaceEnergySinkIO = IOType.fromCoreType( 'SpaceEnergySinkIO', SpaceEnergySink );

greenhouseEffect.register( 'SpaceEnergySink', SpaceEnergySink );
export default SpaceEnergySink;
