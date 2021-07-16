// Copyright 2020-2021, University of Colorado Boulder

/**
 * Wave represents a wave of light in the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const TWO_PI = 2 * Math.PI;
const PHASE_RATE = -Math.PI; // in radians per second

class Wave {

  /**
   * @param {number} wavelength - wavelength of this light wave, in meters
   * @param {Vector2} origin - the point from which the wave will originate
   * @param {Vector2} directionOfTravel - a normalized vector (i.e. length = 1) that indicates direction of travel
   * @param {number} propagationLimit - the altitude beyond which this wave should not extend or travel, works in either
   *                                    direction, in meters
   * @param {Object} [options]
   */
  constructor( wavelength, origin, directionOfTravel, propagationLimit, options ) {
    options = merge( {

      // {number} - the intensity of this wave from its start point, range is 0 (no intensity) to 1 (max intensity)
      intensityAtStart: 1,

      // {string} - a string that can be stuck on the object, useful for debugging
      debugTag: null

    }, options );

    if ( options.debugTag ) {
      this.debugTag = options.debugTag;
    }

    // parameter checking
    assert && assert( Math.abs( directionOfTravel.magnitude - 1 ) < 1E-6, 'direction vector must be normalized' );
    assert && assert( directionOfTravel.y !== 0, 'fully horizontal waves are not supported' );
    assert && assert(
      Math.sign( directionOfTravel.y ) === Math.sign( propagationLimit - origin.y ),
      'propagation limit does not make sense for provided directionOfTravel'
    );
    assert && assert( propagationLimit !== origin.x, 'this wave has no where to go' );

    // @public (read-only) {number}
    this.wavelength = wavelength;

    // {boolean} - indicates whether this wave is coming from a sourced point or just moving through space
    this.isSourced = true;

    // (read-only) {number} - the length of time that this wave has existed
    this.existanceTime = 0;

    // @public (read-only) {Vector2}
    this.directionOfTravel = directionOfTravel;

    // @private {number} - the altitude past which this wave should not propagate
    this.propagationLimit = propagationLimit;

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

    // @public (read-only) {number} - The intensity value for this wave at its starting point.  This is a normalized
    // value which goes from anything just above 0 (and intensity of 0 is meaningless, so is not allowed by the code)
    // to a max value of 1.
    this.intensityAtStart = options.intensityAtStart;
  }

  /**
   * @param dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // If there is a source producing this wave, then it gets longer, otherwise it stays at the same length and
    // propagates through space.
    if ( this.isSourced ) {
      this.length += dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
    else {

      // Move the wave forward, being careful not to move the start point beyond the propagation limit.
      let dy = this.directionOfTravel.y * GreenhouseEffectConstants.SPEED_OF_LIGHT * dt;
      if ( Math.abs( dy ) > Math.abs( this.propagationLimit - this.startPoint.y ) ) {
        dy = this.propagationLimit - this.startPoint.y;
      }
      this.startPoint.addXY(
        this.directionOfTravel.x * GreenhouseEffectConstants.SPEED_OF_LIGHT * dt,
        dy
      );
    }

    // Check if the current change makes this wave longer than it should be and, if so, limit the length.
    this.length = Math.min( this.length, ( this.propagationLimit - this.startPoint.y ) / this.directionOfTravel.y );

    this.phaseOffsetAtOrigin = ( this.phaseOffsetAtOrigin + PHASE_RATE * dt ) % TWO_PI;
    this.existanceTime += dt;
  }

  /**
   * Get the altitude at which this wave ends.  This can be used instead of getEndPoint when only the end altitude is
   * needed, since it doesn't allocate a vector and may thus have better performance.  This treats the wave as a line
   * and does not account for any amplitude.
   * @returns {number}
   * @public
   */
  getEndAltitude() {
    return this.startPoint + this.length * this.directionOfTravel.y;
  }

  /**
   * Get a vector that represents the end point of this wave.  This does not account for any amplitude of the wave, and
   * just treats it as a line between two points.  If a vector is provided, none is allocated.
   * @param [vectorToUse]
   * @public
   */
  getEndPoint( vectorToUse ) {
    const endPointVector = vectorToUse || new Vector2( 0, 0 );
    endPointVector.setXY(
      this.startPoint.x + this.directionOfTravel.x * this.length,
      this.startPoint.y + this.directionOfTravel.y * this.length
    );
    return endPointVector;
  }

  /**
   * true if the wave has completely propagated and has nothing else to do
   * @returns {boolean}
   * @public
   */
  get isCompletelyPropagated() {
    return this.startPoint.y === this.propagationLimit;
  }
}

// statics
Wave.PHASE_RATE = PHASE_RATE;

greenhouseEffect.register( 'Wave', Wave );
export default Wave;