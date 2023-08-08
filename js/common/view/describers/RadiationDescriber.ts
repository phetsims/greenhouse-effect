// Copyright 2021-2023, University of Colorado Boulder

/**
 * Responsible for generating the descriptions related to radiation in this simulation.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import GroundLayer from '../../model/GroundLayer.js';
import TemperatureDescriber from './TemperatureDescriber.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../model/ConcentrationModel.js';
import ConcentrationDescriber from './ConcentrationDescriber.js';

const infraredEmissionIntensityPatternStringProperty = GreenhouseEffectStrings.a11y.infraredEmissionIntensityPatternStringProperty;
const infraredEmissionIntensityWithRedirectionPatternStringProperty = GreenhouseEffectStrings.a11y.infraredEmissionIntensityWithRedirectionPatternStringProperty;
const sunlightStartedStringProperty = GreenhouseEffectStrings.a11y.sunlightStartedStringProperty;
const sunlightStartedSimPausedStringProperty = GreenhouseEffectStrings.a11y.sunlightStartedSimPausedStringProperty;

class RadiationDescriber {

  public constructor() {

    // At the time of this writing (Aug 2023), there are only static usages of this type, so the constructor has been
    // disallowed.  If state is ever needed, feel free to change this.  See
    // https://github.com/phetsims/greenhouse-effect/issues/339.
    assert && assert( false, 'Intended, at least originally, to only be used statically.' );
  }

  /**
   * Generates a description of the changing radiation as it is redirected with changing concentrations. Will return
   * something like
   * "More infrared radiation redirecting back to surface." or
   * "Less infrared radiation redirecting back to surface." or
   * "No infrared radiation redirecting back to surface."
   */
  public static getRadiationRedirectionDescription( newConcentration: number, oldConcentration: number ): string | null {
    return RadiationDescriber.getRadiationChangeDescription(
      GreenhouseEffectStrings.a11y.infraredRadiationRedirectingPatternStringProperty.value,
      newConcentration,
      oldConcentration,
      true // describe when no concentration is redirected from atmosphere
    );
  }

  /**
   * Generates a description of the change in radiation being emitting from the earth surface. Will return something like
   * "More infrared radiation emitting from surface." or
   * "Less infrared radiation emitting from surface.".
   */
  public static getRadiationFromSurfaceChangeDescription( newConcentration: number, oldConcentration: number ): string | null {
    return RadiationDescriber.getRadiationChangeDescription(
      GreenhouseEffectStrings.a11y.infraredRadiationEmittedFromSurfacePatternStringProperty.value,
      newConcentration,
      oldConcentration
    );
  }

  /**
   * Generates a description for the changing radiation. Depending on the provided string patterns, will return
   * something like:
   * "More infrared radiation emitting from surface." or
   * "Less infrared radiation redirecting back to surface." or
   * "No infrared radiation redirecting back to surface".
   *
   * @param patternString - Must have a 'change' param to fill in
   * @param newConcentration
   * @param oldConcentration
   * @param describeNoConcentration - If true, 'no' concentration case will be described. Otherwise, reaching zero
   *                                  concentration will be described as 'less'.
   */
  private static getRadiationChangeDescription( patternString: string, newConcentration: number, oldConcentration: number, describeNoConcentration?: boolean ): string | null {
    let response = null;

    if ( newConcentration !== oldConcentration ) {
      let changeString: string;
      if ( describeNoConcentration && newConcentration === 0 ) {
        changeString = GreenhouseEffectStrings.a11y.noStringProperty.value;
      }
      else {
        changeString = newConcentration > oldConcentration ?
                       GreenhouseEffectStrings.a11y.moreStringProperty.value :
                       GreenhouseEffectStrings.a11y.lessStringProperty.value;
      }
      response = StringUtils.fillIn( patternString, {
        moreOrLess: changeString
      } );
    }

    return response;
  }

  private static getRedirectedInfraredDescription( concentration: number,
                                                   concentrationControlMode: ConcentrationDate,
                                                   date: ConcentrationDate ): string {

    // Get the description from the concentration describer, since the amount of IR that is redirected it completely
    // dependent on the concentration level.
    const qualitativeDescriptionOfRedirection = concentrationControlMode === ConcentrationControlMode.BY_VALUE ?
                                                ConcentrationDescriber.getQualitativeConcentrationDescription( concentration ) :
                                                ConcentrationDescriber.getHistoricalQualitativeConcentrationDescription( date );

    return StringUtils.capitalize( StringUtils.fillIn( GreenhouseEffectStrings.a11y.amountOfPatternStringProperty, {
      qualitativeDescription: qualitativeDescriptionOfRedirection
    } ) );
  }

  /**
   * Gets a description of the infrared radiation intensity at the surface, and the intensity of radiation redirected
   * back to the surface. The intensity of radiation emitted from the surface is directly correlated with the surface
   * temperature. Will return something like:
   * "Infrared waves emit with high intensity from surface and travel to space." or
   * "Infrared waves emit with low intensity from surface and travel to space. Low amount of infrared energy is
   * redirected back to surface."
   */
  public static getInfraredRadiationIntensityDescription( surfaceTemperature: number,
                                                          concentrationControlMode: ConcentrationControlMode,
                                                          date: ConcentrationDate,
                                                          concentration: number ): string | null {
    let radiationIntensityDescription = null;

    if ( surfaceTemperature > GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE ) {
      const intensityDescription = TemperatureDescriber.getQualitativeTemperatureDescriptionString(
        surfaceTemperature,
        concentrationControlMode,
        date
      );

      radiationIntensityDescription = StringUtils.fillIn( infraredEmissionIntensityPatternStringProperty, {
        value: intensityDescription
      } );

      if ( concentration > 0 ) {
        radiationIntensityDescription = StringUtils.fillIn(
          infraredEmissionIntensityWithRedirectionPatternStringProperty,
          {
            surfaceEmission: radiationIntensityDescription,
            value: RadiationDescriber.getRedirectedInfraredDescription( concentration, concentrationControlMode, date )
          }
        );
      }
    }

    return radiationIntensityDescription;
  }

  /**
   * Get a description of the sunlight traveling from space, and potentially if clouds reflect some of that radiation
   * back to space.
   */
  public static getSunlightTravelDescription( includeCloudReflection: boolean,
                                              includeGlacierReflection: boolean ): string {

    let descriptionString;
    if ( !includeCloudReflection && !includeGlacierReflection ) {
      descriptionString = GreenhouseEffectStrings.a11y.sunlightWavesTravelFromSpaceStringProperty.value;
    }
    else if ( includeCloudReflection && !includeGlacierReflection ) {
      descriptionString = StringUtils.fillIn( GreenhouseEffectStrings.a11y.sunlightAndReflectionPatternStringProperty, {
        sunlightDescription: GreenhouseEffectStrings.a11y.sunlightWavesTravelFromSpaceStringProperty,
        reflectionDescription: GreenhouseEffectStrings.a11y.cloudRefectionStringProperty
      } );
    }
    else if ( !includeCloudReflection && includeGlacierReflection ) {

      // This particular situation should never occur for any length of time because of the way the sim is designed, but
      // it can come up briefly when switching between date and manual control modes, so it can't be entirely ignored.
      descriptionString = '';
    }
    else {
      descriptionString = StringUtils.fillIn( GreenhouseEffectStrings.a11y.sunlightAndReflectionPatternStringProperty, {
        sunlightDescription: GreenhouseEffectStrings.a11y.sunlightWavesTravelFromSpaceStringProperty,
        reflectionDescription: GreenhouseEffectStrings.a11y.cloudAndGlacierRefectionStringProperty
      } );
    }

    return descriptionString;
  }

  /**
   * A description that describes when the sunlight starts in the simulation, with an extra hint
   * when the sim is paused to describe that nothing will happen until animation starts. Returns
   * something like
   *
   * "Sunlight started." or
   * "Sunlight started, sim paused."
   */
  public static getSunlightStartedDescription( isPlaying: boolean ): string {
    return isPlaying ? sunlightStartedStringProperty.value : sunlightStartedSimPausedStringProperty.value;
  }
}

greenhouseEffect.register( 'RadiationDescriber', RadiationDescriber );
export default RadiationDescriber;
