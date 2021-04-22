// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import RandomIcon from '../common/view/RandomIcon.js';
import greenhouseEffect from '../greenhouseEffect.js';
import greenhouseEffectStrings from '../greenhouseEffectStrings.js';
import MicroModel from './model/MicroModel.js';
import MicroScreenView from './view/MicroScreenView.js';

class MicroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( '#C5D6E8' ),
      homeScreenIcon: new RandomIcon( 549 ),
      tandem: tandem,
      name: greenhouseEffectStrings.screen.micro
    };

    super(
      () => new MicroModel( tandem.createTandem( 'model' ) ),
      model => new MicroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'MicroScreen', MicroScreen );
export default MicroScreen;