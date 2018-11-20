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
  var Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );

  /**
   *
   * @param {Molecule} molecule
   * @param {string} phetioID
   * @constructor
   */
  function MoleculeIO( molecule, phetioID ) {
    assert && assertInstanceOf( molecule, Molecule );
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
      assert && assertInstanceOf( molecule, Molecule );
      return molecule.toStateObject();
    },

    /**
     * @param {Object} stateObject
     * @returns {Molecule}
     * @override
     */
    fromStateObject: function( stateObject ) {
      return Molecule.fromStateObject( stateObject );
    }
  } );

  moleculesAndLight.register( 'MoleculeIO', MoleculeIO );

  return MoleculeIO;
} );

