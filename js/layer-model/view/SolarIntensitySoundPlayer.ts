// Copyright 2022, University of Colorado Boulder

/**
 * SolarIntensitySoundPlayer is used to produce sounds for the slider that controls photon intensity.  It is
 * basically just a sound clip with a high-pass filter in the signal chain.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';

// types for options
type SolarIntensitySoundPlayerSelfOptions = {};
type SolarIntensitySoundPlayerOptions = SolarIntensitySoundPlayerSelfOptions & SoundClipOptions;

class SolarIntensitySoundPlayer extends SoundClip {

  constructor( solarIntensityProperty: NumberProperty,
               solarIntensityRange: Range,
               providedOptions?: SolarIntensitySoundPlayerOptions ) {

    // Create a low-pass filter that will change as the solar intensity changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';

    // Adjust the cutoff frequency of the filter as the solar intensity changes.
    solarIntensityProperty.link( solarIntensity => {
      const normalizedSolarIntensity = ( solarIntensity - solarIntensityRange.min ) / solarIntensityRange.getLength();

      // Map the solar intensity into a cutoff frequency.  This is a very empirical mapping, and is quite dependent on
      // the frequency content of the underlying sound, so feel free to adjust as needed.
      const cutoffFrequency = Math.pow( normalizedSolarIntensity, 2 ) * 5000;

      // Set the cutoff frequency.
      lowPassFilter.frequency.setTargetAtTime( cutoffFrequency, phetAudioContext.currentTime, 0.015 );
    } );

    const options = optionize<SolarIntensitySoundPlayerOptions, SolarIntensitySoundPlayerSelfOptions, SoundClipOptions>()( {
      additionalAudioNodes: [ lowPassFilter ]
    }, providedOptions );

    super( layerModelBaseSliderSound_mp3, options );
  }
}

greenhouseEffect.register( 'SolarIntensitySoundPlayer', SolarIntensitySoundPlayer );
export default SolarIntensitySoundPlayer;