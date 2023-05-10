// Copyright 2022, University of Colorado Boulder

/**
 * IrWavesSoundGenerator is used to produce sounds that represent the actions of the infrared waves as they interact
 * with the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import wavesIrReemissionLoop_mp3 from '../../../sounds/wavesIrReemissionLoop_mp3.js';
import wavesIrReemissionStartingSound_mp3 from '../../../sounds/wavesIrReemissionStartingSound_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../model/WavesModel.js';
import WavesScreenView from './WavesScreenView.js';

// constants
const MAX_IR_WAVES_FROM_ATMOSPHERE = 3;
const WAVE_LOOP_MAX_OUTPUT_LEVEL = 0.04;
const NEW_WAVE_EMITTED_OUTPUT_LEVEL = 0.02;

// types for options
type SelfOptions = EmptySelfOptions;
type IrWavesSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class IrWavesSoundGenerator extends SoundGenerator {

  private readonly disposeIrWavesSoundGenerator: () => void;
  private readonly updateSoundLoopLevels: () => void;

  public constructor( wavesModel: WavesModel,
                      wavesView: WavesScreenView,
                      providedOptions?: IrWavesSoundGeneratorOptions ) {

    const options = optionize<IrWavesSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {}, providedOptions );

    super( options );

    // Create a sound generator for each of the IR waves that can originate from the atmosphere.
    const irWaveRadiatingFromAtmosphereSoundGenerators: SoundClip[] = [];
    _.times( MAX_IR_WAVES_FROM_ATMOSPHERE, () => {
      const soundGenerator = new SoundClip( wavesIrReemissionLoop_mp3, {
        initialOutputLevel: WAVE_LOOP_MAX_OUTPUT_LEVEL,
        loop: true,
        enableControlProperties: [
          wavesModel.isPlayingProperty
        ]
      } );
      soundGenerator.connect( this.masterGainNode );
      irWaveRadiatingFromAtmosphereSoundGenerators.push( soundGenerator );
    } );

    // Create the sound clip that will be played when a new IR wave starts to emanate from the atmosphere.
    const irWaveEmittedFromAtmosphereSoundGenerator = new SoundClip( wavesIrReemissionStartingSound_mp3, {
      initialOutputLevel: NEW_WAVE_EMITTED_OUTPUT_LEVEL
    } );
    irWaveEmittedFromAtmosphereSoundGenerator.connect( this.masterGainNode );

    // Play the sounds related to IR interactions with the atmosphere.
    const irWaveChangeListener = ( numberOfInteractions: number, previousNumberOfInteractions: number ) => {

      // Play a one-shot sound each time a new interaction starts.
      if ( numberOfInteractions > previousNumberOfInteractions ) {
        irWaveEmittedFromAtmosphereSoundGenerator.play();
      }

      // Make sure that the number of sound generators playing is equal to the number of waves coming from the atmosphere.
      irWaveRadiatingFromAtmosphereSoundGenerators.forEach( ( soundGenerator, index ) => {
        if ( !soundGenerator.isPlaying && numberOfInteractions > index ) {
          soundGenerator.play();
        }
        else if ( soundGenerator.isPlaying && numberOfInteractions <= index ) {
          soundGenerator.stop();
        }
      } );
    };

    wavesModel.waveAtmosphereInteractions.lengthProperty.lazyLink( irWaveChangeListener );

    // A function that is intended to be called during stepping to update the output levels of the loops to match the
    // intensities of the waves to which they correspond.
    this.updateSoundLoopLevels = () => {
      let wavesFromAtmosphereOutputLevel = WAVE_LOOP_MAX_OUTPUT_LEVEL;

      wavesModel.waveGroup.forEach( wave => {

        // Only provide sound for the IR waves that are moving down.  This is done to draw more attention to these
        // waves, since understanding that IR comes back from the atmosphere is a big learning goal.
        if ( wave.isInfrared && wave.propagationDirection.y < 0 ) {
          wavesFromAtmosphereOutputLevel = WAVE_LOOP_MAX_OUTPUT_LEVEL * wave.intensityAtStart;
        }
      } );

      irWaveRadiatingFromAtmosphereSoundGenerators.forEach( soundGenerator => {
        if ( soundGenerator.isPlaying && soundGenerator.getOutputLevel() !== wavesFromAtmosphereOutputLevel ) {
          soundGenerator.setOutputLevel( wavesFromAtmosphereOutputLevel );
        }
      } );
    };

    this.disposeIrWavesSoundGenerator = () => {
      wavesModel.waveAtmosphereInteractions.lengthProperty.unlink( irWaveChangeListener );
    };
  }

  /**
   * Step forward in time by the provided amount.
   */
  public step(): void {
    this.updateSoundLoopLevels();
  }

  public override dispose(): void {
    this.disposeIrWavesSoundGenerator();
    super.dispose();
  }
}

greenhouseEffect.register( 'IrWavesSoundGenerator', IrWavesSoundGenerator );
export default IrWavesSoundGenerator;