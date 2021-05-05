// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDelayLine is a model element that that serves to delay energy.  Functionally, this can be thought of as a
 * digital delay line, though it can't assume that it is being clocked consistently.  See
 * https://en.wikipedia.org/wiki/Digital_delay_line for more information on delay lines
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergySource from './EnergySource.js';

class EnergyDelayLine extends EnergySource {

  /**
   * @param {number} delayTime - in seconds
   * @param {EnergyDirection} direction - Is this energy moving up or down?
   */
  constructor( delayTime, direction ) {

    super();

    // @public - incoming energy this step
    this.incomingEnergyProperty = new NumberProperty( 0 );

    // @private
    this.direction = direction;
    this.delayTime = delayTime;
    this.delayedEnergy = [];
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    let energyToOutputThisStep = 0;
    let accumulatedTime = 0;

    // Update the delay queues, total up any outgoing entries, and mark expired entries for removal.
    this.delayedEnergy.forEach( delayQueueEntry => {

      if ( accumulatedTime + delayQueueEntry.dt < this.delayTime ) {

        // This entry has not been delayed enough yet, so add its dt to the accumulated time and move on.
        accumulatedTime += delayQueueEntry.dt;
      }
      else if ( accumulatedTime < this.delayTime && accumulatedTime + delayQueueEntry.dt >= this.delayTime ) {

        // This entry is on the border line, so use the portion HAS been delayed long enough and rewrite it to keep the
        // remainder.
        const proportionToUse = ( ( this.delayTime - accumulatedTime ) / delayQueueEntry.dt );
        energyToOutputThisStep += proportionToUse * delayQueueEntry.energy;
        accumulatedTime += proportionToUse * delayQueueEntry.dt;
        delayQueueEntry.energy = ( 1 - proportionToUse ) * delayQueueEntry.energy;
        delayQueueEntry.dt = ( 1 - proportionToUse ) * dt;
      }
      else {

        // The entry has been delayed for the full amount of time, accumulate its energy and mark it for deletion.
        energyToOutputThisStep += delayQueueEntry.energy;
        accumulatedTime += delayQueueEntry.dt;
        delayQueueEntry.dt = -1;
      }
    } );

    // Remove expired entries from the delay queue.
    this.delayedEnergy = this.delayedEnergy.filter( delayedEnergyEntry => delayedEnergyEntry.dt > 0 );

    // Put the incoming energy into the delay queue and clear the input.
    this.delayedEnergy.unshift( { dt: dt, energy: this.incomingEnergyProperty.value } );
    this.incomingEnergyProperty.set( 0 );

    // Output the energy for this step, if any.
    this.outputEnergy( this.direction, energyToOutputThisStep );
  }

  /**
   * @public
   */
  reset() {
    this.delayedEnergy = [];
  }
}

greenhouseEffect.register( 'EnergyDelayLine', EnergyDelayLine );
export default EnergyDelayLine;