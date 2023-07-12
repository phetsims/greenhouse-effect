// Copyright 2022-2023, University of Colorado Boulder

/**
 * IrAbsorbanceSoundPlayer is used to produce sounds for the slider that controls the infrared (IR) absorbance of a set
 * of IR-absorbing layers in an atmosphere.  It does this by cross-fading between two sound clips.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';

class InfraredAbsorbanceSoundPlayer extends SoundGenerator implements TSoundPlayer {

  // sound clip played for sounds in the middle, i.e. not at either the min or max
  // private readonly middleSoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3 );
  private readonly middleSoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3, {
    initialPlaybackRate: 1 / Math.pow( 2, 1 / 6 ) // one musical step below the natural playback rate
  } );

  // sound clip played at min and max values
  private readonly boundarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3, {
      initialPlaybackRate: 0.667
    }
  );

  private readonly irAbsorbanceProperty: NumberProperty;

  public constructor( irAbsorbanceProperty: NumberProperty ) {
    super( {
      initialOutputLevel: 0.075
    } );

    // Make the parameters available to the methods.
    this.irAbsorbanceProperty = irAbsorbanceProperty;

    // Create a low-pass filter that will change as the solar intensity changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';

    // Connect the filter to the audio output path.
    lowPassFilter.connect( this.masterGainNode );

    // Adjust the cutoff frequency of the filter as the solar intensity changes.
    irAbsorbanceProperty.link( solarIntensity => {
      const normalizedIrAbsorbance = ( solarIntensity - irAbsorbanceProperty.range.min ) /
                                     irAbsorbanceProperty.range.getLength();

      // Map the IR absorbance into a cutoff frequency.  This is a very empirical mapping, and is quite dependent on
      // the frequency content of the underlying sound, so feel free to adjust as needed.
      const cutoffFrequency = Math.pow( 1 - 0.75 * normalizedIrAbsorbance, 3 ) * 8000;

      // Set the cutoff frequency.
      lowPassFilter.frequency.setTargetAtTime( cutoffFrequency, phetAudioContext.currentTime, 0.015 );
    } );

    // Hook up the sound clips to the filter.
    this.middleSoundClip.connect( lowPassFilter );
    this.boundarySoundClip.connect( lowPassFilter );
  }

  /**
   * Play the sound.
   */
  public play(): void {
    const irAbsorbance = this.irAbsorbanceProperty.value;
    const irRange = this.irAbsorbanceProperty.range;
    if ( irAbsorbance > irRange.min && irAbsorbance < irRange.max ) {
      this.middleSoundClip.play();
    }
    else {
      this.boundarySoundClip.play();
    }
  }

  /**
   * Stop the sounds.  This isn't expected to be used much, but is necessary for the TSoundPlayer interface.
   */
  public stop(): void {
    this.middleSoundClip.stop();
    this.boundarySoundClip.stop();
  }
}

greenhouseEffect.register( 'InfraredAbsorbanceSoundPlayer', InfraredAbsorbanceSoundPlayer );
export default InfraredAbsorbanceSoundPlayer;