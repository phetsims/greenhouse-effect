// Copyright 2021-2022, University of Colorado Boulder

import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO, { NumberStateObject } from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * WaveIntensityChange is a type that represents a change in a propagating wave's intensity at a point along a wave that
 * is modeled as a line.  The WaveIntensityChange defines the intensity of the wave after its position on the wave when
 * traversing from the starting point.  It contains no information about the intensity prior to its position on the
 * wave.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class WaveIntensityChange {

  // the intensity after this change when moving outward from the starting point of the wave
  public postChangeIntensity: number;

  // the distance from the start of the wave where this intensity change exists
  public distanceFromStart: number;

  // model object to which this change is "anchored", null indicates it is not anchored and thus should move with the wave
  public anchoredTo: null | PhetioObject;

  /**
   * @param postChangeIntensity - wave intensity after this change
   * @param distanceFromStart - distance from the start of the wave, in meters
   * @param anchoredTo - a model object to which this change is anchored, which generally is the object causing it
   */
  public constructor( postChangeIntensity: number, distanceFromStart: number, anchoredTo: null | PhetioObject = null ) {
    this.postChangeIntensity = postChangeIntensity;
    this.distanceFromStart = distanceFromStart;
    this.anchoredTo = anchoredTo;
  }

  /**
   * Print out the state as a string, useful for debugging.
   */
  public toString(): string {
    return `{ postChangeIntensity: ${this.postChangeIntensity}, distanceFromStart: ${this.distanceFromStart}, anchoredTo: ${this.anchoredTo ? 'something' : 'nothing'}`;
  }

  /**
   * Serializes this WaveIntensityChange instance.
   */
  public toStateObject(): WaveIntensityChangeStateObject {
    return {
      postChangeIntensity: NumberIO.toStateObject( this.postChangeIntensity ),
      distanceFromStart: NumberIO.toStateObject( this.distanceFromStart )
    };
  }

  public static fromStateObject( stateObject: WaveIntensityChangeStateObject ): WaveIntensityChange {
    return new WaveIntensityChange(
      NumberIO.fromStateObject( stateObject.postChangeIntensity ),
      NumberIO.fromStateObject( stateObject.distanceFromStart )
    );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static get STATE_SCHEMA(): Record<string, IOType> {
    return {
      postChangeIntensity: NumberIO,
      distanceFromStart: NumberIO
    };
  }

  // phet-io
  public static WaveIntensityChangeIO = IOType.fromCoreType( 'WaveIntensityChangeIO', WaveIntensityChange );
}

export type WaveIntensityChangeStateObject = {
  postChangeIntensity: NumberStateObject;
  distanceFromStart: NumberStateObject;
};

greenhouseEffect.register( 'WaveIntensityChange', WaveIntensityChange );
export default WaveIntensityChange;