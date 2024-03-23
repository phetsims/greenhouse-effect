// Copyright 2023-2024, University of Colorado Boulder

/**
 * A derived property that creates and updates a string that describes the state of the flux meter.  This is intended
 * for use in conjunction with the description feature.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import FluxMeter from '../../model/FluxMeter.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import ValueToStringMapper from './ValueToStringMapper.js';
import FluxSensorAltitudeDescriptionProperty from './FluxSensorAltitudeDescriptionProperty.js';

const fluxToValueStringMapper = new ValueToStringMapper(
  [
    [
      0,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.noStringProperty
    ],
    [
      2E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyLowStringProperty
    ],
    [
      3E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.exceptionallyLowStringProperty
    ],
    [
      5E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryLowStringProperty
    ],
    [
      10E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.lowStringProperty
    ],
    [
      15E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.lowStringProperty
    ],
    [
      20E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.moderateStringProperty
    ],
    [
      25E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.somewhatHighStringProperty
    ],
    [
      30E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.highStringProperty
    ],
    [
      35E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryHighStringProperty
    ],
    [
      80E6,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.exceptionallyHighStringProperty
    ],
    [
      Number.MAX_VALUE,
      GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyHighStringProperty
    ]
  ],
  true
);

class FluxMeterDescriptionProperty extends StringProperty {

  public constructor( fluxMeterModel: FluxMeter ) {

    // Create a string that will describe the altitude in qualitative terms.
    const altitudeDescriptionProperty = new FluxSensorAltitudeDescriptionProperty(
      fluxMeterModel.fluxSensor.altitudeProperty
    );

    super( '' );

    // Monitor the provided Properties and update the value of the string.
    Multilink.multilink(
      [
        altitudeDescriptionProperty,
        fluxMeterModel.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
        fluxMeterModel.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
        fluxMeterModel.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
        fluxMeterModel.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty
      ],
      ( altitudeDescription, visibleLightDownFlux, visibleLightUpFlux, irLightDownFlux, irLightUpFlux ) => {
        this.value = StringUtils.fillIn( GreenhouseEffectStrings.a11y.fluxMeterStateDescriptionStringProperty, {
          altitude: altitudeDescription,
          incomingSunlightAmount: fluxToValueStringMapper.getStringForValue( visibleLightDownFlux ),
          outgoingSunlightAmount: fluxToValueStringMapper.getStringForValue( visibleLightUpFlux ),
          incomingInfraredAmount: fluxToValueStringMapper.getStringForValue( irLightDownFlux ),
          outgoingInfraredAmount: fluxToValueStringMapper.getStringForValue( irLightUpFlux )
        } );
      }
    );
  }
}

greenhouseEffect.register( 'FluxMeterDescriptionProperty', FluxMeterDescriptionProperty );
export default FluxMeterDescriptionProperty;