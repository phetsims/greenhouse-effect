// Copyright 2022-2023, University of Colorado Boulder

/**
 * EnergyBalanceSoundGenerator is used to produce sounds that represent the balance of energy at the top of the
 * atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import emptyApartmentBedroom06Resampled_mp3 from '../../../../tambo/sounds/emptyApartmentBedroom06Resampled_mp3.js';
import energyBalanceBlip_mp3 from '../../../sounds/energyBalanceBlip_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const HIGHER_SOUND_PLAYBACK_RATE = Math.pow( 2, 1 / 6 );
const MIN_BLIPS_PER_SECOND_WHEN_PLAYING = 2;
const MAX_BLIPS_PER_SECOND = 10;
const VOLUME_UP_ENERGY_RATE = 10; // threshold for turning up and maintaining volume, empirically determined
const VOLUME_FADE_OUT_TIME = 4; // in seconds

// The max expected net energy balance magnitude, in Watts.  This value was determined through empirical testing.
const MAX_EXPECTED_ENERGY_MAGNITUDE = 350;

class EnergyBalanceSoundGenerator extends SoundGenerator {

  private readonly disposeEnergyBalanceSoundGenerator: () => void;
  private readonly fullVolumeLevel: number;
  private volumeFadeCountdown = 0;
  private previousEnergyRate: number;
  private readonly soundClip: SoundClip;
  private readonly netEnergyBalanceProperty: TReadOnlyProperty<number>;

  // The amount of time between each "blip" sound generated.  Changes based on the net energy balance.
  private interBlipTime: number = Number.POSITIVE_INFINITY;

  // Countdown value used to decide when to produce the next "blip" sound.
  private interBlipCountdown: number = Number.POSITIVE_INFINITY;

  public constructor( netEnergyBalanceProperty: TReadOnlyProperty<number>,
                      inRadiativeBalanceProperty: TReadOnlyProperty<boolean>,
                      energyBalanceVisibleProperty: TReadOnlyProperty<boolean> ) {

    const options = {
      initialOutputLevel: 0.3,
      enableControlProperties: [ energyBalanceVisibleProperty ]
    };

    super( options );

    // Create the source sound clip.
    this.soundClip = new SoundClip( energyBalanceBlip_mp3, { rateChangesAffectPlayingSounds: false } );
    this.soundClip.connect( this.mainGainNode );

    // Create a convolver node that will be used for a reverb effect.
    const convolver = phetAudioContext.createConvolver();
    convolver.buffer = emptyApartmentBedroom06Resampled_mp3.audioBufferProperty.value;

    // Add a gain node that will be used for the reverb level.
    const reverbGainNode = phetAudioContext.createGain();

    // Hook up the signal path for the reverb.
    this.soundClip.connect( convolver );
    convolver.connect( reverbGainNode );
    reverbGainNode.connect( this.mainGainNode );

    this.netEnergyBalanceProperty = netEnergyBalanceProperty;
    this.fullVolumeLevel = options.initialOutputLevel;
    this.previousEnergyRate = netEnergyBalanceProperty.value;

    // Define the listener that will update the state of sound generation based on the model state.
    const updateSoundGeneration = () => {

      if ( inRadiativeBalanceProperty.value ) {

        // If the model is in radiative balance, it should not produce sounds.  Set the internal state to turn off the
        // production of blips.  This will have no effect if blips are already off.
        this.interBlipTime = Number.POSITIVE_INFINITY;
        this.interBlipCountdown = this.interBlipTime;
      }
      else {

        const netEnergyBalance = netEnergyBalanceProperty.value;

        // Adjust the playback rate of the blip to be a higher pitch when the net energy is positive, lower pitch
        // when negative.
        if ( netEnergyBalance > 0 && this.soundClip.playbackRate === 1 ) {
          this.soundClip.setPlaybackRate( HIGHER_SOUND_PLAYBACK_RATE );
        }
        else if ( netEnergyBalance < 0 && this.soundClip.playbackRate === HIGHER_SOUND_PLAYBACK_RATE ) {
          this.soundClip.setPlaybackRate( 1 );
        }

        // Adjust the blip rate.  They occur more quickly when the net energy is higher, slower when it's lower.
        const netEnergyMagnitude = Math.abs( netEnergyBalance );
        const blipRate = MIN_BLIPS_PER_SECOND_WHEN_PLAYING +
                         ( MAX_BLIPS_PER_SECOND - MIN_BLIPS_PER_SECOND_WHEN_PLAYING ) *
                         netEnergyMagnitude / MAX_EXPECTED_ENERGY_MAGNITUDE;
        this.interBlipTime = 1 / blipRate;
        if ( this.interBlipTime < this.interBlipCountdown ) {
          this.interBlipCountdown = this.interBlipTime;
        }
      }
    };

    netEnergyBalanceProperty.lazyLink( updateSoundGeneration );
    inRadiativeBalanceProperty.lazyLink( updateSoundGeneration );

    this.disposeEnergyBalanceSoundGenerator = () => {
      netEnergyBalanceProperty.unlink( updateSoundGeneration );
    };
  }

  /**
   * Step forward in time by the provided amount.  This updates the counters used to play sounds and control the volume.
   * @param dt - delta time, in seconds
   */
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
    const energyChangeRate = Math.abs( this.netEnergyBalanceProperty.value - this.previousEnergyRate ) / dt;
    if ( energyChangeRate > VOLUME_UP_ENERGY_RATE ) {
      this.volumeFadeCountdown = VOLUME_FADE_OUT_TIME;
      this.soundClip.setOutputLevel( this.fullVolumeLevel );
    }
    else {
      this.volumeFadeCountdown = Math.max( this.volumeFadeCountdown - dt, 0 );
      this.soundClip.setOutputLevel( this.fullVolumeLevel * ( this.volumeFadeCountdown / VOLUME_FADE_OUT_TIME ) );
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