// Copyright 2021, University of Colorado Boulder

/**
 * TemperatureSoundGenerator is used to create an ambient sound the represents the temperature in the observation window
 * in the Greenhouse Effect simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import greenhouseTemperatureHighV2_mp3 from '../../../sounds/greenhouseTemperatureHighV2_mp3.js';
import greenhouseTemperatureHighV3_mp3 from '../../../sounds/greenhouseTemperatureHighV3_mp3.js';
import greenhouseTemperatureHigh_mp3 from '../../../sounds/greenhouseTemperatureHigh_mp3.js';
import greenhouseTemperatureLowV2_mp3 from '../../../sounds/greenhouseTemperatureLowV2_mp3.js';
import greenhouseTemperatureLowV3_mp3 from '../../../sounds/greenhouseTemperatureLowV3_mp3.js';
import greenhouseTemperatureLow_mp3 from '../../../sounds/greenhouseTemperatureLow_mp3.js';
import greenhouseTemperatureMediumHumanIdealV2_mp3 from '../../../sounds/greenhouseTemperatureMediumHumanIdealV2_mp3.js';
import greenhouseTemperatureMediumHumanIdealV3_mp3 from '../../../sounds/greenhouseTemperatureMediumHumanIdealV3_mp3.js';
import greenhouseTemperatureMediumHumanIdeal_mp3 from '../../../sounds/greenhouseTemperatureMediumHumanIdeal_mp3.js';
import greenhouseTemperatureMediumV2_mp3 from '../../../sounds/greenhouseTemperatureMediumV2_mp3.js';
import greenhouseTemperatureMediumV3_mp3 from '../../../sounds/greenhouseTemperatureMediumV3_mp3.js';
import greenhouseTemperatureMedium_mp3 from '../../../sounds/greenhouseTemperatureMedium_mp3.js';
import greenhouseTemperatureRisingWithBaseNoteHigh_mp3 from '../../../sounds/greenhouseTemperatureRisingWithBaseNoteHigh_mp3.js';
import greenhouseTemperatureRisingWithBaseNoteHumanIdeal_mp3 from '../../../sounds/greenhouseTemperatureRisingWithBaseNoteHumanIdeal_mp3.js';
import greenhouseTemperatureRisingWithBaseNoteLow_mp3 from '../../../sounds/greenhouseTemperatureRisingWithBaseNoteLow_mp3.js';
import greenhouseTemperatureRisingWithBaseNoteMedium_mp3 from '../../../sounds/greenhouseTemperatureRisingWithBaseNoteMedium_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundLayer from '../model/GroundLayer.js';

// constants
// TODO (maybe): On 12/17/2021 I (jbphet) added support to other portions of the sim for ground temperatures below what
//               up until then, had been a minimum ground temperature of 245K.  I didn't update this sound generator to
//               handle this change because it is most likely going away.  If it ends up living on, it will need to be
//               changed to accommodate the potentially lower temperatures.
const LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE = 266; // in Kelvin
const MEDIUM_TO_HUMAN_IDEAL_CROSSOVER_TEMPERATURE = 280; // in Kelvin
const HUMAN_IDEAL_TO_HIGH_CROSSOVER_TEMPERATURE = 289; // in Kelvin
const ORDERED_TEMPERATURE_SOUND_SETS = [
  [
    greenhouseTemperatureLow_mp3,
    greenhouseTemperatureMedium_mp3,
    greenhouseTemperatureMediumHumanIdeal_mp3,
    greenhouseTemperatureHigh_mp3
  ],
  [
    greenhouseTemperatureLowV2_mp3,
    greenhouseTemperatureMediumV2_mp3,
    greenhouseTemperatureMediumHumanIdealV2_mp3,
    greenhouseTemperatureHighV2_mp3
  ],
  [
    greenhouseTemperatureLowV3_mp3,
    greenhouseTemperatureMediumV3_mp3,
    greenhouseTemperatureMediumHumanIdealV3_mp3,
    greenhouseTemperatureHighV3_mp3
  ],
  [
    // favorite set from the 7/13/2021 sound design meeting (was a mix-and-match sort of thing)
    greenhouseTemperatureLowV3_mp3,
    greenhouseTemperatureMediumV2_mp3,
    greenhouseTemperatureMediumHumanIdealV3_mp3,
    greenhouseTemperatureHighV2_mp3
  ],
  [
    // ambient-ish sounds
    greenhouseTemperatureRisingWithBaseNoteLow_mp3,
    greenhouseTemperatureRisingWithBaseNoteMedium_mp3,
    greenhouseTemperatureRisingWithBaseNoteHumanIdeal_mp3,
    greenhouseTemperatureRisingWithBaseNoteHigh_mp3
  ]
];
const TEMPERATURE_SOUND_SET_INDEX = 4;
const CROSS_FADE_SPAN = 6; // in degrees Kelvin
const HALF_CROSS_FADE_SPAN = CROSS_FADE_SPAN / 2;

class TemperatureSoundGenerator extends SoundGenerator {
  private readonly temperatureSoundClipLoops: SoundClip[];
  private readonly temperatureProperty: Property<number>;

  constructor( temperatureProperty: Property<number>, options: SoundGeneratorOptions ) {

    super( options );

    const orderedTemperatureSoundSets = ORDERED_TEMPERATURE_SOUND_SETS[ TEMPERATURE_SOUND_SET_INDEX ];

    // the temperature sound loops in order from lowest temperature to highest
    this.temperatureSoundClipLoops = orderedTemperatureSoundSets.map( sound => {
      const soundClip = new SoundClip( sound, { loop: true } );
      // @ts-ignore TODO: typing for AudioParam
      soundClip.connect( this.masterGainNode );
      return soundClip;
    } );

    // make the temperature Property available to the update method
    this.temperatureProperty = temperatureProperty;

    // Trigger updates when things change.  This class watches the enableControlProperties explicitly instead of only
    // relying on the base class to monitor them so that the loops can be turned off if they don't need to be playing.
    // This saves processor bandwidth on the audio rendering thread, since the parent class turns down the volume but
    // doesn't stop the loops.
    Property.multilink<any[]>(
      [ temperatureProperty, ...options.enableControlProperties as Property<boolean>[] ],
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
    const temperature = Math.max( this.temperatureProperty.value, GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE );
    const loops = this.temperatureSoundClipLoops;

    // Map of loops to output levels.
    const loopsToOutputLevelsMap = new Map();

    // Start with zeros for all output levels, the will be updated below if the loop should be playing.
    this.temperatureSoundClipLoops.forEach( loop => { loopsToOutputLevelsMap.set( loop, 0 ); } );

    // Get a value that summarizes the state of all the enable-control properties.
    const okayToPlay = this.enableControlProperties.reduce(
      ( valueSoFar, enabled ) => valueSoFar || enabled.value, true
    );

    // Set the volume levels for any loops that are non-zero.
    if ( okayToPlay ) {

      if ( temperature < LOW_TO_MEDIUM_CROSSOVER_TEMPERATURE + HALF_CROSS_FADE_SPAN ) {

        let level;

        // By design, there is a little sound generation at the minimum temperature, but not much, and it fades in as
        // the temperature starts to increase.  This is achieved by using the same algorithm for the cross add and the
        // fade in, and setting up the fade in region to be in a place that sounds the way we want it to.
        const fadeInKnee = GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE + CROSS_FADE_SPAN * 0.8;
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