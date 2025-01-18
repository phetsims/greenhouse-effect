// Copyright 2021-2025, University of Colorado Boulder

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
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import GreenhouseEffectMessages from '../../strings/GreenhouseEffectMessages.js';
import greenhouseEffect from '../../greenhouseEffect.js';
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
import PhotonTarget from '../model/PhotonTarget.js';
import MolecularFormulaStrings from './MolecularFormulaStrings.js';

// constants
class Geometry extends EnumerationValue {
  static LINEAR = new Geometry();
  static BENT = new Geometry();
  static TETRAHEDRAL = new Geometry();
  static DIATOMIC = new Geometry();

  static enumeration = new Enumeration( Geometry );
}

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
   * Get the molecular formula for an instance of a Molecule. Returns something like 'CO' or 'N2'.
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
   * From a molecule, return the equivalent value from the PhotonTarget enumeration.
   * @param molecule
   */
  getPhotonTargetEnum( molecule ) {
    const targetEnum = molecule instanceof CO ? PhotonTarget.SINGLE_CO_MOLECULE :
                       molecule instanceof N2 ? PhotonTarget.SINGLE_N2_MOLECULE :
                       molecule instanceof O2 ? PhotonTarget.SINGLE_O2_MOLECULE :
                       molecule instanceof CO2 ? PhotonTarget.SINGLE_CO2_MOLECULE :
                       molecule instanceof NO2 ? PhotonTarget.SINGLE_NO2_MOLECULE :
                       molecule instanceof H2O ? PhotonTarget.SINGLE_H2O_MOLECULE :
                       molecule instanceof O3 ? PhotonTarget.SINGLE_O3_MOLECULE :
                       molecule instanceof CH4 ? PhotonTarget.SINGLE_CH4_MOLECULE :
                       molecule instanceof NO ? PhotonTarget.SINGLE_NO2_MOLECULE :
                       null;

    assert && assert( targetEnum, 'Unknown target enumeration value for molecule.' );
    return targetEnum;
  },

  /**
   * For a given molecule, returns the geometry.
   */
  getGeometryEnum( molecule ) {
    return MolecularGeometryMap.get( molecule.constructor );
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
      descriptionString = GreenhouseEffectMessages.linearGeometryDescriptionMessageProperty;
    }
    else if ( geometry === Geometry.BENT ) {
      descriptionString = GreenhouseEffectMessages.bentGeometryDescriptionMessageProperty;
    }
    else if ( geometry === Geometry.TETRAHEDRAL ) {
      descriptionString = GreenhouseEffectMessages.tetrahedralGeometryDescriptionMessageProperty;
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
MoleculeUtils.Geometry = Geometry;

greenhouseEffect.register( 'MoleculeUtils', MoleculeUtils );
export default MoleculeUtils;