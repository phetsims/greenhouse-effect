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
import Property from '../../../../axon/js/Property.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;

type DefaultTemperatureUnitsSelectorOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

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

    const text = new Text( GreenhouseEffectStrings.defaultTemperatureUnitsStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500
    } );

    const radioButtonGroup = new VerticalAquaRadioButtonGroup(
      defaultTemperatureUnitsProperty,
      [
        createItem(
          TemperatureUnits.KELVIN,
          GreenhouseEffectStrings.temperature.units.kelvinStringProperty,
          options.tandem,
          'kelvinRadioButton'
        ),
        createItem(
          TemperatureUnits.CELSIUS,
          GreenhouseEffectStrings.temperature.units.celsiusStringProperty,
          options.tandem,
          'celsiusRadioButton'
        ),
        createItem(
          TemperatureUnits.FAHRENHEIT,
          GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty,
          options.tandem,
          'fahrenheitRadioButton'
        )
      ],
      { tandem: options.tandem.createTandem( 'radioButtonGroup' ) }
    );

    this.children = [ text, radioButtonGroup ];

    this.addLinkedElement( defaultTemperatureUnitsProperty );

    this.disposeDefaultTemperatureUnitsSelector = (): void => {
      text.dispose();
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
    createNode: () => new Text( labelStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500
    } ),
    tandemName: itemTandemName
  };
};

greenhouseEffect.register( 'DefaultTemperatureUnitsSelector', DefaultTemperatureUnitsSelector );