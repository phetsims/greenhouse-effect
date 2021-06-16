// Copyright 2021, University of Colorado Boulder

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

class LayerModelScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( GreenhouseEffectConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new RandomIcon( 544 ),
      tandem: tandem,
      name: greenhouseEffectStrings.screen.layerModel
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