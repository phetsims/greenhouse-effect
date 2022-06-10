// Copyright 2021-2022, University of Colorado Boulder

/**
 * TemperatureSoundGeneratorFiltered is used to create a sound indicating the temperature, and uses filtered loops to do
 * it.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import greenhouseEffectTemperatureBaseAmbience4Octaves_mp3 from '../../../sounds/greenhouseEffectTemperatureBaseAmbience4Octaves_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectOptionsDialogContent, { TemperatureSoundNames } from './GreenhouseEffectOptionsDialogContent.js';
import Property from '../../../../axon/js/Property.js';

// constants
const FILTER_FREQUENCY_RANGE = new Range( 120, 2500 );
const TIME_CONSTANT = 0.015;
const FILTER_Q = 10; // empirically determined

class TemperatureSoundGeneratorFiltered extends SoundGenerator {
  private readonly temperatureToFilterFrequency: LinearFunction;

  public constructor( temperatureProperty: Property<number>,
                      isSunShiningProperty: Property<boolean>,
                      expectedTemperatureRange: Range,
                      options: SoundGeneratorOptions ) {

    super( options );

    // loop which will be filtered to produce the sounds
    const baseSoundLoop = new SoundClip( greenhouseEffectTemperatureBaseAmbience4Octaves_mp3, {
      loop: true
    } );

    this.temperatureToFilterFrequency = new LinearFunction(
      expectedTemperatureRange.min,
      expectedTemperatureRange.max,
      FILTER_FREQUENCY_RANGE.min,
      FILTER_FREQUENCY_RANGE.max
    );

    // low pass filter
    const lowPassFilter = this.audioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.Q.value = FILTER_Q;

    // band pass filter
    const bandPassFilter = this.audioContext.createBiquadFilter();
    bandPassFilter.type = 'bandpass';
    bandPassFilter.Q.value = FILTER_Q;

    // Send the loop into both filters.
    // @ts-ignore TODO: typing for AudioParam
    baseSoundLoop.connect( lowPassFilter );
    // @ts-ignore TODO: typing for AudioParam
    baseSoundLoop.connect( bandPassFilter );

    // Put the appropriate filter in the signal chain depending on which sound generation is selected for temperature.
    phet.greenhouseEffect.temperatureSoundProperty.link( ( temperatureSound: TemperatureSoundNames ) => {
      if ( temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_LOW_PASS ) {
        lowPassFilter.connect( this.masterGainNode );
        try {
          bandPassFilter.disconnect( this.masterGainNode );
        }
        catch( e ) {
          // Ignore this if the filter wasn't connected.
        }
      }
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
      const frequency = this.temperatureToFilterFrequency.evaluate( temperature );
      const now = this.audioContext.currentTime;
      lowPassFilter.frequency.setTargetAtTime( frequency, now, TIME_CONSTANT );
      bandPassFilter.frequency.setTargetAtTime( frequency, now, TIME_CONSTANT );
    } );
  }
}

greenhouseEffect.register( 'TemperatureSoundGeneratorFiltered', TemperatureSoundGeneratorFiltered );
export default TemperatureSoundGeneratorFiltered;