// Copyright 2021, University of Colorado Boulder

/**
 * WaveSourceSpec is a simple class that is used to specify where waves can be produced - or sourced - by a wave source.
 * It specifies a minimum and maximum X value for where waves will be produced and a direction of travel.  This exists
 * because the wave production occurs in pairs of X value locations, and the source shifts back and forth between them
 * in order to create some variation.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * A simple class that specifies a minimum and maximum X value for where waves will be produced and a direction of
 * travel.  This exists because the wave production occurs in pairs of X value locations, and the source shifts back
 * and forth between them in order to create some variation.
 */
class WaveSourceSpec {
  readonly minXPosition: number;
  readonly maxXPosition: number;
  readonly propagationDirection: Vector2;

  constructor( minXPosition: number, maxXPosition: number, propagationDirection: Vector2 ) {
    this.minXPosition = minXPosition;
    this.maxXPosition = maxXPosition;
    this.propagationDirection = propagationDirection;
  }
}

greenhouseEffect.register( 'WaveSourceSpec', WaveSourceSpec );
export default WaveSourceSpec;