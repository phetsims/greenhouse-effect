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
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function MoleculeIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.moleculesAndLight.Molecule );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'MoleculeIO', MoleculeIO, {}, {
    documentation: 'Wrapper type for a molecule.',

    fromStateObject: function( stateObject ) {
      return window.phet.moleculesAndLight.Molecule.fromStateObject( stateObject );
    },

    toStateObject: function( value ) {
      return value.toStateObject();
    }
  } );

  moleculesAndLight.register( 'MoleculeIO', MoleculeIO );

  return MoleculeIO;
} );

