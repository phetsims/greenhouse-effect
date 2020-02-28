// Copyright 2019-2020, University of Colorado Boulder

/**
 * The molecular formula strings for molecules in Molecules and Light. These are formated with subscripts.
 * They are not meant to be translatable.
 *
 * @author Jesse Greenberg
 */

import ChemUtils from '../../../../nitroglycerin/js/ChemUtils.js';
import moleculesAndLight from '../../moleculesAndLight.js';

const MolecularFormulaStrings = {
  CO_FORMULA_STRING: 'CO',
  N2_FORMULA_STRING: ChemUtils.toSubscript( 'N2' ),
  O2_FORMULA_STRING: ChemUtils.toSubscript( 'O2' ),
  CO2_FORMULA_STRING: ChemUtils.toSubscript( 'CO2' ),
  NO2_FORMULA_STRING: ChemUtils.toSubscript( 'NO2' ),
  O3_FORMULA_STRING: ChemUtils.toSubscript( 'O3' ),
  H20_FORMULA_STRING: ChemUtils.toSubscript( 'H2O' ),
  CH4_FORMULA_STRING: ChemUtils.toSubscript( 'CH4' ),
  NO_FORMULA_STRING: 'NO',
  O_FORMULA_STRING: 'O'
};

moleculesAndLight.register( 'MolecularFormulaStrings', MolecularFormulaStrings );
export default MolecularFormulaStrings;