// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating the descriptions related to radiation in this simulation.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';
import LayersModel from '../../model/LayersModel.js';
import TemperatureDescriber from './TemperatureDescriber.js';

class RadiationDescriber {
  private readonly model: LayersModel;

  constructor( model: LayersModel ) {
    this.model = model;
  }

  /**
   * Generates a description of the changing radiation as it is redirected with changing concentrations. Will return
   * something like
   * "more infrared radiation redirected back to surface." or
   * "less infrared radiation redirected back to surface, now 248.9 Kelvin."
   */
  public getRadiationRedirectionDescription( newConcentration: number, oldConcentration: number ): string | null {
    return this.getRadiationChangeDescription(
      greenhouseEffectStrings.a11y.infraredRadiationRedirectedPattern,
      greenhouseEffectStrings.a11y.infraredRadiationRedirectedWithTemperaturePattern,
      newConcentration,
      oldConcentration
    );
  }

  /**
   * Generates a description of the change in radiation being emitted from the earth surface. Will return something like
   * "more infrared radiation emitted from surface." or
   * "less infrared radiation emitted from surface, now 248.9 Kelvin".
   */
  private getRadiationFromSurfaceChangeDescription( newConcentration: number, oldConcentration: number ): string | null {
    return this.getRadiationChangeDescription(
      greenhouseEffectStrings.a11y.infraredRadiationEmittedFromSurfacePattern,
      greenhouseEffectStrings.a11y.infraredRadiationEmittedFromSurfaceWithTemperaturePattern,
      newConcentration,
      oldConcentration
    );
  }

  /**
   * Generates a description for the changing radiation. Depending on the provided string patterns, will return
   * something like:
   * "More infrared radiation emitted from surface." or
   * "Less infrared radiation redirected back to surface, now 248.9 Kelvin"
   *
   * @param patternString - Pattern string to describe change in radiation
   * @param patternWithTemperatureString - Pattern string with information about temperature, if temperature is shown
   * @param newConcentration
   * @param oldConcentration
   */
  private getRadiationChangeDescription( patternString: string, patternWithTemperatureString: string, newConcentration: number, oldConcentration: number ): string | null {
    let response = null;

    if ( newConcentration !== oldConcentration ) {
      const moreOrLessString = newConcentration > oldConcentration ? greenhouseEffectStrings.a11y.more : greenhouseEffectStrings.a11y.less;

      if ( this.model.surfaceThermometerVisibleProperty.value ) {
        response = StringUtils.fillIn( patternWithTemperatureString, {
          moreOrLess: moreOrLessString,
          quantitativeTemperature: TemperatureDescriber.getQuantitativeTemperatureDescription(
            this.model.surfaceTemperatureKelvinProperty.value,
            this.model.temperatureUnitsProperty.value
          )
        } );
      }
      else {
        response = StringUtils.fillIn( patternString, {
          moreOrLess: moreOrLessString
        } );
      }
    }

    return response;
  }
}

greenhouseEffect.register( 'RadiationDescriber', RadiationDescriber );
export default RadiationDescriber;
