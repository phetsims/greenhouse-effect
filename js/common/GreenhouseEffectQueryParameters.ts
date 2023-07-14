// Copyright 2021-2023, University of Colorado Boulder

/**
 * Query parameters for molecules-and-light.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectQueryParameters = QueryStringMachine.getAll( {

  // The default temperature units to use, meaning the units that all thermometers will be set to on startup and after a
  // reset.  The valid values represent Kelvin, degrees Celsius, and degrees Fahrenheit.
  defaultTemperatureUnits: {
    type: 'string',
    validValues: [ 'K', 'C', 'F' ],
    defaultValue: 'C',
    public: true
  },

  // Enables the feature that shows cueing arrows on the flux sensor.  This sets the initial value of
  // GreenhouseEffectPreferences.cueingArrowsEnabledProperty.
  cueingArrowsEnabled: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // a flag that starts the launches the sim with the sunlight initially started, for ease of development
  initiallyStarted: { type: 'boolean', defaultValue: false },

  // whether or not to run with customizations for Open Sci Ed
  openSciEd: { type: 'flag' },

  // Show additional digits on the temperature readout.  This can be useful for fine-tuning of albedo and gas
  // concentration values.
  showAdditionalTemperatureDigits: { type: 'flag' },

  // show representations of the energy absorbing/emitting layers on the screens where they are usually not visible
  showAllLayers: { type: 'flag' }
} );

greenhouseEffect.register( 'GreenhouseEffectQueryParameters', GreenhouseEffectQueryParameters );

export default GreenhouseEffectQueryParameters;