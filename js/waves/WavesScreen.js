// Copyright 2020, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseWavesScreenView from './GreenhouseWavesScreenView.js';
import WavesModel from './WavesModel.js';

class WavesScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'black' ),
      tandem: tandem,
      name: 'Waves'
    };

    super(
      () => {return new WavesModel();},
      model => new GreenhouseWavesScreenView( model ),
      options
    );
  }
}

greenhouseEffect.register( 'WavesScreen', WavesScreen );
export default WavesScreen;