// Copyright 2021-2023, University of Colorado Boulder

/**
 * Controls for the layers in the Layers model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import InfraredAbsorbanceControl from './InfraredAbsorbanceControl.js';
import AbsorbingLayersControl from './AbsorbingLayersControl.js';

// constants
const PANEL_MARGIN = 5;

export default class InfraredPanel extends Panel {

  public constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center' as const,
      fill: GreenhouseEffectColors.controlPanelBackgroundColorProperty,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.infraredStringProperty,

      // phet-io
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    };

    // title text for the panel
    const titleText = new Text( GreenhouseEffectStrings.infraredStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2
    } );

    const absorbingLayersControl = new AbsorbingLayersControl(
      layersModel.numberOfActiveAtmosphereLayersProperty,
      options.tandem.createTandem( 'absorbingLayersControl' )
    );

    const infraredAbsorbanceControl = new InfraredAbsorbanceControl(
      layersModel.layersInfraredAbsorbanceProperty,
      new Dimension2( width * 0.75, 1 ),
      options.tandem.createTandem( 'infraredAbsorbanceControl' )
    );

    const content = new VBox( {
      children: [ titleText, absorbingLayersControl, infraredAbsorbanceControl ],
      spacing: 20
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'InfraredPanel', InfraredPanel );