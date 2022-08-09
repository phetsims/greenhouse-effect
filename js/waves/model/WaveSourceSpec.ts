// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveSourceSpec is a simple class that is used to specify where waves can be produced - or sourced - by a wave source.
 * It specifies a minimum and maximum X value for where waves will be produced and a direction of travel.  This exists
 * because the wave production occurs in pairs of X value locations, and the source shifts back and forth between them
 * in order to create some variation.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * A simple class that specifies the X value for where waves will be produced and a direction of travel.
 */
class WaveSourceSpec {
  public readonly xPosition: number;
  public readonly propagationDirection: Vector2;

  public constructor( xPosition: number, propagationDirection: Vector2 ) {
    this.xPosition = xPosition;
    this.propagationDirection = propagationDirection;
  }
}

greenhouseEffect.register( 'WaveSourceSpec', WaveSourceSpec );
export default WaveSourceSpec;