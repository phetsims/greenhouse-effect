// Copyright 2021, University of Colorado Boulder

/**
 * A reusable checkbox that enables/disables the cloud in the Waves screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

class CloudCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {BooleanProperty} property - controls whether the cloud is visible
   * @param {Object} [options]
   */
  constructor( property, options ) {

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, 15, 15, {
      fill: 'rgb(17,209,243)'
    } );

    super( greenhouseEffectStrings.cloud, property, {
      iconNode: iconNode,
      helpText: greenhouseEffectStrings.a11y.cloudCheckboxHelpText
    } );
  }
}

greenhouseEffect.register( 'CloudCheckbox', CloudCheckbox );
export default CloudCheckbox;
