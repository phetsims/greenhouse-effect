// Copyright 2021-2022, University of Colorado Boulder

/**
 * TemperatureSoundGeneratorSpeed is used to create a sound indicating the temperature.  As the temperature goes up, it
 * increases the speed at which a looped sound is playing.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import greenhouseTemperatureRisingWithBaseNoteLow_mp3 from '../../../sounds/greenhouseTemperatureRisingWithBaseNoteLow_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Property from '../../../../axon/js/Property.js';

// constants
const PLAYBACK_RATE_RANGE = new Range( 0.5, 1.5 );

class TemperatureSoundGeneratorSpeed extends SoundGenerator {

  constructor( temperatureProperty: Property<number>,
               isSunShiningProperty: Property<boolean>,
               expectedTemperatureRange: Range,
               options: SoundGeneratorOptions ) {

    super( options );

    // the loop which will be filtered to produce the sounds
    const baseSoundLoop = new SoundClip( greenhouseTemperatureRisingWithBaseNoteLow_mp3, {
      loop: true
    } );
    // @ts-ignore TODO: typing for AudioParam
    baseSoundLoop.connect( this.masterGainNode );

    // This loop should be producing sound whenever the sun is shining.
    isSunShiningProperty.link( isSunShining => {
      if ( isSunShining ) {
        baseSoundLoop.play();
      }
      else {
        baseSoundLoop.stop();
      }
    } );

    const temperatureToPlaybackRate = new LinearFunction(
      expectedTemperatureRange.min,
      expectedTemperatureRange.max,
      PLAYBACK_RATE_RANGE.min,
      PLAYBACK_RATE_RANGE.max
    );

    // Adjust the playback rate as the temperature changes.
    temperatureProperty.link( temperature => {
      baseSoundLoop.setPlaybackRate( temperatureToPlaybackRate.evaluate( temperature ) );
    } );
  }
}

greenhouseEffect.register( 'TemperatureSoundGeneratorSpeed', TemperatureSoundGeneratorSpeed );
export default TemperatureSoundGeneratorSpeed;