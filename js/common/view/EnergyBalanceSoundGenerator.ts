// Copyright 2022, University of Colorado Boulder

/**
 * EnergyBalanceSoundGenerator is used to produce sounds that represent the balance of energy at the top of the
 * atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import emptyApartmentBedroom06Resampled_mp3 from '../../../../tambo/sounds/emptyApartmentBedroom06Resampled_mp3.js';
import energyBalanceBlip_mp3 from '../../../sounds/energyBalanceBlip_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import SunEnergySource from '../model/SunEnergySource.js';

// constants
const DEFAULT_OUTPUT_LEVEL = 0;
const MAX_EXPECTED_ENERGY_MAGNITUDE = SunEnergySource.OUTPUT_ENERGY_RATE * EnergyAbsorbingEmittingLayer.SURFACE_AREA * 2;
const HIGHER_SOUND_PLAYBACK_RATE = Math.pow( 2, 1 / 6 );
const MIN_BLIPS_PER_SECOND_WHEN_PLAYING = 2;
const MAX_BLIPS_PER_SECOND = 10;
const MIN_ENERGY_FOR_BLIPS = MAX_EXPECTED_ENERGY_MAGNITUDE * 0.02;
const VOLUME_UP_ENERGY_RATE = 10000; // threshold for turning up and maintaining volume, empirically determined
const VOLUME_FADE_OUT_TIME = 40000; // in seconds

// types for options
type SelfOptions = EmptySelfOptions;
type EnergyBalanceSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class EnergyBalanceSoundGenerator extends SoundGenerator {

  private readonly disposeEnergyBalanceSoundGenerator: () => void;
  private interBlipTime: number = Number.POSITIVE_INFINITY;
  private interBlipCountdown: number = Number.POSITIVE_INFINITY;
  private readonly fullVolumeLevel: number;
  private volumeFadeCountdown = 0;
  private previousEnergyRate: number;
  private readonly soundClip: SoundClip;
  private readonly netEnergyBalanceProperty: TReadOnlyProperty<number>;

  public constructor( netEnergyBalanceProperty: TReadOnlyProperty<number>,
                      providedOptions?: EnergyBalanceSoundGeneratorOptions ) {

    const options = optionize<EnergyBalanceSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    }, providedOptions );

    super( options );

    // Create the source sound clip.
    this.soundClip = new SoundClip( energyBalanceBlip_mp3, { rateChangesAffectPlayingSounds: false } );
    this.soundClip.connect( this.masterGainNode );

    // Create a convolver node that will be used for a reverb effect.
    const convolver = phetAudioContext.createConvolver();
    convolver.buffer = emptyApartmentBedroom06Resampled_mp3.audioBufferProperty.value;

    // Create a gain node for the reverb.
    // Add a gain node that will be used for the reverb level.
    const reverbGainNode = phetAudioContext.createGain();

    // Hook up the signal path for the reverb.
    this.soundClip.connect( convolver );
    convolver.connect( reverbGainNode );
    reverbGainNode.connect( this.masterGainNode );

    this.netEnergyBalanceProperty = netEnergyBalanceProperty;
    this.fullVolumeLevel = options.initialOutputLevel;
    this.previousEnergyRate = netEnergyBalanceProperty.value;

    // Define the listener that will monitor the net energy balance and adjust the rate at which blips are played.
    const energyBalanceListener = ( netEnergyBalance: number ) => {

      // Adjust the playback rate of the blip to be higher when the net energy is positive, lower when negative.
      if ( netEnergyBalance > 0 && this.soundClip.playbackRate === 1 ) {
        this.soundClip.setPlaybackRate( HIGHER_SOUND_PLAYBACK_RATE );
      }
      else if ( netEnergyBalance < 0 && this.soundClip.playbackRate === HIGHER_SOUND_PLAYBACK_RATE ) {
        this.soundClip.setPlaybackRate( 1 );
      }

      // Adjust the blip rate.
      const netEnergyMagnitude = Math.abs( netEnergyBalance );
      if ( netEnergyMagnitude < MIN_ENERGY_FOR_BLIPS ) {

        // The energy is too low for blips, so make sure they are not playing.
        this.interBlipTime = Number.POSITIVE_INFINITY;
        this.interBlipCountdown = this.interBlipTime;
      }
      else {

        // Calculate the desired blip rate.
        const blipRate = MIN_BLIPS_PER_SECOND_WHEN_PLAYING +
                         ( MAX_BLIPS_PER_SECOND - MIN_BLIPS_PER_SECOND_WHEN_PLAYING ) *
                         netEnergyMagnitude / MAX_EXPECTED_ENERGY_MAGNITUDE;
        this.interBlipTime = 1 / blipRate;
        if ( this.interBlipTime < this.interBlipCountdown ) {
          this.interBlipCountdown = this.interBlipTime;
        }
      }
    };

    netEnergyBalanceProperty.lazyLink( energyBalanceListener );

    this.disposeEnergyBalanceSoundGenerator = () => {
      netEnergyBalanceProperty.unlink( energyBalanceListener );
    };
  }

  public step( dt: number ): void {

    // See if it is time to play a blip sound and, if so, do it and reset the countdown.
    if ( this.interBlipCountdown !== Number.POSITIVE_INFINITY ) {
      this.interBlipCountdown = Math.max( this.interBlipCountdown - dt, 0 );
      if ( this.interBlipCountdown === 0 ) {
        this.soundClip.play();
        this.interBlipCountdown = this.interBlipTime;
      }
    }

    // If the energy has changed significantly during this step, turn up the volume.
    const energyChangeMagnitude = Math.abs( this.netEnergyBalanceProperty.value - this.previousEnergyRate );
    if ( energyChangeMagnitude > VOLUME_UP_ENERGY_RATE ) {
      this.volumeFadeCountdown = VOLUME_FADE_OUT_TIME;
      this.setOutputLevel( this.fullVolumeLevel );
    }
    else {
      this.volumeFadeCountdown = Math.max( this.volumeFadeCountdown - dt, 0 );
      this.setOutputLevel( this.fullVolumeLevel * ( this.volumeFadeCountdown / VOLUME_FADE_OUT_TIME ) );
    }

    // Save the current energy rate for the next step.
    this.previousEnergyRate = this.netEnergyBalanceProperty.value;
  }

  public override dispose(): void {
    this.disposeEnergyBalanceSoundGenerator();
    super.dispose();
  }
}

greenhouseEffect.register( 'EnergyBalanceSoundGenerator', EnergyBalanceSoundGenerator );
export default EnergyBalanceSoundGenerator;