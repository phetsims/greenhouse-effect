// Copyright 2022-2023, University of Colorado Boulder

/**
 * SolarIntensitySoundPlayer is used to produce sounds for the slider that controls photon intensity.  It is
 * basically just a sound clip with a high-pass filter in the signal chain.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import Range from '../../../../dot/js/Range.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class SolarIntensitySoundPlayer extends SoundGenerator implements TSoundPlayer {

  // sound clip played for sounds in the middle, i.e. not at either the min or max
  private readonly middleSoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3 );

  // sound clip played at min and max values
  private readonly boundarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3, {
      initialPlaybackRate: 0.667
    }
  );

  private readonly solarIntensityProperty: TRangedProperty;
  private readonly solarIntensityRange: Range;

  public constructor( solarIntensityProperty: TRangedProperty ) {

    // convenience variable
    const solarIntensityRange = solarIntensityProperty.range;

    super( {
      initialOutputLevel: 0.075
    } );

    // Make the parameters available to the methods.
    this.solarIntensityProperty = solarIntensityProperty;
    this.solarIntensityRange = solarIntensityRange;

    // Create a low-pass filter that will change as the solar intensity changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';

    // Connect the filter to the audio output path.
    lowPassFilter.connect( this.mainGainNode );

    // Adjust the cutoff frequency of the filter as the solar intensity changes.
    solarIntensityProperty.link( solarIntensity => {
      const normalizedSolarIntensity = ( solarIntensity - solarIntensityRange.min ) / solarIntensityRange.getLength();

      // Map the solar intensity into a cutoff frequency.  This is a very empirical mapping, and is quite dependent on
      // the frequency content of the underlying sound, so feel free to adjust as needed.
      const cutoffFrequency = Math.max( Math.pow( normalizedSolarIntensity, 2 ) * 5000, 300 );

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
   * TSoundPlayer interface.
   */
  public stop(): void {
    this.middleSoundClip.stop();
    this.boundarySoundClip.stop();
  }

  // This is intended to exist for the life of the sim, and disposal is not supported.
  public override dispose(): void {
    Disposable.assertNotDisposable();
  }
}

greenhouseEffect.register( 'SolarIntensitySoundPlayer', SolarIntensitySoundPlayer );
export default SolarIntensitySoundPlayer;