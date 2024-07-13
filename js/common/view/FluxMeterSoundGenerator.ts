// Copyright 2022-2024, University of Colorado Boulder

/**
 * FluxMeterSoundGenerator is used to produce sounds for the flux meter, which measures the amount of flux for visible
 * and IR radiation at various points in the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import irFluxDownA_mp3 from '../../../sounds/irFluxDownA_mp3.js';
import irFluxDownB_mp3 from '../../../sounds/irFluxDownB_mp3.js';
import irFluxUp_mp3 from '../../../sounds/irFluxUp_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import { Node } from '../../../../scenery/js/imports.js';
import SoundLevelEnum from '../../../../tambo/js/SoundLevelEnum.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// amount of time before starting to fade where flux change is below the threshold, in seconds
const PRE_FADE_TIME = 0.25;

// rate at which the sounds increase in volume, in proportion per second
const FADE_IN_RATE = 5;

// rate at which sounds decrease in volume, in proportion per second
const FADE_OUT_RATE = 4;

const FADE_OUT_TIME = 1 / FADE_OUT_RATE;

// the rate of flux change considered necessary to produce sound, empirically determined
const FLUX_CHANGE_RATE_THRESHOLD = 1000000;

// empirically determined values used to scale attributes of the sound generation
const MAX_EXPECTED_UPWARD_IR_FLUX = 178000000;
const MAX_EXPECTED_DOWNWARD_IR_FLUX = 134000000;

// number of samples to use when averaging out the rate of flux change
const NUMBER_OF_AVERAGING_SAMPLES = 10;

class FluxMeterSoundGenerator extends SoundGenerator {

  private readonly irFluxUpProperty: TReadOnlyProperty<number>;
  private irPreviousFluxUp: number;
  private irUpFluxChangedCountdownTimer = 0;
  private readonly irUpFluxSoundClip: SoundClip;

  private readonly irFluxDownProperty: TReadOnlyProperty<number>;
  private irPreviousFluxDown: number;
  private irDownFluxChangedCountdownTimer = 0;
  private readonly irFluxDownASoundClip: SoundClip;
  private readonly irFluxDownBSoundClip: SoundClip;
  private readonly downwardFluxGainNode: GainNode;
  private downwardFluxGainLevel = 0;

  // arrays that track changes in the flux, used to calculate a moving average
  private readonly irFluxUpRateChangeSamples: number[] = [];
  private readonly irFluxDownRateChangeSamples: number[] = [];

  public constructor( irFluxUpProperty: TReadOnlyProperty<number>,
                      irFluxDownProperty: TReadOnlyProperty<number>,
                      associatedViewNode: Node,
                      isPlayingProperty: TReadOnlyProperty<boolean>,
                      fluxMeterVisibleProperty: TReadOnlyProperty<boolean> ) {

    super( {
      initialOutputLevel: 0.15,
      associatedViewNode: associatedViewNode,
      sonificationLevel: SoundLevelEnum.EXTRA,
      enabledProperty: new DerivedProperty(
        [ isPlayingProperty, fluxMeterVisibleProperty ],
        ( isPlaying, fluxMeterVisible ) => isPlaying && fluxMeterVisible
      )
    } );

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
    this.irUpFluxSoundClip.connect( this.mainGainNode );

    // Create the gain node that will be used to fade in and out the combined clips that make up the IR flux down sound.
    this.downwardFluxGainNode = this.audioContext.createGain();
    this.downwardFluxGainNode.connect( this.mainGainNode );

    // Create the sound clips used for IR flux in the downward direction.  The overall sound is made by cross-fading
    // between these two sounds based on the flux level.
    this.irFluxDownASoundClip = new SoundClip( irFluxDownA_mp3, {
      initialOutputLevel: 0,
      loop: true
    } );
    this.irFluxDownBSoundClip = new SoundClip( irFluxDownB_mp3, {
      initialOutputLevel: 0,
      loop: true
    } );

    // Connect the sounds for the downward-direction IR to the overall gain node for this sound.
    this.irFluxDownASoundClip.connect( this.downwardFluxGainNode );
    this.irFluxDownBSoundClip.connect( this.downwardFluxGainNode );
  }

  /**
   * Step forward in time by the specified amount.  This updates the output levels for the various sounds based on
   * time-related algorithms.
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {

    const irFluxUpChangeRateThisStep = Math.abs( this.irPreviousFluxUp - this.irFluxUpProperty.value ) / dt;
    const irFluxDownChangeRateThisStep = Math.abs( this.irPreviousFluxDown - this.irFluxDownProperty.value ) / dt;

    // Update the moving average samples and calculation for the IR flux change rate in both the upward and downward
    // directions.  This is a decidedly imperfect moving average calculation because it doesn't weight the samples based
    // on the dt values with which they are associated, but it has so far proven to be good enough for the needs of this
    // sound generator.
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

    // Adjust the output level of the upward-direction IR sound.
    let irUpFluxSoundOutputLevel = this.irUpFluxSoundClip.outputLevel;
    if ( this.irUpFluxChangedCountdownTimer > FADE_OUT_TIME ) {

      // Move towards full volume if not already there.
      irUpFluxSoundOutputLevel = Math.min( irUpFluxSoundOutputLevel + FADE_IN_RATE * dt, 1 );
    }
    else if ( this.irUpFluxChangedCountdownTimer > 0 ) {

      // The countdown indicates that this sound should be fading out, so calculate what is probably a reduced volume.
      irUpFluxSoundOutputLevel = Math.max( irUpFluxSoundOutputLevel - FADE_OUT_RATE * dt, 0 );
    }
    else {

      // The sound should be fully faded when the counter gets to zero.
      irUpFluxSoundOutputLevel = 0;
    }
    this.irUpFluxSoundClip.setOutputLevel( irUpFluxSoundOutputLevel );

    // Start or stop the upward-direction IR sound clip if appropriate.
    if ( irUpFluxSoundOutputLevel > 0 && !this.irUpFluxSoundClip.isPlaying ) {
      this.irUpFluxSoundClip.play();
    }
    else if ( irUpFluxSoundOutputLevel === 0 && this.irUpFluxSoundClip.isPlaying ) {
      this.irUpFluxSoundClip.stop( 0.1 );
    }

    // Set the playback rate for the upward-direction IR sound.  This happens regardless of whether it is playing.
    const playbackRate = 1 + Math.min( this.irFluxUpProperty.value / MAX_EXPECTED_UPWARD_IR_FLUX, 1 ) * 4;
    this.irUpFluxSoundClip.setPlaybackRate( playbackRate );

    // Update the overall output level for the downward-direction IR sound.
    if ( this.irDownFluxChangedCountdownTimer > FADE_OUT_TIME ) {

      // Move towards full volume if not already there.
      this.downwardFluxGainLevel = Math.min( this.downwardFluxGainLevel + FADE_IN_RATE * dt, 1 );
    }
    else if ( this.irDownFluxChangedCountdownTimer > 0 ) {

      // The countdown indicates that this sound should be fading out, so calculate what is probably a reduced volume.
      this.downwardFluxGainLevel = Math.max( this.downwardFluxGainLevel - FADE_OUT_RATE * dt, 0 );
    }
    else {

      // The sound should be fully faded when the counter gets to zero.
      this.downwardFluxGainLevel = 0;
    }
    this.downwardFluxGainNode.gain.setValueAtTime( this.downwardFluxGainLevel, 0 );

    // Set the cross-fade levels for the two sounds that comprise the downward IR composite sound.
    const soundAOutputLevel = Utils.clamp( 1 - this.irFluxDownProperty.value / MAX_EXPECTED_DOWNWARD_IR_FLUX, 0, 1 );
    this.irFluxDownASoundClip.setOutputLevel( soundAOutputLevel );
    this.irFluxDownBSoundClip.setOutputLevel( 1 - soundAOutputLevel );

    // Start or stop the downward-direction IR sound clips if appropriate.
    if ( this.downwardFluxGainLevel > 0 ) {
      !this.irFluxDownASoundClip.isPlaying && this.irFluxDownASoundClip.play();
      !this.irFluxDownBSoundClip.isPlaying && this.irFluxDownBSoundClip.play();
    }
    else if ( this.downwardFluxGainLevel === 0 ) {
      this.irFluxDownASoundClip.isPlaying && this.irFluxDownASoundClip.stop( 0.1 );
      this.irFluxDownBSoundClip.isPlaying && this.irFluxDownBSoundClip.stop( 0.1 );
    }

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
}

greenhouseEffect.register( 'FluxMeterSoundGenerator', FluxMeterSoundGenerator );
export default FluxMeterSoundGenerator;