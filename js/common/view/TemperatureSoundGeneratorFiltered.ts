// Copyright 2021-2025, University of Colorado Boulder

/**
 * TemperatureSoundGeneratorFiltered is used to create a sound indicating the temperature, and uses a sound loop and an
 * adjustable filter to do it.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import temperatureBaseAmbience4Octaves_mp3 from '../../../sounds/temperatureBaseAmbience4Octaves_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const FILTER_FREQUENCY_RANGE = new Range( 120, 2500 );
const TIME_CONSTANT = 0.015;
const FILTER_Q = 10; // empirically determined

class TemperatureSoundGeneratorFiltered extends SoundGenerator {

  private readonly temperatureToFilterFrequency: LinearFunction;

  public constructor( temperatureProperty: Property<number>,
                      isSunShiningProperty: Property<boolean>,
                      expectedTemperatureRange: Range,
                      surfaceTemperatureIndicatorEnabledProperty: TReadOnlyProperty<boolean>,
                      isPlayingProperty: TReadOnlyProperty<boolean>,
                      associatedViewNode: Node ) {

    super( {
      initialOutputLevel: 0.045,
      associatedViewNode: associatedViewNode,
      enabledProperty: new DerivedProperty(
        [ surfaceTemperatureIndicatorEnabledProperty, isPlayingProperty ],
        ( surfaceTemperatureIndicatorEnabled, isPlaying ) => surfaceTemperatureIndicatorEnabled && isPlaying
      )
    } );

    // loop which will be filtered to produce the sounds
    const baseSoundLoop = new SoundClip( temperatureBaseAmbience4Octaves_mp3, {
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
    lowPassFilter.connect( this.mainGainNode );

    // Send the loop into both filters.
    baseSoundLoop.connect( lowPassFilter );

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
    } );
  }
}

greenhouseEffect.register( 'TemperatureSoundGeneratorFiltered', TemperatureSoundGeneratorFiltered );
export default TemperatureSoundGeneratorFiltered;