// Copyright 2021-2023, University of Colorado Boulder

/**
 * PhotonsScreen is the 'Photons' screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

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
      homeScreenIcon: GreenhouseEffectIconFactory.createPhotonsHomeScreenIcon(),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectStrings.screen.photonsStringProperty,
      descriptionContent: GreenhouseEffectStrings.a11y.photons.homeScreenDescriptionStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } )
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