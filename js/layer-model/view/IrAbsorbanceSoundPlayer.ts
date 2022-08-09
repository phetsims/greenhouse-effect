// Copyright 2022, University of Colorado Boulder

/**
 * IrAbsorbanceSoundPlayer is used to produce sounds for the slider that controls the infrared (IR) absorbance of a set
 * of IR-absorbing layers in an atmosphere.  It does this by cross-fading between two sound clips.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// types for options
type SelfOptions = EmptySelfOptions;
type IrAbsorbanceSoundPlayerOptions = SelfOptions & SoundClipOptions;

class IrAbsorbanceSoundPlayer extends SoundGenerator implements TSoundPlayer {

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
  private readonly irAbsorbanceRange: Range;


  public constructor( irAbsorbanceProperty: NumberProperty,
                      irAbsorbanceRange: Range,
                      providedOptions?: IrAbsorbanceSoundPlayerOptions ) {

    super( providedOptions );

    // Make the parameters available to the methods.
    this.irAbsorbanceProperty = irAbsorbanceProperty;
    this.irAbsorbanceRange = irAbsorbanceRange;

    // Create a low-pass filter that will change as the solar intensity changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';

    // Connect the filter to the audio output path.
    lowPassFilter.connect( this.masterGainNode );

    // Adjust the cutoff frequency of the filter as the solar intensity changes.
    irAbsorbanceProperty.link( solarIntensity => {
      const normalizedIrAbsorbance = ( solarIntensity - irAbsorbanceRange.min ) / irAbsorbanceRange.getLength();

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
    if ( irAbsorbance > this.irAbsorbanceRange.min && irAbsorbance < this.irAbsorbanceRange.max ) {
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

greenhouseEffect.register( 'IrAbsorbanceSoundPlayer', IrAbsorbanceSoundPlayer );
export default IrAbsorbanceSoundPlayer;