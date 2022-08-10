// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating strings related to the concentration of gases in the atmosphere.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';
import { ConcentrationDate } from '../../model/ConcentrationModel.js';
import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';

// constants
const greenhouseGasesInAtmospherePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.greenhouseGasesInAtmospherePattern;
const greenhouseGasesValuePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.greenhouseGasesValuePattern;

// strings used to describe the levels of concentration in the model
const noString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.no;
const extremelyLowString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyLow;
const veryLowString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryLow;
const lowString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.low;
const moderateString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.moderate;
const highString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.high;
const veryHighString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryHigh;
const extremelyHighString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyHigh;
const maxString = greenhouseEffectStrings.a11y.qualitativeAmountDescriptions.max;
const historicalLevelsOfGreenhouseGassesPatternString = greenhouseEffectStrings.a11y.historicalLevelsOfGreenhouseGassesPattern;
const historicallyLowString = greenhouseEffectStrings.a11y.historicalRelativeDescriptions.low;
const historicallyModerateString = greenhouseEffectStrings.a11y.historicalRelativeDescriptions.moderate;
const historicallyHighString = greenhouseEffectStrings.a11y.historicalRelativeDescriptions.high;

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
  [ ConcentrationDate.ICE_AGE, historicallyLowString ],
  [ ConcentrationDate.SEVENTEEN_FIFTY, historicallyModerateString ],
  [ ConcentrationDate.NINETEEN_FIFTY, historicallyModerateString ],
  [ ConcentrationDate.TWENTY_TWENTY, historicallyHighString ]
] );

// Collection of concentration descriptions and their ranges, with fields defining whether the description
// should be described at the range. The requirement for deciding whether to use the description when the value is
// at the boundary of the Range is complicated but requested in the design document so that every description is heard
// as you move through values with the default step size.
// https://docs.google.com/document/d/1HWVypTlzM5oSUhhcv7gPdx1sSCs0j-xgIF3lbSgzwAQ/edit#
const qualitativeConcentrationDescriptions: ConcentrationDescription[] = [
  { range: new Range( 0, 0 ), descriptionString: noString, includeMin: true, includeMax: true },
  { range: new Range( 0, 0.05 ), descriptionString: extremelyLowString, includeMin: false, includeMax: true },
  { range: new Range( 0.05, 0.25 ), descriptionString: veryLowString, includeMin: false, includeMax: true },
  { range: new Range( 0.25, 0.45 ), descriptionString: lowString, includeMin: false, includeMax: true },
  { range: new Range( 0.45, 0.65 ), descriptionString: moderateString, includeMin: false, includeMax: false },
  { range: new Range( 0.65, 0.80 ), descriptionString: highString, includeMin: true, includeMax: false },
  { range: new Range( 0.80, 0.95 ), descriptionString: veryHighString, includeMin: true, includeMax: false },
  { range: new Range( 0.95, 1 ), descriptionString: extremelyHighString, includeMin: true, includeMax: false },
  { range: new Range( 1, 1 ), descriptionString: maxString, includeMin: true, includeMax: true }
];

// strings used to describe the concentration my year
const iceAgeString = greenhouseEffectStrings.a11y.timePeriodDescriptions.iceAge;
const seventeenFiftyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.seventeenFifty;
const nineteenFiftyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.nineteenFifty;
const twentyTwentyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.twentyTwenty;

const thereIsALargeGlacierString = greenhouseEffectStrings.a11y.thereIsALargeGlacier;
const thereIsAFarmString = greenhouseEffectStrings.a11y.thereIsAFarm;
const thereAreAFewHomesAndFactoriesString = greenhouseEffectStrings.a11y.thereAreAFewHomesAndFactories;
const thereAreManyHomesAndFactoriesString = greenhouseEffectStrings.a11y.thereAreManyHomesAndFactories;
const aLargeGlacierString = greenhouseEffectStrings.a11y.aLargeGlacier;
const aFarmString = greenhouseEffectStrings.a11y.aFarm;
const aFewHomesAndFactoriesString = greenhouseEffectStrings.a11y.aFewHomesAndFactories;
const manyHomesAndFactoriesString = greenhouseEffectStrings.a11y.manyHomesAndFactories;

// strings used to describe the sky
const skyDescriptionPatternString = greenhouseEffectStrings.a11y.sky.skyDescriptionPattern;
const cloudyString = greenhouseEffectStrings.a11y.sky.cloudy;
const clearString = greenhouseEffectStrings.a11y.sky.clear;

class ConcentrationDescriber {

  /**
   * Get a description of the clouds in the sky. Will return something like
   * "The sky is cloudy." or
   * "The sky is clear".
   */
  public static getSkyCloudDescription( cloudEnabled: boolean ): string {
    const skyPatternString = skyDescriptionPatternString;
    const cloudDescriptionString = cloudEnabled ? cloudyString : clearString;
    return StringUtils.fillIn( skyPatternString, { cloudDescription: cloudDescriptionString } );
  }

  /**
   * Get a description of the sky when a cloud is added or removed. Information about
   * the sunlight will be included if the sun is shining. Will return something like
   * "Cloud added to sky. Some sunlight redirected back to space."
   */
  public static getSkyCloudChangeDescription( cloudEnabled: boolean, isShining: boolean ): string {
    let description;

    const addedOrRemovedDescription = cloudEnabled ? greenhouseEffectStrings.a11y.sky.cloudAddedAlert :
                                      greenhouseEffectStrings.a11y.sky.cloudRemovedAlert;
    if ( isShining ) {
      const receivedOrReflectedDescription = cloudEnabled ? greenhouseEffectStrings.a11y.sky.someSunlightReflectedAlert :
                                             greenhouseEffectStrings.a11y.sky.allSunlightReachesSurfaceAlert;

      description = StringUtils.fillIn( greenhouseEffectStrings.a11y.sky.cloudAlertPattern, {
        addedOrRemoved: addedOrRemovedDescription,
        receivedOrReflected: receivedOrReflectedDescription
      } );
    }
    else {
      description = addedOrRemovedDescription;
    }

    return description;
  }

  /**
   * Get the string describing the selected time period. Something like
   * "ice age" or
   * "year seventeen fifty"
   */
  public static getTimePeriodString( timePeriodValue: ConcentrationDate ): string {
    return timePeriodValue === ConcentrationDate.ICE_AGE ? iceAgeString :
           timePeriodValue === ConcentrationDate.SEVENTEEN_FIFTY ? seventeenFiftyString :
           timePeriodValue === ConcentrationDate.NINETEEN_FIFTY ? nineteenFiftyString :
           twentyTwentyString;
  }

  /**
   * Get a description of a particular time period, including the date. Returns something like
   * "year twenty twenty and there are many homes and factories" or
   * "ice age and there is a large glacier"
   */
  public static getDescribedTimePeriodString( timePeriodValue: ConcentrationDate ): string {
    const timePeriodString = ConcentrationDescriber.getTimePeriodString( timePeriodValue );
    const timePeriodDescriptionString = ConcentrationDescriber.getTimePeriodWithExistenceFragmentDescription( timePeriodValue );

    return StringUtils.fillIn( greenhouseEffectStrings.a11y.timePeriodDescriptionPattern, {
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
    return timePeriodValue === ConcentrationDate.ICE_AGE ? thereIsALargeGlacierString :
           timePeriodValue === ConcentrationDate.SEVENTEEN_FIFTY ? thereIsAFarmString :
           timePeriodValue === ConcentrationDate.NINETEEN_FIFTY ? thereAreAFewHomesAndFactoriesString :
           thereAreManyHomesAndFactoriesString;
  }

  /**
   * Get a short description of the current time period, just including graphical contents like
   * "a farm" or
   * "many homes and factories"
   */
  public static getTimePeriodDescription( timePeriodValue: ConcentrationDate ): string {
    return timePeriodValue === ConcentrationDate.ICE_AGE ? aLargeGlacierString :
           timePeriodValue === ConcentrationDate.SEVENTEEN_FIFTY ? aFarmString :
           timePeriodValue === ConcentrationDate.NINETEEN_FIFTY ? aFewHomesAndFactoriesString :
           manyHomesAndFactoriesString;
  }

  /**
   * Returns a string that describes the current time period in the observation window. This is a shorter
   * statement to be used when the time period will return something like
   * "Now a few homes and houses in observation window." or
   * "Now a large number of homes and factories in observation window."
   */
  public static getObservationWindowNowTimePeriodDescription( timePeriodValue: ConcentrationDate ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.observationWindowTimePeriodPattern, {
      timePeriodDescription: ConcentrationDescriber.getTimePeriodDescription( timePeriodValue )
    } );
  }

  /**
   * Get a string that describes the time period in a full context like:
   * "the time period is the year twenty twenty and there are a large number of homes and factories."
   *
   * @param timePeriodValue
   * @param capitalize - If true, the first letter will be capitalized as if there a standalone sentence.
   */
  public static getFullTimePeriodDescription( timePeriodValue: ConcentrationDate, capitalize: boolean ): string {
    const describedTimePeriod = ConcentrationDescriber.getDescribedTimePeriodString( timePeriodValue );
    let fullTimePeriodDescription = StringUtils.fillIn( greenhouseEffectStrings.a11y.waves.screenSummary.timePeriodPattern, {
      timePeriodDescription: describedTimePeriod
    } );

    if ( capitalize ) {
      fullTimePeriodDescription = StringUtils.capitalize( fullTimePeriodDescription );
    }

    return fullTimePeriodDescription;
  }

  /**
   * Get a string that describes the new time period after changing control mode to "by date" from "by value". Will
   * return something like
   * "Time period is the year seventeen fifty" or
   * "Time period is the year twenty twenty".
   */
  public static getTimePeriodChangeDescription( timePeriodValue: ConcentrationDate ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.timePeriodChangeDescriptionPattern, {
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
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.nowLevelsOfConcentrationPattern, {
      value: ConcentrationDescriber.getConcentrationDescription( concentrationValue )
    } );
  }

  /**
   * Get a description of a change in gas concentration level, returns something like "Now higher levels of greenhouse
   * gases".
   */
  public static getConcentrationRelativeChangeDescription( oldConcentration: number, newConcentration: number ): string {
    const changeString = newConcentration > oldConcentration ? greenhouseEffectStrings.a11y.higher :
                         newConcentration < oldConcentration ? greenhouseEffectStrings.a11y.lower :
                         greenhouseEffectStrings.a11y.unchanged;
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.nowRelativeLevelOfConcentrationPattern, {
      value: changeString
    } );
  }

  /**
   * Get a description of the change in the greenhouse gas concentration value from a previous year to a new one,
   * returns something like:
   * "Greenhouse gas levels much lower than twenty twenty."
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
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.higher;
      }
      else if ( concentrationValuesDifference <= 0.1 ) {
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.muchHigher;
      }
      else {
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.significantlyHigher;
      }
    }
    else {
      if ( concentrationValuesDifference >= -0.04 ) {
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.lower;
      }
      else if ( concentrationValuesDifference >= -0.1 ) {
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.muchLower;
      }
      else {
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.significantlyLower;
      }
    }

    return StringUtils.fillIn( greenhouseEffectStrings.a11y.qualitativeConcentrationChangeDescriptionPattern, {
      comparativeDescription: qualitativeDescriptionString,
      year: ConcentrationDescriber.getTimePeriodString( oldYear )
    } );
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
    let descriptionString = '';

    // Round the value to a fixed number of digits so that we can compare to the ranges without JS precision issues.
    const roundedConcentration = Utils.toFixedNumber( concentration, 2 );

    if ( roundedConcentration === 0 ) {

      // Special case: Leave out the "levels of" portion of the descriptive phrase.
      descriptionString = noString;
    }
    else {

      const qualitativeDescriptionString = ConcentrationDescriber.getQualitativeConcentrationDescription( concentration );

      descriptionString = StringUtils.fillIn( greenhouseEffectStrings.a11y.levelsOfPattern, {
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

    return StringUtils.fillIn( historicalLevelsOfGreenhouseGassesPatternString, {
      historical: historicalDescription
    } );
  }

  public static getHistoricalQualitativeConcentrationDescription( date: ConcentrationDate ): string {
    assert && assert( historicalDescriptionMap.has( date ), 'Provided date is not described.' );
    return StringUtils.capitalize( historicalDescriptionMap.get( date )! );
  }

  /**
   * Returns a description of the amount of greenhouse concentration in the atmosphere by value. Will return
   * something like
   * "Very high levels of greenhouse gases in atmosphere." or
   * "No greenhouse gases in atmosphere."
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

    const patternString = includeInAtmosphere ? greenhouseGasesInAtmospherePatternString : greenhouseGasesValuePatternString;
    return StringUtils.fillIn( patternString, {
      valueDescription: valueDescription
    } );
  }
}

greenhouseEffect.register( 'ConcentrationDescriber', ConcentrationDescriber );
export default ConcentrationDescriber;
