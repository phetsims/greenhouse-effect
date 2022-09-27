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

// amount of time after a change before starting the fade out, in seconds
const PRE_FADE_TIME = 1;

// amount of time to fade from full volume to zero, in seconds
const FADE_TIME = 1;

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
    this.irUpFluxSoundClip = new SoundClip( irFluxUp_mp3, { rateChangesAffectPlayingSounds: false } );
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

    if ( irFluxUpChangeRateThisStep > FLUX_CHANGE_RATE_THRESHOLD ) {

      // The flux is changing at a rate high enough that the corresponding sound should be produced at full volume.
      if ( !this.irUpFluxSoundClip.isPlaying ) {
        this.irUpFluxSoundClip.play();
      }
      this.irUpFluxSoundClip.outputLevel = 1;
      this.irUpFluxChangedCountdownTimer = PRE_FADE_TIME + FADE_TIME;
    }
    else {

      // The change during this step is below the threshold, so fade the sound.
      this.irUpFluxChangedCountdownTimer = Math.max( this.irUpFluxChangedCountdownTimer - dt, 0 );
      if ( this.irUpFluxChangedCountdownTimer === 0 ) {

        // It's time to stop this sound from playing.
        this.irUpFluxSoundClip.outputLevel = 0;
        this.irUpFluxSoundClip.stop();
      }
      else if ( this.irUpFluxChangedCountdownTimer < PRE_FADE_TIME ) {

        // Based on the countdown timer value, this sound is fading, so set the output level appropriately.
        this.irUpFluxSoundClip.outputLevel = Math.max( this.irUpFluxChangedCountdownTimer - PRE_FADE_TIME / FADE_TIME, 0 );
      }
    }

    // Set the playback rate for the IR up sound.  This happens regardless of whether it is playing.
    const playbackRate = 1 + Math.min( this.irFluxUpProperty.value / MAX_EXPECTED_IR_FLUX, 1 ) * 2;
    this.irUpFluxSoundClip.setPlaybackRate( playbackRate );

    // Update the previous flux values for the next step.
    this.irPreviousFluxUp = this.irFluxUpProperty.value;
  }

  public override dispose(): void {
    this.disposeFluxMeterSoundGenerator();
    super.dispose();
  }
}

greenhouseEffect.register( 'FluxMeterSoundGenerator', FluxMeterSoundGenerator );
export default FluxMeterSoundGenerator;