// Copyright 2021, University of Colorado Boulder

/**
 * Responsible for generating strings related to the concentration of gasses in the atmosphere.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import ConcentrationModel from '../../model/ConcentrationModel.js';

// strings used to describe the levels of concentration in the model
const concentrationNoString = 'no';
const concentrationVeryLowString = 'very low levels of';
const concentrationLowString = 'low levels of';
const concentrationModerateString = 'moderate levels of';
const concentrationHighString = 'high levels of';
const concentrationVeryHighString = 'very high levels of';
const concentrationMaxString = 'max levels of';

// The range of concentration in the model is split up evenly and described with these strings. Does not include
// "no" and "max" strings because those are only used at the most extreme values.
const nonExtremeConcentrationDescriptionStrings = [
  concentrationVeryLowString,
  concentrationLowString,
  concentrationModerateString,
  concentrationHighString,
  concentrationVeryHighString
];

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
  static getSkyCloudDescription( cloudEnabled ) {
    const skyPatternString = 'The sky is {{cloudDescription}}.';
    const cloudDescriptionString = cloudEnabled ? 'cloudy' : 'clear';
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
  static getTimePeriodString( timePeriodValue ) {
    return timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE ? 'ice age' :
           timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY ? 'year seventeen fifty' :
           timePeriodValue === ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY ? 'year nineteen fifty' :
           'year twenty twenty';
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
  static getConcentrationDescriptionString( value ) {
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
}

greenhouseEffect.register( 'ConcentrationDescriber', ConcentrationDescriber );
export default ConcentrationDescriber;
