// Copyright 2016, University of Colorado Boulder

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

  var TMolecule = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.moleculesAndLight.Molecule );
    Object.call( this, instance, phetioID );
  };

  phetioInherit( Object, 'TMolecule', TMolecule, {}, {

    fromStateObject: function( stateObject ) {
      return window.phet.moleculesAndLight.Molecule.fromStateObject( stateObject );
    },

    toStateObject: function( value ) {
      return value.toStateObject();
    }
  } );

  moleculesAndLight.register( 'TMolecule', TMolecule );

  return TMolecule;
} );
