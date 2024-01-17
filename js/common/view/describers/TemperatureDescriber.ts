// Copyright 2021-2023, University of Colorado Boulder

/**
 * Responsible for generating description strings that describe the temperature.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import GreenhouseEffectUtils from '../../GreenhouseEffectUtils.js';
import TemperatureUnits from '../../model/TemperatureUnits.js';
import ValueToStringMapper from './ValueToStringMapper.js';

// strings used to describe temperature
const extremelyHighStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyHighStringProperty;
const veryHighStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryHighStringProperty;
const highStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.highStringProperty;
const moderateStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.moderateStringProperty;
const lowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.lowStringProperty;
const veryLowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryLowStringProperty;
const exceptionallyLowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.exceptionallyLowStringProperty;
const exceptionallyHighStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.exceptionallyHighStringProperty;
const somewhatLowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.somewhatLowStringProperty;
const somewhatHighStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.somewhatHighStringProperty;
const extremelyLowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyLowStringProperty;
const historicallyLowStringProperty = GreenhouseEffectStrings.a11y.historicalRelativeDescriptions.lowStringProperty;
const historicallyModerateStringProperty = GreenhouseEffectStrings.a11y.historicalRelativeDescriptions.moderateStringProperty;
const historicallyHighStringProperty = GreenhouseEffectStrings.a11y.historicalRelativeDescriptions.highStringProperty;
const surfaceTemperatureChangeWithValuePatternStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureChangeWithValuePatternStringProperty;
const surfaceTemperatureChangeWithoutValuePatternStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureChangeWithoutValuePatternStringProperty;
const temperatureChangeWithValuePatternStringProperty = GreenhouseEffectStrings.a11y.temperatureChangeWithValuePatternStringProperty;
const temperatureChangeWithoutValuePatternStringProperty = GreenhouseEffectStrings.a11y.temperatureChangeWithoutValuePatternStringProperty;
const surfaceTemperatureStableStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureStableStringProperty;
const surfaceTemperatureStableWithDescriptionStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescriptionStringProperty;
const surfaceTemperatureStableWithValueStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureStableWithValueStringProperty;
const surfaceTemperatureStableWithDescriptionAndValueStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescriptionAndValueStringProperty;
const warmingStringProperty = GreenhouseEffectStrings.a11y.warmingStringProperty;
const coolingStringProperty = GreenhouseEffectStrings.a11y.coolingStringProperty;
const stabilizingStringProperty = GreenhouseEffectStrings.a11y.stabilizingStringProperty;
const surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty;
const surfaceTemperatureIsQuantitativePatternStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureIsQuantitativePatternStringProperty;
const surfaceTemperatureIsQualitativePatternStringProperty = GreenhouseEffectStrings.a11y.surfaceTemperatureIsQualitativePatternStringProperty;

const NORMAL_QUALITATIVE_DESCRIPTION_MAPPING = new ValueToStringMapper(
  [
    [ 260, extremelyLowStringProperty ],
    [ 275, veryLowStringProperty ],
    [ 283, lowStringProperty ],
    [ 288, moderateStringProperty ],
    [ 293, highStringProperty ],
    [ 301, veryHighStringProperty ],
    [ Number.POSITIVE_INFINITY, extremelyHighStringProperty ]
  ]
);

const EXTENDED_QUALITATIVE_DESCRIPTION_MAPPING = new ValueToStringMapper(
  [
    [ 160, extremelyLowStringProperty ],
    [ 190, exceptionallyLowStringProperty ],
    [ 220, veryLowStringProperty ],
    [ 250, lowStringProperty ],
    [ 280, somewhatLowStringProperty ],
    [ 310, moderateStringProperty ],
    [ 340, somewhatHighStringProperty ],
    [ 370, highStringProperty ],
    [ 400, veryHighStringProperty ],
    [ 430, exceptionallyHighStringProperty ],
    [ Number.POSITIVE_INFINITY, extremelyHighStringProperty ]
  ]
);

// Range used for categorizing temperature values into historical descriptions.  This was empirically determined based
// on the emergent behavior of the model, so it may need updating if the model changes.
const historicallyModerateTemperatureRange = new Range( 286, 287.8 );

// written units of temperature
const kelvinStringProperty = GreenhouseEffectStrings.a11y.temperatureUnits.kelvinStringProperty;
const celsiusStringProperty = GreenhouseEffectStrings.a11y.temperatureUnits.celsiusStringProperty;
const fahrenheitStringProperty = GreenhouseEffectStrings.a11y.temperatureUnits.fahrenheitStringProperty;

class TemperatureDescriber {

  /**
   * Get formatted description for the current temperature in the provided units, for use in other contexts. Will
   * return something like:
   * "245 Kelvin" or "12 Celsius"
   *
   * @param temperatureKelvin - temperature, in kelvin
   * @param unitsValue
   */
  public static getQuantitativeTemperatureDescription( temperatureKelvin: number, unitsValue: TemperatureUnits ): string {
    return StringUtils.fillIn( GreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty, {
      value: TemperatureDescriber.getTemperatureValueString( temperatureKelvin, unitsValue ),
      units: TemperatureDescriber.getTemperatureUnitsString( unitsValue )
    } );
  }

  /**
   * Returns a qualitative description of the temperature of the ground surface. Will return something like "very high"
   * or "moderate" or "historically high"
   *
   * @param value - the temperature in Kelvin
   * @param useHistoricalDescription - whether to describe in historical terms, such as "historically low"
   * @param useExtendedMapping - which of the two available mappings to use for qualitative words, normal or extended
   */
  public static getQualitativeTemperatureDescriptionString( value: number,
                                                            useHistoricalDescription: boolean,
                                                            useExtendedMapping = false ): string {

    let qualitativeDescriptionString;

    if ( useHistoricalDescription ) {
      if ( value < historicallyModerateTemperatureRange.min ) {
        qualitativeDescriptionString = historicallyLowStringProperty.value;
      }
      else if ( value > historicallyModerateTemperatureRange.max ) {
        qualitativeDescriptionString = historicallyHighStringProperty.value;
      }
      else {
        qualitativeDescriptionString = historicallyModerateStringProperty.value;
      }
    }
    else {

      // Get a qualitative, non-historical description.
      qualitativeDescriptionString = useExtendedMapping ?
                                     EXTENDED_QUALITATIVE_DESCRIPTION_MAPPING.getStringForValue( value ) :
                                     NORMAL_QUALITATIVE_DESCRIPTION_MAPPING.getStringForValue( value );
    }

    return qualitativeDescriptionString;
  }

  /**
   * Get a qualitative description of the surface temperature as a full sentence. Returns something like
   * "Surface temperature is somewhat high."
   */
  public static getQualitativeSurfaceTemperatureDescriptionString( temperatureKelvin: number,
                                                                   useHistoricalDescription: boolean ): string {
    return StringUtils.fillIn( GreenhouseEffectStrings.a11y.qualitativeSurfaceTemperaturePatternStringProperty, {
      description: TemperatureDescriber.getQualitativeTemperatureDescriptionString( temperatureKelvin, useHistoricalDescription )
    } );
  }

  /**
   * Get the current temperature in the provided units, formatted for use in interactive description.
   */
  public static getTemperatureValueString( temperatureKelvin: number, unitsValue: TemperatureUnits ): string {
    const convertedValue = unitsValue === TemperatureUnits.KELVIN ? temperatureKelvin :
                           unitsValue === TemperatureUnits.CELSIUS ? GreenhouseEffectUtils.kelvinToCelsius( temperatureKelvin ) :
                           GreenhouseEffectUtils.kelvinToFahrenheit( temperatureKelvin );

    return Utils.toFixed( convertedValue, 1 );
  }

  /**
   * From the EnumerationProperty value, return the string for the units of temperature for use in interactive
   * descriptions. Will return something like
   * "Kelvin" or
   * "degrees Celsius"
   */
  public static getTemperatureUnitsString( unitsValue: TemperatureUnits ): string {
    return unitsValue === TemperatureUnits.KELVIN ? kelvinStringProperty.value :
           unitsValue === TemperatureUnits.CELSIUS ? celsiusStringProperty.value :
           fahrenheitStringProperty.value;
  }

  /**
   * Get a description of the change in surface temperature, with more or less information depending on whether
   * the thermometer is visible. Will return something like:
   *
   * "Surface temperature warming, now 277 Kelvin." or
   * "Cooling, now 266.1 Kelvin." or
   * "Surface temperature stabilizing, now 255 Kelvin."
   *
   * @param oldTemperature
   * @param currentTemperature
   * @param thermometerVisible - Are we displaying surface temperature values?
   * @param unitsValue - What are the displayed units?
   * @param includeSurfaceTemperatureFragment - Include the "Surface temperature..." prefix fragment?
   * @param describeAsStabilizing - Instead of 'warming' or 'cooling', describe the temperature as 'stabilizing'.
   */
  public static getSurfaceTemperatureChangeString( oldTemperature: number,
                                                   currentTemperature: number,
                                                   thermometerVisible: boolean,
                                                   unitsValue: TemperatureUnits,
                                                   includeSurfaceTemperatureFragment: boolean,
                                                   describeAsStabilizing: boolean ): string | null {
    let changeString;
    let patternString;

    let qualitativeDescriptionString = describeAsStabilizing ?
                                       stabilizingStringProperty.value :
                                       ( currentTemperature > oldTemperature ?
                                         warmingStringProperty.value :
                                         coolingStringProperty.value );

    // If we are not including the surface temperature fragment, the qualitative description is the first word.
    // This is NOT i18n friendly, but PhET's policy is that is OK for now.
    if ( !includeSurfaceTemperatureFragment ) {
      qualitativeDescriptionString = StringUtils.capitalize( qualitativeDescriptionString );
    }

    if ( thermometerVisible ) {
      const temperatureValueString = TemperatureDescriber.getQuantitativeTemperatureDescription( currentTemperature, unitsValue );

      patternString = includeSurfaceTemperatureFragment ?
                      surfaceTemperatureChangeWithValuePatternStringProperty.value :
                      temperatureChangeWithValuePatternStringProperty.value;
      changeString = StringUtils.fillIn( patternString, {
        qualitativeDescription: qualitativeDescriptionString,
        temperature: temperatureValueString
      } );
    }
    else {

      patternString = includeSurfaceTemperatureFragment ?
                      surfaceTemperatureChangeWithoutValuePatternStringProperty.value :
                      temperatureChangeWithoutValuePatternStringProperty.value;
      changeString = StringUtils.fillIn( patternString, {
        qualitativeDescription: qualitativeDescriptionString
      } );
    }

    return changeString;
  }

  /**
   * Get a description of the surface temperature when it is stable, i.e. the ground is in equilibrium. This will
   * include more or less information depending on whether the thermometer is visible and/or the surface temperature
   * indicator is visible. Will return something like: "Surface temperature stable and hot, now 277 Kelvin."
   *
   * Please note that this does not actually check that the temperature *is* stable, so use wisely.
   */
  public static getSurfaceTemperatureStableString( temperature: number,
                                                   thermometerVisible: boolean,
                                                   surfaceTemperatureIndicationVisible: boolean,
                                                   unitsValue: TemperatureUnits,
                                                   useHistoricalDescription: boolean ): string {

    let stableTemperatureString = '';
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescriptionAndValueStringProperty, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          useHistoricalDescription
        ),
        quantitativeDescription: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithValueStringProperty, {
        quantitativeDescription: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( !thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescriptionStringProperty, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          useHistoricalDescription
        )
      } );
    }
    else if ( !thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = surfaceTemperatureStableStringProperty.value;
    }

    return stableTemperatureString;
  }

  /**
   * Get a description of what the current surface temperature "is". Similar to other functions in this class, but with
   * slightly different grammatical structure for different contexts. If the thermometer and surface temperature
   * indicators are both invisible, null will be returned.
   *
   * Will return something like
   * "The surface temperature is high, 290 Kelvin."
   */
  public static getSurfaceTemperatureIsString( temperature: number,
                                               thermometerVisible: boolean,
                                               surfaceTemperatureIndicationVisible: boolean,
                                               unitsValue: TemperatureUnits,
                                               useHistoricalDescription: boolean ): string | null {

    let surfaceTemperatureDescriptionString = null;
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn(
        surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty,
        {
          description: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
            temperature,
            useHistoricalDescription
          ),
          value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
        }
      );
    }
    else if ( thermometerVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQuantitativePatternStringProperty, {
        value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( surfaceTemperatureIndicationVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQualitativePatternStringProperty, {
        description: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          useHistoricalDescription
        )
      } );
    }

    return surfaceTemperatureDescriptionString;
  }
}

greenhouseEffect.register( 'TemperatureDescriber', TemperatureDescriber );
export default TemperatureDescriber;
