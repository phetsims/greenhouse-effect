// Copyright 2022-2023, University of Colorado Boulder

/**
 * SurfaceAlbedoSoundPlayer is used to produce sounds for the slider that controls surface albedo.  It is sound clip
 * with delay lines used to produce a variable echo effect.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import layerModelBaseSliderSound_mp3 from '../../../sounds/layerModelBaseSliderSound_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import emptyApartmentBedroom06Resampled_mp3 from '../../../../tambo/sounds/emptyApartmentBedroom06Resampled_mp3.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';

class SurfaceAlbedoSoundPlayer extends SoundGenerator implements TSoundPlayer {

  // sound clip that will be played when activity occurs
  private readonly primarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3 );

  // sound clip played at min and max values
  private readonly boundarySoundClip: SoundClip = new SoundClip( layerModelBaseSliderSound_mp3, {
      initialPlaybackRate: 0.667
    }
  );

  private readonly surfaceAlbedoProperty: TRangedProperty;

  public constructor( surfaceAlbedoProperty: TRangedProperty ) {

    super( {
      initialOutputLevel: 0.1
    } );

    // Make the number property.
    this.surfaceAlbedoProperty = surfaceAlbedoProperty;

    // Hook up the primary and boundary sound clips to the output.
    this.primarySoundClip.connect( this.mainGainNode );
    this.boundarySoundClip.connect( this.mainGainNode );

    // Add a convolver that will act as a reverb effect.
    const convolver = phetAudioContext.createConvolver();
    convolver.buffer = emptyApartmentBedroom06Resampled_mp3.audioBufferProperty.value;

    // Add a gain node that will be used for the reverb level.
    const reverbGainNode = phetAudioContext.createGain();

    // Connect things up.
    this.primarySoundClip.connect( convolver );
    this.boundarySoundClip.connect( convolver );
    convolver.connect( reverbGainNode );
    reverbGainNode.connect( this.mainGainNode );

    // Adjust the reverb level as the albedo changes, making it so that more reverb occurs with the higher levels of
    // surface albedo.
    surfaceAlbedoProperty.link( surfaceAlbedo => {
      const normalizedSurfaceAlbedo = ( surfaceAlbedo - surfaceAlbedoProperty.range.min ) /
                                      surfaceAlbedoProperty.range.getLength();
      const gainMultiplier = 0.4; // empirically determined to get the desired sound.
      reverbGainNode.gain.setTargetAtTime( normalizedSurfaceAlbedo * gainMultiplier, phetAudioContext.currentTime, 0.015 );
    } );
  }

  public play(): void {
    const surfaceAlbedo = this.surfaceAlbedoProperty.value;
    const surfaceAlbedoRange = this.surfaceAlbedoProperty.range;
    if ( surfaceAlbedo > surfaceAlbedoRange.min && surfaceAlbedo < surfaceAlbedoRange.max ) {
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

  // This is intended to exist for the life of the sim, and disposal is not supported.
  public override dispose(): void {
    Disposable.assertNotDisposable();
  }
}

greenhouseEffect.register( 'SurfaceAlbedoSoundPlayer', SurfaceAlbedoSoundPlayer );
export default SurfaceAlbedoSoundPlayer;