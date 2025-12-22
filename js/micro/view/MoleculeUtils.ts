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

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import Molecule from '../model/Molecule.js';
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
import PhotonTarget, { PhotonTargetString } from '../model/PhotonTarget.js';
import MolecularFormulaStrings from './MolecularFormulaStrings.js';

// constants
class Geometry extends EnumerationValue {
  public static readonly LINEAR = new Geometry();
  public static readonly BENT = new Geometry();
  public static readonly TETRAHEDRAL = new Geometry();
  public static readonly DIATOMIC = new Geometry();

  public static readonly enumeration = new Enumeration( Geometry );
}

const MolecularGeometryMap = new Map<typeof Molecule, Geometry>();
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

type MolecularGeometryString = 'linear' | 'bent' | 'tetrahedral' | 'diatomic';

const MolecularGeometryStringMap = new Map<typeof Molecule, MolecularGeometryString>();
MolecularGeometryStringMap.set( CO, 'linear' );
MolecularGeometryStringMap.set( N2, 'linear' );
MolecularGeometryStringMap.set( O2, 'linear' );
MolecularGeometryStringMap.set( CO2, 'linear' );
MolecularGeometryStringMap.set( NO, 'linear' );
MolecularGeometryStringMap.set( H2O, 'bent' );
MolecularGeometryStringMap.set( O3, 'bent' );
MolecularGeometryStringMap.set( CH4, 'tetrahedral' );
MolecularGeometryStringMap.set( NO2, 'bent' );
MolecularGeometryStringMap.set( O, 'diatomic' );

const MoleculeUtils = {

  /**
   * Get the molecular formula for an instance of a Molecule. Returns something like 'CO' or 'N2'.
   */
  getMolecularFormula( molecule: Molecule ): string {
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
   */
  getPhotonTargetEnum( molecule: Molecule ): PhotonTarget | null {
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

  getPhotonTargetString( molecule: Molecule ): PhotonTargetString {
    return molecule instanceof CO ? 'singleCOMolecule' :
           molecule instanceof N2 ? 'singleN2Molecule' :
           molecule instanceof O2 ? 'singleO2Molecule' :
           molecule instanceof CO2 ? 'singleCO2Molecule' :
           molecule instanceof NO2 ? 'singleNO2Molecule' :
           molecule instanceof H2O ? 'singleH2OMolecule' :
           molecule instanceof O3 ? 'singleO3Molecule' :
           'singleCH4Molecule';
  },

  /**
   * For a given molecule, returns the geometry.
   */
  getGeometryEnum( molecule: Molecule ): Geometry {
    return MolecularGeometryMap.get( molecule.constructor as typeof Molecule )!;
  },

  getGeometryString( molecule: Molecule ): MolecularGeometryString {
    return MolecularGeometryStringMap.get( molecule.constructor as typeof Molecule )!;
  },

  /**
   * Get a description of the molecular geometry. This will be read by the user. Will return a full
   * description like
   *
   * "Linear, molecule with a central atom bonded to one or two other atoms forming a straight line. Bond angle
   * 180 degrees."
   */
  getGeometryDescription( molecule: Molecule ): TReadOnlyProperty<string> {
    let descriptionStringProperty: TReadOnlyProperty<string>;

    const geometry = MolecularGeometryMap.get( molecule.constructor as typeof Molecule );
    if ( geometry === Geometry.LINEAR ) {
      descriptionStringProperty = GreenhouseEffectFluent.a11y.micro.linearGeometryDescriptionStringProperty;
    }
    else if ( geometry === Geometry.BENT ) {
      descriptionStringProperty = GreenhouseEffectFluent.a11y.micro.bentGeometryDescriptionStringProperty;
    }
    else if ( geometry === Geometry.TETRAHEDRAL ) {
      descriptionStringProperty = GreenhouseEffectFluent.a11y.micro.tetrahedralGeometryDescriptionStringProperty;
    }
    else {
      throw new Error( 'requesting geometry label for a geometry that is not registered' );
    }

    return descriptionStringProperty;
  },

  MolecularGeometryMap: MolecularGeometryMap,
  Geometry: Geometry
};

greenhouseEffect.register( 'MoleculeUtils', MoleculeUtils );
export default MoleculeUtils;