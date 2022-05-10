// Copyright 2022, University of Colorado Boulder

/**
 * SolarIntensitySoundPlayer is used to produce sounds for the slider that controls photon intensity.  It is
 * basically just a sound clip with a high-pass filter in the signal chain.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import ISoundPlayer from '../../../../tambo/js/ISoundPlayer.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';

// types for options
type SelfOptions = {};
type SolarIntensitySoundPlayerOptions = SelfOptions & SoundGeneratorOptions;

class SolarIntensitySoundPlayer extends SoundGenerator implements ISoundPlayer {

  // sound clip played for sounds in the middle, i.e. not at either the min or max
  private readonly middleSoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3 );

  // sound clip played at min and max values
  private readonly boundarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3, {
      initialPlaybackRate: 0.667
    }
  );

  // a Property that represents the current solar intensity
  private readonly solarIntensityProperty: NumberProperty;

  // range of solar intensity
  private readonly solarIntensityRange: Range;

  constructor( solarIntensityProperty: NumberProperty,
               solarIntensityRange: Range,
               providedOptions?: SolarIntensitySoundPlayerOptions ) {

    const options = optionize<SolarIntensitySoundPlayerOptions, SelfOptions, SoundGeneratorOptions>()( {}, providedOptions );

    super( options );

    // Make the parameters available to the methods.
    this.solarIntensityProperty = solarIntensityProperty;
    this.solarIntensityRange = solarIntensityRange;

    // Create a low-pass filter that will change as the solar intensity changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';

    // Connect the filter to the audio output path.
    lowPassFilter.connect( this.masterGainNode );

    // Adjust the cutoff frequency of the filter as the solar intensity changes.
    solarIntensityProperty.link( solarIntensity => {
      const normalizedSolarIntensity = ( solarIntensity - solarIntensityRange.min ) / solarIntensityRange.getLength();

      // Map the solar intensity into a cutoff frequency.  This is a very empirical mapping, and is quite dependent on
      // the frequency content of the underlying sound, so feel free to adjust as needed.
      const cutoffFrequency = Math.max( Math.pow( normalizedSolarIntensity, 2 ) * 5000, 75 );

      // Set the cutoff frequency.
      lowPassFilter.frequency.setTargetAtTime( cutoffFrequency, phetAudioContext.currentTime, 0.015 );
    } );

    // Hook up the sound clips to the filter.
    this.middleSoundClip.connect( lowPassFilter );
    this.boundarySoundClip.connect( lowPassFilter );
  }

  /**
   * Play the boundary sound if at the min or max of the range, or the middle sound if not.
   */
  public play(): void {
    const solarIntensity = this.solarIntensityProperty.value;
    if ( solarIntensity > this.solarIntensityRange.min && solarIntensity < this.solarIntensityRange.max ) {
      this.middleSoundClip.play();
    }
    else {
      this.boundarySoundClip.play();
    }
  }

  /**
   * Stop the sounds.  This isn't expected to be used much in this context, it's here primarily to complete the
   * ISoundPlayer interface.
   */
  public stop(): void {
    this.middleSoundClip.stop();
    this.boundarySoundClip.stop();
  }
}

greenhouseEffect.register( 'SolarIntensitySoundPlayer', SolarIntensitySoundPlayer );
export default SolarIntensitySoundPlayer;