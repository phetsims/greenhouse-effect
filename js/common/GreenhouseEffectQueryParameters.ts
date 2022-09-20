// Copyright 2021-2022, University of Colorado Boulder

/**
 * Query parameters for molecules-and-light.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectQueryParameters = QueryStringMachine.getAll( {

  // This flag can be used to enable custom sim-specific options in the Preferences dialog.  This is used to enable
  // designers to test drive some alternative sounds, see mockups, and so forth.
  // TODO: This query parameter and the associated dialog should be completely removed prior to publication, see
  //       https://github.com/phetsims/greenhouse-effect/issues/179.
  customPreferences: { type: 'flag' },

  // This threshold value is used to decide when an EnergyAbsorbingEmittingLayer is considered to be in equilibrium,
  // meaning that the amount of incoming energy is close to the amount of outgoing energy.  There is another query
  // parameter that controls the amount of time that this must be true.  This value is in Watts per square meter.  See
  // https://github.com/phetsims/greenhouse-effect/issues/137 for more information.
  // TODO: Prior to initial publication, this query parameter should be removed and the value incorporated directly into the code, see https://github.com/phetsims/greenhouse-effect/issues/137
  atEquilibriumThreshold: { type: 'number', defaultValue: 0.004 },

  // This value is used in conjunction with atEquilibriumThreshold to decide whether an EnergyAbsorbingEmittingLayer is
  // in energy equilibrium.  To be considered to be in equilibrium, the net different between incoming and radiated
  // energy must be less than the threshold for the at-equilibrium time.  This value is in seconds.  See
  // https://github.com/phetsims/greenhouse-effect/issues/137 for more information.
  // TODO: Prior to initial publication, this query parameter should be removed and the value incorporated directly into the code, see https://github.com/phetsims/greenhouse-effect/issues/137
  atEquilibriumTime: { type: 'number', defaultValue: 2.0 },

  // The default temperature units to use, meaning the units that all thermometers will be set to on startup and after a
  // reset.  The valid values represent Kelvin, degrees Celsius, and degrees Fahrenheit.
  defaultTemperatureUnits: {
    type: 'string',
    validValues: [ 'K', 'C', 'F' ],
    defaultValue: 'C'
  },

  // Enables the feature that shows cueing arrows on the flux sensor.  This sets the initial value of
  // GreenhouseEffectOptions.cueingArrowsEnabledProperty.
  cueingArrowsEnabled: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // Enables the feature that shows cueing arrows on the flux sensor.  This sets the initial value of
  // GreenhouseEffectOptions.cueingArrowsEnabledProperty.
  useOpacityForWaveRendering: {
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
  showAllLayers: { type: 'flag' },

  // show representations of the energy absorbing/emitting layers on the screens where they are usually not visible
  waveGapsEnabled: { type: 'boolean', defaultValue: false }
} );

greenhouseEffect.register( 'GreenhouseEffectQueryParameters', GreenhouseEffectQueryParameters );

export default GreenhouseEffectQueryParameters;