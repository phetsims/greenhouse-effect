// Copyright 2021-2024, University of Colorado Boulder

/**
 * The Node that manages and updates the screen summary for the "Waves" screen in the PDOM.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LandscapeScreenSummaryContentNode from '../../common/view/LandscapeScreenSummaryContentNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import WavesModel from '../model/WavesModel.js';

class WavesScreenSummaryContentNode extends LandscapeScreenSummaryContentNode {

  public constructor( model: WavesModel ) {
    super(
      model,
      GreenhouseEffectStrings.a11y.waves.screenSummary.playAreaDescriptionStringProperty,
      GreenhouseEffectStrings.a11y.waves.screenSummary.controlAreaDescriptionStringProperty
    );
  }
}

greenhouseEffect.register( 'WavesScreenSummaryContentNode', WavesScreenSummaryContentNode );

export default WavesScreenSummaryContentNode;