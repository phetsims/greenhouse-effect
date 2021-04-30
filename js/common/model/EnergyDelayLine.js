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
   * @param {EnergyTransferInterface|null} sourceOfDownwardMovingEnergy
   * @param {EnergyTransferInterface|null} sourceOfUpwardMovingEnergy
   * @param {number} delayTime - in seconds
   */
  constructor( sourceOfDownwardMovingEnergy, sourceOfUpwardMovingEnergy, delayTime ) {

    assert && assert(
      !( sourceOfDownwardMovingEnergy === null && sourceOfUpwardMovingEnergy === null ),
      'must have at least one energy source'
    );

    // @public - The energy that is coming out of this delay line in this step.
    this.energyOutput = new EnergyTransferInterface();

    // @private
    this.sourceOfDownwardMovingEnergy = sourceOfDownwardMovingEnergy;
    this.sourceOfUpwardMovingEnergy = sourceOfUpwardMovingEnergy;
    this.delayTime = delayTime;
    this.delayedDownwardMovingEnergy = [];
    this.delayedUpwardMovingEnergy = [];
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

    const currentTime = ( phet.joist.elapsedTime ) / 1000; // Why oh why is joist's elapsed time in milliseconds?

    if ( this.sourceOfDownwardMovingEnergy && this.sourceOfDownwardMovingEnergy.outputEnergyDownProperty.value > 0 ) {

      // There is some available energy in this direction, so put it into the delay queue.
      this.delayedDownwardMovingEnergy.push( {
          energyAmount: this.sourceOfDownwardMovingEnergy.outputEnergyDownProperty.value,
          exitTime: currentTime + this.delayTime
        }
      );

      // Clear the energy from the source.
      this.sourceOfDownwardMovingEnergy.outputEnergyDownProperty.set( 0 );
    }

    if ( this.sourceOfUpwardMovingEnergy && this.sourceOfUpwardMovingEnergy.outputEnergyUpProperty.value > 0 ) {

      // There is some available energy in this direction, so put it into the delay queue.
      this.delayedUpwardMovingEnergy.push( {
          energyAmount: this.sourceOfUpwardMovingEnergy.outputEnergyUpProperty.value,
          exitTime: currentTime + this.delayTime
        }
      );

      // Clear the energy from the source.
      this.delayedUpwardMovingEnergy.outputEnergyUpProperty.set( 0 );
    }

    // Add any energy that has been sufficiently delayed to the output energy and delete the entry from the delay queue.
    for ( let i = 0; i < this.delayedDownwardMovingEnergy.length; i++ ) {
      if ( this.delayedDownwardMovingEnergy[ 0 ].exitTime <= currentTime ) {
        const sufficientlyDelayedEnergy = this.delayedDownwardMovingEnergy.shift();
        this.energyOutput.outputEnergyDownProperty.value += sufficientlyDelayedEnergy.energyAmount;
      }
      else {
        break;
      }
    }
    for ( let i = 0; i < this.delayedUpwardMovingEnergy.length; i++ ) {
      if ( this.delayedUpwardMovingEnergy[ 0 ].exitTime <= currentTime ) {
        const sufficientlyDelayedEnergy = this.delayedUpwardMovingEnergy.shift();
        this.energyOutput.outputEnergyUpProperty.value += sufficientlyDelayedEnergy.energyAmount;
      }
      else {
        break;
      }
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