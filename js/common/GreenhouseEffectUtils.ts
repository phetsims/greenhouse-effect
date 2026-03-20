// Copyright 2021-2026, University of Colorado Boulder

/**
 * Utility functions and other helpful things used in Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

const GreenhouseEffectUtils = {

  /**
   * Converts a temperature in Kelvin to degrees Fahrenheit.
   */
  kelvinToFahrenheit( kelvin: number ): number {
    return GreenhouseEffectUtils.kelvinToCelsius( kelvin ) * 9 / 5 + 32;
  },

  /**
   * Converts a temperature in Kelvin to degrees Celsius.
   */
  kelvinToCelsius( kelvin: number ): number {
    return kelvin - 273.15;
  }
};

export default GreenhouseEffectUtils;
