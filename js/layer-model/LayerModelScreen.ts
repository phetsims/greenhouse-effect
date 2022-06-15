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
import LayerModelModel from './model/LayerModelModel.js';
import LayerModelScreenView from './view/LayerModelScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';
import BasicActionsKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';

class LayerModelScreen extends Screen<LayerModelModel, LayerModelScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: new Property( GreenhouseEffectConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new RandomIcon( 544 ),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: greenhouseEffectStrings.screen.layerModel,
      keyboardHelpNode: new BasicActionsKeyboardHelpSection()
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