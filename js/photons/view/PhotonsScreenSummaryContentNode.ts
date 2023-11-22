// Copyright 2023, University of Colorado Boulder

/**
 * A Node that manages PDOM content and structure for the screen summary of the "Photons" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LandscapeScreenSummaryContentNode from '../../common/view/LandscapeScreenSummaryContentNode.js';
import PhotonsModel from '../model/PhotonsModel.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import greenhouseEffect from '../../greenhouseEffect.js';

export default class PhotonsScreenSummaryContentNode extends LandscapeScreenSummaryContentNode {
  public constructor( model: PhotonsModel ) {
    super(
      model,
      GreenhouseEffectStrings.a11y.photons.screenSummary.playAreaDescriptionStringProperty,
      GreenhouseEffectStrings.a11y.photons.screenSummary.controlAreaDescriptionStringProperty
    );
  }
}

greenhouseEffect.register( 'PhotonsScreenSummaryContentNode', PhotonsScreenSummaryContentNode );