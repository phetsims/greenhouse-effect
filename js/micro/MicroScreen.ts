// Copyright 2021-2025, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GreenhouseEffectIconFactory from '../common/view/GreenhouseEffectIconFactory.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseEffectFluent from '../GreenhouseEffectFluent.js';
import MicroModel from './model/MicroModel.js';
import MicroScreenView from './view/MicroScreenView.js';

class MicroScreen extends Screen<MicroModel, MicroScreenView> {
  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: new Property( '#C5D6E8' ),
      homeScreenIcon: GreenhouseEffectIconFactory.createMicroScreenHomeIcon(),
      tandem: tandem,
      name: GreenhouseEffectFluent.screen.microStringProperty,

      // TODO: This should use the same content as molecules-and-light, see https://github.com/phetsims/greenhouse-effect/issues/324.
      // MoleculesAndLightKeyboardHelpContent should be moved to this repo.
      createKeyboardHelpNode: () => new SliderControlsAndBasicActionsKeyboardHelpContent()
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