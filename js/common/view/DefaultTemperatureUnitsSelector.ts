// Copyright 2023, University of Colorado Boulder

/**
 * DefaultTemperatureUnitsSelector is the control used to choose the units in which temperature values are presented by
 * default.  The user can change the units, but they will revert back to the default on a reset.  This control is
 * intended to appear in the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Property from '../../../../axon/js/Property.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

type SelfOptions = EmptySelfOptions;

type DefaultTemperatureUnitsSelectorOptions = SelfOptions &
  PickRequired<VBoxOptions, 'tandem'> &
  PickOptional<VBoxOptions, 'visible'>;

export default class DefaultTemperatureUnitsSelector extends VBox {

  private readonly disposeDefaultTemperatureUnitsSelector: () => void;

  public constructor( defaultTemperatureUnitsProperty: Property<TemperatureUnits>,
                      providedOptions?: DefaultTemperatureUnitsSelectorOptions ) {

    const options = optionize<DefaultTemperatureUnitsSelectorOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: 8,
      align: 'center',
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( options );

    const labelText = new Text( GreenhouseEffectStrings.defaultTemperatureUnitsStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const radioButtonGroup = new VerticalAquaRadioButtonGroup(
      defaultTemperatureUnitsProperty,
      [
        createItem(
          TemperatureUnits.KELVIN,
          GreenhouseEffectStrings.temperature.units.kelvinStringProperty,
          options.tandem,
          'KelvinRadioButton'
        ),
        createItem(
          TemperatureUnits.CELSIUS,
          GreenhouseEffectStrings.temperature.units.celsiusStringProperty,
          options.tandem,
          'CelsiusRadioButton'
        ),
        createItem(
          TemperatureUnits.FAHRENHEIT,
          GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty,
          options.tandem,
          'FahrenheitRadioButton'
        )
      ],
      { tandem: options.tandem.createTandem( 'radioButtonGroup' ) }
    );

    this.children = [ labelText, radioButtonGroup ];

    this.addLinkedElement( defaultTemperatureUnitsProperty, {
      tandem: options.tandem.createTandem( defaultTemperatureUnitsProperty.tandem.name )
    } );

    this.disposeDefaultTemperatureUnitsSelector = (): void => {
      labelText.dispose();
      radioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeDefaultTemperatureUnitsSelector();
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
    createNode: tandem => new Text( labelStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500,
      tandem: tandem.createTandem( 'labelText' )
    } ),
    tandemName: itemTandemName
  };
};

greenhouseEffect.register( 'DefaultTemperatureUnitsSelector', DefaultTemperatureUnitsSelector );