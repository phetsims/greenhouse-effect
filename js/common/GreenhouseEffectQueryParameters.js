// Copyright 2021, University of Colorado Boulder

/**
 * Query parameters for molecules-and-light.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectQueryParameters = QueryStringMachine.getAll( {

  // whether or not to run with customizations for Open Sci Ed
  openSciEd: { type: 'flag' },

  // a flag that starts the launches the sim with the sunlight initially started, for ease of development
  initiallyStarted: { type: 'boolean', defaultValue: false },

  // show representations of the energy absorbing/emitting layers on the screens where they are usually not visible
  showAllLayers: { type: 'flag' },

  // a flag that enabled the observation window soundscape, which was turned off for an initial delivery
  soundscape: { type: 'boolean', defaultValue: false }
} );

greenhouseEffect.register( 'GreenhouseEffectQueryParameters', GreenhouseEffectQueryParameters );

export default GreenhouseEffectQueryParameters;