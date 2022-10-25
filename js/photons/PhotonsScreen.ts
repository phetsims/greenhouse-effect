// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../common/GreenhouseEffectConstants.js';
import RandomIcon from '../common/view/RandomIcon.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseEffectStrings from '../GreenhouseEffectStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';
import GreenhouseEffectKeyboardHelpContent from '../common/view/GreenhouseEffectKeyboardHelpContent.js';

class PhotonsScreen extends Screen<PhotonsModel, PhotonsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: new Property( GreenhouseEffectConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new RandomIcon( 1 ),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectStrings.screen.photonsStringProperty,
      descriptionContent: GreenhouseEffectStrings.a11y.photons.homeScreenDescription,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent()
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