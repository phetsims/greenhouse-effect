// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating the descriptions related to radiation in this simulation.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';
import GroundLayer from '../../model/GroundLayer.js';
import LayersModel from '../../model/LayersModel.js';
import TemperatureDescriber from './TemperatureDescriber.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../../model/ConcentrationModel.js';

const infraredRedirectionNoString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.no;
const infraredRedirectionVeryLowString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.veryLow;
const infraredRedirectionLowString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.low;
const infraredRedirectionModerateString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.moderate;
const infraredRedirectionHighString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.high;
const infraredRedirectionVeryHighString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.veryHigh;
const infraredRedirectionMaxString = greenhouseEffectStrings.a11y.infraredRedirectionDescriptions.max;

const infraredEmissionIntensityPatternString = greenhouseEffectStrings.a11y.infraredEmissionIntensityPattern;
const infraredEmissionIntensityWithRedirectionPatternString = greenhouseEffectStrings.a11y.infraredEmissionIntensityWithRedirectionPattern;

// Descriptions for the intensity of infrared radiation redirection, excluding the extrema when there is max or no
// radiation being redirected
const nonExtremeInfraredRadiationDescriptionStrings = [
  infraredRedirectionVeryLowString,
  infraredRedirectionLowString,
  infraredRedirectionModerateString,
  infraredRedirectionHighString,
  infraredRedirectionVeryHighString
];

class RadiationDescriber {
  private readonly model: LayersModel;

  constructor( model: LayersModel ) {
    this.model = model;
  }

  /**
   * Generates a description of the changing radiation as it is redirected with changing concentrations. Will return
   * something like
   * "More infrared radiation redirecting back to surface." or
   * "Less infrared radiation redirecting back to surface."
   */
  public static getRadiationRedirectionDescription( newConcentration: number, oldConcentration: number ): string | null {
    return RadiationDescriber.getRadiationChangeDescription(
      greenhouseEffectStrings.a11y.infraredRadiationRedirectingPattern,
      newConcentration,
      oldConcentration
    );
  }

  /**
   * Generates a description of the change in radiation being emitting from the earth surface. Will return something like
   * "More infrared radiation emitting from surface." or
   * "Less infrared radiation emitting from surface.".
   */
  public static getRadiationFromSurfaceChangeDescription( newConcentration: number, oldConcentration: number ): string | null {
    return RadiationDescriber.getRadiationChangeDescription(
      greenhouseEffectStrings.a11y.infraredRadiationEmittedFromSurfacePattern,
      newConcentration,
      oldConcentration
    );
  }

  /**
   * Generates a description for the changing radiation. Depending on the provided string patterns, will return
   * something like:
   * "More infrared radiation emitting from surface." or
   * "Less infrared radiation redirecting back to surface."
   */
  private static getRadiationChangeDescription( patternString: string, newConcentration: number, oldConcentration: number ): string | null {
    let response = null;

    if ( newConcentration !== oldConcentration ) {
      const moreOrLessString = newConcentration > oldConcentration ? greenhouseEffectStrings.a11y.more : greenhouseEffectStrings.a11y.less;
      response = StringUtils.fillIn( patternString, {
        moreOrLess: moreOrLessString
      } );
    }

    return response;
  }

  private static getRedirectedInfraredDescription( concentration: number ): string {
    let descriptionString = '';

    // if at the extreme values (and only at extreme values), unique descriptions are used
    if ( concentration === ConcentrationModel.CONCENTRATION_RANGE.min ) {
      descriptionString = infraredRedirectionNoString;
    }
    else if ( concentration === ConcentrationModel.CONCENTRATION_RANGE.max ) {
      descriptionString = infraredRedirectionMaxString;
    }
    else {

      // otherwise, the concentration strings are evenly divided along the range of non-extreme strings
      const concentrationRange = ConcentrationModel.CONCENTRATION_RANGE;
      const delta = concentrationRange.getLength() / nonExtremeInfraredRadiationDescriptionStrings.length;
      for ( let i = 0; i < nonExtremeInfraredRadiationDescriptionStrings.length; i++ ) {
        if ( concentration < concentrationRange.min + delta * ( i + 1 ) ) {
          descriptionString = nonExtremeInfraredRadiationDescriptionStrings[ i ];
          break;
        }
      }
    }

    assert && assert( descriptionString !== '', `no description for concentration value: ${concentration}` );
    return descriptionString;
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

      radiationIntensityDescription = StringUtils.fillIn( infraredEmissionIntensityPatternString, {
        value: intensityDescription
      } );

      if ( concentration > 0 ) {
        radiationIntensityDescription = StringUtils.fillIn( infraredEmissionIntensityWithRedirectionPatternString, {
          surfaceEmission: radiationIntensityDescription,
          value: RadiationDescriber.getRedirectedInfraredDescription( concentration )
        } );
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

    assert && assert(
      !( includeGlacierReflection && !includeCloudReflection ),
      'the permutation where the glacier is present and the cloud is not is not expected to occur'
    );

    let descriptionString = '';
    if ( !includeCloudReflection && !includeGlacierReflection ) {
      descriptionString = greenhouseEffectStrings.a11y.sunlightWavesTravelFromSpace;
    }
    else if ( includeCloudReflection && !includeGlacierReflection ) {
      descriptionString = StringUtils.fillIn( greenhouseEffectStrings.a11y.sunlightAndReflectionPattern, {
        sunlightDescription: greenhouseEffectStrings.a11y.sunlightWavesTravelFromSpace,
        reflectionDescription: greenhouseEffectStrings.a11y.cloudRefection
      } );
    }
    else {
      descriptionString = StringUtils.fillIn( greenhouseEffectStrings.a11y.sunlightAndReflectionPattern, {
        sunlightDescription: greenhouseEffectStrings.a11y.sunlightWavesTravelFromSpace,
        reflectionDescription: greenhouseEffectStrings.a11y.cloudAndGlacierRefection
      } );
    }

    return descriptionString;
  }
}

greenhouseEffect.register( 'RadiationDescriber', RadiationDescriber );
export default RadiationDescriber;
