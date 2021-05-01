// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDelayLine is a model element that that serves to delay energy in both the upward and downward directions.  It
 * has an interface similar to that of the EnergyAbsorbingEmittingLayer class, but it only delays the energy, and does
 * no other modifications to it.  Functionally, this can be thought of as a bidirectional digital delay line, see
 * https://en.wikipedia.org/wiki/Digital_delay_line.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyTransferInterface from './EnergyTransferInterface.js';

class EnergyDelayLine {

  /**
   * @param {number} delayTime - in seconds
   */
  constructor( delayTime ) {

    // @public - The energy that is coming out of this delay line in this step.
    this.energyOutput = new EnergyTransferInterface();

    // @private {NumberProperty|null} 
    this.incomingUpwardMovingEnergyProperty = null;

    // @private {NumberProperty|null} 
    this.incomingDownwardMovingEnergyProperty = null;

    // @private
    this.delayTime = delayTime;
    this.delayedDownwardMovingEnergy = [];
    this.delayedUpwardMovingEnergy = [];
  }

  /**
   * @param {EnergyTransferInterface} energyTransferObject
   * @public
   */
  setSourceOfUpwardMovingEnergy( energyTransferObject ) {
    this.incomingUpwardMovingEnergyProperty = energyTransferObject.outputEnergyUpProperty;
  }

  /**
   * @param {EnergyTransferInterface} energyTransferObject
   * @public
   */
  setSourceOfDownwardMovingEnergy( energyTransferObject ) {
    this.incomingDownwardMovingEnergyProperty = energyTransferObject.outputEnergyDownProperty;
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // At the beginning of each step, the output energy should be zero, since the expected use is that any energy that
    // reaches the output is consumed before the next step.  If the output energy is non-zero, this isn't being used as
    // intended.
    assert && assert(
    this.energyOutput.outputEnergyDownProperty.value === 0 && this.energyOutput.outputEnergyUpProperty.value === 0,
      'there should be no energy at the output at start of step'
    );

    // Update the delay queues, and extract any entries that have expired and put it into the outgoing energy.
    this.delayedDownwardMovingEnergy.forEach( delayQueueEntry => {
      delayQueueEntry.remainingTimeInQueue -= dt;
      if ( delayQueueEntry.remainingTimeInQueue <= 0 ) {
        this.energyOutput.outputEnergyDownProperty.value += delayQueueEntry.energyAmount;
      }
    } );
    this.delayedDownwardMovingEnergy = this.delayedDownwardMovingEnergy.filter(
      delayQueueEntry => delayQueueEntry.remainingTimeInQueue > 0
    );
    this.delayedUpwardMovingEnergy.forEach( delayQueueEntry => {
      delayQueueEntry.remainingTimeInQueue -= dt;
      if ( delayQueueEntry.remainingTimeInQueue <= 0 ) {
        this.energyOutput.outputEnergyUpProperty.value += delayQueueEntry.energyAmount;
      }
    } );
    this.delayedUpwardMovingEnergy = this.delayedUpwardMovingEnergy.filter(
      delayQueueEntry => delayQueueEntry.remainingTimeInQueue > 0
    );

    // Add new delay entries for any incoming energy.
    if ( this.incomingDownwardMovingEnergyProperty && this.incomingDownwardMovingEnergyProperty.value > 0 ) {

      // There is some available energy in this direction, so put it into the delay queue.
      this.delayedDownwardMovingEnergy.push( {
          energyAmount: this.incomingDownwardMovingEnergyProperty.value,
          remainingTimeInQueue: this.delayTime
        }
      );

      // Clear the energy from the source.
      this.incomingDownwardMovingEnergyProperty.set( 0 );
    }

    if ( this.incomingUpwardMovingEnergyProperty && this.incomingUpwardMovingEnergyProperty.value > 0 ) {

      // There is some available energy in this direction, so put it into the delay queue.
      this.delayedUpwardMovingEnergy.push( {
          energyAmount: this.incomingUpwardMovingEnergyProperty.value,
          remainingTimeInQueue: this.delayTime
        }
      );

      // Clear the energy from the source.
      this.incomingUpwardMovingEnergyProperty.set( 0 );
    }
  }

  /**
   * @public
   */
  reset() {
    this.energyOutput.reset();
    this.delayedDownwardMovingEnergy = [];
    this.delayedUpwardMovingEnergy = [];
  }
}

greenhouseEffect.register( 'EnergyDelayLine', EnergyDelayLine );
export default EnergyDelayLine;