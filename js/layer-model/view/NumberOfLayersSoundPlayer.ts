// Copyright 2022, University of Colorado Boulder

/**
 * NumberOfLayersSoundPlayer is a sound generator that plays sounds that are intended to indicate the number of infrared
 * absorbing layers that are present in the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import oneAbsorbingLayer_mp3 from '../../../sounds/oneAbsorbingLayer_mp3.js';
import twoAbsorbingLayers_mp3 from '../../../sounds/twoAbsorbingLayers_mp3.js';
import threeAbsorbingLayers_mp3 from '../../../sounds/threeAbsorbingLayers_mp3.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

type SelfOptions = {};
export type NumberOfLayersSoundPlayerOptions = SelfOptions & SoundGeneratorOptions;

class NumberOfLayersSoundPlayer extends SoundGenerator {

  // array of sound clips where the index corresponds to the number of layers
  private readonly layerSoundClips: SoundClip[];

  // number of active layers
  private readonly numberOfLayersProperty: NumberProperty;

  constructor( numberOfLayersProperty: NumberProperty, providedOptions?: NumberOfLayersSoundPlayerOptions ) {

    super( providedOptions );

    this.numberOfLayersProperty = numberOfLayersProperty;
    this.layerSoundClips = [
      new SoundClip( oneAbsorbingLayer_mp3, { initialPlaybackRate: 0.5 } ),
      new SoundClip( oneAbsorbingLayer_mp3 ),
      new SoundClip( twoAbsorbingLayers_mp3 ),
      new SoundClip( threeAbsorbingLayers_mp3 )
    ];

    // Hook up the sounds to this sound generator's master gain node
    this.layerSoundClips.forEach( clip => { clip.connect( this.masterGainNode ); } );
  }

  /**
   * play the sound associated with the currently active number of layers
   */
  public play(): void {

    const numberOfLayers = this.numberOfLayersProperty.value;

    assert && assert( numberOfLayers < this.layerSoundClips.length, `unexpected number of layers: ${numberOfLayers}` );
    this.layerSoundClips[ numberOfLayers ].play();
  }
}

greenhouseEffect.register( 'NumberOfLayersSoundPlayer', NumberOfLayersSoundPlayer );
export default NumberOfLayersSoundPlayer;