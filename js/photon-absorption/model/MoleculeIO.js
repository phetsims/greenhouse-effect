// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for Molecule
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   *
   * @param {Molecule} molecule
   * @param {string} phetioID
   * @constructor
   */
  function MoleculeIO( molecule, phetioID ) {
    assert && assertInstanceOf( molecule, phet.moleculesAndLight.Molecule );
    ObjectIO.call( this, molecule, phetioID );
  }

  phetioInherit( ObjectIO, 'MoleculeIO', MoleculeIO, {}, {
    documentation: 'IO type for a molecule.',

    /**
     * @param {Molecule} molecule
     * @returns {Object}
     * @override
     */
    toStateObject: function( molecule ) {
      assert && assertInstanceOf( molecule, phet.moleculesAndLight.Molecule );
      return molecule.toStateObject();
    },

    /**
     * @param {Object} stateObject
     * @returns {Molecule}
     * @override
     */
    fromStateObject: function( stateObject ) {
      return window.phet.moleculesAndLight.Molecule.fromStateObject( stateObject );
    }
  } );

  moleculesAndLight.register( 'MoleculeIO', MoleculeIO );

  return MoleculeIO;
} );

