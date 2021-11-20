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
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const DEFAULT_ACCUMULATION_PERIOD = 1; // in seconds
const DECIMAL_PLACES = 1; // used to round the output value so that there isn't too much "noise" due to floating point error and such

/**
 * Simple data type used for tracking energy within EnergyRateTracker.
 */
class EnergyInfoQueueItem {
  dt: number;
  energy: number;

  constructor( dt: number, energy: number ) {
    this.dt = dt;
    this.energy = energy;
  }

  // @public
  static fromStateObject( stateObject: EnergyInfoQueueItemStateObject ) {
    return new EnergyInfoQueueItem( stateObject.dt, stateObject.energy );
  }

  // @public
  static get STATE_SCHEMA() {
    return {
      dt: NumberIO,
      energy: NumberIO
    };
  }

  static EnergyInfoQueueItemIO = IOType.fromCoreType( 'EnergyInfoQueueItemIO', EnergyInfoQueueItem );
}

type EnergyInfoQueueItemStateObject = {
  dt: number,
  energy: number
}

class EnergyRateTracker extends PhetioObject {
  readonly energyRateProperty: NumberProperty;
  private readonly energyInfoQueue: EnergyInfoQueueItem[];
  private readonly accumulationPeriod: number;

  constructor( providedOptions?: Partial<EnergyRateTrackerOptions> ) {

    const options = merge( {

      // {number} - the period of time over which the recorded values are averaged
      accumulationPeriod: DEFAULT_ACCUMULATION_PERIOD,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: EnergyRateTracker.EnergyRateTrackerIO

    }, providedOptions ) as EnergyRateTrackerOptions;

    super( options );

    // current total for the accumulation period
    this.energyRateProperty = new NumberProperty( 0, {
      units: 'W',
      tandem: options.tandem.createTandem( 'energyRateProperty' ),
      phetioDocumentation: 'Amount of energy being produced or absorbed.'
    } );

    // a queue containing information about energy packets
    this.energyInfoQueue = [];

    // @private {number}
    this.accumulationPeriod = options.accumulationPeriod!;
  }

  /**
   * @param {number} energy - amount of energy to be recorded for this step, in joules
   * @param {number} dt - delta time, in seconds
   * @public
   */
  addEnergyInfo( energy: number, dt: number ) {

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
    this.energyInfoQueue.length = 0;
    this.energyRateProperty.reset();
  }

  // @public
  static get STATE_SCHEMA() {
    return {
      energyInfoQueue: ArrayIO( EnergyInfoQueueItem.EnergyInfoQueueItemIO )
    };
  }

  static EnergyRateTrackerIO = IOType.fromCoreType( 'EnergyRateTrackerIO', EnergyRateTracker, {
    // @ts-ignore
    defaultDeserializationMethod: IOType.DeserializationMethod.APPLY_STATE // deserialize with applyState, not fromStateObject
  } );
}

// type definition for options specific to this class
type EnergyRateTrackerOptions = {
  accumulationPeriod: number;
  tandem: Tandem;
} & PhetioObjectOptions;

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );
export default EnergyRateTracker;