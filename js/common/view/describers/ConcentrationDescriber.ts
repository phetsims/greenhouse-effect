// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating strings related to the concentration of gasses in the atmosphere.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';
import ConcentrationModel from '../../model/ConcentrationModel.js';

// constants
const greenhouseGassesInAtmospherePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.greenhouseGassesInAtmospherePattern;
const dateLevelsOfGreenhouseGassesPatternString = greenhouseEffectStrings.a11y.dateLevelsOfGreenhouseGassesPattern;

// strings used to describe the levels of concentration in the model
const concentrationNoString = greenhouseEffectStrings.a11y.concentrationDescriptions.no;
const concentrationVeryLowString = greenhouseEffectStrings.a11y.concentrationDescriptions.veryLow;
const concentrationLowString = greenhouseEffectStrings.a11y.concentrationDescriptions.low;
const concentrationModerateString = greenhouseEffectStrings.a11y.concentrationDescriptions.moderate;
const concentrationHighString = greenhouseEffectStrings.a11y.concentrationDescriptions.high;
const concentrationVeryHighString = greenhouseEffectStrings.a11y.concentrationDescriptions.veryHigh;
const concentrationMaxString = greenhouseEffectStrings.a11y.concentrationDescriptions.max;

// The range of concentration in the model is split up evenly and described with these strings. Does not include
// "no" and "max" strings because those are only used at the most extreme values.
const nonExtremeConcentrationDescriptionStrings = [
  concentrationVeryLowString,
  concentrationLowString,
  concentrationModerateString,
  concentrationHighString,
  concentrationVeryHighString
];

// strings used to describe the concentration my year
const iceAgeString = greenhouseEffectStrings.a11y.timePeriodDescriptions.iceAge;
const seventeenFiftyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.seventeenFifty;
const nineteenFiftyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.nineteenFifty;
const twentyTwentyString = greenhouseEffectStrings.a11y.timePeriodDescriptions.twentyTwenty;

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

    // if at the extreme values (and only at extreme values), unique descriptions are used
    if ( value === ConcentrationModel.CONCENTRATION_RANGE.min ) {
      descriptionString = concentrationNoString;
    }
    else if ( value === ConcentrationModel.CONCENTRATION_RANGE.max ) {
      descriptionString = concentrationMaxString;
    }
    else {

      // otherwise, the concentration strings are evenly divided along the range of non-extreme strings
      const concentrationRange = ConcentrationModel.CONCENTRATION_RANGE;
      const delta = concentrationRange.getLength() / nonExtremeConcentrationDescriptionStrings.length;
      for ( let i = 0; i < nonExtremeConcentrationDescriptionStrings.length; i++ ) {
        if ( value < concentrationRange.min + delta * ( i + 1 ) ) {
          descriptionString = nonExtremeConcentrationDescriptionStrings[ i ];
          break;
        }
      }
    }

    assert && assert( descriptionString !== '', `no description for concentration value: ${value}` );
    return descriptionString;
  }

  /**
   * Returns a description of the amount of greenhouse concentration in the atmosphere by value. Will return
   * something like
   * "Very high levels of greenhouse gasses in atmosphere." or
   * "No greenhouse gasses in atmosphere."
   * @public
   *
   * @param {number} value - value of concentration in the model
   * @returns {string}
   */
  static getConcentrationDescriptionWithValue( value: number ) {
    return StringUtils.fillIn( greenhouseGassesInAtmospherePatternString, {
      valueDescription: ConcentrationDescriber.getConcentrationDescription( value )
    } );
  }

  /**
   * @param date - TODO: Replace with new Enumeration pattern
   */
  static getConcentrationDescriptionWithDate( date: any ) {
    return StringUtils.fillIn( dateLevelsOfGreenhouseGassesPatternString, {
      date: ConcentrationDescriber.getTimePeriodString( date )
    } );
  }
}

greenhouseEffect.register( 'ConcentrationDescriber', ConcentrationDescriber );
export default ConcentrationDescriber;
