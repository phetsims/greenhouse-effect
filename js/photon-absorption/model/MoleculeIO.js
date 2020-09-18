// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Molecule
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import Molecule from './Molecule.js';

const MoleculeIO = new IOType( 'MoleculeIO', {
  valueType: Molecule,
  toStateObject: molecule => molecule.toStateObject(),
  fromStateObject: Molecule.fromStateObject
} );

moleculesAndLight.register( 'MoleculeIO', MoleculeIO );
export default MoleculeIO;