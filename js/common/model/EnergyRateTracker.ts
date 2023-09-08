// Copyright 2021-2023, University of Colorado Boulder

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
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

// constants
const DEFAULT_ACCUMULATION_PERIOD = 1; // in seconds
const DECIMAL_PLACES = 1; // used to round the output value so that there isn't too much "noise" due to floating point errors and such

/**
 * Simple data type used for tracking energy within EnergyRateTracker.
 */
class EnergyInfoQueueItem {

  // the amount of time between this item and the previous one in the queue (delta time)
  public readonly dt: number;

  // the amount of energy associated with this item, in joules
  public readonly energy: number;

  public constructor( dt: number, energy: number ) {
    this.dt = dt;
    this.energy = energy;
  }

  /**
   * EnergyInfoQueueItemIO uses data-type serialization because references are not shared and creating new instances
   * during deserialization works fine.
   */
  public static readonly EnergyInfoQueueItemIO =
    new IOType<EnergyInfoQueueItem, EnergyInfoQueueItemStateObject>( 'EnergyInfoQueueItemIO', {
      valueType: EnergyInfoQueueItem,
      stateSchema: {

        // Fields that begin with '_' will not be shown in Studio.
        _dt: NumberIO,
        _energy: NumberIO
      },
      fromStateObject: ( stateObject: EnergyInfoQueueItemStateObject ) => new EnergyInfoQueueItem(
        stateObject._dt,
        stateObject._energy
      )
    } );
}

type SelfOptions = {
  accumulationPeriod?: number;
};
export type EnergyRateTrackerOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

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
      phetioType: EnergyRateTracker.EnergyRateTrackerIO,

      // To date there hasn't been a need to dispose instances of this class, so disposal is currently unsupported.
      isDisposable: false
    }, providedOptions );

    super( options );

    this.energyRateProperty = new NumberProperty( 0, {
      units: 'W',
      tandem: options.tandem.createTandem( 'energyRateProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true, // see https://github.com/phetsims/greenhouse-effect/issues/302
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

  /**
   * EnergyRateTrackerIO uses reference serialization because EnergyRateTracker instances are persistent throughout
   * the life of the sim.
   */
  public static readonly EnergyRateTrackerIO =
    new IOType<EnergyRateTracker, EnergyRateTrackerStateObject>( 'EnergyRateTrackerIO', {
      valueType: EnergyRateTracker,
      stateSchema: {
        energyInfoQueue: ArrayIO( EnergyInfoQueueItem.EnergyInfoQueueItemIO )
      }
    } );
}

type EnergyRateTrackerStateObject = {
  energyInfoQueue: EnergyInfoQueueItem[];
};

/**
 * for phet-io
 */
type EnergyInfoQueueItemStateObject = {
  _dt: number;
  _energy: number;
};

greenhouseEffect.register( 'EnergyRateTracker', EnergyRateTracker );

export default EnergyRateTracker;