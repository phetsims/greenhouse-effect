// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDelayLine is a model element that that serves to delay energy in both the upward and downward directions.  It
 * has an interface similar to that of the EnergyAbsorbingEmittingLayer class, but it only delays the energy, and does
 * no other modifications to it.  Functionally, this can be thought of as a bidirectional digital delay line, see
 * https://en.wikipedia.org/wiki/Digital_delay_line.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergySource from './EnergySource.js';

class EnergyDelayLine extends EnergySource {

  /**
   * @param {number} delayTime - in seconds
   */
  constructor( delayTime ) {

    super();

    // @public {read-only} - Energy coming in that is moving in the downward direction, so coming from above.
    this.incomingDownwardMovingEnergyProperty = new NumberProperty( 0 );

    // @public {read-only} - Energy coming in that is moving in the upward direction, so coming from underneath.
    this.incomingUpwardMovingEnergyProperty = new NumberProperty( 0 );

    // @private
    this.delayTime = delayTime;
    this.delayedDownwardMovingEnergy = [];
    this.delayedUpwardMovingEnergy = [];
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // Update the delay queues, and extract any entries that have expired and put it into the outgoing energy.
    this.delayedDownwardMovingEnergy.forEach( delayQueueEntry => {
      delayQueueEntry.remainingTimeInQueue -= dt;
      if ( delayQueueEntry.remainingTimeInQueue <= 0 ) {
        this.incomingDownwardMovingEnergyProperty.value += delayQueueEntry.energyAmount;
      }
    } );
    this.delayedDownwardMovingEnergy = this.delayedDownwardMovingEnergy.filter(
      delayQueueEntry => delayQueueEntry.remainingTimeInQueue > 0
    );
    this.delayedUpwardMovingEnergy.forEach( delayQueueEntry => {
      delayQueueEntry.remainingTimeInQueue -= dt;
      if ( delayQueueEntry.remainingTimeInQueue <= 0 ) {
        this.incomingUpwardMovingEnergyProperty.value += delayQueueEntry.energyAmount;
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
    this.incomingDownwardMovingEnergyProperty.reset();
    this.incomingUpwardMovingEnergyProperty.reset();
    this.delayedDownwardMovingEnergy = [];
    this.delayedUpwardMovingEnergy = [];
  }
}

greenhouseEffect.register( 'EnergyDelayLine', EnergyDelayLine );
export default EnergyDelayLine;