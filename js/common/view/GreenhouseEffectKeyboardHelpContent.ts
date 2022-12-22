// Copyright 2022, University of Colorado Boulder

/**
 * The contents of the keyboard help dialog for this sim, used for all screens.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimingControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimingControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

class GreenhouseEffectKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const sliderHelpSection = new SliderControlsKeyboardHelpSection( {
      headingStringProperty: GreenhouseEffectStrings.sliderAndFluxMeterControlsStringProperty,

      // The following option essentially removes the word "slider" so that the dialog just says "Adjust" and not
      // "Adjust Slider".  By making it a fixed property, we are not allowing it to be translated, which is intentional.
      sliderStringProperty: new StringProperty( '' )
    } );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection();

    const timingControlsHelpSection = new TimingControlsKeyboardHelpSection();

    // vertically align the left sections
    KeyboardHelpSection.alignHelpSectionIcons( [ sliderHelpSection, timingControlsHelpSection ] );

    super( [ sliderHelpSection, timingControlsHelpSection ], [ basicActionsHelpSection ] );
  }
}

greenhouseEffect.register( 'GreenhouseEffectKeyboardHelpContent', GreenhouseEffectKeyboardHelpContent );
export default GreenhouseEffectKeyboardHelpContent;
