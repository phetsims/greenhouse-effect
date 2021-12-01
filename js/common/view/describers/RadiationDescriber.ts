// Copyright 2021, University of Colorado Boulder

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
    let response = null;

    if ( newConcentration !== oldConcentration ) {
      const moreOrLessString = newConcentration > oldConcentration ? greenhouseEffectStrings.a11y.more : greenhouseEffectStrings.a11y.less;

      if ( this.model.surfaceThermometerVisibleProperty.value ) {
        response = StringUtils.fillIn( greenhouseEffectStrings.a11y.infraredRadiationRedirectedWithTemperaturePattern, {
          moreOrLess: moreOrLessString,
          quantitativeTemperature: TemperatureDescriber.getQuantitativeTemperatureDescription(
            this.model.surfaceTemperatureKelvinProperty.value,
            this.model.temperatureUnitsProperty.value
          )
        } );
      }
      else {
        response = StringUtils.fillIn( greenhouseEffectStrings.a11y.infraredRadiationRedirectedPattern, {
          moreOrLess: moreOrLessString
        } );
      }
    }

    console.log( response );
    return response;
  }
}

greenhouseEffect.register( 'RadiationDescriber', RadiationDescriber );
export default RadiationDescriber;
