// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDelayLine is a model element that that serves to delay energy.  Functionally, this can be thought of as a
 * digital delay line, though it can't assume that it is being clocked consistently.  See
 * https://en.wikipedia.org/wiki/Digital_delay_line for more information on delay lines
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergySource from './EnergySource.js';

class EnergyDelayLine extends EnergySource {

  /**
   * @param {number} delayTime - in seconds
   * @param {EnergyDirection} direction - Is this energy moving up or down?
   * @param {Object} [options]
   */
  constructor( delayTime, direction, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super();

    // @public - incoming energy this step
    this.incomingEnergyProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'incomingEnergyProperty' )
    } );

    // @private
    this.direction = direction;
    this.delayTime = delayTime;
    this.totalTimeInEnergyQueue = 0;
    this.delayedEnergyQueue = [];
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // Put the incoming energy into the delay queue and clear the input.
    this.delayedEnergyQueue.push( { dt: dt, energy: this.incomingEnergyProperty.value } );
    this.incomingEnergyProperty.set( 0 );
    this.totalTimeInEnergyQueue += dt;
    let energyToOutputThisStep = 0;

    // Figure out how much time (and thus energy) to extract from the delay queue.
    let amountOfTimeToExtract = 0;
    if ( this.totalTimeInEnergyQueue > this.delayTime ) {

      // We need to extract the same amount as the time step to keep the energy flow steady, NOT just the excess in the
      // delay queue.
      amountOfTimeToExtract = dt;
    }

    // Go through the queue and extract the energy that should go out this step.
    while ( amountOfTimeToExtract > 0 ) {

      // The first entry in the queue is the oldest.  If the incoming dt value indicates that all of this entry should
      // go out this step, remove the entry from the queue and add its energy to the amount to be output this step.
      if ( amountOfTimeToExtract >= this.delayedEnergyQueue[ 0 ].dt ) {
        const removedEntry = this.delayedEnergyQueue.shift();
        energyToOutputThisStep += removedEntry.energy;
        this.totalTimeInEnergyQueue -= removedEntry.dt;
        amountOfTimeToExtract -= removedEntry.dt;
      }
      else {

        // Part of the energy from this entry should go out in this step, and part of it should remain.  Extract the
        // amount of energy based on the energy rate that it represents and the current dt value, and then modify the
        // entry to have the residual time and energy.
        const proportionToUse = amountOfTimeToExtract / this.delayedEnergyQueue[ 0 ].dt;
        energyToOutputThisStep += this.delayedEnergyQueue[ 0 ].energy * proportionToUse;
        this.delayedEnergyQueue[ 0 ].energy = ( 1 - proportionToUse ) * this.delayedEnergyQueue[ 0 ].energy;
        this.delayedEnergyQueue[ 0 ].dt = ( 1 - proportionToUse ) * this.delayedEnergyQueue[ 0 ].dt;
        amountOfTimeToExtract = 0;
      }
    }

    // Output the energy for this step, if any.
    this.outputEnergy( this.direction, energyToOutputThisStep );
  }

  /**
   * @public
   */
  reset() {
    this.delayedEnergyQueue = [];
    this.totalTimeInEnergyQueue = 0;
  }
}

greenhouseEffect.register( 'EnergyDelayLine', EnergyDelayLine );
export default EnergyDelayLine;