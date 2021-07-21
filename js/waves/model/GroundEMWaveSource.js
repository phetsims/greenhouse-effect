// Copyright 2021, University of Colorado Boulder

/**
 * GroundEMWaveSource produces simulated waves of electromagnetic energy (specifically infrared light) that radiate
 * upward from the ground.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import LayersModel from '../../common/model/LayersModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave from './Wave.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const STRAIGHT_UP_VECTOR = GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR;
const START_TEMPERATURE = 254; // temperature at which wave production starts, in Kelvin
const MIN_TEMPERATURE = LayersModel.MINIMUM_GROUND_TEMPERATURE;
const MINIMUM_INTENSITY = 0.25;

// parameters of the waves that emanate from the ground
const WAVE_PARAMETERS = [
  {
    origin: new Vector2( -LayersModel.SUNLIGHT_SPAN * 0.1, 0 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( -Math.PI * 0.15 )
  },
  {
    origin: new Vector2( -LayersModel.SUNLIGHT_SPAN * 0.25, 0 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( Math.PI * 0.15 )
  },
  {
    origin: new Vector2( LayersModel.SUNLIGHT_SPAN * 0.4, 0 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( -Math.PI * 0.15 )
  }
];

class GroundEMWaveSource {

  /**
   * @param {Wave[]} waves
   * @param {Property.<number>} groundTemperatureProperty
   */
  constructor( waves, groundTemperatureProperty ) {

    // @private
    this.waves = waves;
    this.groundTemperatureProperty = groundTemperatureProperty;
  }

  /**
   * @public
   */
  step() {

    const waveIntensity = mapTemperatureToWaveIntensity( this.groundTemperatureProperty.value );
    // if ( this.count === undefined ){
    //   this.count = 0;
    // }
    // this.count++;
    // if ( this.count > 100 ){
    //   console.log( `waveIntensity = ${waveIntensity}` );
    //   this.count = 0;
    // }
    WAVE_PARAMETERS.forEach( waveParameterSet => {

      // Look for a wave that matches these parameters in the set of all waves.
      const wave = this.waves.find( wave =>
        wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
        wave.origin.equals( waveParameterSet.origin ) &&
        wave.isSourced
      );

      // If the wave doesn't exist yet, but should, create it.
      if ( !wave && this.groundTemperatureProperty.value > START_TEMPERATURE ) {

        // At the current temperature, this wave should be present, but it's not there yet.  Add it.
        this.waves.push( new Wave(
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          waveParameterSet.origin,
          waveParameterSet.directionOfTravel,
          LayersModel.HEIGHT_OF_ATMOSPHERE,
          { intensityAtStart: waveIntensity }
        ) );
      }
      else if ( wave ) {

        if ( wave.getIntensityAt( 0 ) !== waveIntensity ) {

          // Update the intensity.
          wave.setIntensityAtStart( waveIntensity );
        }
      }
    } );
  }
}

const mapTemperatureToWaveIntensity = temperature => {
  return Math.max(
    Utils.roundToInterval( ( temperature - MIN_TEMPERATURE ) / ( 290 - MIN_TEMPERATURE ), 0.25 ),
    MINIMUM_INTENSITY
  );
};

greenhouseEffect.register( 'GroundEMWaveSource', GroundEMWaveSource );
export default GroundEMWaveSource;