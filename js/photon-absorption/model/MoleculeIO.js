// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Molecule
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
   * @public
   * @override
   * @returns {Object}
   */
  static toStateObject( molecule ) {
    validate( molecule, this.validator );
    return molecule.toStateObject();
  }

  /**
   * @param {Object} stateObject
   * @public
   * @override
   * @returns {Molecule}
   */
  static fromStateObject( stateObject ) {
    return Molecule.fromStateObject( stateObject );
  }
}

MoleculeIO.documentation = 'IO Type for a molecule.';
MoleculeIO.validator = { valueType: Molecule };
MoleculeIO.typeName = 'MoleculeIO';
ObjectIO.validateIOType( MoleculeIO );

moleculesAndLight.register( 'MoleculeIO', MoleculeIO );
export default MoleculeIO;