// Copyright 2019-2020, University of Colorado Boulder

/**
 * Provides utility functions to get information about molecules, such as their name, molecular formula
 * and geometry.
 *
 * At the time of this writing, there are some translated strings for the molecule names. But
 * they are really tied to the control panel, so new strings were added to represent them.
 *
 * @author Jesse Greenberg
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import MoleculesAndLightA11yStrings from '../../common/MoleculesAndLightA11yStrings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import CH4 from '../model/molecules/CH4.js';
import CO from '../model/molecules/CO.js';
import CO2 from '../model/molecules/CO2.js';
import H2O from '../model/molecules/H2O.js';
import N2 from '../model/molecules/N2.js';
import NO from '../model/molecules/NO.js';
import NO2 from '../model/molecules/NO2.js';
import O from '../model/molecules/O.js';
import O2 from '../model/molecules/O2.js';
import O3 from '../model/molecules/O3.js';
import MolecularFormulaStrings from './MolecularFormulaStrings.js';

// pdom strings
const carbonDioxideString = MoleculesAndLightA11yStrings.carbonDioxideString.value;
const carbonMonoxideString = MoleculesAndLightA11yStrings.carbonMonoxideString.value;
const diatomicOxygenString = MoleculesAndLightA11yStrings.diatomicOxygenString.value;
const methaneString = MoleculesAndLightA11yStrings.methaneString.value;
const nitrogenDioxideString = MoleculesAndLightA11yStrings.nitrogenDioxideString.value;
const nitrogenString = MoleculesAndLightA11yStrings.nitrogenString.value;
const oxygenString = MoleculesAndLightA11yStrings.oxygenString.value;
const ozoneString = MoleculesAndLightA11yStrings.ozoneString.value;
const waterString = MoleculesAndLightA11yStrings.waterString.value;
const linearString = MoleculesAndLightA11yStrings.linearString.value;
const bentString = MoleculesAndLightA11yStrings.bentString.value;
const tetrahedralString = MoleculesAndLightA11yStrings.tetrahedralString.value;
const diatomicString = MoleculesAndLightA11yStrings.diatomicString.value;
const bentGeometryDescriptionString = MoleculesAndLightA11yStrings.bentGeometryDescriptionString.value;
const tetrahedralGeometryDescriptionString = MoleculesAndLightA11yStrings.tetrahedralGeometryDescriptionString.value;
const linearGeometryDescriptionString = MoleculesAndLightA11yStrings.linearGeometryDescriptionString.value;

// constants
const Geometry = Enumeration.byKeys( [ 'LINEAR', 'BENT', 'TETRAHEDRAL', 'DIATOMIC' ] );

const MolecularGeometryMap = new Map();
MolecularGeometryMap.set( CO, Geometry.LINEAR );
MolecularGeometryMap.set( N2, Geometry.LINEAR );
MolecularGeometryMap.set( O2, Geometry.LINEAR );
MolecularGeometryMap.set( CO2, Geometry.LINEAR );
MolecularGeometryMap.set( NO, Geometry.LINEAR );
MolecularGeometryMap.set( H2O, Geometry.BENT );
MolecularGeometryMap.set( O3, Geometry.BENT );
MolecularGeometryMap.set( CH4, Geometry.TETRAHEDRAL );
MolecularGeometryMap.set( NO2, Geometry.BENT );
MolecularGeometryMap.set( O, Geometry.DIATOMIC );

const MoleculeUtils = {

  /**
   * Get the full molecular name of a molecule. Returns something like "Carbon Dioxide" or "Oxygen".
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getMolecularName( molecule ) {
    return molecule instanceof CO ? carbonMonoxideString :
           molecule instanceof N2 ? nitrogenString :
           molecule instanceof O2 ? oxygenString :
           molecule instanceof CO2 ? carbonDioxideString :
           molecule instanceof NO2 ? nitrogenDioxideString :
           molecule instanceof H2O ? waterString :
           molecule instanceof O3 ? ozoneString :
           molecule instanceof CH4 ? methaneString :
           diatomicOxygenString;
  },

  /**
   * Get the molecular formula for an instance of a Molecule. Returns something like 'CO' or 'O'.
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getMolecularFormula( molecule ) {
    return molecule instanceof CO ? MolecularFormulaStrings.CO_FORMULA_STRING :
           molecule instanceof N2 ? MolecularFormulaStrings.N2_FORMULA_STRING :
           molecule instanceof O2 ? MolecularFormulaStrings.O2_FORMULA_STRING :
           molecule instanceof CO2 ? MolecularFormulaStrings.CO2_FORMULA_STRING :
           molecule instanceof NO2 ? MolecularFormulaStrings.NO2_FORMULA_STRING :
           molecule instanceof H2O ? MolecularFormulaStrings.H20_FORMULA_STRING :
           molecule instanceof O3 ? MolecularFormulaStrings.O3_FORMULA_STRING :
           molecule instanceof CH4 ? MolecularFormulaStrings.CH4_FORMULA_STRING :
           molecule instanceof NO ? MolecularFormulaStrings.NO_FORMULA_STRING :
           MolecularFormulaStrings.O_FORMULA_STRING;
  },

  /**
   * Get a label string for the geometry of a molecule. To be seen by the user in some context. Will
   * return something like 'linear' or 'bent'.
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getGeometryLabel( molecule ) {
    let labelString = '';

    const geometry = MolecularGeometryMap.get( molecule.constructor );
    if ( geometry === Geometry.LINEAR ) {
      labelString = linearString;
    }
    else if ( geometry === Geometry.BENT ) {
      labelString = bentString;
    }
    else if ( geometry === Geometry.TETRAHEDRAL ) {
      labelString = tetrahedralString;
    }
    else if ( geometry === Geometry.DIATOMIC ) {
      labelString = diatomicString;
    }
    else {
      throw new Error( 'requesting geometry label for a geometry that is not registered' );
    }

    return labelString;
  },

  /**
   * Returns a title of the molecular geometry, meant to describe geometry on its own. Will return
   * something like "Linear" or "Bent".
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getGeometryTitleString( molecule ) {
    let titleString = '';

    const geometry = MolecularGeometryMap.get( molecule.constructor );
    if ( geometry === Geometry.LINEAR ) {
      titleString = linearString;
    }
    else if ( geometry === Geometry.BENT ) {
      titleString = bentString;
    }
    else if ( geometry === Geometry.TETRAHEDRAL ) {
      titleString = tetrahedralString;
    }
    else if ( geometry === Geometry.DIATOMIC ) {
      titleString = diatomicString;
    }
    else {
      throw new Error( 'requesting geometry label for a geometry that is not registered' );
    }

    return titleString;
  },

  /**
   * Get a description of the molecular geometry. This will be read by the user. Will return a full
   * description like
   *
   * "Linear, molecule with a central atom bonded to one or two other atoms forming a straight line. Bond angle
   * 180 degrees."
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getGeometryDescription( molecule ) {
    let descriptionString = '';

    const geometry = MolecularGeometryMap.get( molecule.constructor );
    if ( geometry === Geometry.LINEAR ) {
      descriptionString = linearGeometryDescriptionString;
    }
    else if ( geometry === Geometry.BENT ) {
      descriptionString = bentGeometryDescriptionString;
    }
    else if ( geometry === Geometry.TETRAHEDRAL ) {
      descriptionString = tetrahedralGeometryDescriptionString;
    }
    else {
      throw new Error( 'requesting geometry label for a geometry that is not registered' );
    }

    return descriptionString;
  }
};

// @public
// @static
// {Map}
MoleculeUtils.MolecularGeometryMap = MolecularGeometryMap;

// @public
// @static
// {Enumeration}
MoleculeUtils.Geometry = Geometry;

moleculesAndLight.register( 'MoleculeUtils', MoleculeUtils );
export default MoleculeUtils;