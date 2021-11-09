// Copyright 2021, University of Colorado Boulder

/**
 * TemperatureSoundGeneratorFiltered is used to create a sound indicating the temperature, and uses filtered loops to do
 * it.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import baseSound from '../../../sounds/greenhouse-effect-temperature-base-ambience-4-octaves_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundLayer from '../model/GroundLayer.js';
import GreenhouseEffectOptionsDialogContent from './GreenhouseEffectOptionsDialogContent.js';
import Property from '../../../../axon/js/Property.js';

// constants
const EXPECTED_TEMPERATURE_RANGE = new Range( GroundLayer.MINIMUM_TEMPERATURE, 295 );
const FILTER_FREQUENCY_RANGE = new Range( 120, 2500 );
const temperatureToFilterFrequency = new LinearFunction(
  EXPECTED_TEMPERATURE_RANGE.min,
  EXPECTED_TEMPERATURE_RANGE.max,
  FILTER_FREQUENCY_RANGE.min,
  FILTER_FREQUENCY_RANGE.max
);
const TIME_CONSTANT = 0.015;
const FILTER_Q = 10; // empirically determined

class TemperatureSoundGeneratorFiltered extends SoundGenerator {

  /**
   * @param {Property.<number>} temperatureProperty - temperature of the model, in Kelvin
   * @param {Property.<boolean>} isSunShiningProperty
   * @param {Object} [options]
   */
  constructor( temperatureProperty: Property<number>,
               isSunShiningProperty: Property<boolean>,
               options: SoundGeneratorOptions ) {

    super( options );

    // loop which will be filtered to produce the sounds
    const baseSoundLoop = new SoundClip( baseSound, {
      loop: true
    } );

    // low pass filter
    const lowPassFilter = this.audioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.Q.value = FILTER_Q;

    // band pass filter
    const bandPassFilter = this.audioContext.createBiquadFilter();
    bandPassFilter.type = 'bandpass';
    bandPassFilter.Q.value = FILTER_Q;

    // Send the loop into both filters.
    baseSoundLoop.connect( lowPassFilter );
    baseSoundLoop.connect( bandPassFilter );

    // Put the appropriate filter in the signal chain depending on which sound generation is selected for temperature.
    phet.greenhouseEffect.temperatureSoundProperty.link( ( temperatureSound: string ) => {
      // @ts-ignore
      if ( temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_LOW_PASS ) {
        lowPassFilter.connect( this.masterGainNode );
        try {
          bandPassFilter.disconnect( this.masterGainNode );
        }
        catch( e ) {
          // Ignore this if the filter wasn't connected.
        }
      }
      // @ts-ignore
      else if ( temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_BAND_PASS ) {
        bandPassFilter.connect( this.masterGainNode );
        try {
          lowPassFilter.disconnect( this.masterGainNode );
        }
        catch( e ) {
          // Ignore this if the filter wasn't connected.
        }
      }
    } );

    // This loop should be producing sound whenever the sun is shining.
    isSunShiningProperty.link( isSunShining => {
      if ( isSunShining ) {
        baseSoundLoop.play();
      }
      else {
        baseSoundLoop.stop();
      }
    } );

    // Adjust the filters as the temperature changes.
    temperatureProperty.link( temperature => {
      const frequency = temperatureToFilterFrequency.evaluate( temperature );
      const now = this.audioContext.currentTime;
      lowPassFilter.frequency.setTargetAtTime( frequency, now, TIME_CONSTANT );
      bandPassFilter.frequency.setTargetAtTime( frequency, now, TIME_CONSTANT );
    } );
  }
}

greenhouseEffect.register( 'TemperatureSoundGeneratorFiltered', TemperatureSoundGeneratorFiltered );
export default TemperatureSoundGeneratorFiltered;