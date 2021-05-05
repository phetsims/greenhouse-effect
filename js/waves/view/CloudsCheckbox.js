// Copyright 2021, University of Colorado Boulder

/**
 * A reusable checkbox that enables/disables clouds in the Waves screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

class CloudsCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {BooleanProperty} property - controls whether clouds are visible
   * @param {Object} [options]
   */
  constructor( property, options ) {

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, 15, 15, {
      fill: 'rgb(17,209,243)'
    } );

    super( greenhouseEffectStrings.clouds, property, {
      iconNode: iconNode
    } );
  }
}

greenhouseEffect.register( 'CloudsCheckbox', CloudsCheckbox );
export default CloudsCheckbox;
