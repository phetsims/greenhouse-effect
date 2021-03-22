// Copyright 2021, University of Colorado Boulder

/**
 * A reusable checkbox that enables/disables clouds in the Waves screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GreenhouseEffectIconCheckbox from '../../common/view/GreenhouseEffectIconCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

class CloudsCheckbox extends GreenhouseEffectIconCheckbox {

  /**
   * @param {BooleanProperty} property - controls whether clouds are visible
   * @param {Object} [options]
   */
  constructor( property, options ) {

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, 15, 15, {
      fill: 'rgb(17,209,243)'
    } );

    super( greenhouseEffectStrings.clouds, iconNode, property );
  }
}

greenhouseEffect.register( 'CloudsCheckbox', CloudsCheckbox );
export default CloudsCheckbox;
