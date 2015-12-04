// Copyright 2014-2015, University of Colorado Boulder

/**
 * Wavelength Constants for photons of the PhotonAbsorptionModel
 *
 * @author Jesse Greenberg (Phet Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );

  var WavelengthConstants = {
    SUNLIGHT_WAVELENGTH: 400E-9, // Ported from the original JAVA version, but not used in Molecules And Light
    MICRO_WAVELENGTH: 20,
    IR_WAVELENGTH: 850E-9,
    VISIBLE_WAVELENGTH: 580E-9,
    UV_WAVELENGTH: 100E-9,
    DEBUG_WAVELENGTH: 1,

    // Given a wavelength, look up the tandem name for an emitter
    // This is required because the simulation is driven by the wavelength value.  If this code is too instances
    // unmaintainable, we could rewrite the sim to use Emitter instances, each of which has a wavelength and a tandem name
    // See, for example: PhotonEmitterNode
    getTandemName: function( wavelength ) {
      return wavelength === this.SUNLIGHT_WAVELENGTH ? 'sunlight' :
             wavelength === this.MICRO_WAVELENGTH ? 'microwave' :
             wavelength === this.IR_WAVELENGTH ? 'infrared' :
             wavelength === this.VISIBLE_WAVELENGTH ? 'visible' :
             wavelength === this.UV_WAVELENGTH ? 'ultraviolet' :
             assert( false, 'unknown' );
    }
  };

  moleculesAndLight.register( 'WavelengthConstants', WavelengthConstants );

  return WavelengthConstants;
} );