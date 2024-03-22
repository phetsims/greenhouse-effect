// Copyright 2021-2023, University of Colorado Boulder

/**
 * Most checkboxes in Greenhouse Effect have a label with an icon. This puts the label and icon
 * together and uses them both as the content Node for a Checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

// constants
const LABEL_ICON_SPACING = 10;
const LABEL_FONT = new PhetFont( {
  size: 14
} );

type SelfOptions = {

  maxLabelTextWidth?: number;

  // if provided, will be included in the icon for the checkbox
  iconNode?: Node | null;
};
export type GreenhouseEffectCheckboxOptions = SelfOptions & WithRequired<CheckboxOptions, 'tandem'>;

class GreenhouseEffectCheckbox extends Checkbox {
  protected constructor( property: Property<boolean>,
                         labelStringProperty: TReadOnlyProperty<string>,
                         providedOptions?: GreenhouseEffectCheckboxOptions ) {

    const options = optionize<GreenhouseEffectCheckboxOptions, SelfOptions, CheckboxOptions>()( {
      iconNode: null,
      maxLabelTextWidth: 180, // empirically determined, works well for most cases in Greenhouse
      isDisposable: false,

      // i18n
      maxWidth: 250,

      // pdom
      accessibleName: labelStringProperty
    }, providedOptions );

    const text = new Text( labelStringProperty, {
      font: LABEL_FONT,
      maxWidth: options.maxLabelTextWidth
    } );

    const contentChildren = options.iconNode ? [ text, options.iconNode ] : [ text ];
    const checkboxContent = new HBox( {
      children: contentChildren,
      spacing: LABEL_ICON_SPACING
    } );

    super( property, checkboxContent, options );
  }
}

greenhouseEffect.register( 'GreenhouseEffectCheckbox', GreenhouseEffectCheckbox );
export default GreenhouseEffectCheckbox;