// Copyright 2017-2019, University of Colorado Boulder

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
  var validate = require( 'AXON/validate' );

  /**
   *
   * @param {Molecule} molecule
   * @param {string} phetioID
   * @constructor
   */
  function MoleculeIO( molecule, phetioID ) {
    ObjectIO.call( this, molecule, phetioID );
  }

  phetioInherit( ObjectIO, 'MoleculeIO', MoleculeIO, {}, {
    documentation: 'IO type for a molecule.',
    validator: { valueType: Molecule },

    /**
     * @param {Molecule} molecule
     * @returns {Object}
     * @override
     */
    toStateObject: function( molecule ) {
      validate( molecule, this.validator );
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

