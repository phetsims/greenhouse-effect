// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import greenhouseEffect from '../greenhouseEffect.js';
import greenhouseEffectStrings from '../greenhouseEffectStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

class PhotonsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem,
      name: greenhouseEffectStrings.screen.photons
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