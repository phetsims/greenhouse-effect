// Copyright 2020-2021, University of Colorado Boulder

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

  constructor( initialAttenuation, distanceFromStart ) {

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
  toStateObject() {
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
  static fromStateObject( stateObject ) {
    return new WaveAttenuator(
      NumberIO.fromStateObject( stateObject.attenuation ),
      NumberIO.fromStateObject( stateObject.distanceFromStart )
    );
  }
}

WaveAttenuator.WaveAttenuatorIO = IOType.fromCoreType( 'WaveAttenuatorIO', WaveAttenuator, {
  stateSchema: {
    attenuation: NumberIO,
    distanceFromStart: NumberIO
  }
} );

greenhouseEffect.register( 'WaveAttenuator', WaveAttenuator );
export default WaveAttenuator;