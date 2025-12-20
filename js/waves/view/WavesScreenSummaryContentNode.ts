// Copyright 2021-2025, University of Colorado Boulder

/**
 * The Node that manages and updates the screen summary for the "Waves" screen in the PDOM.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LandscapeScreenSummaryContentNode from '../../common/view/LandscapeScreenSummaryContentNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import WavesModel from '../model/WavesModel.js';

class WavesScreenSummaryContentNode extends LandscapeScreenSummaryContentNode {

  public constructor( model: WavesModel ) {
    super(
      model,
      GreenhouseEffectFluent.a11y.waves.screenSummary.playAreaDescriptionStringProperty,
      GreenhouseEffectFluent.a11y.waves.screenSummary.controlAreaDescriptionStringProperty
    );
  }
}

greenhouseEffect.register( 'WavesScreenSummaryContentNode', WavesScreenSummaryContentNode );

export default WavesScreenSummaryContentNode;