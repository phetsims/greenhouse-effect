// Copyright 2021-2022, University of Colorado Boulder

/**
 * EnergyRateTracker uses a moving average calculation to track the amount of energy that is moving into or out of a
 * system.
 *
 * This class has no `step` method, and is expected to be essentially stepped by consistent addition of energy amounts,
 * even if those amounts are zero.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO, { NumberStateObject } from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const DEFAULT_ACCUMULATION_PERIOD = 1; // in seconds
const DECIMAL_PLACES = 1; // used to round the output value so that there isn't too much "noise" due to floating point errors and such

/**
 * Simple data type used for tracking energy within EnergyRateTracker.
 */
class EnergyInfoQueueItem {
  public readonly dt: number;
  public readonly energy: number;

  public constructor( dt: number, energy: number ) {
    this.dt = dt;
    this.energy = energy;
  }

  public static readonly EnergyInfoQueueItemIO = new IOType( 'EnergyInfoQueueItemIO', {
    valueType: EnergyInfoQueueItem,
    stateSchema: {
      dt: NumberIO,
      energy: NumberIO
    },
    fromStateObject: ( stateObject: EnergyInfoQueueItemStateObject ) => new EnergyInfoQueueItem(
      NumberIO.fromStateObject( stateObject.dt ),
      NumberIO.fromStateObject( stateObject.energy )
    )
  } );
}

type SelfOptions = {
  accumulationPeriod?: number;
};
export type EnergyRateTrackerOptions = SelfOptions & PhetioObjectOptions;

class EnergyRateTracker extends PhetioObject {

  // the period of time over which the recorded values are averaged
  private readonly accumulationPeriod: number;

  // current total energy for the accumulation period
  public readonly energyRateProperty: NumberProperty;

  // a queue containing information about energy packets
  private readonly energyInfoQueue: EnergyInfoQueueItem[];

  public constructor( providedOptions?: EnergyRateTrackerOptions ) {

    const options = optionize<EnergyRateTrackerOptions, SelfOptions, PhetioObjectOptions>()( {

      accumulationPeriod: DEFAULT_ACCUMULATION_PERIOD,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: EnergyRateTracker.EnergyRateTrackerIO

    }, providedOptions );

    super( options );

    this.energyRateProperty = new NumberProperty( 0, {
      units: 'W',
      tandem: options.tandem.createTandem( 'energyRateProperty' ),
      phetioDocumentation: 'Amount of energy being produced or absorbed.'
    } );

    this.energyInfoQueue = [];

    this.accumulationPeriod = options.accumulationPeriod!;
  }

  /**
   * @param energy - amount of energy to be recorded for this step, in joules
   * @param dt - delta time, in seconds
   */
  public addEnergyInfo( energy: number, dt: number ): void {

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
   * Reset to initial state.
   */
  public reset(): void {
    this.energyInfoQueue.length = 0;
    this.energyRateProperty.reset();
  }

  public static readonly EnergyRateTrackerIO = new IOType( 'EnergyRateTrackerIO', {
    valueType: EnergyRateTracker,
    stateSchema: {
      energyInfoQueue: ArrayIO( EnergyInfoQueueItem.EnergyInfoQueueItemIO )
    },
    defaultDeserializationMethod: 'applyState'
  } );
}

/**
 * for phet-io
 */
type EnergyInfoQueueItemStateObject = {
  dt: NumberStateObject;
  energy: NumberStateObject;
};

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );

export default EnergyRateTracker;