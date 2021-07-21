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

// constants
const TEMPERATURE_HYSTERESIS = 1; // in degrees Kelvin
const STRAIGHT_UP_VECTOR = GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR;

// parameters of the waves that emanate from the ground
const ORDERED_WAVE_PARAMETERS = [
  {
    temperature: 254,
    origin: new Vector2( -LayersModel.SUNLIGHT_SPAN * 0.1, 0 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( -Math.PI * 0.15 )
  },
  {
    temperature: 254,
    origin: new Vector2( -LayersModel.SUNLIGHT_SPAN * 0.25, 0 ),
    directionOfTravel: STRAIGHT_UP_VECTOR.rotated( Math.PI * 0.15 )
  },
  {
    temperature: 254,
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

    ORDERED_WAVE_PARAMETERS.forEach( waveParameterSet => {

      // Look for a wave that matches these parameters in the set off all waves.
      const wave = this.waves.find( wave =>
        wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
        wave.origin.equals( waveParameterSet.origin ) &&
        wave.isSourced
      );

      if ( this.groundTemperatureProperty.value > waveParameterSet.temperature + TEMPERATURE_HYSTERESIS && !wave ) {

        // At the current temperature, this wave should be present, but it's not there yet.  Add it.
        this.waves.push( new Wave(
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          waveParameterSet.origin,
          waveParameterSet.directionOfTravel,
          LayersModel.HEIGHT_OF_ATMOSPHERE
        ) );
      }
      else if ( this.groundTemperatureProperty.value < waveParameterSet.temperature - TEMPERATURE_HYSTERESIS
                && wave ) {

        if ( wave.isSourced ) {
          wave.isSourced = false;
        }
        else if ( wave.startPoint.y === wave.propagationLimit ) {

          // This wave is done, remove it.
          this.waves = _.remove( this.waves, waveToTest => waveToTest === wave );
        }
      }
    } );
  }
}

greenhouseEffect.register( 'GroundEMWaveSource', GroundEMWaveSource );
export default GroundEMWaveSource;