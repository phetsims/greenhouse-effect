// Copyright 2020-2021, University of Colorado Boulder

/**
 * Wave represents a wave of light in the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const TWO_PI = 2 * Math.PI;
const PHASE_RATE = -Math.PI; // in radians per second

class Wave {

  /**
   * @param {number} wavelength
   * @param type
   * @param {Vector2} origin - the point from which the wave will originate
   * @param destinationPoint
   * @param parameterModel
   * @param totalDistance
   * @param {Vector2} directionOfTravel - a normalized vector (i.e. length = 1) that indicates direction of travel
   * @param options
   */
  constructor( wavelength, type, origin, destinationPoint, parameterModel, totalDistance, directionOfTravel, options ) {
    options = merge( {
      onLeadingEdgeReachesTarget: _.noop,
      onAlmostDone: _.noop,
      onTrailingEdgeReachesTarget: _.noop,
      onTrailingEdgeAppears: _.noop,
      debugTag: null
    }, options );

    if ( options.debugTag ) {
      this.debugTag = options.debugTag;
    }

    // @public (read-only) {number}
    this.wavelength = wavelength;

    // {boolean} - indicates whether this wave is coming from a sourced point or just moving through space
    this.sourced = true;

    // (read-only) {number} - the length of time that this wave has existed
    this.existanceTime = 0;

    // @public (read-only) {Vector2}
    this.directionOfTravel = directionOfTravel;

    // @private {number} - the altitude past which this wave should not propagate
    this.propagationLimit = destinationPoint.y;

    // @public (read-only) {number} - the length of this wave from the start point to where it ends
    this.length = 0;

    // @public (read-only) {number} - Angle of phase offset, in radians.  This is here primarily in support of the view,
    // but it has to be available in the model in order to coordinate the appearance of reflected and stimulated waves.
    this.phaseOffsetAtOrigin = 0;

    // @public (read-only) {Vector2} - The point from which this wave originates.  This is immutable over the lifetime
    // of a wave, and it distinct from the start point, since the start point can move as the wave propagates.
    this.origin = origin;

    // @public (read-only) {Vector2} - The starting point where the wave currently exists in model space.  This will be
    // the same as the origin if the wave is being sourced, or will move if the wave is propagating without being
    // sourced.
    this.startPoint = origin.copy();

    this.angle = destinationPoint.minus( origin ).getAngle();
    this.type = type;
    this.destinationPoint = destinationPoint;
    this.parameterModel = parameterModel;
    this.endPoint = this.startPoint;
    this.time = 0;

    this.speed = 80;
    this.totalDistance = totalDistance;

    const totalTime = this.totalDistance / this.speed;

    const travelDistance = this.destinationPoint.minus( this.startPoint ).getMagnitude();

    // Time for the trailing edge to reach the destination
    this.timeForTrailingEdgeToReachDestination = travelDistance / this.speed + totalTime;

    // Time for the leading edge to reach the destination
    this.timeForLeadingEdgeToReachDestination = travelDistance / this.speed;

    this.onLeadingEdgeReachesTarget = options.onLeadingEdgeReachesTarget;
    this.onAlmostDone = options.onAlmostDone;
    this.onTrailingEdgeReachesTarget = options.onTrailingEdgeReachesTarget;
    this.onTrailingEdgeAppears = options.onTrailingEdgeAppears;
  }

  /**
   * @param dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // If there is a source producing this wave, then it gets longer, otherwise it stays at the same length and
    // propagates through space.
    if ( this.sourced ) {
      this.length += dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
    else {
      this.startPoint.addXY(
        this.directionOfTravel.x * GreenhouseEffectConstants.SPEED_OF_LIGHT * dt,
        this.directionOfTravel.y * GreenhouseEffectConstants.SPEED_OF_LIGHT * dt
      );
    }

    // Check if the current change makes this wave longer than it should and, if so, limit the length.
    this.length = Math.min( this.length, Math.abs( this.startPoint.y - this.propagationLimit ) );

    this.phaseOffsetAtOrigin = ( this.phaseOffsetAtOrigin + PHASE_RATE * dt ) % TWO_PI;
    this.existanceTime += dt;
    this.time += dt;

    if ( this.onLeadingEdgeReachesTarget && this.leadingEdgeReachedDestination ) {
      this.onLeadingEdgeReachesTarget( this );
      delete this.onLeadingEdgeReachesTarget;
    }
    if ( this.onAlmostDone && this.almostDone ) {
      this.onAlmostDone( this );
      delete this.onAlmostDone;
    }
    if ( this.onTrailingEdgeReachesTarget && this.trailingEdgeReachedDestination ) {
      this.onTrailingEdgeReachesTarget( this );
      delete this.onTrailingEdgeReachesTarget;
    }

    // About a 1" gap between tail of parent and head of next wave
    if ( this.onTrailingEdgeAppears && this.time >= this.totalDistance / this.speed + 1.3 ) {
      this.onTrailingEdgeAppears( this );
      delete this.onTrailingEdgeAppears;
    }
  }

  get leadingEdgeReachedDestination() {
    return this.time >= this.timeForLeadingEdgeToReachDestination;
  }

  get almostDone() {
    return this.time >= this.timeForLeadingEdgeToReachDestination * 0.6 + this.timeForTrailingEdgeToReachDestination * 0.4;
  }

  get trailingEdgeReachedDestination() {
    return this.time >= this.timeForTrailingEdgeToReachDestination;
  }
}

// statics
Wave.PHASE_RATE = PHASE_RATE;

greenhouseEffect.register( 'Wave', Wave );
export default Wave;