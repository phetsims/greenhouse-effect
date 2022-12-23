// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author John Blanco
 */

import StringProperty from '../../../axon/js/StringProperty.js';
import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GreenhouseEffectColors from '../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../common/GreenhouseEffectConstants.js';
import GreenhouseEffectIconFactory from '../common/view/GreenhouseEffectIconFactory.js';
import GreenhouseEffectKeyboardHelpContent from '../common/view/GreenhouseEffectKeyboardHelpContent.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseEffectStrings from '../GreenhouseEffectStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

class PhotonsScreen extends Screen<PhotonsModel, PhotonsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: GreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createPhotonsScreenHomeIcon(),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectStrings.screen.photonsStringProperty,
      descriptionContent: GreenhouseEffectStrings.a11y.photons.homeScreenDescriptionStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent(
        {
          sliderHelpSectionOptions: {
            headingStringProperty: GreenhouseEffectStrings.sliderAndFluxMeterControlsStringProperty,

            // The following option essentially removes the word "slider" so that the dialog just says "Adjust" and not
            // "Adjust Slider".  By making it a fixed property, we are not allowing it to be translated, which is intentional.
            sliderStringProperty: new StringProperty( '' )
          }
        }
      )
    };

    super(
      () => new PhotonsModel( tandem.createTandem( 'model' ) ),
      model => new PhotonsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'PhotonsScreen', PhotonsScreen );
export default PhotonsScreen;