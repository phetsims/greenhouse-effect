// Copyright 2021, University of Colorado Boulder

/**
 * Most checkboxes in Greenhouse Effect have a label with an icon. This puts the label and icon
 * together and uses them both as the content Node for a Checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Text from '../../../../scenery/js/nodes/Text.js';

// constants
const LABEL_ICON_SPACING = 10;
const LABEL_FONT = new PhetFont( {
  size: 14
} );

class GreenhouseEffectCheckbox extends Checkbox {

  /**
   * @param {string} labelString
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( labelString, property, options ) {

    options = merge( {

      // {Node|null} - if provided, will be included in the icon for the checkbox
      iconNode: null,

      // i18n
      maxWidth: 250,

      // pdom
      accessibleName: labelString
    }, options );

    const labelText = new Text( labelString, { font: LABEL_FONT } );

    const contentChildren = options.iconNode ? [ labelText, options.iconNode ] : [ labelText ];
    const checkboxContent = new HBox( {
      children: contentChildren,
      spacing: LABEL_ICON_SPACING
    } );

    super( checkboxContent, property, options );
  }
}

greenhouseEffect.register( 'GreenhouseEffectCheckbox', GreenhouseEffectCheckbox );
export default GreenhouseEffectCheckbox;
