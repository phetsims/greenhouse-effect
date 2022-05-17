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
import irAbsorbanceLow_mp3 from '../../../sounds/irAbsorbanceLow_mp3.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import ISoundPlayer from '../../../../tambo/js/ISoundPlayer.js';
import irAbsorbanceHigh_mp3 from '../../../sounds/irAbsorbanceHigh_mp3.js';

// types for options
type IrAbsorbanceSoundPlayerSelfOptions = {};
type IrAbsorbanceSoundPlayerOptions = IrAbsorbanceSoundPlayerSelfOptions & SoundClipOptions;

class IrAbsorbanceSoundPlayer extends SoundGenerator implements ISoundPlayer {

  // sound clip that is at max volume at low IR absorbance values, min volume for high values
  private readonly lowValueSoundClip: SoundClip;

  // sound clip that is at min volume at low IR absorbance values, max volume for high values
  private readonly highValueSoundClip: SoundClip;

  constructor( irAbsorbanceProperty: NumberProperty,
               irAbsorbanceRange: Range,
               providedOptions?: IrAbsorbanceSoundPlayerOptions ) {

    super( providedOptions );

    // Create and hook up the two sound clips that will act as the two core sounds.
    this.lowValueSoundClip = new SoundClip( irAbsorbanceLow_mp3 );
    this.lowValueSoundClip.connect( this.masterGainNode );
    this.highValueSoundClip = new SoundClip( irAbsorbanceHigh_mp3 );
    this.highValueSoundClip.connect( this.masterGainNode );

    // Cross-fade between the sound clips based on the IR absorbance value.
    irAbsorbanceProperty.link( irAbsorbance => {
      const normalizedIrAbsorbance = ( irAbsorbance - irAbsorbanceRange.min ) / irAbsorbanceRange.getLength();
      this.lowValueSoundClip.setOutputLevel( 1 - normalizedIrAbsorbance );
      this.highValueSoundClip.setOutputLevel( normalizedIrAbsorbance );
    } );
  }

  /**
   * Play the sound.  The volume levels of the sound clip will have been adjusted to do the cross-fade already.
   */
  public play(): void {
    this.lowValueSoundClip.play();
    this.highValueSoundClip.play();
  }

  /**
   * Stop the sounds.  This isn't expected to be used much, but is necessary for the ISoundPlayer interface.
   */
  public stop(): void {
    this.lowValueSoundClip.stop();
    this.highValueSoundClip.stop();
  }
}

greenhouseEffect.register( 'IrAbsorbanceSoundPlayer', IrAbsorbanceSoundPlayer );
export default IrAbsorbanceSoundPlayer;