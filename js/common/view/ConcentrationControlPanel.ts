// Copyright 2021-2022, University of Colorado Boulder

/**
 * Controls for the concentration of greenhouse gases in the sim. Concentration can be modified directly by value
 * or greenhouse gas concentration can be selected from a particular date.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Circle, Line, Node, Path, Rectangle, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import calendarAltRegularShape from '../../../../sherpa/js/fontawesome-5/calendarAltRegularShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import VSlider from '../../../../sun/js/VSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import ConcentrationSliderSoundGenerator from './ConcentrationSliderSoundGenerator.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import RadiationDescriber from './describers/RadiationDescriber.js';

// constants
const lotsString = greenhouseEffectStrings.concentrationPanel.lots;
const noneString = greenhouseEffectStrings.concentrationPanel.none;
const waterConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.waterConcentrationPattern;
const carbonDioxideConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.carbonDioxideConcentrationPattern;
const methaneConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.methaneConcentrationPattern;
const nitrousOxideConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.nitrousOxideConcentrationPattern;

// Height in view coordinates of the concentration slider track (when controlling concentration by value) and the
// concentration meter graphic (when controlling by date). These are the same height so that the positions of values
// along the slider are at the same positions of values along the concentration meter.
const CONCENTRATION_SLIDER_TRACK_HEIGHT = 150;

// Size of the concentration slider thumb, also used for layout of labels.
const CONCENTRATION_SLIDER_THUMB_SIZE = new Dimension2( 20, 10 );

// Tick sizes for the concentration meter.
const CONCENTRATION_METER_MACRO_BOX_WIDTH = 30;
const CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS = 14;

// Margins between content and panel borders.
const PANEL_MARGINS = 5;

// Spacing between contents within the panel.
const CONTENT_SPACING = 10;

// For text labels for the slider and meter.
const LABEL_OPTIONS = { font: GreenhouseEffectConstants.CONTENT_FONT, maxWidth: 60 };

// color of meters and controls in this panel
const CONCENTRATION_CONTROLS_STROKE = 'black';

const RADIO_BUTTON_GROUP_OPTIONS = {
  baseColor: 'white',
  selectedStroke: 'rgb(0,173,221)',
  selectedLineWidth: 2
};

type SelfOptions = {

  // If true, the panel will include a readout of the composition of greenhouse gases when selecting concentrations by
  // date.
  includeCompositionData?: boolean;
};
type ConcentrationControlPanelOptions = SelfOptions & PanelOptions;

class ConcentrationControlPanel extends Panel {

  /**
   * @param width - width the panel contents are limited to, for i18n and layout with other screen components
   * @param concentrationModel
   * @param radiationDescriber
   * @param [providedOptions]
   */
  public constructor( width: number,
                      concentrationModel: ConcentrationModel,
                      radiationDescriber: RadiationDescriber,
                      providedOptions?: ConcentrationControlPanelOptions ) {

    const options = optionize<ConcentrationControlPanelOptions, SelfOptions, PanelOptions>()( {

      includeCompositionData: false,
      xMargin: PANEL_MARGINS,
      yMargin: PANEL_MARGINS,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.title,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // Title for the whole panel
    const titleNode = new Text( greenhouseEffectStrings.concentrationPanel.greenhouseGasConcentration, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGINS * 2,
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    // controls the concentration directly by value
    const concentrationSlider = new ConcentrationSlider(
      concentrationModel,
      radiationDescriber,
      options.tandem.createTandem( 'concentrationSlider' )
    );

    // controls to select greenhouse gas concentration by date, and a meter displaying relative concentration
    const dateControl = new DateControl(
      concentrationModel.dateProperty,
      concentrationModel.concentrationProperty,
      concentrationModel.concentrationControlModeProperty,
      options.tandem.createTandem( 'dateControl' )
    );

    // selects how the user is controlling concentration, by date or by value
    const controlRadioButtonGroup = new ConcentrationControlRadioButtonGroup(
      concentrationModel.concentrationControlModeProperty,
      options.tandem.createTandem( 'controlRadioButtonGroup' )
    );

    // Put the two concentration controls into a single node where only one is visible at a time.
    const controlsParentNode = new Node( {
      children: [ concentrationSlider, dateControl ]
    } );
    concentrationSlider.center = dateControl.center;

    const contentChildren = [ titleNode, controlsParentNode, controlRadioButtonGroup ];

    let compositionDataNode: CompositionDataNode | null = null;
    if ( options.includeCompositionData ) {
      compositionDataNode = new CompositionDataNode( concentrationModel.dateProperty );
      contentChildren.push( compositionDataNode );
    }

    const content = new VBox( {
      children: contentChildren,
      spacing: CONTENT_SPACING
    } );

    super( content, options );

    // only one form of controls is visible at a time
    concentrationModel.concentrationControlModeProperty.link( concentrationControl => {
      concentrationSlider.visible = ConcentrationControlMode.BY_VALUE === concentrationControl;
      dateControl.visible = ConcentrationControlMode.BY_DATE === concentrationControl;

      if ( compositionDataNode ) {
        compositionDataNode.visible = dateControl.visible;
      }
    } );
  }
}

/**
 * Inner class containing controls for selecting a concentration by date as well as a concentration meter showing
 * relative greenhouse gas concentration in time. The visualization has a "macro" line spanning from "none" to "lots"
 * of concentration and a "micro" line that is a zoomed in portion of the "macro". The "micro" line shows the
 * value of concentration relative to the range of values that can be selected by date.
 */
class DateControl extends Node {

  /**
   * @param dateProperty
   * @param concentrationProperty - setting date will modify concentration
   * @param concentrationControlModeProperty - setting date will modify concentration
   * @param tandem
   */
  public constructor( dateProperty: EnumerationProperty<ConcentrationDate>,
                      concentrationProperty: IReadOnlyProperty<number>,
                      concentrationControlModeProperty: EnumerationProperty<ConcentrationControlMode>,
                      tandem: Tandem ) {

    super();

    // numeric date representations are not translatable, see https://github.com/phetsims/greenhouse-effect/issues/21
    const twentyTwentyLabel = '2020';
    const nineteenFiftyLabel = '1950';
    const seventeenFiftyLabel = '1750';
    const iceAgeLabel = greenhouseEffectStrings.concentrationPanel.iceAge;

    // the radio buttons for the date control
    const items = [
      {
        node: new Text( twentyTwentyLabel, LABEL_OPTIONS ),
        value: ConcentrationDate.TWENTY_TWENTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearTwentyTwenty,
        tandemName: 'twentyTwentyRadioButton'
      },
      {
        node: new Text( nineteenFiftyLabel, LABEL_OPTIONS ),
        value: ConcentrationDate.NINETEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearNineteenFifty,
        tandemName: 'nineteenFiftyRadioButton'
      },
      {
        node: new Text( seventeenFiftyLabel, LABEL_OPTIONS ),
        value: ConcentrationDate.SEVENTEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearSeventeenFifty,
        tandemName: 'seventeenFiftyRadioButton'
      },
      {
        node: new Text( iceAgeLabel, LABEL_OPTIONS ),
        value: ConcentrationDate.ICE_AGE,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.iceAge,
        tandemName: 'iceAgeRadioButton'
      }
    ];
    const dateRadioButtonGroup = new RectangularRadioButtonGroup(
      dateProperty,
      items,
      merge(
        {

          // pdom
          labelTagName: 'h4',
          labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.label,
          helpText: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.helpText,

          // phet-io
          tandem: tandem.createTandem( 'dateRadioButtonGroup' )
        },
        RADIO_BUTTON_GROUP_OPTIONS
      )
    );

    // relative concentration graphic
    const meterLineOptions = { stroke: CONCENTRATION_CONTROLS_STROKE, lineWidth: 2 };
    const macroConcentrationLine = new Line( 0, 0, 0, CONCENTRATION_SLIDER_TRACK_HEIGHT, meterLineOptions );
    const microConcentrationLine = new Line( 0, 0, 0, CONCENTRATION_SLIDER_TRACK_HEIGHT, meterLineOptions );

    // Create the macroBox, which is the little rectangle that depicts the area that is being magnified.  This is sized
    // to automatically hold all of the possible concentration values that are associated with dates.
    const macroBoxProportionateHeight = ConcentrationModel.DATE_CONCENTRATION_RANGE.getLength() /
                                        ConcentrationModel.CONCENTRATION_RANGE.getLength() *
                                        1.2;
    const macroBoxProportionateCenterY = ConcentrationModel.DATE_CONCENTRATION_RANGE.getCenter() /
                                         ConcentrationModel.CONCENTRATION_RANGE.getLength();
    const macroValueBox = new Rectangle(
      0,
      0,
      CONCENTRATION_METER_MACRO_BOX_WIDTH,
      CONCENTRATION_SLIDER_TRACK_HEIGHT * macroBoxProportionateHeight,
      {
        stroke: CONCENTRATION_CONTROLS_STROKE
      }
    );

    // minor ticks on the micro line
    const minorTickLineOptions = { stroke: 'grey' };
    for ( let i = 0; i <= CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS; i++ ) {
      const tick = new Line( 0, 0, 9, 0, minorTickLineOptions );

      tick.center = microConcentrationLine.centerTop.plusXY(
        0,
        i * CONCENTRATION_SLIDER_TRACK_HEIGHT / CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS
      );
      microConcentrationLine.addChild( tick );
    }

    // labels for the macro line
    const lotsText = new Text( lotsString, LABEL_OPTIONS );
    const noneText = new Text( noneString, LABEL_OPTIONS );

    // lines between macro and micro lines showing that the micro line is a zoomed in view of the macro line, end
    // points are set after layout
    const connectionLineOptions = { stroke: 'gray', lineDash: [ 5, 5 ] };
    const topConnectionLine = new Line( 0, 0, 0, 0, connectionLineOptions );
    const bottomConnectionLine = new Line( 0, 0, 0, 0, connectionLineOptions );

    const valueCircle = new Circle( 5, { fill: 'black' } );

    // add components
    this.addChild( macroValueBox );
    this.addChild( macroConcentrationLine );
    this.addChild( microConcentrationLine );
    this.addChild( topConnectionLine );
    this.addChild( bottomConnectionLine );
    this.addChild( valueCircle );
    this.addChild( lotsText );
    this.addChild( noneText );
    this.addChild( dateRadioButtonGroup );

    // layout - label text at top and bottom of line, offset to match position of text
    // for the slider which allows extra space for the thumb
    lotsText.centerBottom = macroConcentrationLine.centerTop.minusXY( 0, CONCENTRATION_SLIDER_THUMB_SIZE.height / 2 );
    noneText.centerTop = macroConcentrationLine.centerBottom.plusXY( 0, CONCENTRATION_SLIDER_THUMB_SIZE.height / 2 );

    microConcentrationLine.center = macroConcentrationLine.center.plusXY( 70, 0 );

    macroValueBox.center = macroConcentrationLine.centerBottom.plusXY(
      0,
      -CONCENTRATION_SLIDER_TRACK_HEIGHT * macroBoxProportionateCenterY
    );

    topConnectionLine.setPoint1( macroValueBox.rightTop );
    topConnectionLine.setPoint2( microConcentrationLine.centerTop );

    bottomConnectionLine.setPoint1( macroValueBox.rightBottom );
    bottomConnectionLine.setPoint2( microConcentrationLine.centerBottom );

    dateRadioButtonGroup.leftTop = microConcentrationLine.rightTop.plusXY( 10, 0 );

    // place the value circle at a position representing current concentration
    const concentrationRange = ConcentrationModel.CONCENTRATION_RANGE;
    const concentrationHeightFunction = new LinearFunction(
      concentrationRange.getLength() * ( macroBoxProportionateCenterY - macroBoxProportionateHeight / 2 ),
      concentrationRange.getLength() * ( macroBoxProportionateCenterY + macroBoxProportionateHeight / 2 ),
      microConcentrationLine.bottom,
      microConcentrationLine.top
    );
    valueCircle.centerX = microConcentrationLine.centerX;
    Multilink.multilink(
      [ concentrationProperty, concentrationControlModeProperty ],
      ( concentration, concentrationControlMode ) => {
        if ( concentrationControlMode === ConcentrationControlMode.BY_DATE ) {
          valueCircle.centerY = concentrationHeightFunction.evaluate( concentration );
        }
      }
    );
  }
}

/**
 * Inner class that is a labelled VSlider that directly controls greenhouse gas concentration in the sim.
 */
class ConcentrationSlider extends Node {
  public constructor( concentrationModel: ConcentrationModel, radiationDescriber: RadiationDescriber, tandem: Tandem ) {

    super( { tandem: tandem } );

    const sliderRange = concentrationModel.manuallyControlledConcentrationProperty.range!;
    const sliderSoundGenerator = new ConcentrationSliderSoundGenerator(
      concentrationModel.concentrationProperty,
      sliderRange
    );

    const slider = new VSlider( concentrationModel.manuallyControlledConcentrationProperty, sliderRange, {
      trackSize: new Dimension2( 1, CONCENTRATION_SLIDER_TRACK_HEIGHT ),
      thumbSize: new Dimension2( 20, 10 ),

      // constrain the value a bit to avoid some oddities with floating point math
      constrainValue: n => Utils.toFixedNumber( n, 6 ),

      // sound generation
      soundGenerator: sliderSoundGenerator,

      // pdom
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.concentration.greenhouseGasConcentration,
      labelTagName: 'label',
      helpText: greenhouseEffectStrings.a11y.concentrationPanel.concentration.concentrationSliderHelpText,
      keyboardStep: 0.05,
      shiftKeyboardStep: 0.01, // finer grain
      pageKeyboardStep: 0.2, // coarser grain,
      a11yCreateAriaValueText: ( value: number ) => {
        return ConcentrationDescriber.getConcentrationDescriptionWithValue( value, true, false );
      },

      // phet-io
      tandem: tandem.createTandem( 'slider' )
    } );
    slider.scale( -1, 1 );

    // add labels to the slider
    const lotsText = new Text( lotsString, LABEL_OPTIONS );
    const noneText = new Text( noneString, LABEL_OPTIONS );

    this.addChild( slider );
    this.addChild( lotsText );
    this.addChild( noneText );

    lotsText.centerBottom = slider.centerTop;
    noneText.centerTop = slider.centerBottom;
  }
}

class CompositionDataNode extends VBox {
  private readonly waterText: RichText;
  private readonly carbonDioxideText: RichText;
  private readonly methaneText: RichText;
  private readonly nitrousOxideText: RichText;

  public constructor( dateProperty: EnumerationProperty<ConcentrationDate> ) {
    super( {
      align: 'left'
    } );

    const textOptions = {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 200
    };
    this.waterText = new RichText( '', textOptions );
    this.carbonDioxideText = new RichText( '', textOptions );
    this.methaneText = new RichText( '', textOptions );
    this.nitrousOxideText = new RichText( '', textOptions );

    this.children = [ this.waterText, this.carbonDioxideText, this.methaneText, this.nitrousOxideText ];

    dateProperty.link( this.updateCompositionReadout.bind( this ) );
  }

  /**
   * Update the readout of greenhouse gas composition data for the provided date.
   * NOTE: Don't have data or lookup yet, that needs to be implemented.
   */
  private updateCompositionReadout(): void {
    const waterString = StringUtils.fillIn( waterConcentrationPatternString, { value: 70 } );
    const carbonDioxideString = StringUtils.fillIn( carbonDioxideConcentrationPatternString, { value: 414 } );
    const methaneString = StringUtils.fillIn( methaneConcentrationPatternString, { value: 1.876 } );
    const nitrousOxideString = StringUtils.fillIn( nitrousOxideConcentrationPatternString, { value: 0.332 } );

    this.waterText.text = waterString;
    this.carbonDioxideText.text = carbonDioxideString;
    this.methaneText.text = methaneString;
    this.nitrousOxideText.text = nitrousOxideString;
  }
}

/**
 * An inner class for the control panel that creates a RadioButtonGroup that selects between controlling concentration
 * by date or by value.
 */
class ConcentrationControlRadioButtonGroup extends RectangularRadioButtonGroup<ConcentrationControlMode> {

  /**
   * @param property - Property for the method of controlling concentration
   * @param tandem
   */
  public constructor( property: EnumerationProperty<ConcentrationControlMode>, tandem: Tandem ) {

    const dateIcon = new Path( calendarAltRegularShape, {
      fill: 'black'
    } );

    // the CalendarAlt isn't square, scale it down and produce a square button
    dateIcon.setScaleMagnitude( 34 / dateIcon.width, 34 / dateIcon.height );

    const dummyProperty = new NumberProperty( 5, { range: new Range( 0, 10 ) } );
    assert && assert( dummyProperty.range );
    const sliderIcon = new VSlider( dummyProperty, dummyProperty.range!, {
      trackSize: new Dimension2( 2, dateIcon.height - 9 ),
      thumbSize: new Dimension2( 18, 9 ),
      trackFillEnabled: 'black',
      pickable: false,

      // slider icon should not have representation in the PDOM, accessibility is managed by the checkbox
      tagName: null,

      // phet-io - opting out of the Tandem for the icon
      tandem: Tandem.OPT_OUT
    } );

    const items = [
      {
        node: sliderIcon,
        value: ConcentrationControlMode.BY_VALUE,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.byConcentration,
        tandemName: 'byConcentrationRadioButton'
      },
      {
        node: dateIcon,
        value: ConcentrationControlMode.BY_DATE,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.byTimePeriod,
        tandemName: 'byTimePeriodRadioButton'
      }
    ];

    super(
      property,
      items,
      merge(
        {
          orientation: 'horizontal' as const,

          // pdom
          labelTagName: 'h4',
          labelContent: greenhouseEffectStrings.a11y.concentrationPanel.exploreMode,
          helpText: greenhouseEffectStrings.a11y.concentrationPanel.exploreModeHelpText,

          // phet-io
          tandem: tandem
        },
        RADIO_BUTTON_GROUP_OPTIONS
      )
    );
  }
}

greenhouseEffect.register( 'ConcentrationControlPanel', ConcentrationControlPanel );
export default ConcentrationControlPanel;
