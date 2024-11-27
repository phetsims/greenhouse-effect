// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveSourceSpec is a simple class that is used to specify where waves can be produced - or sourced - by a wave source.
 * It specifies a minimum and maximum X value for where waves will be produced and a direction of travel.  This exists
 * because the wave production occurs in pairs of X value locations, and the source shifts back and forth between them
 * in order to create some variation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * A simple class that specifies the X value for where waves will be produced and a direction of travel.
 */
class WaveSourceSpec {

  // The X (i.e. horizontal) position, in meters, from which this wave should originate.  No Y value is included
  // because all wave sources in the sim are assigned a fixed and unchanging altitude.
  public readonly xPosition: number;

  // A 2D vector representing the direction in which the wave should travel.
  public readonly propagationDirection: Vector2;

  public constructor( xPosition: number, propagationDirection: Vector2 ) {
    this.xPosition = xPosition;
    this.propagationDirection = propagationDirection;
  }

  // Instances of this class are intended to be lightweight and do not link to any Property instances, so disposal is
  // unneeded and not supported.
  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

greenhouseEffect.register( 'WaveSourceSpec', WaveSourceSpec );
export default WaveSourceSpec;