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
  var validate = require( 'AXON/validate' );

  class MoleculeIO extends ObjectIO {

    /**
     * @param {Molecule} molecule
     * @returns {Object}
     * @override
     */
    static toStateObject( molecule ) {
      validate( molecule, this.validator );
      return molecule.toStateObject();
    }

    /**
     * @param {Object} stateObject
     * @returns {Molecule}
     * @override
     */
    static fromStateObject( stateObject ) {
      return Molecule.fromStateObject( stateObject );
    }
  }

  MoleculeIO.documentation = 'IO type for a molecule.';
  MoleculeIO.validator = { valueType: Molecule };
  MoleculeIO.typeName = 'MoleculeIO';
  ObjectIO.validateSubtype( MoleculeIO );

  return moleculesAndLight.register( 'MoleculeIO', MoleculeIO );
} );

