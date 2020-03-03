// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseEffectModel from './model/GreenhouseEffectModel.js';
import GreenhouseEffectScreenView from './view/GreenhouseEffectScreenView.js';

class GreenhouseEffectScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem,
      name: 'Greenhouse Effect'
    };

    super(
      () => new GreenhouseEffectModel( tandem.createTandem( 'model' ) ),
      model => new GreenhouseEffectScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'GreenhouseEffectScreen', GreenhouseEffectScreen );
export default GreenhouseEffectScreen;