// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TPhoton( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.moleculesAndLight.Photon );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TPhoton', TPhoton, {}, {
    documentation: 'A Photon',
    fromStateObject: function( stateObject ) {
      return {
        vx: TNumber.fromStateObject( stateObject.vx ),
        vy: TNumber.fromStateObject( stateObject.vy ),
        wavelength: TNumber.fromStateObject( stateObject.wavelength )
      };
    },

    toStateObject: function( value ) {
      return {
        vx: TNumber.toStateObject( value.vx ),
        vy: TNumber.toStateObject( value.vy ),
        wavelength: TNumber.toStateObject( value.wavelength )
      };
    }
  } );

  moleculesAndLight.register( 'TPhoton', TPhoton );

  return TPhoton;
} );
