// Copyright 2021, University of Colorado Boulder

/**
 * A reusable checkbox that controls whether the surface thermometer is shown, with label and icon.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class SurfaceThermometerCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {Property.<boolean>} property
   * @param {Tandem} tandem
   */
  constructor( property: Property<boolean>, tandem: Tandem ) {
    const iconNode = new ThermometerNode( 0, 5, new NumberProperty( 2 ), { scale: 0.2 } );
    super( greenhouseEffectStrings.surfaceThermometer, property, {
      iconNode: iconNode,

      // pdom
      helpText: greenhouseEffectStrings.a11y.surfaceThermometer.helpText,

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'SurfaceThermometerCheckbox', SurfaceThermometerCheckbox );
export default SurfaceThermometerCheckbox;
