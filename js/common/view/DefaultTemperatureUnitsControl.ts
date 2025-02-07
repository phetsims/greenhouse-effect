// Copyright 2023-2024, University of Colorado Boulder

/**
 * DefaultTemperatureUnitsSelector is the control used to choose the units in which temperature values are presented by
 * default.  The user can change the units, but they will revert back to the default on a reset.  This control is
 * intended to appear in the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import TemperatureUnits from '../model/TemperatureUnits.js';

export default class DefaultTemperatureUnitsControl extends VBox {

  public constructor( defaultTemperatureUnitsProperty: Property<TemperatureUnits>, tandem: Tandem ) {

    const text = new Text( GreenhouseEffectStrings.defaultTemperatureUnitsStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500
    } );

    // Items that describe the radio buttons
    const items: AquaRadioButtonGroupItem<TemperatureUnits>[] = [
      createItem(
        TemperatureUnits.KELVIN,
        GreenhouseEffectStrings.temperature.units.kelvinStringProperty,
        tandem,
        'kelvinRadioButton'
      ),
      createItem(
        TemperatureUnits.CELSIUS,
        GreenhouseEffectStrings.temperature.units.celsiusStringProperty,
        tandem,
        'celsiusRadioButton'
      ),
      createItem(
        TemperatureUnits.FAHRENHEIT,
        GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty,
        tandem,
        'fahrenheitRadioButton'
      )
    ];

    const radioButtonGroup = new VerticalAquaRadioButtonGroup<TemperatureUnits>( defaultTemperatureUnitsProperty, items, {
      tandem: tandem.createTandem( 'radioButtonGroup' ),
      phetioVisiblePropertyInstrumented: false,

      // pdom
      accessibleName: GreenhouseEffectStrings.defaultTemperatureUnitsStringProperty
    } );

    super( {
      children: [ text, radioButtonGroup ],
      spacing: 8,
      align: 'center',
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      isDisposable: false,
      tandem: tandem
    } );

    this.addLinkedElement( defaultTemperatureUnitsProperty );
  }
}

/**
 * Create an item for the radio button group.
 * @param value - value associated with the radio button
 * @param labelStringProperty - label that appears on the radio button
 * @param groupTandem - used to associate the item's tandem with the radio-button group
 * @param itemTandemName - used to create the item's tandem
 */
const createItem = ( value: TemperatureUnits,
                     labelStringProperty: TReadOnlyProperty<string>,
                     groupTandem: Tandem,
                     itemTandemName: string ): AquaRadioButtonGroupItem<TemperatureUnits> => {
  return {
    value: value,
    createNode: () => new Text( labelStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500
    } ),
    tandemName: itemTandemName,
    options: {
      accessibleName: labelStringProperty
    }
  };
};

greenhouseEffect.register( 'DefaultTemperatureUnitsControl', DefaultTemperatureUnitsControl );