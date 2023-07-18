// Copyright 2022-2023, University of Colorado Boulder

/**
 * TemperatureUnitsControl is a UI component that allows a user to select between Kelvin, degrees Celsius, or degrees
 * Fahrenheit, using a horizontal set of radio buttons.  This was originally developed for the "Layer Model" screen of
 * the "Greenhouse Effect" simulation, but may be applicable to other situations in the future.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TemperatureUnits from '../../common/model/TemperatureUnits.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';

const UNITS_LABEL_MAX_WIDTH = 50;

class TemperatureUnitsControl extends VBox {
  public constructor( temperatureUnitsProperty: Property<TemperatureUnits>, tandem: Tandem ) {

    // Create the label that sits above the radio buttons.
    const text = new Text( GreenhouseEffectStrings.temperatureUnitsStringProperty, {
      font: GreenhouseEffectConstants.LABEL_FONT,
      maxWidth: 200
    } );

    // Options shared by the labels for all radio buttons
    const textOptions = {
      font: GreenhouseEffectConstants.LABEL_FONT,
      maxWidth: UNITS_LABEL_MAX_WIDTH
    };

    // Items that describe the radio buttons
    const items: AquaRadioButtonGroupItem<TemperatureUnits>[] = [
      {
        createNode: () => new Text( GreenhouseEffectStrings.temperature.units.kelvinStringProperty, textOptions ),
        value: TemperatureUnits.KELVIN,
        tandemName: 'kelvinRadioButton'
      },
      {
        createNode: () => new Text( GreenhouseEffectStrings.temperature.units.celsiusStringProperty, textOptions ),
        value: TemperatureUnits.CELSIUS,
        tandemName: 'celsiusRadioButton'
      },
      {
        createNode: () => new Text( GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty, textOptions ),
        value: TemperatureUnits.FAHRENHEIT,
        tandemName: 'fahrenheitRadioButton'
      }
    ];

    // Create the radio buttons.
    const temperatureUnitsRadioButtonGroup = new AquaRadioButtonGroup<TemperatureUnits>( temperatureUnitsProperty, items, {
      orientation: 'horizontal',
      spacing: 15,
      touchAreaXDilation: 6,
      touchAreaYDilation: 4,
      radioButtonOptions: {
        radius: 6
      },
      tandem: tandem.createTandem( 'temperatureUnitsRadioButtonGroup' ),
      phetioVisiblePropertyInstrumented: false // see https://github.com/phetsims/greenhouse-effect/issues/318
    } );

    // Put the label and radio buttons together in the VBox.
    super( {
      children: [ text, temperatureUnitsRadioButtonGroup ],
      align: 'left',
      spacing: 3,
      visiblePropertyOptions: {
        phetioFeatured: true // see https://github.com/phetsims/greenhouse-effect/issues/318
      },
      tandem: tandem,
      isDisposable: false
    } );
  }
}

greenhouseEffect.register( 'TemperatureUnitsControl', TemperatureUnitsControl );
export default TemperatureUnitsControl;