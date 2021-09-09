// Copyright 2021, University of Colorado Boulder

/**
 * TemperatureSoundGenerator is used to create an ambient sound the represents the temperature in the observation window
 * in the Greenhouse Effect simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import temperatureHighV2Sound from '../../../sounds/greenhouse-temperature-high-v2_mp3.js';
import temperatureHighV3Sound from '../../../sounds/greenhouse-temperature-high-v3_mp3.js';
import temperatureHighSound from '../../../sounds/greenhouse-temperature-high_mp3.js';
import temperatureLowV2Sound from '../../../sounds/greenhouse-temperature-low-v2_mp3.js';
import temperatureLowV3Sound from '../../../sounds/greenhouse-temperature-low-v3_mp3.js';
import temperatureLowSound from '../../../sounds/greenhouse-temperature-low_mp3.js';
import temperatureMediumHumanIdealV2Sound from '../../../sounds/greenhouse-temperature-medium-human-ideal-v2_mp3.js';
import temperatureMediumHumanIdealV3Sound from '../../../sounds/greenhouse-temperature-medium-human-ideal-v3_mp3.js';
import temperatureMediumHumanIdealSound from '../../../sounds/greenhouse-temperature-medium-human-ideal_mp3.js';
import temperatureMediumV2Sound from '../../../sounds/greenhouse-temperature-medium-v2_mp3.js';
import temperatureMediumV3Sound from '../../../sounds/greenhouse-temperature-medium-v3_mp3.js';
import temperatureMediumSound from '../../../sounds/greenhouse-temperature-medium_mp3.js';
import temperatureRisingHighSound from '../../../sounds/greenhouse-temperature-rising-with-base-note-high_mp3.js';
import temperatureRisingHumanIdealSound from '../../../sounds/greenhouse-temperature-rising-with-base-note-human-ideal_mp3.js';
import temperatureRisingLowSound from '../../../sounds/greenhouse-temperature-rising-with-base-note-low_mp3.js';
import temperatureRisingMediumSound from '../../../sounds/greenhouse-temperature-rising-with-base-note-medium_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundLayer from '../model/GroundLayer.js';

// constants
const LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE = 266; // in Kelvin
const MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE = 280; // in Kelvin
const HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE = 289; // in Kelvin
const ORDERED_TEMPERATURE_SOUND_SETS = [
  [
    temperatureLowSound,
    temperatureMediumSound,
    temperatureMediumHumanIdealSound,
    temperatureHighSound
  ],
  [
    temperatureLowV2Sound,
    temperatureMediumV2Sound,
    temperatureMediumHumanIdealV2Sound,
    temperatureHighV2Sound
  ],
  [
    temperatureLowV3Sound,
    temperatureMediumV3Sound,
    temperatureMediumHumanIdealV3Sound,
    temperatureHighV3Sound
  ],
  [
    // favorite set from the 7/13/2021 sound design meeting (was a mix-and-match sort of thing)
    temperatureLowV3Sound,
    temperatureMediumV2Sound,
    temperatureMediumHumanIdealV3Sound,
    temperatureHighV2Sound
  ],
  [
    // ambient-ish sounds
    temperatureRisingLowSound,
    temperatureRisingMediumSound,
    temperatureRisingHumanIdealSound,
    temperatureRisingHighSound
  ]
];
const TEMPERATURE_SOUND_SET_INDEX = 4;
const CROSS_FADE_SPAN = 6; // in degrees Kelvin
const HALF_CROSS_FADE_SPAN = CROSS_FADE_SPAN / 2;

class TemperatureSoundGenerator extends SoundGenerator {

  /**
   * @param {Property.<number>} temperatureProperty - temperature of the model, in Kelvin
   * @param {Object} [options]
   */
  constructor( temperatureProperty, options ) {

    super( options );

    const orderedTemperatureSoundSets = ORDERED_TEMPERATURE_SOUND_SETS[ TEMPERATURE_SOUND_SET_INDEX ];

    // @private {SoundClip[]} - the temperature sound loops in order from lowest temperature to highest
    this.temperatureSoundClipLoops = orderedTemperatureSoundSets.map( sound => {
      const soundClip = new SoundClip( sound, { loop: true } );
      soundClip.connect( this.masterGainNode );
      return soundClip;
    } );

    // @private - make the temperature Property available to the update method
    this.temperatureProperty = temperatureProperty;

    // @private - make the enable control properties available to the update method
    this.localEnableControlProperties = options.enableControlProperties || [];

    // Trigger updates when things change.  This class watches the enableControlProperties explicitly instead of only
    // relying on the base class to monitor them so that the loops can be turned off if they don't need to be playing.
    // This saves processor bandwidth on the audio rendering thread, since the parent class turns down the volume but
    // doesn't stop the loops.
    Property.multilink(
      [ temperatureProperty, ...options.enableControlProperties ],
      () => { this.updateLoopStates(); }
    );
  }

  /**
   * Update the play state (i.e. playing or not playing) and the output level of the loops based on the temperature and
   * the enable control properties.
   * @private
   */
  updateLoopStates() {

    // convenience variables
    const temperature = this.temperatureProperty.value;
    const loops = this.temperatureSoundClipLoops;

    // The code below assumes that the minimum temperature really is a minimum, and the temperature never goes below
    // that values.
    assert && assert( temperature >= GroundLayer.MINIMUM_TEMPERATURE, 'temperature below minimum' );

    // Map of loops to output levels.
    const loopsToOutputLevelsMap = new Map();

    // Start with zeros for all output levels, the will be updated below if the loop should be playing.
    this.temperatureSoundClipLoops.forEach( loop => { loopsToOutputLevelsMap.set( loop, 0 ); } );

    // Get a value that summarizes the state of all the enable-control properties.
    const okayToPlay = this.enableControlProperties.reduce( ( valueSoFar, enabled ) => valueSoFar || enabled );

    // Set the volume levels for any loops that are non-zero.
    if ( okayToPlay ) {

      if ( temperature < LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

        let level;

        // By design, there is a little bit sound sound generation at the minimum temperature, but not much, and it
        // fades in as the temperature starts to increase.  This is achieved by using the same algorithm for the cross
        // add and the fade in, and setting up the fade in region to be in a place that sounds the way we want it to.
        const fadeInKnee = GroundLayer.MINIMUM_TEMPERATURE + CROSS_FADE_SPAN * 0.8;
        if ( temperature < fadeInKnee ) {

          // Fade this in based on how close the current temperature is to the minimum.
          level = ( temperature - fadeInKnee + CROSS_FADE_SPAN ) / CROSS_FADE_SPAN;
        }
        else if ( temperature > LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) {

          // This is in an upper cross fade region, adjust its level accordingly.
          level = ( LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN - temperature ) / CROSS_FADE_SPAN;
        }
        else {

          // Not cross fading, set to full volume.
          level = 1;

        }
        loopsToOutputLevelsMap.set( loops[ 0 ], level );
      }
      if ( temperature > LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN &&
           temperature < MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

        let level;

        if ( temperature < LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

          // This is in a lower cross fade region, adjust its level accordingly.
          level = ( temperature - ( LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) ) / CROSS_FADE_SPAN;
        }
        else if ( temperature > MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) {

          // This is in an upper cross fade region, adjust its level accordingly.
          level = ( MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN - temperature ) / CROSS_FADE_SPAN;
        }
        else {

          // Not cross fading, set to full volume.
          level = 1;

        }
        loopsToOutputLevelsMap.set( loops[ 1 ], level );
      }

      if ( temperature > MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN &&
           temperature < HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

        let level;

        if ( temperature < MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

          // This is in a lower cross fade region, adjust its level accordingly.
          level = ( temperature - ( MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) ) / CROSS_FADE_SPAN;
        }
        else if ( temperature > HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) {

          // This is in an upper cross fade region, adjust its level accordingly.
          level = ( HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN - temperature ) / CROSS_FADE_SPAN;
        }
        else {

          // Not cross fading, set to full volume.
          level = 1;
        }
        loopsToOutputLevelsMap.set( loops[ 2 ], level );
      }

      if ( temperature > HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) {

        let level;

        if ( temperature < HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

          // Fade this in a little bit from the minimum temperature.
          level = ( temperature - ( HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE - HALF_CROSS_FADE_SPAN ) ) / CROSS_FADE_SPAN;
        }
        else {

          // Not cross fading, set to full volume.
          level = 1;
        }
        loopsToOutputLevelsMap.set( loops[ 3 ], level );
      }
    }

    loopsToOutputLevelsMap.forEach( ( level, loop ) => {
      if ( level === 0 && loop.isPlaying ) {
        loop.stop();
      }
      else if ( level > 0 ) {
        if ( !loop.isPlaying ) {
          loop.play();
        }
        loop.setOutputLevel( level );
      }
    } );
  }
}

greenhouseEffect.register( 'TemperatureSoundGenerator', TemperatureSoundGenerator );
export default TemperatureSoundGenerator;