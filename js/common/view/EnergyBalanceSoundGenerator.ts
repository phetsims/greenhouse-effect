// Copyright 2022, University of Colorado Boulder

/**
 * EnergyBalanceSoundGenerator is used to produce sounds that represent the balance of energy at the top of the
 * atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import energyBalanceBlip_mp3 from '../../../sounds/energyBalanceBlip_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import SunEnergySource from '../model/SunEnergySource.js';

// constants
const DEFAULT_OUTPUT_LEVEL = 0.5;
const MAX_EXPECTED_ENERGY_MAGNITUDE = SunEnergySource.OUTPUT_ENERGY_RATE * EnergyAbsorbingEmittingLayer.SURFACE_AREA * 2;
const HIGHER_SOUND_PLAYBACK_RATE = Math.pow( 2, 1 / 6 );
const MIN_BLIPS_PER_SECOND_WHEN_PLAYING = 1.25;
const MAX_BLIPS_PER_SECOND = 8;
const MIN_ENERGY_FOR_BLIPS = MAX_EXPECTED_ENERGY_MAGNITUDE * 0.05;

// types for options
type SelfOptions = EmptySelfOptions;
type EnergyBalanceSoundGeneratorOptions = SelfOptions & SoundClipOptions;

class EnergyBalanceSoundGenerator extends SoundClip {

  private readonly disposeEnergyBalanceSoundGenerator: () => void;
  private interBlipTime: number = Number.POSITIVE_INFINITY;
  private interBlipCountdown: number = Number.POSITIVE_INFINITY;

  public constructor( netEnergyBalanceProperty: IReadOnlyProperty<number>,
                      providedOptions?: EnergyBalanceSoundGeneratorOptions ) {

    assert && assert(
      providedOptions === undefined || providedOptions.rateChangesAffectPlayingSounds === undefined,
      'rateChangesAffectPlayingSounds should not be set by client'
    );

    const options = optionize<EnergyBalanceSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL,
      rateChangesAffectPlayingSounds: false
    }, providedOptions );

    super( energyBalanceBlip_mp3, options );

    // Define the listener that will monitor the net energy balance and adjust the rate at which blips are played.
    const energyBalanceListener = ( netEnergyBalance: number ) => {

      // Adjust the playback rate of the blip to be higher when the net energy is positive, lower when negative.
      if ( netEnergyBalance > 0 && this.playbackRate === 1 ) {
        this.setPlaybackRate( HIGHER_SOUND_PLAYBACK_RATE );
      }
      else if ( netEnergyBalance < 0 && this.playbackRate === HIGHER_SOUND_PLAYBACK_RATE ) {
        this.setPlaybackRate( 1 );
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
        this.play();
        this.interBlipCountdown = this.interBlipTime;
      }
    }
  }

  public override dispose(): void {
    this.disposeEnergyBalanceSoundGenerator();
    super.dispose();
  }
}

greenhouseEffect.register( 'EnergyBalanceSoundGenerator', EnergyBalanceSoundGenerator );
export default EnergyBalanceSoundGenerator;