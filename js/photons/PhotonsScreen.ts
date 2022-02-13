// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import GreenhouseEffectConstants from '../common/GreenhouseEffectConstants.js';
import RandomIcon from '../common/view/RandomIcon.js';
import greenhouseEffect from '../greenhouseEffect.js';
import greenhouseEffectStrings from '../greenhouseEffectStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

class PhotonsScreen extends Screen<PhotonsModel, PhotonsScreenView> {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: new Property( GreenhouseEffectConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new RandomIcon( 1 ),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: greenhouseEffectStrings.screen.photons,
      descriptionContent: greenhouseEffectStrings.a11y.photons.homeScreenDescription
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