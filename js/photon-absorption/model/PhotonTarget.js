// Copyright 2014-2020, University of Colorado Boulder

/**
 * Photon targets for a photon absorption model.  The photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import moleculesAndLightStrings from '../../molecules-and-light-strings.js';
import moleculesAndLight from '../../moleculesAndLight.js';

const controlPanelCarbonDioxideString = moleculesAndLightStrings.ControlPanel.CarbonDioxide;
const controlPanelCarbonMonoxideString = moleculesAndLightStrings.ControlPanel.CarbonMonoxide;
const controlPanelMethaneString = moleculesAndLightStrings.ControlPanel.Methane;
const controlPanelNitrogenDioxideString = moleculesAndLightStrings.ControlPanel.NitrogenDioxide;
const controlPanelNitrogenString = moleculesAndLightStrings.ControlPanel.Nitrogen;
const controlPanelOxygenString = moleculesAndLightStrings.ControlPanel.Oxygen;
const controlPanelOzoneString = moleculesAndLightStrings.ControlPanel.Ozone;
const controlPanelWaterString = moleculesAndLightStrings.ControlPanel.Water;

export default moleculesAndLight.register( 'PhotonTarget', Enumeration.byKeys( [
  'SINGLE_CO_MOLECULE',
  'SINGLE_N2_MOLECULE',
  'SINGLE_O2_MOLECULE',
  'SINGLE_CO2_MOLECULE',
  'SINGLE_CH4_MOLECULE',
  'SINGLE_H2O_MOLECULE',
  'SINGLE_NO2_MOLECULE',
  'SINGLE_O3_MOLECULE'
], {
  beforeFreeze: function( enumeration ) {

    /**
     * maps photon target to translatable string
     * @param {PhotonTarget} photonTarget
     * @returns {string} - the control panel molecule name
     */
    enumeration.getMoleculeName = function( photonTarget ) {
      return photonTarget === enumeration.SINGLE_CO_MOLECULE ? controlPanelCarbonMonoxideString :
             photonTarget === enumeration.SINGLE_N2_MOLECULE ? controlPanelNitrogenString :
             photonTarget === enumeration.SINGLE_O2_MOLECULE ? controlPanelOxygenString :
             photonTarget === enumeration.SINGLE_CO2_MOLECULE ? controlPanelCarbonDioxideString :
             photonTarget === enumeration.SINGLE_NO2_MOLECULE ? controlPanelNitrogenDioxideString :
             photonTarget === enumeration.SINGLE_H2O_MOLECULE ? controlPanelWaterString :
             photonTarget === enumeration.SINGLE_O3_MOLECULE ? controlPanelOzoneString :
             photonTarget === enumeration.SINGLE_CH4_MOLECULE ? controlPanelMethaneString :
             assert && assert( false, 'unknown' );
    };
  }
} ) );