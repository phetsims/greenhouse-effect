// Copyright 2021, University of Colorado Boulder

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * WaveAttenuator is a simple class that is used to keep track of points along a wave where attenuation (reduction in
 * intensity) should occur.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class WaveAttenuator {
  attenuation: number;
  distanceFromStart: number;

  /**
   * @param {number} initialAttenuation - amount of attenuation at construction, may be changed later
   * @param {number} distanceFromStart - distance from the start of the wave, in meters
   */
  constructor( initialAttenuation: number, distanceFromStart: number ) {

    // @public {number} - Amount of attenuation.  This is a normalized value from 0 to 1 where 0 means no attenuation
    // (i.e. the wave's intensity will remain unchanged when passing through it) and 1 means 100% attenuation (a wave
    // passing through will have its intensity reduced to zero).
    this.attenuation = initialAttenuation;

    // @public {number}
    this.distanceFromStart = distanceFromStart;
  }

  /**
   * Serializes this WaveAttenuator instance.
   * @returns {Object}
   * @public
   */
  toStateObject(): WaveAttenuatorStateObject {
    return {
      attenuation: NumberIO.toStateObject( this.attenuation ),
      distanceFromStart: NumberIO.toStateObject( this.distanceFromStart )
    };
  }

  /**
   * @param stateObject
   * @returns {Object}
   * @public
   */
  static fromStateObject( stateObject: WaveAttenuatorStateObject ) {
    return new WaveAttenuator(
      NumberIO.fromStateObject( stateObject.attenuation ),
      NumberIO.fromStateObject( stateObject.distanceFromStart )
    );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  static get STATE_SCHEMA() {
    return {
      attenuation: NumberIO,
      distanceFromStart: NumberIO
    };
  }

  // phet-io
  static WaveAttenuatorIO = IOType.fromCoreType( 'WaveAttenuatorIO', WaveAttenuator );
}

type WaveAttenuatorStateObject = {
  attenuation: number,
  distanceFromStart: number
}

greenhouseEffect.register( 'WaveAttenuator', WaveAttenuator );
export default WaveAttenuator;