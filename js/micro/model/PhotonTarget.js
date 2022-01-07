// Copyright 2021, University of Colorado Boulder

/**
 * MicroPhoton targets for a photon absorption model.  The photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

const controlPanelCarbonDioxideString = greenhouseEffectStrings.ControlPanel.CarbonDioxide;
const controlPanelCarbonMonoxideString = greenhouseEffectStrings.ControlPanel.CarbonMonoxide;
const controlPanelMethaneString = greenhouseEffectStrings.ControlPanel.Methane;
const controlPanelNitrogenDioxideString = greenhouseEffectStrings.ControlPanel.NitrogenDioxide;
const controlPanelNitrogenString = greenhouseEffectStrings.ControlPanel.Nitrogen;
const controlPanelOxygenString = greenhouseEffectStrings.ControlPanel.Oxygen;
const controlPanelOzoneString = greenhouseEffectStrings.ControlPanel.Ozone;
const controlPanelWaterString = greenhouseEffectStrings.ControlPanel.Water;

const PhotonTarget = EnumerationDeprecated.byKeys( [
  'SINGLE_CO_MOLECULE',
  'SINGLE_N2_MOLECULE',
  'SINGLE_O2_MOLECULE',
  'SINGLE_CO2_MOLECULE',
  'SINGLE_CH4_MOLECULE',
  'SINGLE_H2O_MOLECULE',
  'SINGLE_NO2_MOLECULE',
  'SINGLE_O3_MOLECULE'
], {
  beforeFreeze: enumeration => {

    /**
     * maps photon target to translatable string
     * @param {PhotonTarget} photonTarget
     * @returns {string} - the control panel molecule name
     */
    enumeration.getMoleculeName = photonTarget => photonTarget === enumeration.SINGLE_CO_MOLECULE ? controlPanelCarbonMonoxideString :
                                                  photonTarget === enumeration.SINGLE_N2_MOLECULE ? controlPanelNitrogenString :
                                                  photonTarget === enumeration.SINGLE_O2_MOLECULE ? controlPanelOxygenString :
                                                  photonTarget === enumeration.SINGLE_CO2_MOLECULE ? controlPanelCarbonDioxideString :
                                                  photonTarget === enumeration.SINGLE_NO2_MOLECULE ? controlPanelNitrogenDioxideString :
                                                  photonTarget === enumeration.SINGLE_H2O_MOLECULE ? controlPanelWaterString :
                                                  photonTarget === enumeration.SINGLE_O3_MOLECULE ? controlPanelOzoneString :
                                                  photonTarget === enumeration.SINGLE_CH4_MOLECULE ? controlPanelMethaneString :
                                                  assert && assert( false, 'unknown' );
  }
} );
greenhouseEffect.register( 'PhotonTarget', PhotonTarget );
export default PhotonTarget;