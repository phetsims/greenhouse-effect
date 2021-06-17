// Copyright 2021, University of Colorado Boulder

/**
 * EnergyRateTracker uses a moving average calculation to track the amount of energy that is moving into or out of a
 * system.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const DEFAULT_ACCUMULATION_PERIOD = 1; // in seconds
const DECIMAL_PLACES = 1; // used to round the output value so that there isn't too much "noise" due to floating point error and such

class EnergyRateTracker {

  constructor( options ) {

    options = merge( {

      // {number} - the period of time over which the recorded values are averaged
      accumulationPeriod: DEFAULT_ACCUMULATION_PERIOD
    }, options );

    // @public (read-only) {Property.<number>} - current total for the accumulation period
    this.energyRateProperty = new NumberProperty( 0 );

    // @private {Object[]}, each object has a dt and energy value
    this.energyInfoQueue = [];

    // @private {number}
    this.accumulationPeriod = options.accumulationPeriod;
  }

  /**
   * @param {number} energy - amount of energy to be recorded for this step, in joules
   * @param {number} dt - delta time, in seconds
   * @public
   */
  addEnergyInfo( energy, dt ) {

    // Put the new energy information into the queue.
    this.energyInfoQueue.push( { dt: dt, energy: energy } );

    // Variables for the accumulator calculation.
    let totalEnergy = 0;
    let totalTime = 0;
    const energyInfoQueueCopy = [ ...this.energyInfoQueue ];

    // Move through the queue from the newest to the oldest entry, accumulating time and energy info and deleting
    // entries that have "aged out".
    for ( let i = energyInfoQueueCopy.length - 1; i >= 0; i-- ) {
      const energyInfoEntry = energyInfoQueueCopy[ i ];
      if ( totalTime + energyInfoEntry.dt <= this.accumulationPeriod ) {

        // Add the information from this entry to the accumulator totals.
        totalEnergy += energyInfoEntry.energy;
        totalTime += energyInfoEntry.dt;
      }
      else {

        // There are entries in the queue that exceed the time span, so remove them and exit the loop.
        const entriesToRemove = i + 1;
        _.times( entriesToRemove, () => this.energyInfoQueue.shift() );
        break;
      }
    }

    // Update the publicly available energy total value.
    this.energyRateProperty.set( Utils.toFixedNumber( totalEnergy / totalTime, DECIMAL_PLACES ) );
  }

  /**
   * @public
   */
  reset() {
    this.energyInfoQueue = [];
    this.energyRateProperty.reset();
  }
}

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );
export default EnergyRateTracker;