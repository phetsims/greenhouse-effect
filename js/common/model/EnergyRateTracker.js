// Copyright 2021, University of Colorado Boulder

/**
 * EnergyRateTracker uses a moving average calculation to track the amount of energy that is moving into or out of a
 * system.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const DEFAULT_ACCUMULATION_PERIOD = 1; // in seconds
const DECIMAL_PLACES = 1; // used to round the output value so that there isn't too much "noise" due to floating point error and such

class EnergyRateTracker extends PhetioObject {

  constructor( options ) {

    options = merge( {

      // {number} - the period of time over which the recorded values are averaged
      accumulationPeriod: DEFAULT_ACCUMULATION_PERIOD,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: EnergyRateTracker.EnergyRateTrackerIO

    }, options );

    super( options );

    // @public (read-only) {Property.<number>} - current total for the accumulation period
    this.energyRateProperty = new NumberProperty( 0, {
      units: 'W',
      tandem: options.tandem.createTandem( 'energyRateProperty' ),
      phetioDocumentation: 'Amount of energy being produced or absorbed.'
    } );

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
    this.energyInfoQueue.push( new EnergyInfoQueueItem( dt, energy ) );

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

  /**
   * for phet-io
   * @public
   */
  // toStateObject() {
  //   return {
  //     energyInfoQueue: ArrayIO( EnergyInfoQueueItem.EnergyInfoQueueItemIO ).toStateObject( this.energyInfoQueue )
  //   };
  // }

  // @public
  static get STATE_SCHEMA() {
    return {
      energyInfoQueue: ArrayIO( EnergyInfoQueueItem.EnergyInfoQueueItemIO )
    };
  }
}

/**
 * Simple data type used for tracking energy.
 */
class EnergyInfoQueueItem {

  constructor( dt, energy ) {
    this.dt = dt;
    this.energy = energy;
  }

  // @public
  static fromStateObject( stateObject ) {
    return new EnergyInfoQueueItem( stateObject.dt, stateObject.energy );
  }

  // @public
  static get STATE_SCHEMA() {
    return {
      dt: NumberIO,
      energy: NumberIO
    };
  }
}

EnergyInfoQueueItem.EnergyInfoQueueItemIO = IOType.fromCoreType( 'EnergyInfoQueueItemIO', EnergyInfoQueueItem );

/**
 * @public
 * EnergyRateTrackerIO handles PhET-iO serialization of the EnergyRateTracker. Because serialization involves accessing
 * private members, it delegates to EnergyRateTracker. The methods that EnergyRateTrackerIO overrides are typical of
 * 'Dynamic element serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
EnergyRateTracker.EnergyRateTrackerIO = IOType.fromCoreType( 'EnergyRateTrackerIO', EnergyRateTracker );

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );
export default EnergyRateTracker;