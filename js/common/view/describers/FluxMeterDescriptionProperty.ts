// Copyright 2023, University of Colorado Boulder

/**
 * A derived property that creates and updates a string that describes the state of the flux meter.  This is intended
 * for use in conjunction with the description feature.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import FluxMeter from '../../model/FluxMeter.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import LayersModel from '../../model/LayersModel.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';

const mapOfThresholdsToEnergyFluxStrings = new Map(
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
  ]
);

class FluxMeterDescriptionProperty extends StringProperty {

  public constructor( fluxMeterModel: FluxMeter ) {

    // map of numerical altitude values to the strings used to describe them
    const mapOfThresholdsToAltitudeStrings = new Map(
      [
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.05,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.nearSurfaceStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.2,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.veryLowStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.4,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.lowStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.6,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.moderateStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.8,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.highStringProperty
        ],
        [
          fluxMeterModel.fluxSensor.altitudeProperty.rangeProperty.value.max,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.veryHighStringProperty
        ],
        [
          Number.MAX_VALUE,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.topOfAtmosphereStringProperty
        ]
      ]
    );

    super( '' );

    // Monitor the provided Properties and update the value of the string.
    Multilink.multilink(
      [
        fluxMeterModel.fluxSensor.altitudeProperty,
        fluxMeterModel.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
        fluxMeterModel.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
        fluxMeterModel.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
        fluxMeterModel.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty
      ],
      ( altitude, visibleLightDownFlux, visibleLightUpFlux, irLightDownFlux, irLightUpFlux ) => {
        this.value = StringUtils.fillIn( GreenhouseEffectStrings.a11y.fluxMeterStateDescriptionStringProperty, {
          altitude: mapValueToString( altitude, mapOfThresholdsToAltitudeStrings ),
          incomingSunlightAmount: mapValueToString( visibleLightDownFlux, mapOfThresholdsToEnergyFluxStrings, true ),
          outgoingSunlightAmount: mapValueToString( visibleLightUpFlux, mapOfThresholdsToEnergyFluxStrings, true ),
          incomingInfraredAmount: mapValueToString( irLightDownFlux, mapOfThresholdsToEnergyFluxStrings, true ),
          outgoingInfraredAmount: mapValueToString( irLightUpFlux, mapOfThresholdsToEnergyFluxStrings, true )
        } );
      }
    );
  }
}

/**
 * Helper function for mapping a numerical value to a string using a set of threshold values.
 * @param value - the value to be mapped to a string
 * @param thresholdsToStringsMap - a set of thresholds and the string values to use when the provided vaue is below or
 *                                 equal to the associated value (depending on the thresholdIsInclusive setting) but
 *                                 above all other thresholds
 * @param thresholdIsInclusive - a boolean flag that controls whether the threshold comparison uses less-than or
 *                               less-than-or-equal
 */
const mapValueToString = ( value: number,
                           thresholdsToStringsMap: Map<number, TReadOnlyProperty<string>>,
                           thresholdIsInclusive = false ) => {

  const sortedThresholds = _.sortBy( Array.from( thresholdsToStringsMap.keys() ) );
  let result = thresholdsToStringsMap.get( sortedThresholds[ sortedThresholds.length - 1 ] )!.value;
  for ( const threshold of sortedThresholds ) {
    if ( ( !thresholdIsInclusive && value < threshold ) || ( thresholdIsInclusive && value <= threshold ) ) {
      result = thresholdsToStringsMap.get( threshold )!.value;
      break;
    }
  }
  return result;
};

greenhouseEffect.register( 'FluxMeterDescriptionProperty', FluxMeterDescriptionProperty );
export default FluxMeterDescriptionProperty;
