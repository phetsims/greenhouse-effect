// Copyright 2021, University of Colorado Boulder

/**
 * Controls for the layers in the Layers model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import { Image } from '../../../../scenery/js/imports.js';
import photon660Image from '../../../images/photon-660_png.js';
import { HBox } from '../../../../scenery/js/imports.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

// constants
const MAX_LAYERS = 3; // from design doc
const HEADING_FONT = new PhetFont( 14 );
const TICK_MARK_LABEL_FONT = new PhetFont( 10 );
const PANEL_MARGIN = 5;

class LayersControl extends Panel {

  constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center',

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.infrared,

      // phet-io
      tandem: tandem
    };

    // Title text for the panel.
    const titleTextNode = new Text( greenhouseEffectStrings.infrared, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2,
      tandem: options.tandem.createTandem( 'titleTextNode' )
    } );

    // Image of a photon that will be combined with the title text to form the overall title for the panel.
    const infraredPhotonIcon = new Image( photon660Image, {
      maxWidth: 20 // empirically determined to look how we want it
    } );

    const titleNode = new HBox( {
      children: [ titleTextNode, infraredPhotonIcon ],
      spacing: 10
    } );

    // number picker for controlling the number of layers
    const numberOfLayersNumberPicker = new NumberPicker(
      layersModel.numberOfActiveAtmosphereLayersProperty,
      new Property( new Range( 0, MAX_LAYERS ) ),
      {
        cornerRadius: 3,
        xMargin: 5,
        font: new PhetFont( 16 ),

        // phet-io
        tandem: tandem.createTandem( 'numberOfLayersControl' )
      }
    );

    // label for picker that controls the number of layers
    const layerNumberControlLabel = new Text( greenhouseEffectStrings.absorbingLayers, {
      font: HEADING_FONT
    } );

    // Combine the control and label for controlling the number of layers into a single node.
    const numberOfLayersControl = new HBox( {
      children: [ numberOfLayersNumberPicker, layerNumberControlLabel ],
      spacing: 5
    } );

    // label for the slider that controls IR absorbance
    const irAbsorbanceSliderLabel = new Text( greenhouseEffectStrings.infraredAbsorbance, {
      font: HEADING_FONT
    } );

    // convenience variable
    const absorbanceRange = LayerModelModel.IR_ABSORBANCE_RANGE;

    // slider for controlling the absorbance of the layers
    const irAbsorbanceSlider = new HSlider(
      layersModel.layersInfraredAbsorbanceProperty,
      absorbanceRange,
      {
        trackSize: new Dimension2( width * 0.75, 1 ),
        thumbSize: new Dimension2( 10, 20 ),
        thumbTouchAreaXDilation: 8,
        thumbTouchAreaYDilation: 8,
        majorTickLength: 12,
        minorTickLength: 6,
        tickLabelSpacing: 2,

        // phet-io
        tandem: tandem.createTandem( 'absorbanceSlider' )
      }
    );
    irAbsorbanceSlider.addMajorTick(
      absorbanceRange.min,
      new Text( StringUtils.fillIn( greenhouseEffectStrings.valuePercentPattern, { value: absorbanceRange.min * 100 } ), {
        font: TICK_MARK_LABEL_FONT
      } )
    );
    irAbsorbanceSlider.addMajorTick(
      absorbanceRange.max,
      new Text( StringUtils.fillIn( greenhouseEffectStrings.valuePercentPattern, { value: absorbanceRange.max * 100 } ), {
        font: TICK_MARK_LABEL_FONT
      } )
    );
    const tickMarkSpacing = 0.1;
    for ( let minorTickMarkValue = absorbanceRange.min + tickMarkSpacing;
          minorTickMarkValue < absorbanceRange.max;
          minorTickMarkValue += tickMarkSpacing ) {

      // Add minor tick mark to the slider.
      irAbsorbanceSlider.addMinorTick( minorTickMarkValue );
    }

    // Put the label and slider for the IR absorbance control into their own VBox.
    const irAbsorbanceControl = new VBox( {
      children: [ irAbsorbanceSliderLabel, irAbsorbanceSlider ],
      spacing: 5
    } );


    const content = new VBox( {
      children: [ titleNode, numberOfLayersControl, irAbsorbanceControl ],
      spacing: 20
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'LayersControl', LayersControl );
export default LayersControl;