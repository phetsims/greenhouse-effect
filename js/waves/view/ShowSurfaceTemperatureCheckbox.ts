// Copyright 2021-2024, University of Colorado Boulder

/**
 * Checkbox that controls whether the surface temperature is displayed in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

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
        concentrationControlModeProperty.value === ConcentrationControlMode.BY_DATE
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