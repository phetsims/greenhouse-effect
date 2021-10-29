// Copyright 2021, University of Colorado Boulder

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
import LayersModel from '../../model/LayersModel.js';

// constants
// determined by inspection, temperature descriptions are evenly distributed across this range of values in Kelvin
const DESCRIBED_TEMPERATURE_RANGE = new Range( 245, 290 );

// strings used to describe temperature
const temperatureVeryHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.veryHigh;
const temperatureHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.high;
const temperatureSomewhatHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.somewhatHigh;
const temperatureModerateString = greenhouseEffectStrings.a11y.temperatureDescriptions.moderate;
const temperatureSomewhatLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.somewhatLow;
const temperatureLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.low;
const temperatureVeryLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.veryLow;

const qualitativeTemperatureDescriptionStrings = [
  temperatureVeryLowString,
  temperatureLowString,
  temperatureSomewhatLowString,
  temperatureModerateString,
  temperatureSomewhatHighString,
  temperatureHighString,
  temperatureVeryHighString
];

// written units of temperature
const kelvinString = greenhouseEffectStrings.a11y.temperatureUnits.kelvin;
const celsiusString = greenhouseEffectStrings.a11y.temperatureUnits.celsius;
const fahrenheitString = greenhouseEffectStrings.a11y.temperatureUnits.fahrenheit;

class TemperatureDescriber {
  constructor() {}

  /**
   * Get formatted description for the current temperature in the provided units, for use in other contexts. Will
   * return something like:
   * "245 Kelvin" or
   * "12 Celsius
   * @public
   *
   * @param {number} temperatureKelvin - temperature, in kelvin
   * @param {LayersModel.TemperatureUnits} unitsValue
   * @returns {string}
   */
  static getQuantitativeTemperatureDescription( temperatureKelvin: number, unitsValue: any ) {
    return StringUtils.fillIn( greenhouseEffectStrings.temperature.units.valueUnitsPattern, {
      value: TemperatureDescriber.getTemperatureValueString( temperatureKelvin, unitsValue ),
      units: TemperatureDescriber.getTemperatureUnitsString( unitsValue )
    } );
  }

  /**
   * Returns a qualitative description of the temperature of the ground surface. Will return something like
   * "very high" or
   * "moderate" or
   * "low"
   * @public
   *
   * @param {number} value - the temperature in kelvin
   * @returns {string}
   */
  static getQualitativeTemperatureDescriptionString( value: number ) {
    const delta = DESCRIBED_TEMPERATURE_RANGE.getLength() / qualitativeTemperatureDescriptionStrings.length;

    // qualitativeTemperatureDescriptionStrings are ordered from lowest to highest temperature. If we don't find a
    // description string it is beyond the max of DESCRIBED_TEMPERATURE_RANGE so we default to a description
    // for the hottest temperature
    let descriptionString = qualitativeTemperatureDescriptionStrings[ qualitativeTemperatureDescriptionStrings.length - 1 ];
    for ( let i = 0; i < qualitativeTemperatureDescriptionStrings.length; i++ ) {
      if ( value < DESCRIBED_TEMPERATURE_RANGE.min + delta * ( i + 1 ) ) {
        descriptionString = qualitativeTemperatureDescriptionStrings[ i ];
        break;
      }
    }

    return descriptionString;
  }

  /**
   * Get the current temperature in the provided units, formatted for use in interactive description.
   * @public
   *
   * @param {number} temperatureKelvin
   * @param {LayersModel.TemperatureUnits} unitsValue
   * @returns {string}
   */
  static getTemperatureValueString( temperatureKelvin: number, unitsValue: any ) {
    // @ts-ignore
    const convertedValue = unitsValue === LayersModel.TemperatureUnits.KELVIN ? temperatureKelvin :
                           // @ts-ignore
                           unitsValue === LayersModel.TemperatureUnits.CELSIUS ? GreenhouseEffectUtils.kelvinToCelsius( temperatureKelvin ) :
                           GreenhouseEffectUtils.kelvinToFahrenheit( temperatureKelvin );

    return Utils.toFixed( convertedValue, 0 );
  }

  /**
   * From the EnumerationProperty value, return the string for the units of temperature for use in interactive
   * descriptions. Will return something like
   * "Kelvin" or
   * "degrees Celsius"
   * @public
   *
   * @param {LayersModel.TemperatureUnits} unitsValue
   * @returns {string}
   */
  static getTemperatureUnitsString( unitsValue: any ) {
    // @ts-ignore
    return unitsValue === LayersModel.TemperatureUnits.KELVIN ? kelvinString :
           // @ts-ignore
           unitsValue === LayersModel.TemperatureUnits.CELSIUS ? celsiusString :
           fahrenheitString;

  }
}

greenhouseEffect.register( 'TemperatureDescriber', TemperatureDescriber );
export default TemperatureDescriber;
