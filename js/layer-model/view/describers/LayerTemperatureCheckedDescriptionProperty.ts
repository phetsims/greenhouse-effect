// Copyright 2023, University of Colorado Boulder

/**
 * A description that is responsible for describing when a thermometer is added to an atmosphere or surface layer,
 * including information about the current temperature, units, which layer it is and whether the layer has absorbed any
 * energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import TemperatureUnits from '../../../common/model/TemperatureUnits.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import TemperatureDescriber from '../../../common/view/describers/TemperatureDescriber.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import LocalizedStringProperty from '../../../../../chipper/js/LocalizedStringProperty.js';

class LayerTemperatureCheckedDescriptionProperty extends StringProperty {

  /**
   * @param layerNumber - The layer number that is presented to the user. 0 signifies the ground layer.
   * @param temperatureProperty
   * @param temperatureUnitsProperty
   * @param atLeastOnePhotonAbsorbedProperty
   */
  public constructor(
    layerNumber: number,
    temperatureProperty: TReadOnlyProperty<number>,
    temperatureUnitsProperty: TReadOnlyProperty<TemperatureUnits>,
    atLeastOnePhotonAbsorbedProperty: TReadOnlyProperty<boolean> ) {

    super( '' );

    Multilink.multilink( [ temperatureProperty, temperatureUnitsProperty, atLeastOnePhotonAbsorbedProperty ], ( temperature, temperatureUnits, atLeastOnePhotonAbsorbed ) => {
      let layerDescription: LocalizedStringProperty | string;
      if ( layerNumber === 0 ) {

        // This is the ground layer.
        layerDescription = GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceStringProperty;
      }
      else {
        layerDescription = StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceStringProperty, {
          layerNumber: layerNumber
        } );
      }

      let layerDescriptionString = StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.thermometerMeasuringSurfacePatternStringProperty, { surfaceOrLayer: layerDescription } );

      // The temperature is displayed when the layer gets some non-zero energy, so that is when additional temperature
      // description is included.
      if ( atLeastOnePhotonAbsorbed ) {
        layerDescriptionString += `, ${TemperatureDescriber.getQuantitativeTemperatureDescription(
          temperature, temperatureUnits
        )}`;
      }

      this.value = layerDescriptionString;
    } );
  }
}

greenhouseEffect.register( 'LayerTemperatureCheckedDescriptionProperty', LayerTemperatureCheckedDescriptionProperty );
export default LayerTemperatureCheckedDescriptionProperty;
