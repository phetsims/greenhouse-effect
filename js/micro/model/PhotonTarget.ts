// Copyright 2021-2022, University of Colorado Boulder

/**
 * MicroPhoton targets for a photon absorption model.  The photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

const controlPanelCarbonDioxideStringProperty = GreenhouseEffectStrings.ControlPanel.CarbonDioxideStringProperty;
const controlPanelCarbonMonoxideStringProperty = GreenhouseEffectStrings.ControlPanel.CarbonMonoxideStringProperty;
const controlPanelMethaneStringProperty = GreenhouseEffectStrings.ControlPanel.MethaneStringProperty;
const controlPanelNitrogenDioxideStringProperty = GreenhouseEffectStrings.ControlPanel.NitrogenDioxideStringProperty;
const controlPanelNitrogenStringProperty = GreenhouseEffectStrings.ControlPanel.NitrogenStringProperty;
const controlPanelOxygenStringProperty = GreenhouseEffectStrings.ControlPanel.OxygenStringProperty;
const controlPanelOzoneStringProperty = GreenhouseEffectStrings.ControlPanel.OzoneStringProperty;
const controlPanelWaterStringProperty = GreenhouseEffectStrings.ControlPanel.WaterStringProperty;

class PhotonTarget extends EnumerationValue {
  public static readonly SINGLE_CO_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_N2_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_O2_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_CO2_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_CH4_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_H2O_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_NO2_MOLECULE = new PhotonTarget();
  public static readonly SINGLE_O3_MOLECULE = new PhotonTarget();

  public static enumeration = new Enumeration( PhotonTarget );

  /**
   * maps photon target to translatable string
   */
  public static getMoleculeName( photonTarget: PhotonTarget ): string {
    return photonTarget === PhotonTarget.SINGLE_CO_MOLECULE ? controlPanelCarbonMonoxideStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_N2_MOLECULE ? controlPanelNitrogenStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_O2_MOLECULE ? controlPanelOxygenStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_CO2_MOLECULE ? controlPanelCarbonDioxideStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_NO2_MOLECULE ? controlPanelNitrogenDioxideStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_H2O_MOLECULE ? controlPanelWaterStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_O3_MOLECULE ? controlPanelOzoneStringProperty.value :
           photonTarget === PhotonTarget.SINGLE_CH4_MOLECULE ? controlPanelMethaneStringProperty.value :
           ( () => { throw new Error( 'unknown photon target' ); } )();

  }
}

greenhouseEffect.register( 'PhotonTarget', PhotonTarget );
export default PhotonTarget;