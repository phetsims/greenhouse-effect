// Copyright 2021-2023, University of Colorado Boulder

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * WaveAttenuator is a simple class that is used to keep track of points along a wave where attenuation (reduction in
 * intensity) exist.  These are generally caused by something splitting off some portion of the energy earlier in the
 * wave's propagation, such as a cloud or a part of the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class WaveAttenuator {

  // Amount of attenuation.  This is a normalized value from 0 to 1 where 0 means no attenuation (i.e. the wave's
  // intensity will remain unchanged when passing through it) and 1 means 100% attenuation (a wave passing through will
  // have its intensity reduced to zero).
  public attenuation: number;

  // the distance from the start of the wave where this attenuator exists
  public distanceFromStart: number;

  /**
   * @param initialAttenuation - amount of attenuation at construction, may be changed later
   * @param distanceFromStart - distance from the start of the wave, in meters
   */
  public constructor( initialAttenuation: number, distanceFromStart: number ) {
    this.attenuation = initialAttenuation;
    this.distanceFromStart = distanceFromStart;
  }

  // phet-io - This uses data type serialization.
  public static readonly WaveAttenuatorIO = new IOType( 'WaveAttenuatorIO', {
    valueType: WaveAttenuator,
    stateSchema: {
      attenuation: NumberIO,
      distanceFromStart: NumberIO
    },
    fromStateObject: ( stateObject: WaveAttenuatorStateObject ) => new WaveAttenuator(
      stateObject.attenuation,
      stateObject.distanceFromStart
    )
  } );
}

export type WaveAttenuatorStateObject = {
  attenuation: number;
  distanceFromStart: number;
};

greenhouseEffect.register( 'WaveAttenuator', WaveAttenuator );
export default WaveAttenuator;