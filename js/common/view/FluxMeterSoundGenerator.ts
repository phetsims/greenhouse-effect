// Copyright 2022, University of Colorado Boulder

/**
 * FluxMeterSoundGenerator is used to produce sounds for the flux meter, which measures the amount of flux for visible
 * and IR radiation at various points in the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import irFluxDown_mp3 from '../../../sounds/irFluxDown_mp3.js';
import irFluxUp_mp3 from '../../../sounds/irFluxUp_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const DEFAULT_OUTPUT_LEVEL = 0.22;

// amount of time before starting to fade where flux change is below the threshold, in seconds
const PRE_FADE_TIME = 0.25;

// rate at which the sounds increase in volume, in proportion per second
const FADE_IN_RATE = 5;

// rate at which sounds decrease in volume, in proportion per second
const FADE_OUT_RATE = 4;

const FADE_OUT_TIME = 1 / FADE_OUT_RATE;

// the rate of flux change considered necessary to produce sound, empirically determined
const FLUX_CHANGE_RATE_THRESHOLD = 400000;

// an empirically determined value used to scale attributes of the sound generation
const MAX_EXPECTED_IR_FLUX = 175000000;

// number of samples to use when averaging out the rate of flux change
const NUMBER_OF_AVERAGING_SAMPLES = 10;

// types for options
type SelfOptions = EmptySelfOptions;
type FluxMeterSoundGeneratorOptions = SelfOptions & SoundGeneratorOptions;

class FluxMeterSoundGenerator extends SoundGenerator {

  private readonly irFluxUpProperty: TReadOnlyProperty<number>;
  private irPreviousFluxUp: number;
  private irUpFluxChangedCountdownTimer = 0;
  private readonly irUpFluxSoundClip: SoundClip;

  private readonly irFluxDownProperty: TReadOnlyProperty<number>;
  private irPreviousFluxDown: number;
  private irDownFluxChangedCountdownTimer = 0;
  private readonly irDownFluxSoundClip: SoundClip;
  private readonly lowPassFilter = new BiquadFilterNode( phetAudioContext );

  // arrays that track changes in the flux, used to calculate a moving average
  private readonly irFluxUpRateChangeSamples: number[] = [];
  private readonly irFluxDownRateChangeSamples: number[] = [];

  // internal dispose function
  private readonly disposeFluxMeterSoundGenerator: () => void;

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
    this.irFluxDownProperty = irFluxDownProperty;

    // Set the initial values for the historic rate information that will be used to track changes.
    this.irPreviousFluxUp = irFluxUpProperty.value;
    this.irPreviousFluxDown = irFluxUpProperty.value;

    // Create the sound clip used for IR flux in the upward direction.
    this.irUpFluxSoundClip = new SoundClip( irFluxUp_mp3, {
      initialOutputLevel: 0,
      loop: true
    } );
    this.irUpFluxSoundClip.connect( this.masterGainNode );

    // Create the sound clip used for IR flux in the downward direction.
    this.irDownFluxSoundClip = new SoundClip( irFluxDown_mp3, {
      initialOutputLevel: 0,
      loop: true
    } );

    // Set up the filter that will be used on the flux in the downward direction.
    this.lowPassFilter.type = 'lowpass';
    this.lowPassFilter.connect( this.masterGainNode );

    // Connect the sound for the IR moving down to the filter.
    this.irDownFluxSoundClip.connect( this.lowPassFilter );

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
    const irFluxDownChangeRateThisStep = Math.abs( this.irPreviousFluxDown - this.irFluxDownProperty.value ) / dt;

    // Update the moving average samples and calculation.  This is a decidedly imperfect moving average calculation
    // because it doesn't weight the samples based on the dt values with which they are associated, but it is good
    // enough for the needs of this object.
    this.irFluxUpRateChangeSamples.push( irFluxUpChangeRateThisStep );
    if ( this.irFluxUpRateChangeSamples.length > NUMBER_OF_AVERAGING_SAMPLES ) {
      this.irFluxUpRateChangeSamples.shift();
    }
    const averageIrFluxUpChangeRate = this.irFluxUpRateChangeSamples.length >= NUMBER_OF_AVERAGING_SAMPLES ?
                                      this.irFluxUpRateChangeSamples.reduce( ( total, val ) => total + val, 0 ) / NUMBER_OF_AVERAGING_SAMPLES :
                                      0;
    this.irFluxDownRateChangeSamples.push( irFluxDownChangeRateThisStep );
    if ( this.irFluxDownRateChangeSamples.length > NUMBER_OF_AVERAGING_SAMPLES ) {
      this.irFluxDownRateChangeSamples.shift();
    }
    const averageIrFluxDownChangeRate = this.irFluxDownRateChangeSamples.length >= NUMBER_OF_AVERAGING_SAMPLES ?
                                        this.irFluxDownRateChangeSamples.reduce( ( total, val ) => total + val, 0 ) / NUMBER_OF_AVERAGING_SAMPLES :
                                        0;

    // Adjust the countdown timers based on the rate of flux change.
    if ( Math.abs( averageIrFluxUpChangeRate ) > FLUX_CHANGE_RATE_THRESHOLD ) {
      this.irUpFluxChangedCountdownTimer = PRE_FADE_TIME + FADE_OUT_TIME;
    }
    else {
      this.irUpFluxChangedCountdownTimer = Math.max( this.irUpFluxChangedCountdownTimer - dt, 0 );
    }

    if ( Math.abs( averageIrFluxDownChangeRate ) > FLUX_CHANGE_RATE_THRESHOLD ) {
      this.irDownFluxChangedCountdownTimer = PRE_FADE_TIME + FADE_OUT_TIME;
    }
    else {
      this.irDownFluxChangedCountdownTimer = Math.max( this.irDownFluxChangedCountdownTimer - dt, 0 );
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

    // Set the output level for the sound corresponding to the upward IR flux.
    this.irUpFluxSoundClip.setOutputLevel( irUpFluxSoundOutputLevel );

    // Set the playback rate for the IR up sound.  This happens regardless of whether it is playing.
    const playbackRate = 1 + Math.min( this.irFluxUpProperty.value / MAX_EXPECTED_IR_FLUX, 1 ) * 4;
    this.irUpFluxSoundClip.setPlaybackRate( playbackRate );

    // Update the output level for the sound corresponding to the IR flux in the downward direction.
    let irDownFluxSoundOutputLevel = this.irDownFluxSoundClip.outputLevel;
    if ( this.irDownFluxChangedCountdownTimer > FADE_OUT_TIME ) {

      // Move towards full volume if not already there.
      irDownFluxSoundOutputLevel = Math.min( irDownFluxSoundOutputLevel + FADE_IN_RATE * dt, 1 );
    }
    else if ( this.irDownFluxChangedCountdownTimer > 0 ) {
      irDownFluxSoundOutputLevel = Math.max( irDownFluxSoundOutputLevel - FADE_OUT_RATE * dt, 0 );
    }
    else {
      irDownFluxSoundOutputLevel = Math.max( irDownFluxSoundOutputLevel - 0.1 * dt, 0 );
    }

    // Start or stop the sound clip if appropriate.
    if ( irDownFluxSoundOutputLevel > 0 && !this.irDownFluxSoundClip.isPlaying ) {
      this.irDownFluxSoundClip.play();
    }
    else if ( irDownFluxSoundOutputLevel === 0 && this.irDownFluxSoundClip.isPlaying ) {
      this.irDownFluxSoundClip.stop( 0.1 );
    }

    // Set the output level for the sound corresponding to the upward IR flux.
    this.irDownFluxSoundClip.setOutputLevel( irDownFluxSoundOutputLevel );

    // Set the frequency of the low-pass filter for the sound in the downward direction.  This formula was empirically
    // determined such that the change in the high frequencies could be heard reasonably well over the ranges of flux
    // experienced in the sim.
    const filterFrequency = 200 + ( Math.min( this.irFluxDownProperty.value / MAX_EXPECTED_IR_FLUX, 1 ) ) * 5000;
    this.lowPassFilter.frequency.setTargetAtTime( filterFrequency, phetAudioContext.currentTime, 0.015 );

    // Update the previous flux values for the next step.
    this.irPreviousFluxUp = this.irFluxUpProperty.value;
    this.irPreviousFluxDown = this.irFluxDownProperty.value;
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