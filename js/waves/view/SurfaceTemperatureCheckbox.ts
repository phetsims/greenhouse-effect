// Copyright 2021-2022, University of Colorado Boulder

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
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';

class SurfaceTemperatureCheckbox extends GreenhouseEffectCheckbox {
  public constructor( property: Property<boolean>, model: ConcentrationModel, tandem: Tandem ) {

    const iconWidth = 15;

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, iconWidth, iconWidth, {
      fill: new LinearGradient( 0, 0, 0, iconWidth )
        .addColorStop( 0.1, PhetColorScheme.RED_COLORBLIND )
        .addColorStop( 0.7, '#22CC00' )
        .addColorStop( 1, '#1A9900' )
    } );

    const checkedUtterance = new Utterance();
    model.surfaceTemperatureKelvinProperty.link( temperatureKelvin => {
      checkedUtterance.alert = TemperatureDescriber.getQualitativeSurfaceTemperatureDescriptionString(
        temperatureKelvin,
        model.concentrationControlModeProperty.value,
        model.dateProperty.value
      );
    } );

    super( property, greenhouseEffectStrings.showSurfaceTemperature, {
      iconNode: iconNode,

      // pdom
      helpText: greenhouseEffectStrings.a11y.showSurfaceTemperature.helpText,
      checkedContextResponse: checkedUtterance,
      uncheckedContextResponse: 'Surface glow hidden.',

      // phetio
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'SurfaceTemperatureCheckbox', SurfaceTemperatureCheckbox );
export default SurfaceTemperatureCheckbox;
