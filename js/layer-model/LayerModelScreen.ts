// Copyright 2021-2024, University of Colorado Boulder

/**
 * LayerModelScreen is the 'Layers Model' screen.
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
import LayerModelModel from './model/LayerModelModel.js';
import LayerModelScreenView from './view/LayerModelScreenView.js';

class LayerModelScreen extends Screen<LayerModelModel, LayerModelScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: GreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createLayerModelHomeScreenIcon(),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectFluent.screen.layerModelStringProperty,
      screenButtonsHelpText: GreenhouseEffectFluent.a11y.layerModel.screenButtonsHelpTextStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } ),
      isDisposable: false
    };

    super(
      () => new LayerModelModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new LayerModelScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'LayerModelScreen', LayerModelScreen );
export default LayerModelScreen;