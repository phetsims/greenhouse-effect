// Copyright 2023, University of Colorado Boulder

/**
 * Base class for the control panels used on the "Layer Model" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';

// constants
const PANEL_MARGIN = 5;

export default class LayerScreenControlPanel extends Panel {

  public constructor( controls: Node[],
                      width: number,
                      layersModel: LayerModelModel,
                      titleStringProperty: TReadOnlyProperty<string>,
                      tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center' as const,
      fill: GreenhouseEffectColors.controlPanelBackgroundColorProperty,
      isDisposable: false,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: titleStringProperty,

      // phet-io
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    };

    // Title text for the panel.
    const titleText = new Text( titleStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2
    } );

    const content = new VBox( {
      children: [ titleText, ...controls ],
      spacing: 24
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'LayerScreenControlPanel', LayerScreenControlPanel );