// Copyright 2021-2023, University of Colorado Boulder

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
import GreenhouseEffectStrings from '../GreenhouseEffectStrings.js';
import LayerModelModel from './model/LayerModelModel.js';
import LayerModelScreenView from './view/LayerModelScreenView.js';

class LayerModelScreen extends Screen<LayerModelModel, LayerModelScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: GreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createLayerModelHomeScreenIcon(),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: GreenhouseEffectStrings.screen.layerModelStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } )
    };

    super(
      () => new LayerModelModel( tandem.createTandem( 'model' ) ),
      model => new LayerModelScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'LayerModelScreen', LayerModelScreen );
export default LayerModelScreen;