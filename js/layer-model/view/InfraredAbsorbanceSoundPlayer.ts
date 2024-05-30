// Copyright 2022-2023, University of Colorado Boulder

/**
 * IrAbsorbanceSoundPlayer is used to produce sounds for the slider that controls the absorbance of a set of IR
 * (infrared) absorbing layers in an atmosphere.
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
import Disposable from '../../../../axon/js/Disposable.js';

class InfraredAbsorbanceSoundPlayer extends SoundGenerator implements TSoundPlayer {

  // sound clip played for sounds in the middle range, i.e. not at either the min or max
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

    // Create a low-pass filter that will change as the IR absorbance changes.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext );
    lowPassFilter.type = 'lowpass';

    // Connect the filter to the audio output path.
    lowPassFilter.connect( this.mainGainNode );

    // Adjust the cutoff frequency of the filter as the absorbance changes.
    irAbsorbanceProperty.link( irAbsorbance => {

      // Calculate a normalized value for this setting.
      const normalizedIrAbsorbance = ( irAbsorbance - irAbsorbanceProperty.range.min ) /
                                     irAbsorbanceProperty.range.getLength();

      // Adjust the normalized value so that it doesn't go all the way to zero, which would entirely must the sound.
      const minProportion = 0.2;
      const adjustedNormalizedIrAbsorbance = minProportion + ( normalizedIrAbsorbance * ( 1 - minProportion ) );

      // Map the IR absorbance into a cutoff frequency.
      const cutoffFrequency = Math.pow( adjustedNormalizedIrAbsorbance, 2 ) * 5000;

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

  // This is intended to exist for the life of the sim, so disposal is not supported.
  public override dispose(): void {
    Disposable.assertNotDisposable();
  }
}

greenhouseEffect.register( 'InfraredAbsorbanceSoundPlayer', InfraredAbsorbanceSoundPlayer );
export default InfraredAbsorbanceSoundPlayer;