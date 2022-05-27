// Copyright 2022, University of Colorado Boulder

/**
 * ConcentrationSliderSoundGenerator is a sound generator specifically designed to produce sounds for the concentration
 * slider that controls the greenhouse gas levels in the Greenhouse Effect simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import ValueChangeSoundGenerator from '../../../../tambo/js/sound-generators/ValueChangeSoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Range from '../../../../dot/js/Range.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import sliderMovement_mp3 from '../../../sounds/sliderMovement_mp3.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import ISoundPlayer from '../../../../tambo/js/ISoundPlayer.js';

class ConcentrationSliderSoundGenerator extends ValueChangeSoundGenerator {

  constructor( concentrationProperty: IReadOnlyProperty<number>, valueRange: Range ) {

    // sound generator for the middle range of the slider's movement
    const sliderMiddleSoundGenerator = new SliderMiddleRangeSoundGenerator( concentrationProperty, valueRange, {
      initialOutputLevel: 0.1
    } );
    soundManager.addSoundGenerator( sliderMiddleSoundGenerator );

    super( valueRange, {

      numberOfMiddleThresholds: 9,
      middleMovingUpSoundPlayer: sliderMiddleSoundGenerator,
      middleMovingDownSoundPlayer: sliderMiddleSoundGenerator
    } );
  }
}

/**
 * Sound generator to be used for the middle portion of the concentration slider range.
 */
class SliderMiddleRangeSoundGenerator extends SoundGenerator implements ISoundPlayer {
  private readonly baseSoundClip: SoundClip;
  private readonly concentrationProperty: IReadOnlyProperty<number>;
  private readonly concentrationRange: Range;

  constructor( concentrationProperty: IReadOnlyProperty<number>,
               concentrationRange: Range,
               options?: Partial<SoundGeneratorOptions> ) {

    super( options );

    // Create a dynamics compressor so that the output of this sound generator doesn't go too high when lots of sounds
    // are being played.
    const dynamicsCompressorNode = this.audioContext.createDynamicsCompressor();

    // The following values were empirically determined through informed experimentation.
    const now = this.audioContext.currentTime;
    dynamicsCompressorNode.threshold.setValueAtTime( -3, now );
    dynamicsCompressorNode.knee.setValueAtTime( 0, now ); // hard knee
    dynamicsCompressorNode.ratio.setValueAtTime( 12, now );
    dynamicsCompressorNode.attack.setValueAtTime( 0, now );
    dynamicsCompressorNode.release.setValueAtTime( 0.25, now );
    dynamicsCompressorNode.connect( this.masterGainNode );

    // the sound clip that forms the basis of all sounds that are produced
    this.baseSoundClip = new SoundClip( sliderMovement_mp3, {
      rateChangesAffectPlayingSounds: false
    } );
    // @ts-ignore TODO: typing for AudioParam
    this.baseSoundClip.connect( dynamicsCompressorNode );

    // variables used by the methods below
    this.concentrationProperty = concentrationProperty;
    this.concentrationRange = concentrationRange;
  }

  /**
   * Play the main sound clip multiple times with some randomization around the center pitch and the delay between each
   * play.  The behavior was determined by informed trial-and-error based on an initial sound design that used a bunch
   * of separate sound clips.  See https://github.com/phetsims/greenhouse-effect/issues/28.
   */
  public play(): void {

    // parameters the bound the randomization, empirically determined
    const minimumInterSoundTime = 0.06;
    const maximumInterSoundTime = minimumInterSoundTime * 1.5;

    // Set a value for the number of playing instances of the clip at which we limit additional plays.  This helps to
    // prevent too many instances of the clip from playing simultaneously, which can sound a bit chatic.
    const playingInstancesLimitThreshold = 5;

    // Calculate a normalized value based on the range.
    const normalizedValue = this.concentrationRange.getNormalizedValue( this.concentrationProperty.value );

    // Calculate the number of times to play based on the current concentration value.  This calculation was empirically
    // determined and can be adjusted as needed to get the desired sound behavior.  There is also code to limit the
    // number of playing instance so that it doesn't get overwhelming.
    let timesToPlay;
    if ( this.baseSoundClip.getNumberOfPlayingInstances() < playingInstancesLimitThreshold ) {
      timesToPlay = Math.floor( normalizedValue * 3 ) + 2;
    }
    else {
      timesToPlay = 1;
    }

    // Calculate the minimum playback rate based on the current concentration.
    const minPlaybackRate = 1 + normalizedValue * 2;

    let delayAmount = 0;
    _.times( timesToPlay, () => {

      // Set the playback rate with some randomization.
      this.baseSoundClip.setPlaybackRate( minPlaybackRate + ( dotRandom.nextDouble() * 0.2 ), 0 );

      // Put some spacing between each playing of the clip.  The parameters of the calculation are broken out to make
      // experimentation and adjustment easier.
      this.baseSoundClip.play( delayAmount );
      delayAmount = delayAmount + minimumInterSoundTime + dotRandom.nextDouble() * ( maximumInterSoundTime - minimumInterSoundTime );
    } );
    this.baseSoundClip.setPlaybackRate( 1, 0 );
  }

  public stop(): void {
    // does nothing in this class, but is needed for the ISoundPlayer interface
  }
}

greenhouseEffect.register( 'ConcentrationSliderSoundGenerator', ConcentrationSliderSoundGenerator );

export default ConcentrationSliderSoundGenerator;