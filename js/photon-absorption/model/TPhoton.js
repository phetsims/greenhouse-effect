// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );
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
        vx: NumberIO.fromStateObject( stateObject.vx ),
        vy: NumberIO.fromStateObject( stateObject.vy ),
        wavelength: NumberIO.fromStateObject( stateObject.wavelength )
      };
    },

    toStateObject: function( value ) {
      return {
        vx: NumberIO.toStateObject( value.vx ),
        vy: NumberIO.toStateObject( value.vy ),
        wavelength: NumberIO.toStateObject( value.wavelength )
      };
    }
  } );

  moleculesAndLight.register( 'TPhoton', TPhoton );

  return TPhoton;
} );
