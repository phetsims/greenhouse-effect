// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating strings related to the concentration of gases in the atmosphere.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';
import ConcentrationModel from '../../model/ConcentrationModel.js';
import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';

// constants
const greenhouseGasesInAtmospherePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.greenhouseGasesInAtmospherePattern;
const dateLevelsOfGreenhouseGasesPatternString = greenhouseEffectStrings.a11y.dateLevelsOfGreenhouseGasesPattern;

// strings used to describe the levels of concentration in the model
const concentrationNoString = greenhouseEffectStrings.a11y.concentrationDescriptions.no;
const concentrationExtremelyLowString = greenhouseEffectStrings.a11y.concentrationDescriptions.extremelyLow;
const concentrationVeryLowString = greenhouseEffectStrings.a11y.concentrationDescriptions.veryLow;
const concentrationLowString = greenhouseEffectStrings.a11y.concentrationDescriptions.low;
const concentrationModerateString = greenhouseEffectStrings.a11y.concentrationDescriptions.moderate;
const concentrationHighString = greenhouseEffectStrings.a11y.concentrationDescriptions.high;
const concentrationVeryHighString = greenhouseEffectStrings.a11y.concentrationDescriptions.veryHigh;
const concentrationExtremelyHighString = greenhouseEffectStrings.a11y.concentrationDescriptions.extremelyHigh;
const concentrationMaxString = greenhouseEffectStrings.a11y.concentrationDescriptions.max;

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

// Collection of concentration descriptions and their ranges, with fields defining whether the description
// should be described at the range. The requirement for deciding whether to use the description when the value is
// at the boundary of the Range is complicated but requested in the design document so that every description is heard
// as you move through values with the default step size.
// https://docs.google.com/document/d/1HWVypTlzM5oSUhhcv7gPdx1sSCs0j-xgIF3lbSgzwAQ/edit#
const concentrationDescriptions: ConcentrationDescription[] = [
  { range: new Range( 0, 0 ), descriptionString: concentrationNoString, includeMin: true, includeMax: true },
  { range: new Range( 0, 0.05 ), descriptionString: concentrationExtremelyLowString, includeMin: false, includeMax: true },
  { range: new Range( 0.05, 0.25 ), descriptionString: concentrationVeryLowString, includeMin: false, includeMax: true },
  { range: new Range( 0.25, 0.45 ), descriptionString: concentrationLowString, includeMin: false, includeMax: true },
  { range: new Range( 0.45, 0.65 ), descriptionString: concentrationModerateString, includeMin: false, includeMax: false },
  { range: new Range( 0.65, 0.80 ), descriptionString: concentrationHighString, includeMin: true, includeMax: false },
  { range: new Range( 0.80, 0.95 ), descriptionString: concentrationVeryHighString, includeMin: true, includeMax: false },
  { range: new Range( 0.95, 1 ), descriptionString: concentrationExtremelyHighString, includeMin: true, includeMax: false },
  { range: new Range( 1, 1 ), descriptionString: concentrationMaxString, includeMin: true, includeMax: true }
];

// strings used to describe the concentration my year
const iceAgeString = greenhouseEffectStrings.a11y.timePeriodDescriptions.iceAge;
const seventeenFiftyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.seventeenFifty;
const nineteenFiftyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.nineteenFifty;
const twentyTwentyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.twentyTwenty;

const iceAgeDescriptionString = greenhouseEffectStrings.a11y.iceAgeDescription;
const seventeenFiftyDescriptionString = greenhouseEffectStrings.a11y.seventeenFiftyDescription;
const nineteenFiftyDescriptionString = greenhouseEffectStrings.a11y.nineteenFiftyDescription;
const twentyTwentyDescriptionString = greenhouseEffectStrings.a11y.twentyTwentyDescription;

// strings used to describe the sky
const skyDescriptionPatternString = greenhouseEffectStrings.a11y.sky.skyDescriptionPattern;
const cloudyString = greenhouseEffectStrings.a11y.sky.cloudy;
const clearString = greenhouseEffectStrings.a11y.sky.clear;

class ConcentrationDescriber {
  constructor() {}

  /**
   * Get a description of the clouds in the sky. Will return something like
   * "The sky is cloudy." or
   * "The sky is clear".
   * @public
   *
   * @param {boolean} cloudEnabled
   */
  static getSkyCloudDescription( cloudEnabled: boolean ) {
    const skyPatternString = skyDescriptionPatternString;
    const cloudDescriptionString = cloudEnabled ? cloudyString : clearString;
    return StringUtils.fillIn( skyPatternString, { cloudDescription: cloudDescriptionString } );
  }

  /**
   * Get a description of the sky when a cloud is added or removed. Information about
   * the sunlight will be included if the sun is shining. Will return something like
   * "Cloud added to sky. Some sunlight redirected back to space."
   */
  static getSkyCloudChangeDescription( cloudEnabled: boolean, isShining: boolean ) {
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
   * @public
   *
   * @param {ConcentrationModel.CONCENTRATION_DATE} timePeriodValue
   * @returns {string}
   */
  static getTimePeriodString( timePeriodValue: any ) {
    // @ts-ignore
    return timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE ? iceAgeString :
      // @ts-ignore
           timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY ? seventeenFiftyString :
             // @ts-ignore
           timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY ? nineteenFiftyString :
           twentyTwentyString;
  }

  /**
   * Get a description of a particular time period, including the date. Returns something like
   * "year twenty twenty and there are lots of homes and factories" or
   * "ice age and there is a large glacier"
   */
  public static getDescribedTimePeriodString( timePeriodValue: any ) {
    const timePeriodString = ConcentrationDescriber.getTimePeriodString( timePeriodValue );
    const timePeriodDescriptionString = ConcentrationDescriber.getTimePeriodDescription( timePeriodValue );

    return StringUtils.fillIn( greenhouseEffectStrings.a11y.timePeriodDescriptionPattern, {
      timePeriod: timePeriodString,
      description: timePeriodDescriptionString
    } );
  }

  /**
   * Get a description of the time period, just the isolated fragment. Will return something like
   * "a few homes and factories" or
   * "a large number of homes and factories"
   * @param timePeriodValue
   */
  public static getTimePeriodDescription( timePeriodValue: any ) {
    // @ts-ignore
    return timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE ? iceAgeDescriptionString :
      // @ts-ignore
           timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY ? seventeenFiftyDescriptionString :
             // @ts-ignore
           timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY ? nineteenFiftyDescriptionString :
           twentyTwentyDescriptionString;

  }

  /**
   * Returns a string that describes the current time period in the observation window, will return something like
   * "Now a few homes and houses in observation window." or
   * "Now a large number of homes and factories in observation window."
   */
  public static getObservationWindowNowTimePeriodDescription( timePeriodValue: any ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.observationWindowTimePeriodPattern, {
      timePeriodDescription: ConcentrationDescriber.getTimePeriodDescription( timePeriodValue )
    } );
  }

  /**
   * Get a string that describes the time period in a full context like:
   * "the time period is the year twenty twenty and there are a large number of homes and factories."
   */
  public static getFullTimePeriodDescription( timePeriodValue: any ) {

    const describedTimePeriod = ConcentrationDescriber.getDescribedTimePeriodString( timePeriodValue );
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.waves.screenSummary.timePeriodPattern, {
      timePeriodDescription: describedTimePeriod
    } );
  }

  /**
   * Get a string that describes the time period in a full context, proceeded by "currently". Will return something like
   * "Currently, the time period is the year twenty-twenty and there are a large number of homes and factories."
   */
  public static getTimePeriodCurrentlyDescription( timePeriodValue: any ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.currentlyTimePeriodDescriptionPattern, {
      timePeriodDescription: ConcentrationDescriber.getFullTimePeriodDescription( timePeriodValue )
    } );
  }

  /**
   * Get a description of the current levels of greenhouse gases in the atmosphere in a sentence that starts with "Now",
   * returns something like:
   * "Now very high levels of greenhouse gases in atmosphere." or
   * "Now low levels of greenhouse gases in atmosphere."
   *
   * @param concentrationValue
   */
  public static getCurrentConcentrationLevelsDescription( concentrationValue: number ): string {
    return StringUtils.fillIn( greenhouseEffectStrings.a11y.nowLevelsOfConcentrationPattern, {
      value: ConcentrationDescriber.getConcentrationDescription( concentrationValue )
    } );
  }

  /**
   * Get a description of the change in the greenhouse gas concentration value from a previous year to a new one,
   * returns something like:
   * "Greenhouse gas levels much lower than twenty twenty."
   */
  public static getQualitativeConcentrationChangeDescription( oldConcentrationValue: number,
                                                              oldYear: number,
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
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.vastlyHigher;
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
        qualitativeDescriptionString = greenhouseEffectStrings.a11y.vastlyLower;
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
   * @public
   *
   * @param {number} value - value of concentration in the model
   * @returns {string}
   */
  static getConcentrationDescription( value: number ) {
    let descriptionString = '';

    // format the value so that we describe it without js precision issues
    const formattedValue = Utils.toFixedNumber( value, 2 );

    for ( let i = 0; i < concentrationDescriptions.length; i++ ) {
      const concentrationDescription = concentrationDescriptions[ i ];
      const concentrationRange = concentrationDescription.range;
      const minComparator = concentrationDescription.includeMin ? formattedValue >= concentrationRange.min : formattedValue > concentrationRange.min;
      const maxComparator = concentrationDescription.includeMax ? formattedValue <= concentrationRange.max : formattedValue < concentrationRange.max;

      if ( minComparator && maxComparator ) {
        descriptionString = concentrationDescription.descriptionString;
        break;
      }
    }

    assert && assert( descriptionString !== '', `no description for concentration value: ${value}` );
    return descriptionString;
  }

  /**
   * Returns a description of the amount of greenhouse concentration in the atmosphere by value. Will return
   * something like
   * "Very high levels of greenhouse gases in atmosphere." or
   * "No greenhouse gases in atmosphere."
   * @public
   *
   * @param {number} value - value of concentration in the model
   * @returns {string}
   */
  static getConcentrationDescriptionWithValue( value: number ) {

    // Capitalize so that this statement appears in a sentence. Not friendly for i18n, but PhET decided that this
    // simple solution is most appropriate since i18n + a11y overlap is not a funded project at this time.
    const valueDescription = StringUtils.capitalize( ConcentrationDescriber.getConcentrationDescription( value ) );

    return StringUtils.fillIn( greenhouseGasesInAtmospherePatternString, {
      valueDescription: valueDescription
    } );
  }

  /**
   * Returns a description of the levels of greenhouse gas concentration in the atmosphere by date. Will return
   * something like
   * "Year seventeen fifty levels of greenhouse gases in atmosphere."
   * @param date - TODO: Replace with new Enumeration pattern
   */
  static getConcentrationDescriptionWithDate( date: any ) {
    const dateString = StringUtils.capitalize( ConcentrationDescriber.getTimePeriodString( date ) );

    return StringUtils.fillIn( dateLevelsOfGreenhouseGasesPatternString, {
      date: dateString
    } );
  }
}

greenhouseEffect.register( 'ConcentrationDescriber', ConcentrationDescriber );
export default ConcentrationDescriber;
