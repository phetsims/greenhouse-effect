// Copyright 2021, University of Colorado Boulder

/**
 * Checkbox that controls whether the surface temperature is displayed in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
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
    const halfIconWidth = iconWidth / 2;

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, 15, 15, {
      fill: new RadialGradient( halfIconWidth, halfIconWidth, 0, halfIconWidth, halfIconWidth, 15 )
        .addColorStop( 0, 'rgb(0,255,0)' )
        .addColorStop( 0.5, 'rgb(245, 60, 44 )' )
        .addColorStop( 1, 'rgb(232,9,0)' )
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
