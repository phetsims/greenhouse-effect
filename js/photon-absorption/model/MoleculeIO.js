// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Molecule
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import Molecule from './Molecule.js';

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

moleculesAndLight.register( 'MoleculeIO', MoleculeIO );
export default MoleculeIO;