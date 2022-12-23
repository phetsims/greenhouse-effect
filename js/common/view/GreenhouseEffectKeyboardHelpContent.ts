// Copyright 2022, University of Colorado Boulder

/**
 * The contents of the keyboard help dialog for this sim, used for all screens.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection, { SliderControlsKeyboardHelpSectionOptions } from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimingControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimingControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent, { TwoColumnKeyboardHelpContentOptions } from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import greenhouseEffect from '../../greenhouseEffect.js';

type SelfOptions = {
  sliderHelpSectionOptions?: SliderControlsKeyboardHelpSectionOptions;
};
export type GreenhouseEffectKeyboardHelpContentOptions = SelfOptions & TwoColumnKeyboardHelpContentOptions;

class GreenhouseEffectKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor( providedOptions?: GreenhouseEffectKeyboardHelpContentOptions ) {

    const options = optionize<GreenhouseEffectKeyboardHelpContentOptions, SelfOptions, TwoColumnKeyboardHelpContent>()( {
      sliderHelpSectionOptions: {}
    }, providedOptions );

    /* Create the various sections that will be combined to make up the dialog contents. */const sliderHelpSection = new SliderControlsKeyboardHelpSection( options.sliderHelpSectionOptions );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection();
    const timingControlsHelpSection = new TimingControlsKeyboardHelpSection();

    // Vertically align the left sections.
    KeyboardHelpSection.alignHelpSectionIcons( [ sliderHelpSection, timingControlsHelpSection ] );

    super( [ sliderHelpSection, timingControlsHelpSection ], [ basicActionsHelpSection ] );
  }
}

greenhouseEffect.register( 'GreenhouseEffectKeyboardHelpContent', GreenhouseEffectKeyboardHelpContent );
export default GreenhouseEffectKeyboardHelpContent;
