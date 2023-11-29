// Copyright 2021-2023, University of Colorado Boulder

/**
 * Checkbox that controls whether the surface temperature is displayed in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { LinearGradient, Rectangle } from '../../../../scenery/js/imports.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

class ShowSurfaceTemperatureCheckbox extends GreenhouseEffectCheckbox {
  public constructor( property: Property<boolean>,
                      surfaceTemperatureKelvinProperty: TReadOnlyProperty<number>,
                      concentrationControlModeProperty: EnumerationProperty<ConcentrationControlMode>,
                      dateProperty: EnumerationProperty<ConcentrationDate>,
                      tandem: Tandem ) {

    const iconWidth = 15;

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, iconWidth, iconWidth, {
      fill: new LinearGradient( 0, 0, 0, iconWidth )
        .addColorStop( 0.1, PhetColorScheme.RED_COLORBLIND )
        .addColorStop( 0.7, '#22CC00' )
        .addColorStop( 1, '#1A9900' )
    } );

    const checkedUtterance = new Utterance();
    surfaceTemperatureKelvinProperty.link( temperatureKelvin => {
      checkedUtterance.alert = TemperatureDescriber.getQualitativeSurfaceTemperatureDescriptionString(
        temperatureKelvin,
        concentrationControlModeProperty.value
      );
    } );

    super( property, GreenhouseEffectStrings.showSurfaceTemperatureStringProperty, {
      iconNode: iconNode,
      touchAreaXDilation: 5,
      touchAreaYDilation: 4,

      // pdom
      helpText: GreenhouseEffectStrings.a11y.showSurfaceTemperature.helpTextStringProperty,
      checkedContextResponse: checkedUtterance,
      uncheckedContextResponse: GreenhouseEffectStrings.a11y.surfaceTemperatureScaleHiddenStringProperty,

      // phetio
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'ShowSurfaceTemperatureCheckbox', ShowSurfaceTemperatureCheckbox );
export default ShowSurfaceTemperatureCheckbox;
