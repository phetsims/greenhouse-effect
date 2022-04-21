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

// types for options
type SurfaceAlbedoSoundPlayerSelfOptions = {};
type SurfaceAlbedoSoundPlayerOptions = SurfaceAlbedoSoundPlayerSelfOptions & SoundGeneratorOptions;

// constants
const NUMBER_OF_DELAY_LINES = 2;
const DELAY_TIME = 0.2; // time for first delay, in seconds
const DECAY_RATE = 0.3; // multiplier for decay of echo, must be less than 1

class SurfaceAlbedoSoundPlayer extends SoundGenerator implements ISoundPlayer {

  // the sound clip that will be played when activity occurs
  private readonly primarySoundClip: SoundClip;

  constructor( surfaceAlbedoProperty: NumberProperty,
               surfaceAlbedoRange: Range,
               providedOptions?: SurfaceAlbedoSoundPlayerOptions ) {

    super( providedOptions );

    // Create the primary sound clip and hook it up to the output.
    this.primarySoundClip = new SoundClip( layerModelBaseSliderSound_mp3 );
    this.primarySoundClip.connect( this.masterGainNode );

    // Add a set of delay lines to get a bit of an echo effect.
    const delayGainNodes: GainNode[] = [];
    _.times( NUMBER_OF_DELAY_LINES, index => {
      const delayLine = new DelayNode( this.audioContext );
      delayLine.delayTime.value = ( index + 1 ) * DELAY_TIME;
      this.primarySoundClip.connect( delayLine );
      const gainNode = new GainNode( this.audioContext );
      delayGainNodes.push( gainNode );
      delayLine.connect( gainNode );
      gainNode.connect( this.masterGainNode );
    } );

    // Adjust the delay gain nodes as the albedo changes, making it so that more echo occurs with the higher levels of
    // surface albedo.
    surfaceAlbedoProperty.link( surfaceAlbedo => {
      const normalizedSurfaceAlbedo = ( surfaceAlbedo - surfaceAlbedoRange.min ) / surfaceAlbedoRange.getLength();
      let nextGainValue = normalizedSurfaceAlbedo * DECAY_RATE;
      delayGainNodes.forEach( gainNode => {
        gainNode.gain.setTargetAtTime( nextGainValue, 0, 0.1 );
        nextGainValue = nextGainValue * DECAY_RATE;
      } );
    } );
  }

  public play(): void {
    this.primarySoundClip.play();
  }

  public stop(): void {
    this.primarySoundClip.stop();
  }
}

greenhouseEffect.register( 'SurfaceAlbedoSoundPlayer', SurfaceAlbedoSoundPlayer );
export default SurfaceAlbedoSoundPlayer;