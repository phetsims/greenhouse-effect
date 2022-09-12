// Copyright 2021-2022, University of Colorado Boulder

/**
 * Controls for the layers in the Layers model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { HBox, Image, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import NumberOfLayersSoundPlayer from './NumberOfLayersSoundPlayer.js';
import IrAbsorbanceSoundPlayer from './IrAbsorbanceSoundPlayer.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const MAX_LAYERS = 3; // from design doc
const HEADING_FONT = new PhetFont( 14 );
const TICK_MARK_LABEL_FONT = new PhetFont( 10 );
const PANEL_MARGIN = 5;
const IR_ABSORBANCE_STEP_SIZE = 0.1;

class LayersControl extends Panel {

  public constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center' as const,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.infrared,

      // phet-io
      tandem: tandem
    };

    // title text for the panel
    const titleText = new Text( GreenhouseEffectStrings.infrared, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    // image of a photon that will be combined with the title text to form the overall title for the panel
    const infraredPhotonIcon = new Image( infraredPhoton_png, {
      maxWidth: 20 // empirically determined to look how we want it
    } );

    const titleNode = new HBox( {
      children: [ titleText, infraredPhotonIcon ],
      spacing: 10
    } );

    // convenience variable
    const absorbanceRange = LayerModelModel.IR_ABSORBANCE_RANGE;

    // sound player used by slider for sound generation in the middle range
    const irAbsorbanceSoundPlayer = new IrAbsorbanceSoundPlayer(
      layersModel.layersInfraredAbsorbanceProperty,
      absorbanceRange,
      { initialOutputLevel: 0.075 }
    );
    soundManager.addSoundGenerator( irAbsorbanceSoundPlayer );

    // sound player for the number of layers
    const numberOfLayersSoundPlayer = new NumberOfLayersSoundPlayer(
      layersModel.numberOfActiveAtmosphereLayersProperty,
      { initialOutputLevel: 0.2 }
    );
    soundManager.addSoundGenerator( numberOfLayersSoundPlayer );

    // number picker for controlling the number of layers
    const numberOfLayersNumberPicker = new NumberPicker(
      layersModel.numberOfActiveAtmosphereLayersProperty,
      new Property( new Range( 0, MAX_LAYERS ) ),
      {
        cornerRadius: 3,
        xMargin: 5,
        font: new PhetFont( 16 ),
        valueChangedSoundPlayer: numberOfLayersSoundPlayer,
        boundarySoundPlayer: numberOfLayersSoundPlayer,

        // phet-io
        tandem: tandem.createTandem( 'numberOfLayersPicker' )
      }
    );

    // label for picker that controls the number of layers
    const layerNumberControlLabel = new Text( GreenhouseEffectStrings.absorbingLayers, {
      font: HEADING_FONT
    } );

    // Combine the control and label for controlling the number of layers into a single node.
    const numberOfLayersControl = new HBox( {
      children: [ numberOfLayersNumberPicker, layerNumberControlLabel ],
      spacing: 5
    } );

    // label for the slider that controls IR absorbance
    const irAbsorbanceSliderLabel = new Text( GreenhouseEffectStrings.infraredAbsorbance, {
      font: HEADING_FONT
    } );

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
        constrainValue: ( value: number ) => Utils.roundToInterval( value, IR_ABSORBANCE_STEP_SIZE ),
        keyboardStep: IR_ABSORBANCE_STEP_SIZE,
        shiftKeyboardStep: IR_ABSORBANCE_STEP_SIZE,
        pageKeyboardStep: IR_ABSORBANCE_STEP_SIZE * 2,
        valueChangeSoundGeneratorOptions: {
          numberOfMiddleThresholds: 8,
          middleMovingUpSoundPlayer: irAbsorbanceSoundPlayer,
          middleMovingDownSoundPlayer: irAbsorbanceSoundPlayer,
          minSoundPlayer: irAbsorbanceSoundPlayer,
          maxSoundPlayer: irAbsorbanceSoundPlayer
        },

        // phet-io
        tandem: tandem.createTandem( 'absorbanceSlider' )
      }
    );
    irAbsorbanceSlider.addMajorTick(
      absorbanceRange.min,
      new Text( StringUtils.fillIn( GreenhouseEffectStrings.valuePercentPattern, { value: absorbanceRange.min * 100 } ), {
        font: TICK_MARK_LABEL_FONT
      } )
    );
    irAbsorbanceSlider.addMajorTick(
      absorbanceRange.max,
      new Text( StringUtils.fillIn( GreenhouseEffectStrings.valuePercentPattern, { value: absorbanceRange.max * 100 } ), {
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