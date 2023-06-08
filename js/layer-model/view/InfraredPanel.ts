// Copyright 2021-2023, University of Colorado Boulder

/**
 * Controls for the layers in the Layers model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import Panel from '../../../../sun/js/Panel.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import IrAbsorbanceSoundPlayer from './IrAbsorbanceSoundPlayer.js';
import NumberOfLayersSoundPlayer from './NumberOfLayersSoundPlayer.js';

// constants
const MAX_LAYERS = 3; // from design doc
const HEADING_FONT = new PhetFont( 14 );
const TICK_MARK_TEXT_OPTIONS = {
  font: new PhetFont( 10 ),
  maxWidth: 30
};
const PANEL_MARGIN = 5;
const IR_ABSORBANCE_STEP_SIZE = 0.1;

class InfraredPanel extends Panel {

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
      tandem: tandem
    };

    // title text for the panel
    const titleText = new Text( GreenhouseEffectStrings.infraredStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2
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
    const absorbingLayersPicker = new NumberPicker(
      layersModel.numberOfActiveAtmosphereLayersProperty,
      new Property( new Range( 0, MAX_LAYERS ) ),
      {
        cornerRadius: 3,
        xMargin: 5,
        font: new PhetFont( 22 ),
        arrowHeight: 8,
        backgroundColor: GreenhouseEffectColors.controlPanelBackgroundColorProperty,
        valueChangedSoundPlayer: numberOfLayersSoundPlayer,
        boundarySoundPlayer: numberOfLayersSoundPlayer,

        // phet-io
        tandem: tandem.createTandem( 'absorbingLayersPicker' )
      }
    );

    // label for picker that controls the number of layers
    const layerNumberControlLabel = new Text( GreenhouseEffectStrings.absorbingLayersStringProperty, {
      font: HEADING_FONT
    } );

    // Combine the control and label for controlling the number of layers into a single node.
    const numberOfLayersControl = new HBox( {
      children: [ absorbingLayersPicker, layerNumberControlLabel ],
      spacing: 5
    } );

    // label for the slider that controls IR absorbance
    const irAbsorbanceSliderLabel = new Text( GreenhouseEffectStrings.infraredAbsorbanceStringProperty, {
      font: HEADING_FONT
    } );

    // slider for controlling the absorbance of the layers
    const irAbsorbanceSlider = new HSlider(
      layersModel.layersInfraredAbsorbanceProperty,
      absorbanceRange,
      {
        trackSize: new Dimension2( width * 0.75, 1 ),
        thumbSize: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE,
        thumbTouchAreaXDilation: 8,
        thumbTouchAreaYDilation: 8,
        majorTickLength: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.6,
        minorTickLength: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.25,
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
      new Text(
        new PatternStringProperty( GreenhouseEffectStrings.valuePercentPatternStringProperty, {
          value: absorbanceRange.min * 100
        }, { tandem: Tandem.OPT_OUT } ),
        TICK_MARK_TEXT_OPTIONS
      )
    );
    irAbsorbanceSlider.addMajorTick(
      absorbanceRange.max,
      new Text(
        new PatternStringProperty( GreenhouseEffectStrings.valuePercentPatternStringProperty, {
          value: absorbanceRange.max * 100
        }, { tandem: Tandem.OPT_OUT } ),
        TICK_MARK_TEXT_OPTIONS
      )
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
      children: [ titleText, numberOfLayersControl, irAbsorbanceControl ],
      spacing: 20
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'InfraredPanel', InfraredPanel );
export default InfraredPanel;