// Copyright 2023-2024, University of Colorado Boulder

/**
 * A Node that manages PDOM content and structure for the screen summary of a greenhouse effect screen.
 * This is a superclass for subclasses that will fill in content and implement state descriptions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';
import { Node } from '../../../../scenery/js/imports.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';

export default class GreenhouseEffectScreenSummaryContentNode extends ScreenSummaryContent {

  // The main description for the screen which updates with the model.
  protected readonly simStateDescriptionNode: Node;

  /**
   * @param model
   * @param playAreaDescription - a description string for the play area
   * @param controlAreaDescription - a description string for the control area
   */
  public constructor( model: GreenhouseEffectModel, playAreaDescription: LocalizedStringProperty, controlAreaDescription: LocalizedStringProperty ) {
    super( null, { isDisposable: false } );

    const playAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: playAreaDescription
    } );

    const controlAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: controlAreaDescription
    } );

    this.simStateDescriptionNode = new Node( { tagName: 'p' } );
    const startSunlightHintNode = new Node( {
      tagName: 'p',
      innerContent: GreenhouseEffectStrings.a11y.startSunlightHintStringProperty
    } );

    this.children = [
      playAreaDescriptionNode,
      controlAreaDescriptionNode,
      this.simStateDescriptionNode,
      startSunlightHintNode
    ];
  }
}

greenhouseEffect.register( 'GreenhouseEffectScreenSummaryContentNode', GreenhouseEffectScreenSummaryContentNode );