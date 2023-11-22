// Copyright 2023, University of Colorado Boulder

/**
 * A Node that manages PDOM content and structure for the screen summary of the "Layer Model" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import GreenhouseEffectScreenSummaryContentNode from '../../common/view/GreenhouseEffectScreenSummaryContentNode.js';

export default class LayerModelScreenSummaryContentNode extends GreenhouseEffectScreenSummaryContentNode {
  public constructor( model: LayerModelModel ) {
    super(
      model,
      GreenhouseEffectStrings.a11y.layerModel.screenSummary.playAreaDescriptionStringProperty,
      GreenhouseEffectStrings.a11y.layerModel.screenSummary.controlAreaDescriptionStringProperty
    );
  }
}

greenhouseEffect.register( 'LayerModelScreenSummaryContentNode', LayerModelScreenSummaryContentNode );