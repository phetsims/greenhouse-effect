// Copyright 2021-2024, University of Colorado Boulder

/**
 * Responsible for generating strings related to the concentration of gases in the atmosphere.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import { ConcentrationDate } from '../../model/ConcentrationModel.js';

// constants
const greenhouseGasesInAtmospherePatternStringProperty = GreenhouseEffectStrings.a11y.greenhouseGasesInAtmospherePatternStringProperty;
const greenhouseGasesValuePatternStringProperty = GreenhouseEffectStrings.a11y.greenhouseGasesValuePatternStringProperty;

// strings used to describe the levels of concentration in the model
const noStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.noStringProperty;
const extremelyLowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyLowStringProperty;
const veryLowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryLowStringProperty;
const lowStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.lowStringProperty;
const moderateStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.moderateStringProperty;
const highStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.highStringProperty;
const veryHighStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryHighStringProperty;
const extremelyHighStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyHighStringProperty;
const maxStringProperty = GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.maxStringProperty;
const historicalLevelsOfGreenhouseGassesPatternStringProperty = GreenhouseEffectStrings.a11y.historicalLevelsOfGreenhouseGassesPatternStringProperty;
const historicallyLowStringProperty = GreenhouseEffectStrings.a11y.historicalRelativeDescriptions.lowStringProperty;
const historicallyModerateStringProperty = GreenhouseEffectStrings.a11y.historicalRelativeDescriptions.moderateStringProperty;
const historicallyHighStringProperty = GreenhouseEffectStrings.a11y.historicalRelativeDescriptions.highStringProperty;

// A type to assist with determining which concentration description to use
type ConcentrationDescription = {
  descriptionString: string;

  // The concentration range in which the description string should be used
  range: Range;

  // Whether the description should be used when the value is at the min or max value of the range. There is a complex
  // design requirement for whether the range should be inclusive or exclusive at the boundaries so that all
  // concentration descriptions are heard as you move with a keyboard.
  includeMin: boolean;
  includeMax: boolean;
};

// Maps the date to a relative description of the historical concentration.
const historicalDescriptionMap = new Map( [
  [ ConcentrationDate.ICE_AGE, historicallyLowStringProperty ],
  [ ConcentrationDate.YEAR_1750, historicallyModerateStringProperty ],
  [ ConcentrationDate.YEAR_1950, historicallyModerateStringProperty ],
  [ ConcentrationDate.YEAR_2020, historicallyHighStringProperty ]
] );

// Collection of concentration descriptions and their ranges, with fields defining whether the description
// should be described at the range. The requirement for deciding whether to use the description when the value is
// at the boundary of the Range is complicated but requested in the design document so that every description is heard
// as you move through values with the default step size.
// https://docs.google.com/document/d/1HWVypTlzM5oSUhhcv7gPdx1sSCs0j-xgIF3lbSgzwAQ/edit#
const qualitativeConcentrationDescriptions: ConcentrationDescription[] = [
  { range: new Range( 0, 0 ), descriptionString: noStringProperty.value, includeMin: true, includeMax: true },
  { range: new Range( 0, 0.05 ), descriptionString: extremelyLowStringProperty.value, includeMin: false, includeMax: true },
  { range: new Range( 0.05, 0.25 ), descriptionString: veryLowStringProperty.value, includeMin: false, includeMax: true },
  { range: new Range( 0.25, 0.45 ), descriptionString: lowStringProperty.value, includeMin: false, includeMax: true },
  { range: new Range( 0.45, 0.65 ), descriptionString: moderateStringProperty.value, includeMin: false, includeMax: false },
  { range: new Range( 0.65, 0.80 ), descriptionString: highStringProperty.value, includeMin: true, includeMax: false },
  { range: new Range( 0.80, 0.95 ), descriptionString: veryHighStringProperty.value, includeMin: true, includeMax: false },
  { range: new Range( 0.95, 1 ), descriptionString: extremelyHighStringProperty.value, includeMin: true, includeMax: false },
  { range: new Range( 1, 1 ), descriptionString: maxStringProperty.value, includeMin: true, includeMax: true }
];

// strings used to describe the concentration my year
const iceAgeStringProperty = GreenhouseEffectStrings.a11y.timePeriodDescriptions.iceAgeStringProperty;
const seventeenFiftyStringProperty = GreenhouseEffectStrings.a11y.timePeriodDescriptions.seventeenFiftyStringProperty;
const nineteenFiftyStringProperty = GreenhouseEffectStrings.a11y.timePeriodDescriptions.nineteenFiftyStringProperty;
const twentyTwentyStringProperty = GreenhouseEffectStrings.a11y.timePeriodDescriptions.twentyTwentyStringProperty;

const thereIsALargeGlacierStringProperty = GreenhouseEffectStrings.a11y.thereIsALargeGlacierStringProperty;
const thereIsAFarmStringProperty = GreenhouseEffectStrings.a11y.thereIsAFarmStringProperty;
const thereAreAFewHomesAndFactoriesStringProperty = GreenhouseEffectStrings.a11y.thereAreAFewHomesAndFactoriesStringProperty;
const thereAreManyHomesAndFactoriesStringProperty = GreenhouseEffectStrings.a11y.thereAreManyHomesAndFactoriesStringProperty;
const aLargeGlacierStringProperty = GreenhouseEffectStrings.a11y.aLargeGlacierStringProperty;
const aFarmStringProperty = GreenhouseEffectStrings.a11y.aFarmStringProperty;
const aFewHomesAndFactoriesStringProperty = GreenhouseEffectStrings.a11y.aFewHomesAndFactoriesStringProperty;
const manyHomesAndFactoriesStringProperty = GreenhouseEffectStrings.a11y.manyHomesAndFactoriesStringProperty;

// strings used to describe the sky
const skyDescriptionPatternStringProperty = GreenhouseEffectStrings.a11y.sky.skyDescriptionPatternStringProperty;
const cloudyStringProperty = GreenhouseEffectStrings.a11y.sky.cloudyStringProperty;
const clearStringProperty = GreenhouseEffectStrings.a11y.sky.clearStringProperty;

class ConcentrationDescriber {

  /**
   * Get a description of the clouds in the sky. Will return something like
   * "The sky is cloudy." or
   * "The sky is clear".
   */
  public static getSkyCloudDescription( cloudEnabled: boolean ): string {
    const skyPatternString = skyDescriptionPatternStringProperty.value;
    const cloudDescriptionString = cloudEnabled ? cloudyStringProperty.value : clearStringProperty.value;
    return StringUtils.fillIn( skyPatternString, { cloudDescription: cloudDescriptionString } );
  }

  /**
   * Get a description of the sky when a cloud is added or removed. Information about
   * the sunlight will be included if the sun is shining. Will return something like
   * "Cloud added to sky. Some sunlight redirected back to space."
   */
  public static getSkyCloudChangeDescription( cloudEnabled: boolean, isShining: boolean ): string {
    let description;

    const addedOrRemovedDescriptionProperty = cloudEnabled ?
                                              GreenhouseEffectStrings.a11y.sky.cloudAddedAlertStringProperty :
                                              GreenhouseEffectStrings.a11y.sky.cloudRemovedAlertStringProperty;
    if ( isShining ) {
      const receivedOrReflectedDescriptionProperty = cloudEnabled ?
                                                     GreenhouseEffectStrings.a11y.sky.someSunlightReflectedAlertStringProperty :
                                                     GreenhouseEffectStrings.a11y.sky.allSunlightReachesSurfaceAlertStringProperty;

      description = StringUtils.fillIn( GreenhouseEffectStrings.a11y.sky.cloudAlertPatternStringProperty, {
        addedOrRemoved: addedOrRemovedDescriptionProperty,
        receivedOrReflected: receivedOrReflectedDescriptionProperty
      } );
    }
    else {
      description = addedOrRemovedDescriptionProperty.value;
    }

    return description;
  }

  /**
   * Get the string describing the selected time period. Something like
   * "ice age" or
   * "year seventeen fifty"
   */
  public static getTimePeriodString( timePeriodValue: ConcentrationDate ): string {
    return timePeriodValue === ConcentrationDate.ICE_AGE ? iceAgeStringProperty.value :
           timePeriodValue === ConcentrationDate.YEAR_1750 ? seventeenFiftyStringProperty.value :
           timePeriodValue === ConcentrationDate.YEAR_1950 ? nineteenFiftyStringProperty.value :
           twentyTwentyStringProperty.value;
  }

  /**
   * Get a description of a particular time period, including the date. Returns something like
   * "year twenty-twenty and there are many homes and factories" or
   * "ice age and there is a large glacier"
   */
  public static getDescribedTimePeriodString( timePeriodValue: ConcentrationDate ): string {
    const timePeriodString = ConcentrationDescriber.getTimePeriodString( timePeriodValue );
    const timePeriodDescriptionString = ConcentrationDescriber.getTimePeriodWithExistenceFragmentDescription( timePeriodValue );

    return StringUtils.fillIn( GreenhouseEffectStrings.a11y.timePeriodDescriptionPatternStringProperty, {
      timePeriod: timePeriodString,
      description: timePeriodDescriptionString
    } );
  }

  /**
   * Get a description of the time period with a prefix fragment like "there is". Will return something like
   * "there is a farm" or
   * "there are many homes and factories"
   */
  public static getTimePeriodWithExistenceFragmentDescription( timePeriodValue: ConcentrationDate ): string {
    return timePeriodValue === ConcentrationDate.ICE_AGE ? thereIsALargeGlacierStringProperty.value :
           timePeriodValue === ConcentrationDate.YEAR_1750 ? thereIsAFarmStringProperty.value :
           timePeriodValue === ConcentrationDate.YEAR_1950 ? thereAreAFewHomesAndFactoriesStringProperty.value :
           thereAreManyHomesAndFactoriesStringProperty.value;
  }

  /**
   * Get a short description of the current time period, just including graphical contents like
   * "a farm" or
   * "many homes and factories"
   */
  public static getTimePeriodDescription( timePeriodValue: ConcentrationDate ): string {
    return timePeriodValue === ConcentrationDate.ICE_AGE ? aLargeGlacierStringProperty.value :
           timePeriodValue === ConcentrationDate.YEAR_1750 ? aFarmStringProperty.value :
           timePeriodValue === ConcentrationDate.YEAR_1950 ? aFewHomesAndFactoriesStringProperty.value :
           manyHomesAndFactoriesStringProperty.value;
  }

  /**
   * Returns a string that describes the current time period in the observation window. This is a shorter
   * statement to be used when the time period will return something like
   * "Now a few homes and houses in observation window." or
   * "Now a large number of homes and factories in observation window."
   */
  public static getObservationWindowNowTimePeriodDescription( timePeriodValue: ConcentrationDate ): string {
    return StringUtils.fillIn( GreenhouseEffectStrings.a11y.observationWindowTimePeriodPatternStringProperty, {
      timePeriodDescription: ConcentrationDescriber.getTimePeriodDescription( timePeriodValue )
    } );
  }

  /**
   * Get a string that describes the time period in a full context like:
   * "the time period is the year twenty-twenty and there are a large number of homes and factories."
   *
   * @param timePeriodValue
   * @param capitalize - If true, the first letter will be capitalized as if there a standalone sentence.
   */
  public static getFullTimePeriodDescription( timePeriodValue: ConcentrationDate, capitalize: boolean ): string {
    const describedTimePeriod = ConcentrationDescriber.getDescribedTimePeriodString( timePeriodValue );
    let fullTimePeriodDescription = StringUtils.fillIn(
      GreenhouseEffectStrings.a11y.timePeriodPatternStringProperty,
      { timePeriodDescription: describedTimePeriod }
    );

    if ( capitalize ) {
      fullTimePeriodDescription = StringUtils.capitalize( fullTimePeriodDescription );
    }

    return fullTimePeriodDescription;
  }

  /**
   * Get a string that describes the new time period after changing control mode to "by date" from "by value". Will
   * return something like
   * "Time period is the year seventeen fifty" or
   * "Time period is the year twenty-twenty".
   */
  public static getTimePeriodChangeDescription( timePeriodValue: ConcentrationDate ): string {
    return StringUtils.fillIn( GreenhouseEffectStrings.a11y.timePeriodChangeDescriptionPatternStringProperty, {
      timePeriodDescription: ConcentrationDescriber.getTimePeriodString( timePeriodValue )
    } );
  }

  /**
   * Get a description of the current levels of greenhouse gases in the atmosphere in a sentence that starts with "Now",
   * returns something like:
   * "Now very high levels of greenhouse gases." or
   * "Now low levels of greenhouse gases."
   */
  public static getCurrentConcentrationLevelsDescription( concentrationValue: number ): string {
    return StringUtils.fillIn( GreenhouseEffectStrings.a11y.nowLevelsOfConcentrationPatternStringProperty, {
      value: ConcentrationDescriber.getConcentrationDescription( concentrationValue )
    } );
  }

  /**
   * Get a description of the change in the greenhouse gas concentration value from a previous year to a new one,
   * returns something like:
   * "Greenhouse gas levels much lower than twenty-twenty."
   */
  public static getQualitativeConcentrationChangeDescription( oldConcentrationValue: number,
                                                              oldYear: ConcentrationDate,
                                                              newConcentrationValue: number ): string {

    assert && assert(
      oldConcentrationValue !== newConcentrationValue,
      'this method should not be called for equal concentration values'
    );
    const concentrationValuesDifference = newConcentrationValue - oldConcentrationValue;
    let qualitativeDescriptionString;
    if ( concentrationValuesDifference > 0 ) {
      if ( concentrationValuesDifference <= 0.04 ) {
        qualitativeDescriptionString = GreenhouseEffectStrings.a11y.higherStringProperty.value;
      }
      else if ( concentrationValuesDifference <= 0.1 ) {
        qualitativeDescriptionString = GreenhouseEffectStrings.a11y.muchHigherStringProperty.value;
      }
      else {
        qualitativeDescriptionString = GreenhouseEffectStrings.a11y.significantlyHigherStringProperty.value;
      }
    }
    else {
      if ( concentrationValuesDifference >= -0.04 ) {
        qualitativeDescriptionString = GreenhouseEffectStrings.a11y.lowerStringProperty.value;
      }
      else if ( concentrationValuesDifference >= -0.1 ) {
        qualitativeDescriptionString = GreenhouseEffectStrings.a11y.muchLowerStringProperty.value;
      }
      else {
        qualitativeDescriptionString = GreenhouseEffectStrings.a11y.significantlyLowerStringProperty.value;
      }
    }

    return StringUtils.fillIn(
      GreenhouseEffectStrings.a11y.qualitativeConcentrationChangeDescriptionPatternStringProperty,
      {
        comparativeDescription: qualitativeDescriptionString,
        year: ConcentrationDescriber.getTimePeriodString( oldYear )
      }
    );
  }

  /**
   * Get a description of the level of concentration in the atmosphere, to be used in other sentences. Returns
   * something like
   * "low levels of" or
   * "very high levels of" or
   * "no"
   *
   * @param concentration - value of concentration in the model
   */
  public static getConcentrationDescription( concentration: number ): string {
    let descriptionString;

    // Round the value to a fixed number of digits so that we can compare to the ranges without JS precision issues.
    const roundedConcentration = Utils.toFixedNumber( concentration, 2 );

    if ( roundedConcentration === 0 ) {

      // Special case: Leave out the "levels of" portion of the descriptive phrase.
      descriptionString = noStringProperty.value;
    }
    else {

      const qualitativeDescriptionString = ConcentrationDescriber.getQualitativeConcentrationDescription( concentration );

      descriptionString = StringUtils.fillIn( GreenhouseEffectStrings.a11y.levelsOfPatternStringProperty, {
        qualitativeDescription: qualitativeDescriptionString
      } );
    }

    return descriptionString;
  }

  /**
   * Get a single word or short phrase that qualitatively describes the provided concentration value, something like
   * "low", or "very high".
   */
  public static getQualitativeConcentrationDescription( concentration: number ): string {

    let qualitativeDescription = '';

    // Round the value to a fixed number of digits so that we can compare to the ranges without JS precision issues.
    const roundedConcentration = Utils.toFixedNumber( concentration, 2 );

    for ( let i = 0; i < qualitativeConcentrationDescriptions.length; i++ ) {
      const qualitativeConcentrationDescription = qualitativeConcentrationDescriptions[ i ];
      const concentrationRange = qualitativeConcentrationDescription.range;
      const minComparator = qualitativeConcentrationDescription.includeMin ?
                            roundedConcentration >= concentrationRange.min :
                            roundedConcentration > concentrationRange.min;
      const maxComparator = qualitativeConcentrationDescription.includeMax ?
                            roundedConcentration <= concentrationRange.max :
                            roundedConcentration < concentrationRange.max;

      if ( minComparator && maxComparator ) {
        qualitativeDescription = qualitativeConcentrationDescription.descriptionString;
        break;
      }
    }

    assert && assert( qualitativeDescription !== '', `no description for concentration value: ${concentration}` );

    return qualitativeDescription;
  }

  /**
   * Returns a description of the levels of greenhouse gas concentration in the atmosphere for a date. Will return
   * something like
   * "Historically high levels of greenhouse gases in atmosphere."
   */
  public static getConcentrationDescriptionForDate( date: ConcentrationDate ): string {
    const historicalDescription = StringUtils.capitalize(
      ConcentrationDescriber.getHistoricalQualitativeConcentrationDescription( date )
    );

    return StringUtils.fillIn( historicalLevelsOfGreenhouseGassesPatternStringProperty, {
      historical: historicalDescription
    } );
  }

  public static getHistoricalQualitativeConcentrationDescription( date: ConcentrationDate ): string {
    assert && assert( historicalDescriptionMap.has( date ), 'Provided date is not described.' );
    const historicalDescriptionStringProperty = historicalDescriptionMap.get( date )!;
    return StringUtils.capitalize( historicalDescriptionStringProperty.value );
  }

  /**
   * Returns a description of the amount of greenhouse concentration in the atmosphere by value. Will return something
   * like "Very high levels of greenhouse gases in atmosphere" or "No greenhouse gases in atmosphere".
   *
   * OR, "in atmosphere" can be excluded:
   *
   * "Moderate levels of greenhouse gases."
   * "No greenhouse gases."
   *
   *
   * @param value - value of concentration in the model
   * @param capitalize - if true, the description will be capitalized for the beginning of a sentence.
   * @param [includeInAtmosphere] - Whether to include "in atmosphere" at end of description, default is true
   */
  public static getConcentrationDescriptionWithValue( value: number, capitalize: boolean, includeInAtmosphere = true ): string {

    let valueDescription = ConcentrationDescriber.getConcentrationDescription( value );

    // Capitalize if this statement is first in a sentence. Not friendly for i18n, but PhET decided that this
    // simple solution is most appropriate since i18n + a11y overlap is not a funded project at this time.
    if ( capitalize ) {
      valueDescription = StringUtils.capitalize( valueDescription );
    }

    const patternStringProperty = includeInAtmosphere ?
                                  greenhouseGasesInAtmospherePatternStringProperty :
                                  greenhouseGasesValuePatternStringProperty;
    return StringUtils.fillIn( patternStringProperty, {
      valueDescription: valueDescription
    } );
  }
}

greenhouseEffect.register( 'ConcentrationDescriber', ConcentrationDescriber );
export default ConcentrationDescriber;