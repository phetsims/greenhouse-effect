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
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TMolecule( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.moleculesAndLight.Molecule );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TMolecule', TMolecule, {}, {
    documentation: 'Wrapper type for a molecule.',

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
