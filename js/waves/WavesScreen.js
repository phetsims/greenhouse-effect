// Copyright 2020, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import RandomIcon from '../common/view/RandomIcon.js';
import greenhouseEffect from '../greenhouseEffect.js';
import WavesScreenView from './view/WavesScreenView.js';
import WavesModel from './model/WavesModel.js';

class WavesScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new RandomIcon( 552 ),
      tandem: tandem,
      name: 'Waves'
    };

    super(
      () => {return new WavesModel();},
      model => new WavesScreenView( model ),
      options
    );
  }
}

greenhouseEffect.register( 'WavesScreen', WavesScreen );
export default WavesScreen;