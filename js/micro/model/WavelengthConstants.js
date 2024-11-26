// Copyright 2021-2023, University of Colorado Boulder

/**
 * Wavelength Constants for photons of the PhotonAbsorptionModel
 *
 * @author Jesse Greenberg (Phet Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';

const quadWavelengthSelectorInfraredString = GreenhouseEffectStrings.QuadWavelengthSelector.Infrared;
const quadWavelengthSelectorMicrowaveString = GreenhouseEffectStrings.QuadWavelengthSelector.Microwave;
const quadWavelengthSelectorUltravioletString = GreenhouseEffectStrings.QuadWavelengthSelector.Ultraviolet;
const quadWavelengthSelectorVisibleString = GreenhouseEffectStrings.QuadWavelengthSelector.Visible;

// An enumeration describing one of the possible values for the wavelength of a photon.
class Wavelength extends EnumerationValue {
  static SUNLIGHT = new Wavelength();
  static MICRO = new Wavelength();
  static INFRARED = new Wavelength();
  static VISIBLE = new Wavelength();
  static ULTRAVIOLET = new Wavelength();
  static enumeration = new Enumeration( Wavelength );
}

const WavelengthConstants = {

  // all values in meters
  SUNLIGHT_WAVELENGTH: 400E-9, // Ported from the original JAVA version, but not used in Molecules And Light
  MICRO_WAVELENGTH: 0.2,
  IR_WAVELENGTH: 850E-9,
  VISIBLE_WAVELENGTH: 580E-9,
  UV_WAVELENGTH: 100E-9,
  DEBUG_WAVELENGTH: 1,

  // Given a wavelength, look up the tandem name for an emitter
  // This is required because the simulation is driven by the wavelength value.  If this code is too unmaintainable,
  // we could rewrite the sim to use Emitter instances, each of which has a wavelength and a tandem name
  // See, for example: PhotonEmitterNode
  getTandemName( wavelength ) {
    return wavelength === this.SUNLIGHT_WAVELENGTH ? 'sunlight' :
           wavelength === this.MICRO_WAVELENGTH ? 'microwave' :
           wavelength === this.IR_WAVELENGTH ? 'infrared' :
           wavelength === this.VISIBLE_WAVELENGTH ? 'visible' :
           wavelength === this.UV_WAVELENGTH ? 'ultraviolet' :
           assert( false, 'unknown' );
  },


  /**
   * Given a wavelength, get the name of the lightSource that it belongs too. This is used by a11y to get the correct
   * name of the wavelength in a readable form.
   * @param {number} wavelength
   * @returns {string}
   */
  getLightSourceName( wavelength ) {
    return wavelength === this.MICRO_WAVELENGTH ? quadWavelengthSelectorMicrowaveString :
           wavelength === this.IR_WAVELENGTH ? quadWavelengthSelectorInfraredString :
           wavelength === this.VISIBLE_WAVELENGTH ? quadWavelengthSelectorVisibleString :
           wavelength === this.UV_WAVELENGTH ? quadWavelengthSelectorUltravioletString :
           assert( false, 'unknown' );
  },

  /**
   * Given the wavelength value, map to the correct light source enum.
   * @param wavelength
   * @returns {PhotonTarget|void}
   */
  getLightSourceEnum( wavelength ) {
    return wavelength === this.MICRO_WAVELENGTH ? Wavelength.MICRO :
           wavelength === this.IR_WAVELENGTH ? Wavelength.INFRARED :
           wavelength === this.VISIBLE_WAVELENGTH ? Wavelength.VISIBLE :
           wavelength === this.UV_WAVELENGTH ? Wavelength.ULTRAVIOLET :
           assert( false, 'unknown' );
  }
};

greenhouseEffect.register( 'WavelengthConstants', WavelengthConstants );

export default WavelengthConstants;