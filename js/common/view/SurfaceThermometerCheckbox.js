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
import GreenhouseEffectIconCheckbox from './GreenhouseEffectIconCheckbox.js';

class SurfaceThermometerCheckbox extends GreenhouseEffectIconCheckbox {

  /**
   * @param {BooleanProperty} property
   */
  constructor( property ) {
    const iconNode = new ThermometerNode( 0, 5, new NumberProperty( 2 ), { scale: 0.2 } );
    super( greenhouseEffectStrings.surfaceThermometer, iconNode, property );
  }
}

greenhouseEffect.register( 'SurfaceThermometerCheckbox', SurfaceThermometerCheckbox );
export default SurfaceThermometerCheckbox;
