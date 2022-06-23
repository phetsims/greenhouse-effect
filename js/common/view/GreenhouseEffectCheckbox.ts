// Copyright 2021-2022, University of Colorado Boulder

/**
 * Most checkboxes in Greenhouse Effect have a label with an icon. This puts the label and icon
 * together and uses them both as the content Node for a Checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const LABEL_ICON_SPACING = 10;
const LABEL_FONT = new PhetFont( {
  size: 14
} );

type SelfOptions = {

  // if provided, will be included in the icon for the checkbox
  iconNode?: Node | null;
};
type GreenhouseEffectCheckboxOptions = SelfOptions & CheckboxOptions;

class GreenhouseEffectCheckbox extends Checkbox {
  public constructor( property: Property<boolean>, labelString: string, providedOptions?: GreenhouseEffectCheckboxOptions ) {

    const options = optionize<GreenhouseEffectCheckboxOptions, SelfOptions, CheckboxOptions>()( {
      iconNode: null,

      // i18n
      maxWidth: 250,

      // phet-io
      tandem: Tandem.REQUIRED,

      // pdom
      accessibleName: labelString
    }, providedOptions );

    const labelText = new Text( labelString, {
      font: LABEL_FONT,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const contentChildren = options.iconNode ? [ labelText, options.iconNode ] : [ labelText ];
    const checkboxContent = new HBox( {
      children: contentChildren,
      spacing: LABEL_ICON_SPACING
    } );

    super( property, checkboxContent, options );
  }
}

greenhouseEffect.register( 'GreenhouseEffectCheckbox', GreenhouseEffectCheckbox );
export default GreenhouseEffectCheckbox;
