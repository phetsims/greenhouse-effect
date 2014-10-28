// Copyright 2002-2013, University of Colorado Boulder

/**
 * Wavelength Constants for photons of the PhotonAbsorptionModel
 *
 * @author Jesse Greenberg (Phet Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function() {
  'use strict';

  return {
    SUNLIGHT_WAVELENGTH: 400E-9, // Ported from the original JAVA version, but not used in Molecules And Light
    MICRO_WAVELENGTH: 20,
    IR_WAVELENGTH: 850E-9,
    VISIBLE_WAVELENGTH: 580E-9,
    UV_WAVELENGTH: 100E-9,
    DEBUG_WAVELENGTH: 1
  };
} );