// Copyright 2021, University of Colorado Boulder

/**
 * Query parameters for molecules-and-light.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectQueryParameters = QueryStringMachine.getAll( {

  // whether or not to run with customizations for Open Sci Ed
  openSciEd: { type: 'flag' }
} );

greenhouseEffect.register( 'GreenhouseEffectQueryParameters', GreenhouseEffectQueryParameters );

export default GreenhouseEffectQueryParameters;