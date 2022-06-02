// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import GreenhouseEffectConstants from '../common/GreenhouseEffectConstants.js';
import RandomIcon from '../common/view/RandomIcon.js';
import greenhouseEffect from '../greenhouseEffect.js';
import greenhouseEffectStrings from '../greenhouseEffectStrings.js';
import WavesModel from './model/WavesModel.js';
import WavesScreenView from './view/WavesScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

class WavesScreen extends Screen<WavesModel, WavesScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: new Property( GreenhouseEffectConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new RandomIcon( 552 ),
      maxDT: GreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: greenhouseEffectStrings.screen.waves,
      descriptionContent: greenhouseEffectStrings.a11y.waves.homeScreenDescription
    };

    super(
      () => new WavesModel( tandem.createTandem( 'model' ) ),
      model => new WavesScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

greenhouseEffect.register( 'WavesScreen', WavesScreen );
export default WavesScreen;