// Copyright 2023, University of Colorado Boulder

/**
 * A class that manages PDOM structure and content for the screen descriptions for the "Landscape" screens
 * (Waves and Photons screens at this time).
 */

import GreenhouseEffectScreenSummaryContentNode from './GreenhouseEffectScreenSummaryContentNode.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';

// constants
const currentlyStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.currentlyStringProperty;
const currentlySimIsPausedStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.currentlySimIsPausedStringProperty;
const currentlyNoSunlightStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.currentlyNoSunlightStringProperty;
const currentlySimIsPausedNoSunlightStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.currentlySimIsPausedNoSunlightStringProperty;
const summaryWithTemperaturePatternStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.summaryWithTemperaturePatternStringProperty;
const summaryWithoutTemperaturePatternStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.summaryWithoutTemperaturePatternStringProperty;
const surfaceTemperaturePatternStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.surfaceTemperaturePatternStringProperty;
const qualitativeAndQuantitativeTemperatureDescriptionPatternStringProperty = GreenhouseEffectStrings.a11y.waves.screenSummary.qualitativeAndQuantitativeTemperatureDescriptionPatternStringProperty;

export default class LandscapeScreenSummaryContentNode extends GreenhouseEffectScreenSummaryContentNode {
  public constructor( model: ConcentrationModel, playAreaDescription: LocalizedStringProperty, controlAreaDescription: LocalizedStringProperty ) {
    super( model, playAreaDescription, controlAreaDescription );

    Multilink.multilink(
      [
        model.sunEnergySource.isShiningProperty,
        model.isPlayingProperty,
        model.concentrationProperty,
        model.dateProperty,
        model.surfaceTemperatureKelvinProperty,
        model.concentrationControlModeProperty,
        model.surfaceTemperatureVisibleProperty,
        model.surfaceThermometerVisibleProperty,
        model.temperatureUnitsProperty,
        model.cloudEnabledInManualConcentrationModeProperty
      ],
      (
        sunIsShining,
        isPlaying,
        concentration,
        date,
        surfaceTemperatureKelvin,
        concentrationControlMode,
        surfaceTemperatureVisible,
        surfaceThermometerVisible,
        temperatureUnits,
        cloudEnabled
      ) => {
        this.simStateDescriptionNode.innerContent = this.getScreenDescriptionString(
          sunIsShining,
          isPlaying,
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
   * "Currently, no sunlight in observation window; the time period is the year twenty-twenty. The sky is cloudy." or
   * "Currently, max levels of greenhouse gases in atmosphere. Earth’s surface temperature is very high, 22 degrees
   * Celsius. The sky is cloudy."
   */
  private getScreenDescriptionString( sunIsShining: boolean,
                                      isPlaying: boolean,
                                      concentration: number,
                                      date: ConcentrationDate,
                                      surfaceTemperatureKelvin: number,
                                      concentrationControlMode: ConcentrationControlMode,
                                      surfaceTemperatureVisible: boolean,
                                      surfaceThermometerVisible: boolean,
                                      temperatureUnits: TemperatureUnits,
                                      cloudEnabled: boolean ): string {

    // the final description
    let descriptionString;

    // the leading portion of the summary may include an extra hint that sunlight isn't shining yet or that
    // the sim is paused
    const currentlyDescriptionString = ( sunIsShining && isPlaying ) ? currentlyStringProperty.value :
                                       ( sunIsShining && !isPlaying ) ? currentlySimIsPausedStringProperty.value :
                                       ( !sunIsShining && isPlaying ) ? currentlyNoSunlightStringProperty.value :
                                       currentlySimIsPausedNoSunlightStringProperty;

    // portion that describes the state of the sky
    const skyDescriptionString = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );

    // portion that describes the state of the concentration in the atmosphere
    let concentrationDescriptionString;
    if ( concentrationControlMode === ConcentrationControlMode.BY_VALUE ) {

      // If sun is shining and sim is playing, capitalize because this will be read after "Currently, ", otherwise
      // the concentration description will start the sentence.
      const capitalize = !( sunIsShining && isPlaying );
      concentrationDescriptionString = ConcentrationDescriber.getConcentrationDescriptionWithValue( concentration, capitalize );
    }
    else {

      // capitalize because it will be its own sentence in this content
      concentrationDescriptionString = ConcentrationDescriber.getFullTimePeriodDescription( date, true );
    }

    let patternString;

    // The rest of the description depends on whether we want to include information about temperature.
    // Temperature information is included if elected by the user in the UI while the sun is shining. Describing
    // temperature while the sun is not shining can create confusing descriptions where the concentration is high
    // but the temperature is still low.
    if ( ( surfaceTemperatureVisible || surfaceThermometerVisible ) && sunIsShining ) {
      patternString = summaryWithTemperaturePatternStringProperty.value;

      // Portion that generates the temperature description. If the thermometer is visible, it will include a
      // quantitative description of the temperature. If user has elected to view the temperature in another
      // representation we include a qualitative description of the temperature.
      const qualitativeTemperatureDescriptionString = TemperatureDescriber.getQualitativeTemperatureDescriptionString(
        surfaceTemperatureKelvin,
        concentrationControlMode,
        date
      );
      const quantitativeTemperatureDescriptionString = TemperatureDescriber.getQuantitativeTemperatureDescription(
        surfaceTemperatureKelvin,
        temperatureUnits
      );

      let temperatureFragmentString;
      if ( surfaceTemperatureVisible && surfaceThermometerVisible ) {
        temperatureFragmentString = StringUtils.fillIn(
          qualitativeAndQuantitativeTemperatureDescriptionPatternStringProperty.value,
          {
            qualitativeDescription: qualitativeTemperatureDescriptionString,
            quantitativeDescription: quantitativeTemperatureDescriptionString
          }
        );
      }
      else if ( surfaceTemperatureVisible ) {
        temperatureFragmentString = qualitativeTemperatureDescriptionString;
      }
      else {
        temperatureFragmentString = quantitativeTemperatureDescriptionString;
      }

      const temperatureDescriptionString = StringUtils.fillIn( surfaceTemperaturePatternStringProperty, {
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
      patternString = summaryWithoutTemperaturePatternStringProperty.value;
      descriptionString = StringUtils.fillIn( patternString, {
        currentlyDescription: currentlyDescriptionString,
        concentrationDescription: concentrationDescriptionString,
        skyDescription: skyDescriptionString
      } );
    }

    return descriptionString;
  }
}

greenhouseEffect.register( 'LandscapeScreenSummaryContentNode', LandscapeScreenSummaryContentNode );