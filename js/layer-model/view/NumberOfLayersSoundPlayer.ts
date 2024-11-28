// Copyright 2022-2024, University of Colorado Boulder

/**
 * NumberOfLayersSoundPlayer is a sound generator that plays sounds that are intended to indicate the number of infrared
 * absorbing layers that are present in the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import oneAbsorbingLayer_mp3 from '../../../sounds/oneAbsorbingLayer_mp3.js';
import threeAbsorbingLayers_mp3 from '../../../sounds/threeAbsorbingLayers_mp3.js';
import twoAbsorbingLayers_mp3 from '../../../sounds/twoAbsorbingLayers_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class NumberOfLayersSoundPlayer extends SoundGenerator implements TSoundPlayer {

  // array of sound clips where the index corresponds to the number of layers
  private readonly layerSoundClips: SoundClip[];

  // number of active layers
  private readonly numberOfLayersProperty: TRangedProperty;

  public constructor( numberOfLayersProperty: TRangedProperty ) {

    super( {
      initialOutputLevel: 0.2
    } );

    this.numberOfLayersProperty = numberOfLayersProperty;
    this.layerSoundClips = [
      new SoundClip( oneAbsorbingLayer_mp3, { initialPlaybackRate: 0.5 } ),
      new SoundClip( oneAbsorbingLayer_mp3 ),
      new SoundClip( twoAbsorbingLayers_mp3 ),
      new SoundClip( threeAbsorbingLayers_mp3 )
    ];

    // Hook up the sounds to this sound generator's main gain node
    this.layerSoundClips.forEach( clip => { clip.connect( this.mainGainNode ); } );
  }

  /**
   * play the sound associated with the currently active number of layers
   */
  public play(): void {

    const numberOfLayers = this.numberOfLayersProperty.value;

    assert && assert( numberOfLayers < this.layerSoundClips.length, `unexpected number of layers: ${numberOfLayers}` );
    this.layerSoundClips[ numberOfLayers ].play();
  }

  public stop(): void {
    // Nothing to do in this case.
  }

  // This is intended to exist for the life of the sim, so disposal is not supported.
  public override dispose(): void {
    Disposable.assertNotDisposable();
  }
}

greenhouseEffect.register( 'NumberOfLayersSoundPlayer', NumberOfLayersSoundPlayer );
export default NumberOfLayersSoundPlayer;