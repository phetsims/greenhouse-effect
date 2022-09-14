// Copyright 2022, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import TemperatureUnits from '../../common/model/TemperatureUnits.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

const LABEL_FONT = new PhetFont( 14 );

/**
 * TemperatureUnitsSelector is a UI component that allows a user to select between Kelvin, degrees Celsius, or degrees
 * Fahrenheit, using a horizontal set of radio buttons.  This was originally developed for the "Layer Model" screen of
 * the "Greenhouse Effect" simulation, but may be applicable to other situations in the future.
 */

class TemperatureUnitsSelector extends VBox {
  public constructor( temperatureUnitsProperty: Property<TemperatureUnits> ) {

    // Create the label that sits above the radio button selectors.
    const label = new Text( GreenhouseEffectStrings.temperatureUnits, { font: LABEL_FONT } );

    // Create the radio button items.
    const temperatureSelectionRadioButtonItems = [
      {
        node: new Text( GreenhouseEffectStrings.temperature.units.kelvin, { font: LABEL_FONT } ),
        value: TemperatureUnits.KELVIN
      },
      {
        node: new Text( GreenhouseEffectStrings.temperature.units.celsius, { font: LABEL_FONT } ),
        value: TemperatureUnits.CELSIUS
      },
      {
        node: new Text( GreenhouseEffectStrings.temperature.units.fahrenheit, { font: LABEL_FONT } ),
        value: TemperatureUnits.FAHRENHEIT
      }
    ];

    // Create the radio buttons.
    const soundIndexSelector = new AquaRadioButtonGroup(
      temperatureUnitsProperty,
      temperatureSelectionRadioButtonItems,
      {
        orientation: 'horizontal',
        spacing: 15,
        radioButtonOptions: {
          radius: 6
        }
      }
    );

    // TODO: Temporary, for debug.
    temperatureUnitsProperty.lazyLink( units => {
      console.log( `units = ${units}` );
    } );

    // Put the label and radio buttons together in the VBox.
    super( {
      children: [ label, soundIndexSelector ],
      align: 'left',
      spacing: 3
    } );
  }
}

greenhouseEffect.register( 'TemperatureUnitsSelector', TemperatureUnitsSelector );
export default TemperatureUnitsSelector;