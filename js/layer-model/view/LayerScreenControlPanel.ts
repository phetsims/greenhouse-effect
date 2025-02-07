// Copyright 2023-2024, University of Colorado Boulder

/**
 * Base class for the control panels used on the "Layer Model" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';

// constants
const PANEL_MARGIN = 5;

type LayerScreenControlPanelSelfOptions = EmptySelfOptions;

// You must provide a tandem, but you can optionally provide a labelContent.
type LayerScreenControlPanelOptions = LayerScreenControlPanelSelfOptions &
  PickRequired<PanelOptions, 'tandem'> &
  PickOptional<PanelOptions, 'labelContent'>;

export default class LayerScreenControlPanel extends Panel {

  public constructor( controls: Node[],
                      width: number,
                      layersModel: LayerModelModel,
                      titleStringProperty: TReadOnlyProperty<string>,
                      providedOptions: LayerScreenControlPanelOptions ) {

    const options = optionize<LayerScreenControlPanelOptions, LayerScreenControlPanelSelfOptions, PanelOptions>()( {
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
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

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