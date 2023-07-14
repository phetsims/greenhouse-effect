// Copyright 2022-2023, University of Colorado Boulder

import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Disposable from '../../../../axon/js/Disposable.js';

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

  // Model object to which this change is "anchored", meaning that the model object is currently causing the change,
  // so the change should occur at the same position as the object.  There are a number of things that can cause
  // intensity changes, such as clouds and layers in the atmosphere, hence the vague typing.  A value of `null`
  // indicates that the intensity change isn't anchored to anything, which means that it should propagate with the wave.
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
    return `{ postChangeIntensity: ${this.postChangeIntensity}, ` +
           `distanceFromStart: ${this.distanceFromStart}, ` +
           `anchoredTo: ${this.anchoredTo ? 'something' : 'nothing'}`;
  }

  // phet-io IOType - We use data-type serialization here because these intensity changes can be set as set in the
  // individual waves and references aren't shared.
  public static readonly WaveIntensityChangeIO =
    new IOType<WaveIntensityChange, WaveIntensityChangeStateObject>( 'WaveIntensityChangeIO', {
      valueType: WaveIntensityChange,
      stateSchema: {
        postChangeIntensity: NumberIO,
        distanceFromStart: NumberIO,
        anchoredTo: NullableIO( ReferenceIO( IOType.ObjectIO ) )
      },
      fromStateObject: ( stateObject: WaveIntensityChangeStateObject ) => new WaveIntensityChange(
        stateObject.postChangeIntensity,
        stateObject.distanceFromStart,
        NullableIO( ReferenceIO( IOType.ObjectIO ) ).fromStateObject( stateObject.anchoredTo )
      )
    } );

  // Instances of this class are intended to be lightweight and do not link to any Property instances, so disposal is
  // unneeded and not supported.
  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

// for phet-io
export type WaveIntensityChangeStateObject = {
  postChangeIntensity: number;
  distanceFromStart: number;
  anchoredTo: null | ReferenceIOState;
};

greenhouseEffect.register( 'WaveIntensityChange', WaveIntensityChange );
export default WaveIntensityChange;