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

    const energyBalanceListener = ( netEnergyBalance: number ) => {

      // Adjust the playback rate of the blip to be higher when the net energy is positive, lower when negative.
      if ( netEnergyBalance > 0 && this.playbackRate === 1 ) {
        this.setPlaybackRate( HIGHER_SOUND_PLAYBACK_RATE );
      }
      else if ( netEnergyBalance < 0 && this.playbackRate === HIGHER_SOUND_PLAYBACK_RATE ) {
        this.setPlaybackRate( 1 );
      }

      const threshold = MAX_EXPECTED_ENERGY_MAGNITUDE * 0.2;
      if ( Math.abs( netEnergyBalance ) > threshold ) {

        // TODO: Can I simplify this?
        if ( this.interBlipTime === Number.POSITIVE_INFINITY ) {
          this.interBlipTime = 0.25;
        }
        if ( this.interBlipCountdown > this.interBlipTime ) {
          this.interBlipCountdown = this.interBlipTime;
        }
      }
      else {
        this.interBlipTime = Number.POSITIVE_INFINITY;
        this.interBlipCountdown = this.interBlipTime;
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