// Copyright 2021-2025, University of Colorado Boulder

/**
 * Responsible for generating the descriptions related to radiation in this simulation.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../../GreenhouseEffectFluent.js';
import { ConcentrationDate } from '../../model/ConcentrationModel.js';
import GroundLayer from '../../model/GroundLayer.js';
import EnergyRepresentation from '../EnergyRepresentation.js';
import ConcentrationDescriber from './ConcentrationDescriber.js';
import TemperatureDescriber from './TemperatureDescriber.js';

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
  public static getRadiationRedirectionDescription( newConcentration: number,
                                                    oldConcentration: number,
                                                    energyRepresentation: EnergyRepresentation ): string | null {

    return RadiationDescriber.getRadiationChangeDescription(
      GreenhouseEffectFluent.a11y.infraredEnergyRedirectingPatternStringProperty.value,
      newConcentration,
      oldConcentration,
      energyRepresentation,
      true // describe when no concentration is redirected from atmosphere
    );
  }

  /**
   * Generates a description of the change in radiation being emitting from the earth surface. Will return something like
   * "More infrared radiation emitting from surface." or
   * "Less infrared radiation emitting from surface.".
   */
  public static getRadiationFromSurfaceChangeDescription( newConcentration: number,
                                                          oldConcentration: number,
                                                          energyRepresentation: EnergyRepresentation ): string | null {

    return RadiationDescriber.getRadiationChangeDescription(
      GreenhouseEffectFluent.a11y.infraredEnergyEmittedFromSurfacePatternStringProperty.value,
      newConcentration,
      oldConcentration,
      energyRepresentation
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
   * @param energyRepresentation - Is the energy represented as a photon or wave?
   */
  private static getRadiationChangeDescription( patternString: string,
                                                newConcentration: number,
                                                oldConcentration: number,
                                                energyRepresentation: EnergyRepresentation,
                                                describeNoConcentration = false ): string | null {
    let response = null;

    if ( newConcentration !== oldConcentration ) {
      let changeString: string;
      if ( describeNoConcentration && newConcentration === 0 ) {
        changeString = GreenhouseEffectFluent.a11y.noStringProperty.value;
      }
      else {

        if ( newConcentration > oldConcentration ) {
          changeString = GreenhouseEffectFluent.a11y.moreStringProperty.value;
        }
        else {

          changeString = energyRepresentation === EnergyRepresentation.PHOTON ?
                         GreenhouseEffectFluent.a11y.fewerStringProperty.value :
                         GreenhouseEffectFluent.a11y.lessStringProperty.value;
        }
      }

      response = StringUtils.fillIn( patternString, {
        changeDescription: changeString,
        energyRepresentation: energyRepresentation === EnergyRepresentation.PHOTON ?
                              GreenhouseEffectFluent.a11y.energyRepresentation.photonsStringProperty :
                              GreenhouseEffectFluent.a11y.energyRepresentation.radiationStringProperty
      } );
    }

    return response;
  }

  private static getRedirectedInfraredDescription( concentration: number,
                                                   useHistoricalDescription: boolean,
                                                   date: ConcentrationDate,
                                                   energyRepresentation: EnergyRepresentation ): string {

    // Get the description from the concentration describer, since the amount of IR that is redirected is completely
    // dependent on the concentration level.
    const qualitativeDescriptionOfRedirection = useHistoricalDescription ?
                                                ConcentrationDescriber.getHistoricalQualitativeConcentrationDescription( date ) :
                                                ConcentrationDescriber.getQualitativeConcentrationDescription( concentration );

    const enclosingPhraseProperty = energyRepresentation === EnergyRepresentation.WAVE ?
                                    GreenhouseEffectFluent.a11y.amountOfPatternStringProperty :
                                    GreenhouseEffectFluent.a11y.proportionOfPatternStringProperty;

    return StringUtils.capitalize( StringUtils.fillIn( enclosingPhraseProperty, {
      qualitativeDescription: qualitativeDescriptionOfRedirection
    } ) );
  }

  /**
   * Gets a description of the infrared radiation intensity at the surface, and the intensity of radiation redirected
   * back to the surface by the atmosphere. The intensity of radiation emitted from the surface is directly correlated
   * with the surface temperature. Will return something like:
   * "Infrared waves emit with high intensity from surface and travel to space." or
   * "A low amount of infrared photons emit from surface and travel to space. Moderate proportion of infrared photons
   * are redirecting back to surface."
   */
  public static getInfraredRadiationIntensityDescription( surfaceTemperature: number,
                                                          useHistoricalDescription: boolean,
                                                          useExtendedMapping: boolean,
                                                          date: ConcentrationDate,
                                                          concentration: number,
                                                          energyRepresentation: EnergyRepresentation ): string | null {
    let radiationIntensityDescription = null;

    if ( surfaceTemperature > GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE ) {

      radiationIntensityDescription = RadiationDescriber.getInfraredSurfaceEmissionDescription(
        surfaceTemperature, energyRepresentation, useHistoricalDescription, useExtendedMapping
      );

      const irDescriptionWithRedirectionPatternProperty = energyRepresentation === EnergyRepresentation.WAVE ?
                                                          GreenhouseEffectFluent.a11y.waves.observationWindow.infraredEmissionIntensityWithRedirectionPatternStringProperty :
                                                          GreenhouseEffectFluent.a11y.photons.observationWindow.infraredEmissionIntensityWithRedirectionPatternStringProperty;

      if ( concentration > 0 ) {

        radiationIntensityDescription = StringUtils.fillIn( irDescriptionWithRedirectionPatternProperty, {
            surfaceEmission: radiationIntensityDescription,
            value: RadiationDescriber.getRedirectedInfraredDescription(
              concentration, useHistoricalDescription, date, energyRepresentation
            )
          }
        );
      }
      else if ( energyRepresentation === EnergyRepresentation.PHOTON ) {
        radiationIntensityDescription += ' ' +
                                         GreenhouseEffectFluent.a11y.photons.observationWindow.noOutgoingInfraredStringProperty.value;
      }
    }

    return radiationIntensityDescription;
  }

  /**
   * Gets a description of the IR that is being emitted from the surface.  Example: A low amount of infrared photons
   * emit from surface and travel toward space.
   */
  public static getInfraredSurfaceEmissionDescription( surfaceTemperature: number,
                                                       energyRepresentation: EnergyRepresentation,
                                                       useHistoricalDescription: boolean,
                                                       useExtendedMapping = false ): string {

    const intensityDescription = TemperatureDescriber.getQualitativeTemperatureDescriptionString(
      surfaceTemperature,
      useHistoricalDescription,
      useExtendedMapping
    );

    const irEmissionPatternProperty = energyRepresentation === EnergyRepresentation.WAVE ?
                                      GreenhouseEffectFluent.a11y.waves.observationWindow.infraredEmissionIntensityPatternStringProperty :
                                      GreenhouseEffectFluent.a11y.infraredEmissionIntensityPatternStringProperty;

    return StringUtils.capitalize( StringUtils.fillIn( irEmissionPatternProperty, { value: intensityDescription } ) );
  }

  /**
   * Get a description of the sunlight traveling from space, and potentially if clouds reflect some of that radiation
   * back to space.
   */
  public static getSunlightTravelDescription( includeCloudReflection: boolean,
                                              includeGlacierReflection: boolean,
                                              energyRepresentation: EnergyRepresentation ): string {

    // Use somewhat different wording when representing light using waves versus photons.
    const sunlightDescriptionProperty = energyRepresentation === EnergyRepresentation.WAVE ?
                                        GreenhouseEffectFluent.a11y.waves.observationWindow.sunlightWavesTravelFromSpaceStringProperty :
                                        GreenhouseEffectFluent.a11y.photons.observationWindow.sunlightPhotonsDescriptionStringProperty;

    let descriptionString;
    if ( !includeCloudReflection && !includeGlacierReflection ) {
      descriptionString = sunlightDescriptionProperty.value;
    }
    else if ( includeCloudReflection && !includeGlacierReflection ) {
      descriptionString = StringUtils.fillIn( GreenhouseEffectFluent.a11y.sunlightAndReflectionPatternStringProperty, {
        sunlightDescription: sunlightDescriptionProperty,
        reflectionDescription: GreenhouseEffectFluent.a11y.cloudRefectionStringProperty
      } );
    }
    else if ( !includeCloudReflection && includeGlacierReflection ) {

      // This particular situation should never occur for any length of time because of the way the sim is designed, but
      // it can come up briefly when switching between date and manual control modes, so it can't be entirely ignored.
      descriptionString = '';
    }
    else {
      descriptionString = StringUtils.fillIn( GreenhouseEffectFluent.a11y.sunlightAndReflectionPatternStringProperty, {
        sunlightDescription: sunlightDescriptionProperty,
        reflectionDescription: GreenhouseEffectFluent.a11y.cloudAndGlacierRefectionStringProperty
      } );
    }

    return descriptionString;
  }
}

greenhouseEffect.register( 'RadiationDescriber', RadiationDescriber );
export default RadiationDescriber;