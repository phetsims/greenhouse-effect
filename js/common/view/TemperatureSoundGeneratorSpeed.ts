// Copyright 2021, University of Colorado Boulder

/**
 * TemperatureSoundGeneratorSpeed is used to create a sound indicating the temperature.  As the temperature goes up, it
 * increases the speed at which a looped sound is playing.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import baseSound from '../../../sounds/greenhouse-temperature-rising-with-base-note-low_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundLayer from '../model/GroundLayer.js';
import Property from '../../../../axon/js/Property.js';

// constants
const EXPECTED_TEMPERATURE_RANGE = new Range( GroundLayer.MINIMUM_TEMPERATURE, 295 );
const PLAYBACK_RATE_RANGE = new Range( 0.5, 1.5 );
const temperatureToPlaybackRate = new LinearFunction(
  EXPECTED_TEMPERATURE_RANGE.min,
  EXPECTED_TEMPERATURE_RANGE.max,
  PLAYBACK_RATE_RANGE.min,
  PLAYBACK_RATE_RANGE.max
);

class TemperatureSoundGeneratorSpeed extends SoundGenerator {

  /**
   * @param {Property.<number>} temperatureProperty - temperature of the model, in Kelvin
   * @param {Property.<boolean>} isSunShiningProperty
   * @param {Object} [options]
   */
  constructor( temperatureProperty: Property<number>,
               isSunShiningProperty: Property<boolean>,
               options: SoundGeneratorOptions ) {

    super( options );

    // the loop which will be filtered to produce the sounds
    const baseSoundLoop = new SoundClip( baseSound, {
      loop: true
    } );
    baseSoundLoop.connect( this.masterGainNode );

    // This loop should be producing sound whenever the sun is shining.
    isSunShiningProperty.link( ( isSunShining: boolean ) => {
      if ( isSunShining ) {
        baseSoundLoop.play();
      }
      else {
        baseSoundLoop.stop();
      }
    } );

    // Adjust the playback rate as the temperature changes.
    temperatureProperty.link( ( temperature: number ) => {
      // @ts-ignore
      baseSoundLoop.setPlaybackRate( temperatureToPlaybackRate( temperature ) );
    } );
  }
}

greenhouseEffect.register( 'TemperatureSoundGeneratorSpeed', TemperatureSoundGeneratorSpeed );
export default TemperatureSoundGeneratorSpeed;