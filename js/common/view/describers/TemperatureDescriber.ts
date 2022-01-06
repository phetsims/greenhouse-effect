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
import LayersModel from '../../model/LayersModel.js';
import GroundLayer from '../../model/GroundLayer.js';

// constants
// determined by inspection, temperature descriptions are evenly distributed across this range of values in Kelvin
const DESCRIBED_TEMPERATURE_RANGE = new Range( GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE, 290 );

// strings used to describe temperature
const temperatureVeryHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.veryHigh;
const temperatureHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.high;
const temperatureSomewhatHighString = greenhouseEffectStrings.a11y.temperatureDescriptions.somewhatHigh;
const temperatureModerateString = greenhouseEffectStrings.a11y.temperatureDescriptions.moderate;
const temperatureSomewhatLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.somewhatLow;
const temperatureLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.low;
const temperatureVeryLowString = greenhouseEffectStrings.a11y.temperatureDescriptions.veryLow;
const surfaceTemperatureChangeWithValuePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureChangeWithValuePattern;
const surfaceTemperatureChangeWithoutValuePatternString = greenhouseEffectStrings.a11y.surfaceTemperatureChangeWithoutValuePattern;
const surfaceTemperatureStable = greenhouseEffectStrings.a11y.surfaceTemperatureStable;
const surfaceTemperatureStableWithDescription = greenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescription;
const surfaceTemperatureStableWithValue = greenhouseEffectStrings.a11y.surfaceTemperatureStableWithValue;
const surfaceTemperatureStableWithDescriptionAndValue = greenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescriptionAndValue;
const warmingString = greenhouseEffectStrings.a11y.warming;
const coolingString = greenhouseEffectStrings.a11y.cooling;

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
   * "245 Kelvin" or "12 Celsius"
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

    return Utils.toFixed( convertedValue, 1 );
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

  /**
   * Get a description of the change in surface temperature, with more or less information depending on whether
   * the thermometer is visible. Will return something like:
   * "Surface temperature warming, now 277 Kelvin."
   */
  static getSurfaceTemperatureChangeString( oldTemperature: number,
                                            currentTemperature: number,
                                            thermometerVisible: boolean,
                                            unitsValue: any ): string | null {
    let changeString = null;

    if ( oldTemperature !== currentTemperature ) {
      const qualitativeDescriptionString = currentTemperature > oldTemperature ? warmingString : coolingString;

      if ( thermometerVisible ) {
        const temperatureValueString = TemperatureDescriber.getQuantitativeTemperatureDescription( currentTemperature, unitsValue );

        changeString = StringUtils.fillIn( surfaceTemperatureChangeWithValuePatternString, {
          qualitativeDescription: qualitativeDescriptionString,
          temperature: temperatureValueString
        } );
      }
      else {
        changeString = StringUtils.fillIn( surfaceTemperatureChangeWithoutValuePatternString, {
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
                                            unitsValue: any ): string {

    let stableTemperatureString = '';
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescriptionAndValue, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString( temperature ),
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
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString( temperature )
      } );
    }
    else if ( !thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = surfaceTemperatureStable;
    }

    return stableTemperatureString;
  }
}

greenhouseEffect.register( 'TemperatureDescriber', TemperatureDescriber );
export default TemperatureDescriber;
