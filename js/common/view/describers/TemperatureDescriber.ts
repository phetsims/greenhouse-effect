// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating description strings that describe the temperature.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';
import GreenhouseEffectUtils from '../../GreenhouseEffectUtils.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../model/ConcentrationModel.js';
import TemperatureUnits from '../../model/TemperatureUnits.js';

// strings used to describe temperature
const temperatureExtremelyHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.extremelyHigh;
const temperatureVeryHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.veryHigh;
const temperatureHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.high;
const temperatureModerateString = greenhouseEffectStrings.a11y.temperatureDescriptions.moderate;
const temperatureLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.low;
const temperatureVeryLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.veryLow;
const temperatureExtremelyLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.extremelyLow;
const temperatureHistoricallyLowString = greenhouseEffectStrings.a11y.historicalTemperatureDescriptions.low;
const temperatureHistoricallyModerateString = greenhouseEffectStrings.a11y.historicalTemperatureDescriptions.moderate;
const temperatureHistoricallyHighString = greenhouseEffectStrings.a11y.historicalTemperatureDescriptions.high;
const surfaceTemperatureChangeWithValuePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureChangeWithValuePattern;
const surfaceTemperatureChangeWithoutValuePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureChangeWithoutValuePattern;
const temperatureChangeWithValuePatternString = greenhouseEffectStrings.a11y.temperatureChangeWithValuePattern;
const temperatureChangeWithoutValuePatternString = greenhouseEffectStrings.a11y.temperatureChangeWithoutValuePattern;
const surfaceTemperatureStable = greenhouseEffectStrings.a11y.surfaceTemperatureStable;
const surfaceTemperatureStableWithDescription = greenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescription;
const surfaceTemperatureStableWithValue = greenhouseEffectStrings.a11y.surfaceTemperatureStableWithValue;
const surfaceTemperatureStableWithDescriptionAndValue = greenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescriptionAndValue;
const warmingString = greenhouseEffectStrings.a11y.warming;
const coolingString = greenhouseEffectStrings.a11y.cooling;
const surfaceTemperatureIsQuantitativeAndQualitativePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureIsQuantitativeAndQualitativePattern;
const surfaceTemperatureIsQuantitativePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureIsQuantitativePattern;
const surfaceTemperatureIsQualitativePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureIsQualitativePattern;

const qualitativeTemperatureDescriptionStrings = [
  temperatureExtremelyLowString,
  temperatureVeryLowString,
  temperatureLowString,
  temperatureModerateString,
  temperatureHighString,
  temperatureVeryHighString,
  temperatureExtremelyHighString
];

// The minimum values for temperatures in kelvin each description used in the above array when describing the
// temperature qualitatively.
const qualitativeTemperatureDescriptionThresholds = [
  260, 275, 283, 288, 293, 301
];

assert && assert( qualitativeTemperatureDescriptionThresholds.length + 1 === qualitativeTemperatureDescriptionStrings.length,
  'thresholds for finding the description needs to match the length of descriptions to find the qualitative temperature description' );

// Range used for categorizing temperature values into historical descriptions.  This was empirically determined based
// on the emergent behavior of the model, so it may need updating if the model changes.
const historicallyModerateTemperatureRange = new Range( 286, 287.8 );

// written units of temperature
const kelvinString = greenhouseEffectStrings.a11y.temperatureUnits.kelvin;
const celsiusString = greenhouseEffectStrings.a11y.temperatureUnits.celsius;
const fahrenheitString = greenhouseEffectStrings.a11y.temperatureUnits.fahrenheit;

class TemperatureDescriber {

  constructor() {}

  /**
   * Get formatted description for the current temperature in the provided units, for use in other contexts. Will
   * return something like:
   * "245 Kelvin" or "12 Celsius"
   *
   * @param temperatureKelvin - temperature, in kelvin
   * @param unitsValue
   */
  public static getQuantitativeTemperatureDescription( temperatureKelvin: number, unitsValue: TemperatureUnits ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.temperature.units.valueUnitsPattern, {
      value: TemperatureDescriber.getTemperatureValueString( temperatureKelvin, unitsValue ),
      units: TemperatureDescriber.getTemperatureUnitsString( unitsValue )
    } );
  }

  /**
   * Returns a qualitative description of the temperature of the ground surface. Will return something like "very high"
   * or "moderate" or "historically high"
   *
   * @param value - the temperature in kelvin
   * @param concentrationControlMode - the mode for how concentration is controlled, either by value or by date
   * @param date - the selected date
   */
  public static getQualitativeTemperatureDescriptionString( value: number,
                                                            concentrationControlMode: ConcentrationControlMode,
                                                            date: ConcentrationDate ): string {

    let descriptionString;

    if ( concentrationControlMode === ConcentrationControlMode.BY_VALUE ) {
      descriptionString = qualitativeTemperatureDescriptionStrings[ 0 ];

      // Use the minimum values in the "thresholds" array to find the correct qualitative description
      for ( let i = 0; i < qualitativeTemperatureDescriptionThresholds.length; i++ ) {
        const thresholdMin = qualitativeTemperatureDescriptionThresholds[ i ];
        if ( value >= thresholdMin ) {
          descriptionString = qualitativeTemperatureDescriptionStrings[ i + 1 ];
        }
      }
    }
    else {

      // Get a historical description.
      assert && assert( concentrationControlMode === ConcentrationControlMode.BY_DATE );
      if ( value < historicallyModerateTemperatureRange.min ) {
        descriptionString = temperatureHistoricallyLowString;
      }
      else if ( value > historicallyModerateTemperatureRange.max ) {
        descriptionString = temperatureHistoricallyHighString;
      }
      else {
        descriptionString = temperatureHistoricallyModerateString;
      }
    }

    return descriptionString;
  }

  /**
   * Get a qualitative description of the surface temperature as a full sentence. Returns something like
   * "Surface temperature is somewhat high.
   */
  public static getQualitativeSurfaceTemperatureDescriptionString( temperatureKelvin: number,
                                                                   concentrationControlMode: ConcentrationControlMode,
                                                                   date: ConcentrationDate ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.qualitativeSurfaceTemperaturePattern, {
      description: TemperatureDescriber.getQualitativeTemperatureDescriptionString( temperatureKelvin, concentrationControlMode, date )
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
   * From the EnumerationDeprecatedProperty value, return the string for the units of temperature for use in interactive
   * descriptions. Will return something like
   * "Kelvin" or
   * "degrees Celsius"
   */
  public static getTemperatureUnitsString( unitsValue: TemperatureUnits ): string {
    return unitsValue === TemperatureUnits.KELVIN ? kelvinString :
           unitsValue === TemperatureUnits.CELSIUS ? celsiusString :
           fahrenheitString;
  }

  /**
   * Get a description of the change in surface temperature, with more or less information depending on whether
   * the thermometer is visible. Will return something like:
   * "Surface temperature warming, now 277 Kelvin." or
   * "Cooling, now 266.1 Kelvin."
   */
  static getSurfaceTemperatureChangeString( oldTemperature: number,
                                            currentTemperature: number,
                                            thermometerVisible: boolean,
                                            unitsValue: TemperatureUnits,
                                            includeSurfaceTemperatureFragment: boolean ): string | null {
    let changeString = null;
    let patternString = null;

    if ( oldTemperature !== currentTemperature ) {
      let qualitativeDescriptionString = currentTemperature > oldTemperature ? warmingString : coolingString;

      // If we are not including the surface temperature fragment, the qualitative description is the first word.
      // This is NOT i18n friendly, but PhET's policy is that is OK for now.
      if ( !includeSurfaceTemperatureFragment ) {
        qualitativeDescriptionString = StringUtils.capitalize( qualitativeDescriptionString );
      }

      if ( thermometerVisible ) {
        const temperatureValueString = TemperatureDescriber.getQuantitativeTemperatureDescription( currentTemperature, unitsValue );

        patternString = includeSurfaceTemperatureFragment ? surfaceTemperatureChangeWithValuePatternString : temperatureChangeWithValuePatternString;
        changeString = StringUtils.fillIn( patternString, {
          qualitativeDescription: qualitativeDescriptionString,
          temperature: temperatureValueString
        } );
      }
      else {

        patternString = includeSurfaceTemperatureFragment ? surfaceTemperatureChangeWithoutValuePatternString : temperatureChangeWithoutValuePatternString;
        changeString = StringUtils.fillIn( patternString, {
          qualitativeDescription: qualitativeDescriptionString
        } );
      }
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
  static getSurfaceTemperatureStableString( temperature: number,
                                            thermometerVisible: boolean,
                                            surfaceTemperatureIndicationVisible: boolean,
                                            unitsValue: TemperatureUnits,
                                            concentrationControlMode: ConcentrationControlMode,
                                            date: ConcentrationDate ): string {

    let stableTemperatureString = '';
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescriptionAndValue, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        ),
        quantitativeDescription: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithValue, {
        quantitativeDescription: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( !thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescription, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        )
      } );
    }
    else if ( !thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = surfaceTemperatureStable;
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
  static getSurfaceTemperatureIsString( temperature: number,
                                        thermometerVisible: boolean,
                                        surfaceTemperatureIndicationVisible: boolean,
                                        unitsValue: TemperatureUnits,
                                        concentrationControlMode: ConcentrationControlMode,
                                        date: ConcentrationDate ): string | null {

    let surfaceTemperatureDescriptionString = null;
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQuantitativeAndQualitativePatternString, {
        description: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        ),
        value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( thermometerVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQuantitativePatternString, {
        value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( surfaceTemperatureIndicationVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQualitativePatternString, {
        description: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        )
      } );
    }

    return surfaceTemperatureDescriptionString;
  }
}

greenhouseEffect.register( 'TemperatureDescriber', TemperatureDescriber );
export default TemperatureDescriber;
