// Copyright 2022, University of Colorado Boulder

/**
 * SurfaceAlbedoSoundPlayer is used to produce sounds for the slider that controls surface albedo.  It is sound clip
 * with delay lines used to produce a variable echo effect.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import ISoundPlayer from '../../../../tambo/js/ISoundPlayer.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import impulseResponseLargeRoom_mp3 from '../../../../tambo/sounds/impulseResponseLargeRoom_mp3.js';

// types for options
type SurfaceAlbedoSoundPlayerSelfOptions = {};
type SurfaceAlbedoSoundPlayerOptions = SurfaceAlbedoSoundPlayerSelfOptions & SoundGeneratorOptions;

class SurfaceAlbedoSoundPlayer extends SoundGenerator implements ISoundPlayer {

  // sound clip that will be played when activity occurs
  private readonly primarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3 );

  // sound clip played at min and max values
  private readonly boundarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3, {
      initialPlaybackRate: 0.667
    }
  );

  private readonly surfaceAlbedoProperty: NumberProperty;
  private readonly surfaceAlbedoRange: Range;

  constructor( surfaceAlbedoProperty: NumberProperty,
               surfaceAlbedoRange: Range,
               providedOptions?: SurfaceAlbedoSoundPlayerOptions ) {

    super( providedOptions );

    // Make the number property and its range available to the methods.
    this.surfaceAlbedoProperty = surfaceAlbedoProperty;
    this.surfaceAlbedoRange = surfaceAlbedoRange;

    // Hook up the primary and boundary sound clips to the output.
    this.primarySoundClip.connect( this.masterGainNode );
    this.boundarySoundClip.connect( this.masterGainNode );

    // Add a convolver that will act as a reverb effect.
    const convolver = phetAudioContext.createConvolver();
    convolver.buffer = impulseResponseLargeRoom_mp3.audioBufferProperty.value;

    // Add a gain node that will be used for the reverb level.
    const reverbGainNode = phetAudioContext.createGain();

    // Connect things up.
    this.primarySoundClip.connect( convolver );
    this.boundarySoundClip.connect( convolver );
    convolver.connect( reverbGainNode );
    reverbGainNode.connect( this.masterGainNode );

    // Adjust the reverb level as the albedo changes, making it so that more reverb occurs with the higher levels of
    // surface albedo.
    surfaceAlbedoProperty.link( surfaceAlbedo => {
      const normalizedSurfaceAlbedo = ( surfaceAlbedo - surfaceAlbedoRange.min ) / surfaceAlbedoRange.getLength();
      const gainMultiplier = 1.5; // empirically determined to get the desired sound.
      reverbGainNode.gain.setTargetAtTime( normalizedSurfaceAlbedo * gainMultiplier, phetAudioContext.currentTime, 0.015 );
    } );
  }

  public play(): void {
    const surfaceAlbedo = this.surfaceAlbedoProperty.value;
    if ( surfaceAlbedo > this.surfaceAlbedoRange.min && surfaceAlbedo < this.surfaceAlbedoRange.max ) {
      this.primarySoundClip.play();
    }
    else {
      this.boundarySoundClip.play();
    }
  }

  public stop(): void {
    this.primarySoundClip.stop();
    this.boundarySoundClip.stop();
  }
}

greenhouseEffect.register( 'SurfaceAlbedoSoundPlayer', SurfaceAlbedoSoundPlayer );
export default SurfaceAlbedoSoundPlayer;