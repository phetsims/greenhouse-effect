// Copyright 2021-2024, University of Colorado Boulder

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
import GreenhouseEffectFluent from '../GreenhouseEffectFluent.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

class PhotonsScreen extends Screen<PhotonsModel, PhotonsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: GreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createPhotonsHomeScreenIcon(),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectFluent.screen.photonsStringProperty,
      screenButtonsHelpText: GreenhouseEffectFluent.a11y.photons.screenButtonsHelpTextStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } ),
      isDisposable: false
    };

    super(
      () => new PhotonsModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new PhotonsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'PhotonsScreen', PhotonsScreen );
export default PhotonsScreen;