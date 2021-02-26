// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import greenhouseEffect from '../greenhouseEffect.js';
import greenhouseEffectStrings from '../greenhouseEffectStrings.js';
import LayersModel from './model/LayersModel.js';
import LayersScreenView from './view/LayersScreenView.js';

class LayersModelScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem,
      name: greenhouseEffectStrings.screen.model
    };

    super(
      () => new LayersModel( tandem.createTandem( 'model' ) ),
      model => new LayersScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'LayersModelScreen', LayersModelScreen );
export default LayersModelScreen;