// Copyright 2022-2023, University of Colorado Boulder

/**
 * The contents of the keyboard help dialog for this sim, used for all screens.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent, { TwoColumnKeyboardHelpContentOptions } from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

type SelfOptions = {

  // boolean flag that indicates whether the flux meter help information should be included in the help contents
  includeFluxMeterHelp?: boolean;
};
export type GreenhouseEffectKeyboardHelpContentOptions = SelfOptions & TwoColumnKeyboardHelpContentOptions;

class GreenhouseEffectKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor( providedOptions?: GreenhouseEffectKeyboardHelpContentOptions ) {

    // @ts-expect-error - chip away for https://github.com/phetsims/phet-core/issues/130
    const options = optionize<GreenhouseEffectKeyboardHelpContentOptions, SelfOptions, TwoColumnKeyboardHelpContent>()( {
      includeFluxMeterHelp: false
    }, providedOptions );

    // The slider help section is somewhat different when the flux meter information is included.
    const sliderHelpSectionOptions = options.includeFluxMeterHelp ?
      {
        headingStringProperty: GreenhouseEffectStrings.sliderAndFluxMeterControlsStringProperty,

        // The following option essentially removes the word "slider" so that the dialog just says "Adjust" and not
        // "Adjust Slider".  By making it a fixed property, we are not allowing it to be translated, which is intentional.
        sliderStringProperty: new StringProperty( '' )
      } :
      {};

    // Create the various sections that will be combined to make up the dialog contents.
    const sliderHelpSection = new SliderControlsKeyboardHelpSection( sliderHelpSectionOptions );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection();
    const timingControlsHelpSection = new TimeControlKeyboardHelpSection();

    // Vertically align the left sections.
    KeyboardHelpSection.alignHelpSectionIcons( [ sliderHelpSection, timingControlsHelpSection ] );

    super( [ sliderHelpSection, timingControlsHelpSection ], [ basicActionsHelpSection ] );
  }
}

greenhouseEffect.register( 'GreenhouseEffectKeyboardHelpContent', GreenhouseEffectKeyboardHelpContent );
export default GreenhouseEffectKeyboardHelpContent;
