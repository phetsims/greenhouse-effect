// Copyright 2022, University of Colorado Boulder

/**
 * A describer that is responsible for generating description strings for the flux detected by the flux meter.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';

const increasesStringProperty = GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.nearSurfaceStringProperty;

class FluxMeterDescriber {

  /**
   * Returns a string that describes the measurement made by the flux meter and the height of its sensor.
   *
   * Example:
   *   "At low altitude, high amount of incoming sunlight and low amount of outgoing sunlight. High amount of outgoing
   *    infrared and low amount of incoming infrared."
   */
  public static getFluxDescription(): string | null {
    let descriptionString = 'I describe, therefore I am';

    descriptionString += `: ${increasesStringProperty.value}`;

    return descriptionString;
  }
}

greenhouseEffect.register( 'FluxMeterDescriber', FluxMeterDescriber );
export default FluxMeterDescriber;
