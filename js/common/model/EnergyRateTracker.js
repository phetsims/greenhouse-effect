// Copyright 2021, University of Colorado Boulder

/**
 * EnergyRateTracker is used primarily for debugging, and it allows clients to track the average amount of energy moving
 * through a system in Watts, which is joules per second.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const ACCUMULATION_TIME = 1; // in seconds

class EnergyRateTracker {

  constructor() {

    // @public (read-only) {number} - current total for the accumulation period
    this.energyRate = 0;

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

      if ( totalAccumulatedTime + energyAndTimeEntry.dt <= ACCUMULATION_TIME ) {

        // This energy entry is completely inside the accumulation period, so use all of it.
        energyTotal += energyAndTimeEntry.energy;
        accumulatedEntryTime += energyAndTimeEntry.dt;
      }
      else if ( totalAccumulatedTime <= ACCUMULATION_TIME && totalAccumulatedTime + energyAndTimeEntry.dt > ACCUMULATION_TIME ) {

        // This energy entry is partially in the window, so use the appropriate proportionate amount.
        const proportionToUse = ( ( ACCUMULATION_TIME - totalAccumulatedTime ) / energyAndTimeEntry.dt );
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
    this.energyRate = energyTotal / accumulatedEntryTime;
  }

  /**
   * @public
   */
  reset() {
    this.energyAccumulator = [];
    this.energyRate = 0;
  }
}

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );
export default EnergyRateTracker;