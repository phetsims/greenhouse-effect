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

    netEnergyBalanceProperty.lazyLink( ( netEnergyBalance, previousNetEnergyBalance ) => {

      // Adjust the playback rate of the blip to be higher when the net energy is positive, lower when negative.
      if ( netEnergyBalance > 0 && this.playbackRate === 1 ) {
        this.setPlaybackRate( HIGHER_SOUND_PLAYBACK_RATE );
      }
      else if ( netEnergyBalance < 0 && this.playbackRate === HIGHER_SOUND_PLAYBACK_RATE ) {
        this.setPlaybackRate( 1 );
      }

      const threshold = MAX_EXPECTED_ENERGY_MAGNITUDE * 0.1;
      if ( Math.abs( netEnergyBalance ) > threshold &&
           Math.abs( previousNetEnergyBalance ) < threshold ) {
        this.play();
      }
    } );
  }
}

greenhouseEffect.register( 'EnergyBalanceSoundGenerator', EnergyBalanceSoundGenerator );
export default EnergyBalanceSoundGenerator;