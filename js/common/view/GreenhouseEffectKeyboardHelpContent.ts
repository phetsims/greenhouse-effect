// Copyright 2022, University of Colorado Boulder

/**
 * The contents of the keyboard help dialog for this sim, used for all screens.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TimingControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimingControlsKeyboardHelpSection.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';

class GreenhouseEffectKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const sliderHelpSection = new SliderControlsKeyboardHelpSection();
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection();

    const timingControlsHelpSection = new TimingControlsKeyboardHelpSection();

    // vertically align the left sections
    KeyboardHelpSection.alignHelpSectionIcons( [ sliderHelpSection, timingControlsHelpSection ] );

    super( [ sliderHelpSection, timingControlsHelpSection ], [ basicActionsHelpSection ] );
  }
}

greenhouseEffect.register( 'GreenhouseEffectKeyboardHelpContent', GreenhouseEffectKeyboardHelpContent );
export default GreenhouseEffectKeyboardHelpContent;
