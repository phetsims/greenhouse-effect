// Copyright 2021-2023, University of Colorado Boulder

/**
 * MovingSampleWindow is a utility class that is used to track a set of numerical values over a span of time.  It can be
 * useful for things like moving average calculations.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';

class MovingSampleWindow {

  // the period of time over which the recorded values are averaged
  private readonly accumulationPeriod: number;

  // a queue containing information about energy packets
  private readonly sampleQueue: Sample[];

  public constructor( accumulationPeriod: number ) {
    this.accumulationPeriod = accumulationPeriod;
    this.sampleQueue = [];
  }

  /**
   * @param sampleValue - value to be stored
   * @param dt - delta time, in seconds
   */
  public addSample( sampleValue: number, dt: number ): void {

    // Put the new energy information into the queue.
    this.sampleQueue.push( new Sample( sampleValue, dt ) );

    // Variables for the accumulator calculation.
    let totalTime = 0;
    const sampleQueueCopy = [ ...this.sampleQueue ];

    // Move through the queue from the newest to the oldest entry and delete entries that have "aged out".
    for ( let i = sampleQueueCopy.length - 1; i >= 0; i-- ) {
      const sample = sampleQueueCopy[ i ];
      if ( totalTime + sample.dt <= this.accumulationPeriod ) {

        // Add the information from this entry to the accumulator totals.
        totalTime += sample.dt;
      }
      else {

        // There are entries in the queue that exceed the time span, so remove them and exit the loop.
        const entriesToRemove = i + 1;
        _.times( entriesToRemove, () => this.sampleQueue.shift() );
        break;
      }
    }
  }

  /**
   * Get the difference between the largest and the smallest values currently in the sample queue.  This will always be
   * greater than or equal to zero.
   */
  public getMaxSampleDifference(): number {
    let maxDifference = 0;
    if ( this.sampleQueue.length > 1 ) {
      let maxValue = Number.NEGATIVE_INFINITY;
      let minValue = Number.POSITIVE_INFINITY;
      for ( let i = 0; i < this.sampleQueue.length; i++ ) {
        const sampleValue = this.sampleQueue[ i ].sampleValue;
        maxValue = sampleValue > maxValue ? sampleValue : maxValue;
        minValue = sampleValue < minValue ? sampleValue : minValue;
      }
      maxDifference = maxValue - minValue;
    }
    return maxDifference;
  }

  /**
   * Reset to initial state.
   */
  public reset(): void {
    this.sampleQueue.length = 0;
  }
}

/**
 * Simple data type used for tracking energy within MovingSampleWindow.
 */
class Sample {

  // the amount of time between this item and the previous one in the queue (delta time)
  public readonly dt: number;

  // the numerical value associated with this sample
  public readonly sampleValue: number;

  public constructor( sampleValue: number, dt: number ) {
    this.sampleValue = sampleValue;
    this.dt = dt;
  }
}

greenhouseEffect.register( 'MovingSampleWindow', MovingSampleWindow );

export default MovingSampleWindow;