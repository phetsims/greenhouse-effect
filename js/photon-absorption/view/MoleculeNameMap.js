// Copyright 2018, University of Colorado Boulder

/**
 * Maps the molecule type to its described name. Uses instanceof checks and the actual type
 * of the molecule rather than a native Map.
 *
 * At the time of this writing, there are some translated strings for the molecule names. But
 * they are really tied to the control panel, so new strings were added to represent them.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const CH4 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CH4' );
  const CO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO' );
  const CO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO2' );
  const H2O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/H2O' );
  const MolecularFormulaStrings = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MolecularFormulaStrings' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const N2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/N2' );
  const NO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO2' );
  const O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );
  const O3 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O3' );
  const NO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO' );

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

  const MoleculeNameMap = {

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
             molecule instanceof NO2 ? MolecularFormulaStrings.NO2_FORMULA_STRING:
             molecule instanceof H2O ? MolecularFormulaStrings.H20_FORMULA_STRING :
             molecule instanceof O3 ? MolecularFormulaStrings.O3_FORMULA_STRING :
             molecule instanceof CH4 ? MolecularFormulaStrings.CH4_FORMULA_STRING :
             molecule instanceof NO ? MolecularFormulaStrings.NO_FORMULA_STRING :
             MolecularFormulaStrings.O_FORMULA_STRING;
    }
  };

  return moleculesAndLight.register( 'MoleculeNameMap', MoleculeNameMap );
} );
