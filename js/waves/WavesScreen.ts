// Copyright 2020-2024, University of Colorado Boulder

/**
 * WavesScreen is the 'Waves' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GreenhouseEffectColors from '../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../common/GreenhouseEffectConstants.js';
import GreenhouseEffectIconFactory from '../common/view/GreenhouseEffectIconFactory.js';
import GreenhouseEffectKeyboardHelpContent from '../common/view/GreenhouseEffectKeyboardHelpContent.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseEffectFluent from '../GreenhouseEffectFluent.js';
import WavesModel from './model/WavesModel.js';
import WavesScreenView from './view/WavesScreenView.js';

class WavesScreen extends Screen<WavesModel, WavesScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: GreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createWavesHomeScreenIcon(),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectFluent.screen.wavesStringProperty,
      screenButtonsHelpText: GreenhouseEffectFluent.a11y.waves.screenButtonsHelpTextStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent(),
      isDisposable: false
    };

    super(
      () => new WavesModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new WavesScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'WavesScreen', WavesScreen );
export default WavesScreen;