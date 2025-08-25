// Copyright 2021-2025, University of Colorado Boulder

/**
 * Wavelength Constants for photons of the PhotonAbsorptionModel
 *
 * @author Jesse Greenberg (Phet Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

const quadWavelengthSelectorInfraredStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.InfraredStringProperty;
const quadWavelengthSelectorMicrowaveStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.MicrowaveStringProperty;
const quadWavelengthSelectorUltravioletStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.UltravioletStringProperty;
const quadWavelengthSelectorVisibleStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.VisibleStringProperty;

// An enumeration describing one of the possible values for the wavelength of a photon.
class Wavelength extends EnumerationValue {
  public static readonly SUNLIGHT = new Wavelength();
  public static readonly MICRO = new Wavelength();
  public static readonly INFRARED = new Wavelength();
  public static readonly VISIBLE = new Wavelength();
  public static readonly ULTRAVIOLET = new Wavelength();
  public static readonly enumeration = new Enumeration( Wavelength );
}

type LightSource = 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight';

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
  getTandemName( wavelength: number ): LightSource {
    if ( wavelength === this.SUNLIGHT_WAVELENGTH ) {
      return 'sunlight';
    }
    if ( wavelength === this.MICRO_WAVELENGTH ) {
      return 'microwave';
    }
    if ( wavelength === this.IR_WAVELENGTH ) {
      return 'infrared';
    }
    if ( wavelength === this.VISIBLE_WAVELENGTH ) {
      return 'visible';
    }
    if ( wavelength === this.UV_WAVELENGTH ) {
      return 'ultraviolet';
    }
    throw new Error( 'Unknown wavelength' );
  },

  /**
   * Given a wavelength, get the name of the lightSource that it belongs too. This is used by a11y to get the correct
   * name of the wavelength in a readable form.
   */
  getLightSourceName( wavelength: number ): string {
    if ( wavelength === this.MICRO_WAVELENGTH ) {
      return quadWavelengthSelectorMicrowaveStringProperty.value;
    }
    if ( wavelength === this.IR_WAVELENGTH ) {
      return quadWavelengthSelectorInfraredStringProperty.value;
    }
    if ( wavelength === this.VISIBLE_WAVELENGTH ) {
      return quadWavelengthSelectorVisibleStringProperty.value;
    }
    if ( wavelength === this.UV_WAVELENGTH ) {
      return quadWavelengthSelectorUltravioletStringProperty.value;
    }
    throw new Error( 'Unknown wavelength' );
  },

  /**
   * Given the wavelength value, map to the correct light source enum.
   */
  getLightSourceEnum( wavelength: number ): Wavelength {
    if ( wavelength === this.MICRO_WAVELENGTH ) {
      return Wavelength.MICRO;
    }
    if ( wavelength === this.IR_WAVELENGTH ) {
      return Wavelength.INFRARED;
    }
    if ( wavelength === this.VISIBLE_WAVELENGTH ) {
      return Wavelength.VISIBLE;
    }
    if ( wavelength === this.UV_WAVELENGTH ) {
      return Wavelength.ULTRAVIOLET;
    }
    throw new Error( 'Unknown wavelength' );
  }
};

greenhouseEffect.register( 'WavelengthConstants', WavelengthConstants );

export default WavelengthConstants;