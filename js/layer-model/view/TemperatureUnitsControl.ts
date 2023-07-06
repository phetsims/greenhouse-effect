// Copyright 2022-2023, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TemperatureUnits from '../../common/model/TemperatureUnits.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

const LABEL_FONT = new PhetFont( 14 );
const UNITS_LABEL_MAX_WIDTH = 50;

/**
 * TemperatureUnitsSelector is a UI component that allows a user to select between Kelvin, degrees Celsius, or degrees
 * Fahrenheit, using a horizontal set of radio buttons.  This was originally developed for the "Layer Model" screen of
 * the "Greenhouse Effect" simulation, but may be applicable to other situations in the future.
 */

class TemperatureUnitsControl extends VBox {
  public constructor( temperatureUnitsProperty: Property<TemperatureUnits>, tandem: Tandem ) {

    // Create the label that sits above the radio button selectors.
    const text = new Text( GreenhouseEffectStrings.temperatureUnitsStringProperty, {
      font: LABEL_FONT,
      maxWidth: 200
    } );

    // Create the radio buttons.
    const temperatureUnitsRadioButtonGroup = new AquaRadioButtonGroup(
      temperatureUnitsProperty,
      [
        {
          createNode: () => new Text( GreenhouseEffectStrings.temperature.units.kelvinStringProperty, {
            font: LABEL_FONT,
            maxWidth: UNITS_LABEL_MAX_WIDTH
          } ),
          value: TemperatureUnits.KELVIN,
          tandemName: 'kelvinRadioButton'
        },
        {
          createNode: () => new Text( GreenhouseEffectStrings.temperature.units.celsiusStringProperty, {
            font: LABEL_FONT,
            maxWidth: UNITS_LABEL_MAX_WIDTH
          } ),
          value: TemperatureUnits.CELSIUS,
          tandemName: 'celsiusRadioButton'
        },
        {
          createNode: () => new Text( GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty, {
            font: LABEL_FONT,
            maxWidth: UNITS_LABEL_MAX_WIDTH
          } ),
          value: TemperatureUnits.FAHRENHEIT,
          tandemName: 'fahrenheitRadioButton'
        }
      ],
      {
        orientation: 'horizontal',
        spacing: 15,
        radioButtonOptions: {
          radius: 6
        },
        tandem: tandem.createTandem( 'temperatureUnitsRadioButtonGroup' ),
        phetioVisiblePropertyInstrumented: false // see https://github.com/phetsims/greenhouse-effect/issues/318
      }
    );

    // Put the label and radio buttons together in the VBox.
    super( {
      tandem: tandem,
      children: [ text, temperatureUnitsRadioButtonGroup ],
      align: 'left',
      spacing: 3,
      visiblePropertyOptions: {
        phetioFeatured: true // see https://github.com/phetsims/greenhouse-effect/issues/318
      }
    } );
  }
}

greenhouseEffect.register( 'TemperatureUnitsSelector', TemperatureUnitsControl );
export default TemperatureUnitsControl;