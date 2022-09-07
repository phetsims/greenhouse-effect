// Copyright 2021-2022, University of Colorado Boulder

/**
 * MicroPhoton targets for a photon absorption model.  The photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

const controlPanelCarbonDioxideString = GreenhouseEffectStrings.ControlPanel.CarbonDioxide;
const controlPanelCarbonMonoxideString = GreenhouseEffectStrings.ControlPanel.CarbonMonoxide;
const controlPanelMethaneString = GreenhouseEffectStrings.ControlPanel.Methane;
const controlPanelNitrogenDioxideString = GreenhouseEffectStrings.ControlPanel.NitrogenDioxide;
const controlPanelNitrogenString = GreenhouseEffectStrings.ControlPanel.Nitrogen;
const controlPanelOxygenString = GreenhouseEffectStrings.ControlPanel.Oxygen;
const controlPanelOzoneString = GreenhouseEffectStrings.ControlPanel.Ozone;
const controlPanelWaterString = GreenhouseEffectStrings.ControlPanel.Water;

class PhotonTarget extends EnumerationValue {
  static SINGLE_CO_MOLECULE = new PhotonTarget();
  static SINGLE_N2_MOLECULE = new PhotonTarget();
  static SINGLE_O2_MOLECULE = new PhotonTarget();
  static SINGLE_CO2_MOLECULE = new PhotonTarget();
  static SINGLE_CH4_MOLECULE = new PhotonTarget();
  static SINGLE_H2O_MOLECULE = new PhotonTarget();
  static SINGLE_NO2_MOLECULE = new PhotonTarget();
  static SINGLE_O3_MOLECULE = new PhotonTarget();

  static enumeration = new Enumeration( PhotonTarget );

  /**
   * maps photon target to translatable string
   * @param {PhotonTarget} photonTarget
   * @returns {string} - the control panel molecule name
   * @public
   */
  static getMoleculeName( photonTarget ) {
    return photonTarget === PhotonTarget.SINGLE_CO_MOLECULE ? controlPanelCarbonMonoxideString :
           photonTarget === PhotonTarget.SINGLE_N2_MOLECULE ? controlPanelNitrogenString :
           photonTarget === PhotonTarget.SINGLE_O2_MOLECULE ? controlPanelOxygenString :
           photonTarget === PhotonTarget.SINGLE_CO2_MOLECULE ? controlPanelCarbonDioxideString :
           photonTarget === PhotonTarget.SINGLE_NO2_MOLECULE ? controlPanelNitrogenDioxideString :
           photonTarget === PhotonTarget.SINGLE_H2O_MOLECULE ? controlPanelWaterString :
           photonTarget === PhotonTarget.SINGLE_O3_MOLECULE ? controlPanelOzoneString :
           photonTarget === PhotonTarget.SINGLE_CH4_MOLECULE ? controlPanelMethaneString :
           assert && assert( false, 'unknown' );

  }
}

greenhouseEffect.register( 'PhotonTarget', PhotonTarget );
export default PhotonTarget;