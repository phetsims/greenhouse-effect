// Copyright 2021-2025, University of Colorado Boulder

/**
 * A reusable checkbox that controls whether the surface thermometer is shown, with label and icon.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';

class SurfaceThermometerCheckbox extends GreenhouseEffectCheckbox {

  public constructor( property: Property<boolean>,
                      temperatureProperty: NumberProperty,
                      temperatureUnitsProperty: Property<TemperatureUnits>,
                      tandem: Tandem ) {

    const iconNode = new ThermometerNode( new NumberProperty( 2 ), 0, 5, { scale: 0.2 } );

    const checkedUtterance = new Utterance();
    Multilink.multilink( [ temperatureProperty, temperatureUnitsProperty ], ( temperature, units ) => {
      checkedUtterance.alert = StringUtils.fillIn(
        GreenhouseEffectStrings.a11y.thermometerShownAlertPatternStringProperty,
        {
          value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, units )
        }
      );
    } );

    super( property, GreenhouseEffectStrings.surfaceThermometerStringProperty, {
      iconNode: iconNode,
      touchAreaXDilation: 5,

      // pdom
      accessibleHelpText: GreenhouseEffectStrings.a11y.surfaceThermometer.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: checkedUtterance,
      accessibleContextResponseUnchecked: GreenhouseEffectStrings.a11y.thermometerRemovedAlertStringProperty,

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'SurfaceThermometerCheckbox', SurfaceThermometerCheckbox );
export default SurfaceThermometerCheckbox;