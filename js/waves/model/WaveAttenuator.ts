// Copyright 2021-2022, University of Colorado Boulder

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
  public attenuation: number;
  public distanceFromStart: number;

  /**
   * @param initialAttenuation - amount of attenuation at construction, may be changed later
   * @param distanceFromStart - distance from the start of the wave, in meters
   */
  public constructor( initialAttenuation: number, distanceFromStart: number ) {

    // {number} - Amount of attenuation.  This is a normalized value from 0 to 1 where 0 means no attenuation
    // (i.e. the wave's intensity will remain unchanged when passing through it) and 1 means 100% attenuation (a wave
    // passing through will have its intensity reduced to zero).
    this.attenuation = initialAttenuation;

    // {number}
    this.distanceFromStart = distanceFromStart;
  }

  /**
   * Serializes this WaveAttenuator instance.
   */
  public toStateObject(): WaveAttenuatorStateObject {
    return {
      attenuation: NumberIO.toStateObject( this.attenuation ),
      distanceFromStart: NumberIO.toStateObject( this.distanceFromStart )
    };
  }

  public static fromStateObject( stateObject: WaveAttenuatorStateObject ): WaveAttenuator {
    return new WaveAttenuator(
      NumberIO.fromStateObject( stateObject.attenuation ),
      NumberIO.fromStateObject( stateObject.distanceFromStart )
    );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static get STATE_SCHEMA(): { [ key: string ]: IOType } {
    return {
      attenuation: NumberIO,
      distanceFromStart: NumberIO
    };
  }

  // phet-io
  public static WaveAttenuatorIO = IOType.fromCoreType( 'WaveAttenuatorIO', WaveAttenuator );
}

type WaveAttenuatorStateObject = {
  attenuation: number;
  distanceFromStart: number;
};

greenhouseEffect.register( 'WaveAttenuator', WaveAttenuator );
export default WaveAttenuator;