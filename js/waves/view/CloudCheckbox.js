// Copyright 2021, University of Colorado Boulder

/**
 * A checkbox that is linked to a count of the number of active clouds, and sets the number of clouds to either 0 or 1
 * based on the state of the checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

class CloudCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {Property.<boolean>} cloudEnabledProperty - controls whether the cloud is visible
   * @param {Tandem} tandem
   */
  constructor( cloudEnabledProperty, tandem ) {

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, 15, 15, {
      fill: 'rgb(17,209,243)'
    } );

    super( greenhouseEffectStrings.cloud, cloudEnabledProperty, {
      iconNode: iconNode,
      helpText: greenhouseEffectStrings.a11y.cloudCheckboxHelpText,

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'CloudCheckbox', CloudCheckbox );
export default CloudCheckbox;
