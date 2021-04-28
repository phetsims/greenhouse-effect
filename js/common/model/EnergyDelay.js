// Copyright 2021, University of Colorado Boulder

/**
 * A model element that takes in an amount of energy at each step and delays it before it reaches its output.
 *
 * TODO: I (jbphet) am initially thinking of this as a temporary element needed for prototyping, so the documentation is
 *       going to be light.  This should be fleshed out if it ends up in the final model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';

class EnergyDelay {

  /**
   * @param {number} delayTime - in seconds
   */
  constructor( delayTime ) {

    // {number} (read-only) - output energy in joules, should be cleared via method once used
    this.outputEnergy = 0;

    // @private
    this.delayTime = delayTime;
    this.delayedEnergy = [];
  }

  /**
   * @param {number} incomingEnergy - in joules
   * @param {number} dt - time, in seconds
   * @public
   */
  step( incomingEnergy, dt ) {

    const currentTime = ( phet.joist.elapsedTime ) / 1000; // Why oh why is elapsed time in milliseconds?

    this.delayedEnergy.push(
      {
        energyAmount: incomingEnergy,
        exitTime: currentTime + this.delayTime
      }
    );

    // Add any energy that has been sufficiently delayed to the output energy and delete the entry from the delay queue.
    for ( let i = 0; i < this.delayedEnergy.length; i++ ) {
      if ( this.delayedEnergy[ 0 ].exitTime <= currentTime ) {
        const sufficientlyDelayedEnergy = this.delayedEnergy.shift();
        this.outputEnergy += sufficientlyDelayedEnergy.energyAmount;
      }
      else {
        break;
      }
    }
  }

  /**
   * @public
   */
  clearOutputEnergy() {
    this.outputEnergy = 0;
  }

  /**
   * @public
   */
  reset() {
    this.clearOutputEnergy();
    this.delayedEnergy = [];
  }
}

greenhouseEffect.register( 'EnergyDelay', EnergyDelay );
export default EnergyDelay;
