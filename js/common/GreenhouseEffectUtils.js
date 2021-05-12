// Copyright 2021, University of Colorado Boulder

/**
 * Utility functions and other helpful things used in Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectUtils = {

  /**
   * Converts a temperature in Kelvin to that temperature in Fahrenheit.
   * @public
   *
   * @param kelvin
   * @returns {number}
   */
  kelvinToFahrenheit( kelvin ) {
    return GreenhouseEffectUtils.kelvinToCelsius( kelvin ) * 9 / 5 + 32;
  },

  /**
   * Converts a temperature in Kelvin to that temperature in Celsius.
   * @public
   *
   * @param {number} kelvin
   * @returns {number}
   */
  kelvinToCelsius( kelvin ) {
    return kelvin - 273.15;
  }
};

greenhouseEffect.register( 'GreenhouseEffectUtils', GreenhouseEffectUtils );
export default GreenhouseEffectUtils;
