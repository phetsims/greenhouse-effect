// Copyright 2021, University of Colorado Boulder

/**
 * Checkbox that controls whether the surface temperature is displayed in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

class SurfaceTemperatureCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {BooleanProperty} property - controls whether surface temperature is displayed
   * @param {Tandem} tandem
   */
  constructor( property, tandem ) {

    const iconWidth = 15;

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, iconWidth, iconWidth, {
      fill: new LinearGradient( 0, 0, 0, iconWidth )
        .addColorStop( 0.1, PhetColorScheme.RED_COLORBLIND )
        .addColorStop( 0.7, '#22CC00' )
        .addColorStop( 1, '#1A9900' )
    } );

    super( greenhouseEffectStrings.showSurfaceTemperature, property, {
      iconNode: iconNode,

      // pdom
      helpText: greenhouseEffectStrings.a11y.showSurfaceTemperature.helpText,

      // phetio
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'SurfaceTemperatureCheckbox', SurfaceTemperatureCheckbox );
export default SurfaceTemperatureCheckbox;
