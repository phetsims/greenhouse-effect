// Copyright 2021, University of Colorado Boulder

/**
 * Checkbox that controls whether the surface temperature is displayed in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { LinearGradient, Rectangle } from '../../../../scenery/js/imports.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';

class SurfaceTemperatureCheckbox extends GreenhouseEffectCheckbox {
  constructor( property: Property<boolean>, temperatureProperty: NumberProperty, tandem: Tandem ) {

    const iconWidth = 15;

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, iconWidth, iconWidth, {
      fill: new LinearGradient( 0, 0, 0, iconWidth )
        .addColorStop( 0.1, PhetColorScheme.RED_COLORBLIND )
        .addColorStop( 0.7, '#22CC00' )
        .addColorStop( 1, '#1A9900' )
    } );

    const checkedUtterance = new Utterance();
    temperatureProperty.link( temperatureKelvin => {
      checkedUtterance.alert = TemperatureDescriber.getQualitativeSurfaceTemperatureDescriptionString( temperatureKelvin );
    } );

    super( greenhouseEffectStrings.showSurfaceTemperature, property, {
      iconNode: iconNode,

      // pdom
      helpText: greenhouseEffectStrings.a11y.showSurfaceTemperature.helpText,
      checkedContextResponseUtterance: checkedUtterance,
      uncheckedContextResponseUtterance: new Utterance( { alert: 'Surface glow hidden.' } ),

      // phetio
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'SurfaceTemperatureCheckbox', SurfaceTemperatureCheckbox );
export default SurfaceTemperatureCheckbox;
