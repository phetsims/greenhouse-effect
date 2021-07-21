// Copyright 2021, University of Colorado Boulder

/**
 * GroundEMWaveSource produces simulated waves of electromagnetic energy (specifically infrared light) that radiate
 * upward from the ground.
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import LayersModel from '../../common/model/LayersModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave from './Wave.js';
import Utils from '../../../../dot/js/Utils.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

// constants
const STRAIGHT_UP_VECTOR = GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR;
const START_TEMPERATURE = 254; // temperature at which wave production starts, in Kelvin
const MIN_TEMPERATURE = LayersModel.MINIMUM_GROUND_TEMPERATURE;
const MINIMUM_INTENSITY = 0.25;
const WAVE_LIFETIME_RANGE = new Range( 10, 15 ); // in seconds
const INTRA_WAVE_TIME = 2; // in seconds

// parameters of the waves that emanate from the ground
const WAVE_PARAMETERS = [

  // leftmost waves
  {
    originXRange: new Range( -LayersModel.SUNLIGHT_SPAN * 0.35, -LayersModel.SUNLIGHT_SPAN * 0.30 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( Math.PI * 0.12 )
  },

  // center-ish waves
  {
    originXRange: new Range( -LayersModel.SUNLIGHT_SPAN * 0.1, -LayersModel.SUNLIGHT_SPAN * 0.05 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( -Math.PI * 0.15 )
  },

  // rightmost waves
  {
    originXRange: new Range( LayersModel.SUNLIGHT_SPAN * 0.42, LayersModel.SUNLIGHT_SPAN * 0.47 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( -Math.PI * 0.15 )
  }
];

class GroundEMWaveSource {

  /**
   * @param {Wave[]} wavesInModel
   * @param {Property.<number>} groundTemperatureProperty
   */
  constructor( wavesInModel, groundTemperatureProperty ) {

    // @private
    this.wavesInModel = wavesInModel;
    this.groundTemperatureProperty = groundTemperatureProperty;

    // @private {Map.<Wave,number>}
    this.wavesToLifetimesMap = new Map();

    // @private {WaveCreationSpec[]}
    this.waveSpecQueue = [];
  }

  /**
   * @public
   */
  step( dt ) {

    const waveIntensity = mapTemperatureToWaveIntensity( this.groundTemperatureProperty.value );

    WAVE_PARAMETERS.forEach( waveParameterSet => {

      // Look for a wave that matches these parameters in the set of all waves.
      const matchingWave = this.wavesInModel.find( wave =>
        wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
        waveParameterSet.originXRange.contains( wave.origin.x ) &&
        wave.isSourced
      );

      // Look for a wave that is queued for creation that matches these parameters.
      const waveIsQueued = this.waveSpecQueue.reduce( ( previousValue, currentValue ) => {
        return previousValue || currentValue.waveParameterSet === waveParameterSet;
      }, false );

      // If the wave doesn't exist yet, but should, create it.
      if ( !matchingWave && !waveIsQueued && this.groundTemperatureProperty.value > START_TEMPERATURE ) {

        const xPosition = dotRandom.nextBoolean() ? waveParameterSet.originXRange.min : waveParameterSet.originXRange.max;

        // At the current temperature, this wave should be present, but it's not there yet.  Add it.
        this.addWaveToModel( xPosition, waveParameterSet.directionOfTravel, waveIntensity );
      }

      // If the wave already exists, update it.
      else if ( matchingWave ) {

        if ( matchingWave.existanceTime > this.wavesToLifetimesMap.get( matchingWave ) ) {

          // This wave is done.  Set it to propagate on its own and queue up a new one nearby.
          matchingWave.isSourced = false;
          this.wavesToLifetimesMap.delete( matchingWave );

          // Which wave parameter set was this wave associated with?
          const waveParameterSet = WAVE_PARAMETERS.find( waveParameters =>
            waveParameters.originXRange.contains( matchingWave.origin.x )
          );

          const nextWaveOrigin = matchingWave.origin.x === waveParameterSet.originXRange.min ?
                                 waveParameterSet.originXRange.max :
                                 waveParameterSet.originXRange.min;

          // Queue up a wave for creation after the spacing time.
          this.waveSpecQueue.push( new WaveCreationSpec( waveParameterSet, nextWaveOrigin ) );
        }

        if ( matchingWave.getIntensityAt( 0 ) !== waveIntensity ) {

          // Update the intensity.
          matchingWave.setIntensityAtStart( waveIntensity );
        }
      }
    } );

    // See if it's time to create any of the queued up waves.
    this.waveSpecQueue.forEach( waveCreationSpec => {
      waveCreationSpec.countdown -= dt;
      if ( waveCreationSpec.countdown <= 0 ) {

        // Create the wave.
        this.addWaveToModel( waveCreationSpec.originX, waveCreationSpec.waveParameterSet.directionOfTravel, waveIntensity );
      }
    } );

    // Remove any expired wave creation specs.
    this.waveSpecQueue = this.waveSpecQueue.filter( waveSpec => waveSpec.countdown > 0 );
  }

  /**
   * @private
   */
  addWaveToModel( originX, directionOfTravel, intensity ) {
    const newIRWave = new Wave(
      GreenhouseEffectConstants.INFRARED_WAVELENGTH,
      new Vector2( originX, 0 ),
      directionOfTravel,
      LayersModel.HEIGHT_OF_ATMOSPHERE,
      { intensityAtStart: intensity }
    );
    this.wavesInModel.push( newIRWave );
    this.wavesToLifetimesMap.set( newIRWave, dotRandom.nextDoubleBetween(
      WAVE_LIFETIME_RANGE.min,
      WAVE_LIFETIME_RANGE.max
    ) );
  }

  /**
   * @public
   */
  reset() {
    this.wavesToLifetimesMap.clear();
  }
}

const mapTemperatureToWaveIntensity = temperature => {
  return Math.max(
    Utils.roundToInterval( ( temperature - MIN_TEMPERATURE ) / ( 290 - MIN_TEMPERATURE ), 0.25 ),
    MINIMUM_INTENSITY
  );
};

/**
 * simple inner class for amalgamating the information needed to space out the waves
 */
class WaveCreationSpec {

  constructor( waveParameterSet, originX ) {
    this.countdown = INTRA_WAVE_TIME;
    this.waveParameterSet = waveParameterSet;
    this.originX = originX;
  }
}

greenhouseEffect.register( 'GroundEMWaveSource', GroundEMWaveSource );
export default GroundEMWaveSource;