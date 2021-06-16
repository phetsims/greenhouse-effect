// Copyright 2021, University of Colorado Boulder

/**
 * EnergyRateTracker uses a moving average calculation to track the amount of energy that is moving into or out of a
 * system.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const ACCUMULATION_PERIOD = 1; // in seconds
const DECIMAL_PLACES = 1; // used to round the output value so that there isn't too much "noise" due to floating point error and such

class EnergyRateTracker {

  constructor() {

    // @public (read-only) {Property.<number>} - current total for the accumulation period
    this.energyRateProperty = new NumberProperty( 0 );

    // @private {Object[]}, each object has a dt and energy value
    this.energyAccumulator = [];
  }

  /**
   * @param {number} energy - amount of energy to be accumulated for this step, in joules
   * @param {number} dt - delta time, in seconds
   * @public
   */
  logEnergy( energy, dt ) {

    this.energyAccumulator.unshift( { dt: dt, energy: energy } );

    // Variables for the accumulator calculation.
    let energyTotal = 0;
    let totalAccumulatedTime = 0;
    let accumulatedEntryTime = 0;

    // Loop through all entries and calculate the total for the time period, mark expired entries for removal.
    this.energyAccumulator.forEach( energyAndTimeEntry => {

      if ( totalAccumulatedTime + energyAndTimeEntry.dt <= ACCUMULATION_PERIOD ) {

        // This energy entry is completely inside the accumulation period, so use all of it.
        energyTotal += energyAndTimeEntry.energy;
        accumulatedEntryTime += energyAndTimeEntry.dt;
      }
      else if ( totalAccumulatedTime <= ACCUMULATION_PERIOD && totalAccumulatedTime + energyAndTimeEntry.dt > ACCUMULATION_PERIOD ) {

        // This energy entry is partially in the window, so use the appropriate proportionate amount.
        const proportionToUse = ( ( ACCUMULATION_PERIOD - totalAccumulatedTime ) / energyAndTimeEntry.dt );
        energyTotal += proportionToUse * energyAndTimeEntry.energy;
        accumulatedEntryTime += proportionToUse * energyAndTimeEntry.dt;
      }
      else {

        // This energy entry is completely outside the window, so mark it for deletion.
        energyAndTimeEntry.dt = -1;
      }

      // Filter out expired entries.
      this.energyAccumulator = this.energyAccumulator.filter( energyAndTimeEntry => energyAndTimeEntry.dt > 0 );

      totalAccumulatedTime += energyAndTimeEntry.dt;
    } );

    // Update the publicly available energy total value.
    this.energyRateProperty.set( Utils.toFixedNumber( energyTotal / accumulatedEntryTime, DECIMAL_PLACES ) );
  }

  /**
   * @public
   */
  reset() {
    this.energyAccumulator = [];
    this.energyRateProperty.reset();
  }
}

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );
export default EnergyRateTracker;