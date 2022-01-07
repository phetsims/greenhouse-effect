// Copyright 2021, University of Colorado Boulder

/**
 * The Node that manages and updates the screen summary in the PDOM.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import ConcentrationDescriber from '../../common/view/describers/ConcentrationDescriber.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import WavesModel from '../model/WavesModel.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';

// constants
const currentlyString = greenhouseEffectStrings.a11y.waves.screenSummary.currently;
const currentlyNoSunlightString = greenhouseEffectStrings.a11y.waves.screenSummary.currentlyNoSunlight;

const timePeriodPatternString = greenhouseEffectStrings.a11y.waves.screenSummary.timePeriodPattern;

const summaryWithTemperaturePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.summaryWithTemperaturePattern;
const summaryWithoutTemperaturePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.summaryWithoutTemperaturePattern;

const surfaceTemperaturePatternString = greenhouseEffectStrings.a11y.waves.screenSummary.surfaceTemperaturePattern;
const qualitativeAndQuantitativeTemperatureDescriptionPatternString = greenhouseEffectStrings.a11y.waves.screenSummary.qualitativeAndQuantitativeTemperatureDescriptionPattern;

class WavesScreenSummaryContentNode extends Node {

  /**
   * @param {WavesModel} model
   */
  constructor( model: WavesModel ) {
    super();

    const playAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: greenhouseEffectStrings.a11y.waves.screenSummary.playAreaDescription
    } );
    const controlAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: greenhouseEffectStrings.a11y.waves.screenSummary.controlAreaDescription
    } );
    const simStateDescriptionNode = new Node( { tagName: 'p' } ); // content set with the changing model
    const startSunlightHintNode = new Node( {
      tagName: 'p',
      innerContent: greenhouseEffectStrings.a11y.startSunlightHint
    } );

    this.children = [
      playAreaDescriptionNode,
      controlAreaDescriptionNode,
      simStateDescriptionNode,
      startSunlightHintNode
    ];

    Property.multilink( [
        model.sunEnergySource.isShiningProperty,
        model.concentrationProperty,
        model.dateProperty,
        model.surfaceTemperatureKelvinProperty,
        model.concentrationControlModeProperty,
        model.surfaceTemperatureVisibleProperty,
        model.surfaceThermometerVisibleProperty,
        model.temperatureUnitsProperty,
        model.cloudEnabledProperty
      ],
      (
        sunIsShining: boolean,
        concentration: number,
        date: EnumerationDeprecated,
        surfaceTemperatureKelvin: number,
        concentrationControlMode: EnumerationDeprecated,
        surfaceTemperatureVisible: boolean,
        surfaceThermometerVisible: boolean,
        temperatureUnits: EnumerationDeprecated,
        cloudEnabled: boolean
      ) => {
        // @ts-ignore
        simStateDescriptionNode.innerContent = this.getScreenDescriptionString(
          sunIsShining,
          concentration,
          date,
          surfaceTemperatureKelvin,
          concentrationControlMode,
          surfaceTemperatureVisible,
          surfaceThermometerVisible,
          temperatureUnits,
          cloudEnabled
        );
      }
    );
  }

  /**
   * Returns a full summary of the waves screen. Dependent on most Properties of the WavesModel. Returns something like
   * "Currently, no sunlight in observation window; the time period is the year twenty twenty. The sky is cloudy." or
   * "Currently, max levels of greenhouse gases in atmosphere. Earth’s surface temperature is very high, 22 degrees
   * Celsius. The sky is cloudy.
   * @private
   *
   * @param {boolean} sunIsShining - is the sun shining?
   * @param {number} concentration - value of concentration in the model
   * @param {ConcentrationModel.CONCENTRATION_DATE} date - modelled date of concentration (if controlling by date)
   * @param {number} surfaceTemperatureKelvin - temperature of earth's surface in Kelvin
   * @param {ConcentrationModel.CONCENTRATION_CONTROL_MODE} concentrationControlMode - mode of concentration control
   * @param {boolean} surfaceTemperatureVisible - is the surface temperature visible?
   * @param {boolean} surfaceThermometerVisible - is the surface thermometer visible?
   * @param {LayersModel.TemperatureUnits} temperatureUnits - units selected to describe the temperature
   * @param {boolean} cloudEnabled - is there a cloud in the sky?
   * @returns {string}
   */
  getScreenDescriptionString( sunIsShining: boolean,
                              concentration: number,
                              date: EnumerationDeprecated,
                              surfaceTemperatureKelvin: number,
                              concentrationControlMode: EnumerationDeprecated,
                              surfaceTemperatureVisible: boolean,
                              surfaceThermometerVisible: boolean,
                              temperatureUnits: EnumerationDeprecated,
                              cloudEnabled: boolean ) {

    // the final description
    let descriptionString = '';

    // the leading portion of the summary may include an extra hint that sunlight isn't shining yet
    const currentlyDescriptionString = sunIsShining ? currentlyString : currentlyNoSunlightString;

    // portion that describes the state of the sky
    const skyDescriptionString = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );

    // portion that describes the state of the concentration in the atmosphere
    let concentrationDescriptionString = '';
    // @ts-ignore
    if ( concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_VALUE ) {
      concentrationDescriptionString = ConcentrationDescriber.getConcentrationDescriptionWithValue( concentration );
    }
    else {
      concentrationDescriptionString = StringUtils.fillIn( timePeriodPatternString, {
        timePeriodDescription: ConcentrationDescriber.getTimePeriodString( date )
      } );
    }

    let patternString = '';

    // The rest of the description depends on whether or not we want to include information about temperature.
    // Temperature information is included if elected by the user in the UI while the sun is shining. Describing
    // temperature while the sun is not shining can create confusing descriptions where the concentration is high
    // but the temperature is still low.
    if ( ( surfaceTemperatureVisible || surfaceThermometerVisible ) && sunIsShining ) {
      patternString = summaryWithTemperaturePatternString;

      // Portion that generates the temperature description. If the thermometer is visible, it will include a
      // quantitative description of the temperature. If user has elected to view the temperature in another
      // representation we include a qualitative description of the temperature.
      const qualitativeTemperatureDescriptionString = TemperatureDescriber.getQualitativeTemperatureDescriptionString( surfaceTemperatureKelvin );
      const quantitativeTemperatureDescriptionString = TemperatureDescriber.getQuantitativeTemperatureDescription( surfaceTemperatureKelvin, temperatureUnits );

      let temperatureFragmentString = '';
      if ( surfaceTemperatureVisible && surfaceThermometerVisible ) {
        temperatureFragmentString = StringUtils.fillIn( qualitativeAndQuantitativeTemperatureDescriptionPatternString, {
          qualitativeDescription: qualitativeTemperatureDescriptionString,
          quantitativeDescription: quantitativeTemperatureDescriptionString
        } );
      }
      else if ( surfaceTemperatureVisible ) {
        temperatureFragmentString = qualitativeTemperatureDescriptionString;
      }
      else {
        temperatureFragmentString = quantitativeTemperatureDescriptionString;
      }

      const temperatureDescriptionString = StringUtils.fillIn( surfaceTemperaturePatternString, {
        temperatureDescription: temperatureFragmentString
      } );

      // assemble the final description including temperature information
      descriptionString = StringUtils.fillIn( patternString, {
        currentlyDescription: currentlyDescriptionString,
        concentrationDescription: concentrationDescriptionString,
        temperatureDescription: temperatureDescriptionString,
        skyDescription: skyDescriptionString
      } );
    }
    else {

      // assemble the final description without temperature information
      patternString = summaryWithoutTemperaturePatternString;
      descriptionString = StringUtils.fillIn( patternString, {
        currentlyDescription: currentlyDescriptionString,
        concentrationDescription: concentrationDescriptionString,
        skyDescription: skyDescriptionString
      } );
    }

    return descriptionString;
  }
}

greenhouseEffect.register( 'WavesScreenSummaryContentNode', WavesScreenSummaryContentNode );
export default WavesScreenSummaryContentNode;
