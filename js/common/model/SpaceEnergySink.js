// Copyright 2021, University of Colorado Boulder

/**
 * SpaceEnergySink a place where outgoing energy can be sent if we don't want to do anything with it.  It exists
 * primarily as a place for the top energy absorbing/emitting layer in a stack to send its energy.  In a sense, it
 * "complete the circuit", and thus enables the code to have assertions in place that make sure something is being done
 * with all energy outputs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyRateTracker from './EnergyRateTracker.js';

class SpaceEnergySink {

  constructor( ) {

    // @public {read-only} - Energy coming in that is moving in the upward direction.
    this.incomingUpwardMovingEnergyProperty = new NumberProperty( 0 );

    // @public {read-only} - energy rate tracking for incoming upward-moving energy, used for debugging
    this.incomingUpwardMovingEnergyRateTracker = new EnergyRateTracker();
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // Log the energy.
    this.incomingUpwardMovingEnergyRateTracker.addEnergyInfo( this.incomingUpwardMovingEnergyProperty.value, dt );

    // Do nothing with the energy.
    this.incomingUpwardMovingEnergyProperty.reset();
  }
}

greenhouseEffect.register( 'SpaceEnergySink', SpaceEnergySink );
export default SpaceEnergySink;
