// Copyright 2022, University of Colorado Boulder

/**
 * FluxMeterSoundGenerator is used to produce sounds for the flux meter, which measures the amount of flux for visible
 * and IR radiation at various points in the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import irFluxUp_mp3 from '../../../sounds/irFluxUp_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const DEFAULT_OUTPUT_LEVEL = 0.22;

// amount of time before starting to fade where flux change is below the threshold, in seconds
const PRE_FADE_TIME = 0.5;

// rate at which the sounds increase in volume, in proportion per second
const FADE_IN_RATE = 5;

// rate at which sounds decrease in volume, in proportion per second
const FADE_OUT_RATE = 2;

const FADE_OUT_TIME = 1 / FADE_OUT_RATE;

// the rate of flux change considered necessary to produce sound, empirically determined
const FLUX_CHANGE_RATE_THRESHOLD = 300000;

// an empirically determined value used to scale attributes of the sound generation
const MAX_EXPECTED_IR_FLUX = 175000000;

// types for options
type SelfOptions = EmptySelfOptions;
type FluxMeterSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class FluxMeterSoundGenerator extends SoundGenerator {

  private readonly disposeFluxMeterSoundGenerator: () => void;
  private readonly irFluxUpProperty: TReadOnlyProperty<number>;
  private irPreviousFluxUp: number;
  private irUpFluxChangedCountdownTimer = 0;
  private readonly irUpFluxSoundClip: SoundClip;

  public constructor( visibleFluxUpProperty: TReadOnlyProperty<number>,
                      visibleFluxDownProperty: TReadOnlyProperty<number>,
                      irFluxUpProperty: TReadOnlyProperty<number>,
                      irFluxDownProperty: TReadOnlyProperty<number>,
                      providedOptions?: FluxMeterSoundGeneratorOptions ) {

    const options = optionize<FluxMeterSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    }, providedOptions );

    super( options );

    // Make the properties that track the flux rates available to the methods.
    this.irFluxUpProperty = irFluxUpProperty;

    // Set the initial values for the historic rate information that will be used to track changes.
    this.irPreviousFluxUp = irFluxUpProperty.value;

    // Create the sound clip user for IR flux in the upward direction.
    this.irUpFluxSoundClip = new SoundClip( irFluxUp_mp3, {
      initialOutputLevel: 0,
      loop: true
    } );
    this.irUpFluxSoundClip.connect( this.masterGainNode );

    // Define the class-specific dispose function.
    this.disposeFluxMeterSoundGenerator = () => {
      // TODO: Remove this if it's not needed.  See https://github.com/phetsims/greenhouse-effect/issues/185.
    };
  }

  /**
   * Step forward in time by the specified amount.  This updates the output levels for the various sounds based on
   * time-related algorithms.
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {

    const irFluxUpChangeRateThisStep = Math.abs( this.irPreviousFluxUp - this.irFluxUpProperty.value ) / dt;

    // Adjust the countdown timer based on the rate of flux change.
    if ( irFluxUpChangeRateThisStep > FLUX_CHANGE_RATE_THRESHOLD ) {
      this.irUpFluxChangedCountdownTimer = PRE_FADE_TIME + FADE_OUT_TIME;
    }
    else {
      this.irUpFluxChangedCountdownTimer = Math.max( this.irUpFluxChangedCountdownTimer - dt, 0 );
    }

    // Adjust the output level of the IR flux up sound based on the corresponding countdown timer and the current output
    // level.
    let irUpFluxSoundOutputLevel = this.irUpFluxSoundClip.outputLevel;
    if ( this.irUpFluxChangedCountdownTimer > FADE_OUT_TIME ) {

      // Move towards full volume if not already there.
      irUpFluxSoundOutputLevel = Math.min( irUpFluxSoundOutputLevel + FADE_IN_RATE * dt, 1 );
    }
    else if ( this.irUpFluxChangedCountdownTimer > 0 ) {
      irUpFluxSoundOutputLevel = Math.max( irUpFluxSoundOutputLevel - FADE_OUT_RATE * dt, 0 );
    }
    else {
      irUpFluxSoundOutputLevel = Math.max( irUpFluxSoundOutputLevel - 0.1 * dt, 0 );
    }

    // Start or stop the sound clip if appropriate.
    if ( irUpFluxSoundOutputLevel > 0 && !this.irUpFluxSoundClip.isPlaying ) {
      this.irUpFluxSoundClip.play();
    }
    else if ( irUpFluxSoundOutputLevel === 0 && this.irUpFluxSoundClip.isPlaying ) {
      this.irUpFluxSoundClip.stop( 0.1 );
    }

    // Set the output level.
    this.irUpFluxSoundClip.setOutputLevel( irUpFluxSoundOutputLevel );

    // Set the playback rate for the IR up sound.  This happens regardless of whether it is playing.
    const playbackRate = 1 + Math.min( this.irFluxUpProperty.value / MAX_EXPECTED_IR_FLUX, 1 ) * 4;
    this.irUpFluxSoundClip.setPlaybackRate( playbackRate );

    // Update the previous flux values for the next step.
    this.irPreviousFluxUp = this.irFluxUpProperty.value;
  }

  public reset(): void {
    this.irUpFluxChangedCountdownTimer = 0;
    this.irUpFluxSoundClip.outputLevel = 0;
    this.irUpFluxSoundClip.stop( 0.1 );
    this.irUpFluxSoundClip.setPlaybackRate( 1 );
    this.irPreviousFluxUp = 0;
  }

  public override dispose(): void {
    this.disposeFluxMeterSoundGenerator();
    super.dispose();
  }
}

greenhouseEffect.register( 'FluxMeterSoundGenerator', FluxMeterSoundGenerator );
export default FluxMeterSoundGenerator;