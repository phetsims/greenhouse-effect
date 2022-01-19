// Copyright 2021, University of Colorado Boulder

/**
 * A reusable checkbox that controls whether the surface thermometer is shown, with label and icon.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

class SurfaceThermometerCheckbox extends GreenhouseEffectCheckbox {
  constructor( property: Property<boolean>, temperatureProperty: NumberProperty, temperatureUnitsProperty: Property<any>, tandem: Tandem ) {
    const iconNode = new ThermometerNode( 0, 5, new NumberProperty( 2 ), { scale: 0.2 } );

    const checkedUtterance = new Utterance();
    Property.multilink( [ temperatureProperty, temperatureUnitsProperty ], ( temperature, units ) => {
      checkedUtterance.alert = StringUtils.fillIn( greenhouseEffectStrings.a11y.thermometerShownAlertPattern, {
        value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, units )
      } );
    } );

    super( greenhouseEffectStrings.surfaceThermometer, property, {
      iconNode: iconNode,

      // pdom
      helpText: greenhouseEffectStrings.a11y.surfaceThermometer.helpText,
      checkedContextResponseUtterance: checkedUtterance,
      uncheckedContextResponseUtterance: new Utterance( { alert: greenhouseEffectStrings.a11y.thermometerRemovedAlert } ),

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'SurfaceThermometerCheckbox', SurfaceThermometerCheckbox );
export default SurfaceThermometerCheckbox;
