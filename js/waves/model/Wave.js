// Copyright 2020-2021, University of Colorado Boulder

/**
 * The Wave class represents a wave of light in the model.
 *
 * TODO: The code below was originally written such that changes to the light wave's intensity would be remembered and
 *       would propagate with the wave.  In the 7/21/2021 design meeting, we decided to try not doing this, and have
 *       waves without anything actively attenuating it, such as a cloud, would be constant intensity from start to
 *       finish.  This has been done, but the code to propagate intensity changes was kept in case we changed our minds.
 *       At some point, it will either need to be fully removed or revived.  See
 *       https://github.com/phetsims/greenhouse-effect/issues/53.
 *
 * TODO: The code is written to support multiple points along the wave where its intensity can be attenuated.  However,
 *       this code is basically untested, since it hasn't been needed yet.  It will need to be tested and debugged if
 *       and when it is ever needed. See https://github.com/phetsims/greenhouse-effect/issues/52 for more information.
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

    // @public (read-only) {Vector2} - The point from which this wave originates.  This is immutable over the lifetime
    // of a wave, and it distinct from the start point, since the start point can move as the wave propagates.
    this.origin = origin;

    // @public (read-only) {Vector2}
    this.directionOfTravel = directionOfTravel;

    // @private {number} - the altitude past which this wave should not propagate
    this.propagationLimit = propagationLimit;

    // @public (read-only) {Vector2} - The starting point where the wave currently exists in model space.  This will be
    // the same as the origin if the wave is being sourced, or will move if the wave is propagating without being
    // sourced.
    this.startPoint = origin.copy();

    // @public (read-only) {number} - the length of this wave from the start point to where it ends
    this.length = 0;

    // {boolean} - indicates whether this wave is coming from a sourced point or just moving through space
    this.isSourced = true;

    // (read-only) {number} - the length of time that this wave has existed
    this.existanceTime = 0;

    // @public (read-only) {number} - Angle of phase offset, in radians.  This is here primarily in support of the view,
    // but it has to be available in the model in order to coordinate the appearance of reflected and stimulated waves.
    this.phaseOffsetAtOrigin = 0;

    // @public (read-only) {number} - The intensity value for this wave at its starting point.  This is a normalized
    // value which goes from anything just above 0 (and intensity of 0 is meaningless, so is not allowed by the code)
    // to a max value of 1.
    this.intensityAtStart = options.intensityAtStart;

    // @private {IntensityChange[]} - An array of places along this wave where its intensity changes.  These are kept
    // in order from the start to the end of the wave.
    this.intensityChanges = [];

    // @private {Map.<{Object,Attenuator>} - A Map that maps model objects to the attenuation that they are currently
    // causing on this wave.  The model objects can be essentially anything, hence the vague "Object" type spec.
    // Examples of model objects that can cause an attenuation are clouds and atmosphere layers.
    this.modelObjectToAttenuatorMap = new Map();
  }

  /**
   * @param dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // If there is a source producing this wave it should get longer and will continue to emanate from the same point.
    // If not, it stays at the same length and propagates through space.
    if ( this.isSourced ) {
      const propagationDistance = dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
      this.length += propagationDistance;
      this.intensityChanges.forEach( intensityChange => {
        if ( intensityChange.propagatesWithWave ) {
          const preMoveDistance = intensityChange.distanceFromStart;
          intensityChange.distanceFromStart += propagationDistance;

          // If this intensity change moved through an attenuator, attenuate it.
          for ( const attenuator of this.modelObjectToAttenuatorMap.values() ) {
            if ( preMoveDistance <= attenuator.distanceFromStart &&
                 intensityChange.distanceFromStart > attenuator.distanceFromStart ) {

              // Attenuate the intensity.
              intensityChange.intensity = intensityChange.intensity * ( 1 - attenuator.attenuation );
            }
          }
        }
      } );
    }
    else {

      // Move the wave forward, being careful not to move the start point beyond the propagation limit.
      const propagationDistance = GreenhouseEffectConstants.SPEED_OF_LIGHT * dt;
      let dy = this.directionOfTravel.y * propagationDistance;
      if ( Math.abs( dy ) > Math.abs( this.propagationLimit - this.startPoint.y ) ) {
        dy = this.propagationLimit - this.startPoint.y;
      }
      this.startPoint.addXY(
        this.directionOfTravel.x * propagationDistance,
        dy
      );

      // If there are any non-propagating intensity changes, decrease their distance from the start, since the wave's
      // starting point has moved forward and these should not move with it.
      this.intensityChanges.forEach( intensityChange => {
        if ( !intensityChange.propagatesWithWave ) {
          intensityChange.distanceFromStart -= propagationDistance;
        }
      } );

      // If there are attenuators on this wave, decrease their distance from the start point, since the wave's start
      // point has moved forward and the attenuators don't move with it.
      this.modelObjectToAttenuatorMap.forEach( attenuator => {
        attenuator.distanceFromStart -= propagationDistance;
      } );
    }

    // Check if the current change causes this wave to extend beyond it's propagation limit and, if so, limit the length.
    this.length = Math.min( this.length, ( this.propagationLimit - this.startPoint.y ) / this.directionOfTravel.y );

    // Remove any intensity changes that are no longer on the wave.
    this.intensityChanges = this.intensityChanges.filter( intensityChange =>
      intensityChange.distanceFromStart >= 0 && intensityChange.distanceFromStart < this.length
    );

    // Sort the intensity changes so that they are in order from the start to the end.
    this.sortIntensityChanges();

    // Remove attenuators that are no longer on the wave.
    this.modelObjectToAttenuatorMap.forEach( ( attenuator, modelElement ) => {

        if ( attenuator.distanceFromStart <= 0 ) {
          this.removeAttenuator( modelElement );
        }
      }
    );

    // Update aspects of the wave that evolve over time.
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
   * Get the intensity of the wave at the specified distance from the starting point.
   * @param {number} distanceFromStart (in meters)
   * @returns {number}
   * @public
   */
  getIntensityAt( distanceFromStart ) {
    let intensity = this.intensityAtStart;
    this.intensityChanges.forEach( intensityChange => {
      if ( intensityChange.distanceFromStart < distanceFromStart ) {
        intensity = intensityChange.intensity;
      }
    } );
    return intensity;
  }

  /**
   * Get the intensity of the wave at its end point.
   * @returns {number}
   * @private
   */
  getIntensityAtEnd() {
    return this.getIntensityAt( this.length );
  }

  /**
   * Set the intensity of the wave at the given distance from the start point.  If the intensity at that point is
   * already at the specified value, the request is quietly ignored.
   * @param {number} distanceFromStart
   * @param {number} intensity
   * @param {boolean} propagateWithWave
   * @returns {IntensityChange|null}
   * @private
   */
  setIntensityAt( distanceFromStart, intensity, propagateWithWave ) {

    let addedIntensityChange = null;
    if ( distanceFromStart === 0 ) {
      this.intensityAtStart = intensity;
    }
    else {
      let insertionIndex = 0;
      for ( let i = 0; i < this.intensityChanges.length; i++ ) {
        const intensityChange = this.intensityChanges[ i ];
        if ( intensityChange.distanceFromStart > distanceFromStart ) {

          // This intensity change is past the provided distance, so we're done.
          break;
        }
        else {
          insertionIndex = i + 1;
        }
      }

      // Create a new intensity change and insert it into the array in the appropriate place.
      addedIntensityChange = new IntensityChange( intensity, distanceFromStart, propagateWithWave );
      this.intensityChanges.splice( insertionIndex, 0, addedIntensityChange );
    }

    return addedIntensityChange;
  }

  /**
   * Set the intensity at the start of the wave.
   * @param {number} intensity - a normalized intensity value
   * @public
   */
  setIntensityAtStart( intensity ) {

    assert && assert( intensity > 0 && intensity <= 1, 'illegal intensity value' );

    // Auto-creation of propagating intensity changes is no longer done, see https://github.com/phetsims/greenhouse-effect/issues/53.
    // if ( this.intensityAtStart !== intensity ) {
    //   this.intensityChanges.push( new IntensityChange( this.intensityAtStart, SMALL_INTER_CHANGE_DISTANCE, true ) );
    //   this.sortIntensityChanges();
    //   this.intensityAtStart = intensity;
    // }

    this.intensityAtStart = intensity;
  }

  /**
   * @param {number} distanceFromStart
   * @param {number} attenuationAmount
   * @param {Object} causalModelElement - the model element that is causing this attenuation to exist
   * @public
   */
  addAttenuator( distanceFromStart, attenuationAmount, causalModelElement ) {

    // parameter checking
    assert && assert(
    attenuationAmount >= 0 && attenuationAmount <= 1,
      'the attenuation amount must be between zero and one'
    );

    // state checking
    assert && assert(
      !this.modelObjectToAttenuatorMap.has( causalModelElement ),
      'this model object already has an attenuator'
    );

    const currentIntensityAtDistance = this.getIntensityAt( distanceFromStart );

    // By design, this will get rid of any intensity changes that occur until the end of the wave or until the next
    // attenuator.  This is perhaps not entirely realistic, but the designers decided that it looks better.  If there
    // are intensity changes that are downstream of an attenuator, adjust them to reflect this new attenuation.
    const intensityChangesToRemove = [];
    let nonPropagatingIntensityChangeFound = false;
    for ( let i = 0; i < this.intensityChanges.length; i++ ) {
      const intensityChange = this.intensityChanges[ i ];
      if ( intensityChange.distanceFromStart > distanceFromStart ) {

        if ( !intensityChange.propagatesWithWave ) {
          nonPropagatingIntensityChangeFound = true;
        }

        if ( nonPropagatingIntensityChangeFound ) {

          // attenuate this intensity change
          intensityChange.intensity = intensityChange * attenuationAmount;
        }
        else {

          // This one should be removed.
          intensityChangesToRemove.push( intensityChange );
        }
      }
    }

    this.intensityChanges = this.intensityChanges.filter(
      intensityChange => !intensityChangesToRemove.includes( intensityChange )
    );

    // Create and add the new attenuator and the intensity change that goes with it.
    const attenuatedOutputLevel = currentIntensityAtDistance * ( 1 - attenuationAmount );
    const intensityChange = new IntensityChange( attenuatedOutputLevel, distanceFromStart, false );
    this.intensityChanges.push( intensityChange );
    this.modelObjectToAttenuatorMap.set(
      causalModelElement,
      new WaveAttenuator( attenuationAmount, distanceFromStart, intensityChange )
    );

    // Make sure the intensity changes are in the correct order.
    // TODO: Consider making the code always keep the order correct and just verify the order with asserts and such.
    this.sortIntensityChanges();
  }

  /**
   * Remove the attenuator associated with the provided model element.
   * @param {Object} causalModelElement
   * @public
   */
  removeAttenuator( causalModelElement ) {

    assert && assert(
      this.modelObjectToAttenuatorMap.has( causalModelElement ),
      'no attenuator exists for the provided model element'
    );

    const attenuator = this.modelObjectToAttenuatorMap.get( causalModelElement );

    // By design, when an attenuator is removed, all intensity changes are removed to the end of the wave or to the next
    // attenuator.  This is perhaps not perfectly realistic, but the design team decided that it looked better on July
    // 21, 2021.
    const intensityChangesToRemove = [ attenuator.correspondingIntensityChange ];
    for ( let i = 0; i < this.intensityChanges.length; i++ ) {
      const intensityChange = this.intensityChanges[ i ];
      if ( !intensityChange.propagatesWithWave ) {

        // This is a non-propagating intensity change, which means it goes with an attenuator, so stop the removal of
        // intensity changes.
        break;
      }
      if ( intensityChange.distanceFromStart > attenuator.distanceFromStart ) {
        intensityChangesToRemove.push( intensityChange );
      }
    }

    this.intensityChanges = this.intensityChanges.filter(
      intensityChange => !intensityChangesToRemove.includes( intensityChange )
    );

    // Remove the attenuator from the map.
    this.modelObjectToAttenuatorMap.delete( causalModelElement );
  }

  /**
   * Does the provided model element have an associated attenuator on this wave?
   * @param {Object} modelElement
   * @public
   */
  hasAttenuator( modelElement ) {
    return this.modelObjectToAttenuatorMap.has( modelElement );
  }

  /**
   * Set the attenuation value in the attenuator associated with the provided model element.
   * @param {Object} modelElement
   * @param {number} attenuation
   * @public
   */
  setAttenuation( modelElement, attenuation ) {

    // state and parameter checking
    assert && assert( this.hasAttenuator( modelElement ), 'no attenuator is on this wave for this model element' );
    assert && assert( attenuation >= 0 && attenuation <= 1, 'invalid attenuation value' );

    // Update the attenuation value and the corresponding intensity change.
    const attenuator = this.modelObjectToAttenuatorMap.get( modelElement );
    if ( attenuator.attenuation !== attenuation ) {
      attenuator.attenuation = attenuation;
      attenuator.correspondingIntensityChange.intensity =
        this.getIntensityBefore( attenuator.correspondingIntensityChange ) * ( 1 - attenuation );
    }
  }

  /**
   * Get the intensity prior to the provided intensity change.
   * @param {IntensityChange} intensityChange
   * @returns {number}
   * @private
   */
  getIntensityBefore( intensityChange ) {
    const intensityChangeIndex = this.intensityChanges.indexOf( intensityChange );
    assert && assert( intensityChangeIndex >= 0 );
    let intensityValue = this.intensityAtStart;
    for ( let i = 0; i < intensityChangeIndex; i++ ) {
      intensityValue = this.intensityChanges[ i ].intensity;
    }
    return intensityValue;
  }

  /**
   * true if the wave has completely propagated and has nothing else to do
   * @returns {boolean}
   * @public
   */
  get isCompletelyPropagated() {
    return this.startPoint.y === this.propagationLimit;
  }

  /**
   * Sort the intensity changes from closest to the start point to furthest.
   * @private
   */
  sortIntensityChanges() {

    this.intensityChanges.sort( ( a, b ) => {
      let result = a.distanceFromStart - b.distanceFromStart;

      // If two intensities land on top of one another, the propagating one should come first in the order.  Other parts
      // of the code depend on this being true.
      if ( result === 0 ) {

        // We should never have a case where two propagating intensities are on top of one another.  If we do, other
        // portions of the code should be fixed so that this doesn't occur.
        assert && assert( a.propagatesWithWave !== b.propagatesWithWave );

        result = b.propagatesWithWave ? 1 : -1;
      }

      return result;
    } );
  }
}

/**
 * A simple inner class that is used to keep track of points along the wave where the intensity changes.
 */
class IntensityChange {

  /**
   * @param {number} intensity - a normalized value from 0 to 1
   * @param {number} distanceFromStart - in meters
   * @param {boolean} propagatesWithWave - true if this should move with the wave, false if not
   */
  constructor( intensity, distanceFromStart, propagatesWithWave ) {
    this.intensity = intensity;
    this.distanceFromStart = distanceFromStart;
    this.propagatesWithWave = propagatesWithWave;
  }
}

/**
 * A simple class that is used to keep track of points along the wave where attenuation (reduction in intensity) should
 * occur.
 */
class WaveAttenuator {

  constructor( initialAttenuation, distanceFromStart, correspondingIntensityChange ) {

    // @public {number} - Amount of attenuation.  This is a normalized value from 0 to 1 where 0 means no attenuation
    // (i.e. the wave's intensity will remain unchanged) and 1 means 100% attenuation (a wave passing through will
    // have its intensity reduced to zero).
    this.attenuation = initialAttenuation;

    // @public {number}
    this.distanceFromStart = distanceFromStart;

    // @public (read-only) {IntensityChange} - the intensity change that occurs on the wave due to this attenuator
    this.correspondingIntensityChange = correspondingIntensityChange;
  }
}

// statics
Wave.PHASE_RATE = PHASE_RATE;

greenhouseEffect.register( 'Wave', Wave );
export default Wave;