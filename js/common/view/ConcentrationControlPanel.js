// Copyright 2021, University of Colorado Boulder

/**
 * Controls for the concentration of greenhouse gasses in the sim. Concentration can be modified directly by value
 * or greenhouse gas concentration can be selected from a particular date.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import CalendarAlt from '../../../../sherpa/js/fontawesome-5/regular/CalendarAlt.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import VSlider from '../../../../sun/js/VSlider.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

// constants
const lotsString = greenhouseEffectStrings.concentrationPanel.lots;
const noneString = greenhouseEffectStrings.concentrationPanel.none;
const waterConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.waterConcentrationPattern;
const carbonDioxideConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.carbonDioxideConcentrationPattern;
const methaneConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.methaneConcentrationPattern;
const nitrousOxideConcentrationPatternString = greenhouseEffectStrings.concentrationPanel.nitrousOxideConcentrationPattern;

const CONCENTRATION_METER_HEIGHT = 150; // height in view coordinates of the concentration meter (without labels)
const CONCENTRATION_METER_MACRO_TICK_WIDTH = 15;
const CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS = 14;

const PANEL_MARGINS = 5; // margins between content and panel borders
const CONTENT_SPACING = 10; // spacing between contents within the panel

const RADIO_BUTTON_GROUP_OPTIONS = {
  baseColor: 'white',
  selectedStroke: 'rgb(0,173,221)',
  selectedLineWidth: 2
};

class ConcentrationControlPanel extends Panel {

  /**
   * @param {number} width - width the panel contents are limited to, for i18n and layout with other screen components
   * @param {NumberProperty} concentrationProperty
   * @param {EnumerationProperty} concentrationControlProperty
   * @param {EnumerationProperty} dateProperty
   * @param {Object} [options]
   */
  constructor( width, concentrationProperty, concentrationControlProperty, dateProperty, options ) {

    options = merge( {

      xMargin: PANEL_MARGINS,
      yMargin: PANEL_MARGINS,

      // {boolean} - if true, the panel will include a readout of the composition of greenhouse gasses when selecting
      // concentrations by date
      includeCompositionData: false,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.title
    }, options );

    const titleNode = new Text( greenhouseEffectStrings.concentrationPanel.greenhouseGasConcentration, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGINS * 2
    } );

    // directly controls concentration by value
    const sliderControl = new SliderControl( concentrationProperty );

    // controls to select greenhouse gas concentration by date, and a visualization of relative concentration
    const dateControl = new DateControl( dateProperty, concentrationProperty );

    // selects how the user is controlling concentration, by date or by value
    const controlRadioButtonGroup = new ConcentrationControlRadioButtonGroup( concentrationControlProperty );

    const controlsParentNode = new Node( {
      children: [ sliderControl, dateControl ]
    } );
    sliderControl.center = dateControl.center;

    const contentChildren = [ titleNode, controlsParentNode, controlRadioButtonGroup ];

    // layout
    controlsParentNode.centerTop = titleNode.centerBottom.plusXY( 0, CONTENT_SPACING );
    controlRadioButtonGroup.centerTop = controlsParentNode.centerBottom.plusXY( 0, CONTENT_SPACING );

    let compositionDataNode = null;
    if ( options.includeCompositionData ) {
      compositionDataNode = new CompositionDataNode( dateProperty );
      contentChildren.push( compositionDataNode );

      compositionDataNode.left = titleNode.left;
      compositionDataNode.top = controlRadioButtonGroup.bottom + CONTENT_SPACING;
    }

    const content = new Node( {
      children: contentChildren
    } );

    super( content, options );

    // only one form of controls is visible at a time
    concentrationControlProperty.link( concentrationControl => {
      sliderControl.visible = ConcentrationModel.CONCENTRATION_CONTROL.VALUE === concentrationControl;
      dateControl.visible = ConcentrationModel.CONCENTRATION_CONTROL.DATE === concentrationControl;

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
   * @param {EnumerationProperty} dateProperty
   * @param {NumberProperty} concentrationProperty - setting date will modify concentration
   */
  constructor( dateProperty, concentrationProperty ) {
    super();

    // numeric date representations are not translatable, see https://github.com/phetsims/greenhouse-effect/issues/21
    const twentyNineteenLabel = '2019';
    const nineteenFiftyLabel = '1950';
    const seventeenFiftyLabel = '1750';
    const iceAgeLabel = greenhouseEffectStrings.concentrationPanel.iceAge;

    // the radio buttons for the date control
    const items = [
      {
        node: new Text( twentyNineteenLabel, { font: GreenhouseEffectConstants.CONTENT_FONT } ),
        value: ConcentrationModel.CONCENTRATION_DATE.TWO_THOUSAND_NINETEEN,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearTwentyNineteen
      },
      {
        node: new Text( nineteenFiftyLabel, { font: GreenhouseEffectConstants.CONTENT_FONT } ),
        value: ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearNineteenFifty
      },
      {
        node: new Text( seventeenFiftyLabel, { font: GreenhouseEffectConstants.CONTENT_FONT } ),
        value: ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearSeventeenFifty
      },
      {
        node: new Text( iceAgeLabel, { font: GreenhouseEffectConstants.CONTENT_FONT } ),
        value: ConcentrationModel.CONCENTRATION_DATE.ICE_AGE,
        labelContent: iceAgeLabel
      }
    ];
    const dateRadioButtonGroup = new RectangularRadioButtonGroup(
      dateProperty,
      items,
      merge(
        {
          labelTagName: 'h4',
          labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.label,
          helpText: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.helpText
        },
        RADIO_BUTTON_GROUP_OPTIONS
      )
    );

    // relative concentration graphic
    const meterLineOptions = { stroke: 'black' };
    const macroConcentrationLine = new Line( 0, 0, 0, CONCENTRATION_METER_HEIGHT, meterLineOptions );
    const microConcentrationLine = new Line( 0, 0, 0, CONCENTRATION_METER_HEIGHT, meterLineOptions );

    const macroValueTick = new Line( 0, 0, CONCENTRATION_METER_MACRO_TICK_WIDTH, 0, meterLineOptions );
    const macroValueBox = new Rectangle( 0, 0, CONCENTRATION_METER_MACRO_TICK_WIDTH * 2, CONCENTRATION_METER_MACRO_TICK_WIDTH, meterLineOptions );

    // minor ticks on the micro line
    const minorTickLineOptions = { stroke: 'grey' };
    for ( let i = 0; i < CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS; i++ ) {
      const tick = new Line( 0, 0, 9, 0, minorTickLineOptions );

      tick.center = microConcentrationLine.centerTop.plusXY( 0, i * CONCENTRATION_METER_HEIGHT / CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS );
      microConcentrationLine.addChild( tick );
    }

    // labels for the macro line
    const lotsText = new Text( lotsString, { font: GreenhouseEffectConstants.CONTENT_FONT } );
    const noneText = new Text( noneString, { font: GreenhouseEffectConstants.CONTENT_FONT } );

    // lines between macro and micro lines showing that the micro line is a zoomed in view of the macro line, end
    // points are set after layout
    const connectionLineOptions = { stroke: 'gray', lineDash: [ 5, 5 ] };
    const topConnectionLine = new Line( 0, 0, 0, 0, connectionLineOptions );
    const bottomConnectionLine = new Line( 0, 0, 0, 0, connectionLineOptions );

    const valueCircle = new Circle( 5, { fill: 'black' } );

    // add components
    this.addChild( macroValueTick );
    this.addChild( macroValueBox );
    this.addChild( macroConcentrationLine );
    this.addChild( microConcentrationLine );
    this.addChild( topConnectionLine );
    this.addChild( bottomConnectionLine );
    this.addChild( valueCircle );
    this.addChild( lotsText );
    this.addChild( noneText );
    this.addChild( dateRadioButtonGroup );

    // layout
    lotsText.centerBottom = macroConcentrationLine.centerTop;
    noneText.centerTop = macroConcentrationLine.centerBottom;

    microConcentrationLine.center = macroConcentrationLine.center.plusXY( 70, 0 );

    macroValueTick.center = macroConcentrationLine.centerTop.plusXY( 0, CONCENTRATION_METER_HEIGHT / 4 );
    macroValueBox.center = macroValueTick.center;

    topConnectionLine.setPoint1( macroValueBox.rightTop );
    topConnectionLine.setPoint2( microConcentrationLine.centerTop );

    bottomConnectionLine.setPoint1( macroValueBox.rightBottom );
    bottomConnectionLine.setPoint2( microConcentrationLine.centerBottom );

    dateRadioButtonGroup.leftTop = microConcentrationLine.rightTop.plusXY( 10, 0 );

    // place the value circle at a position representing current concentration
    const concentrationRange = concentrationProperty.range;
    const concentrationHeightFunction = new LinearFunction( concentrationRange.min, concentrationRange.max, microConcentrationLine.bottom, microConcentrationLine.top );
    valueCircle.centerX = microConcentrationLine.centerX;
    concentrationProperty.link( concentration => {
      valueCircle.centerY = concentrationHeightFunction( concentration );
    } );
  }
}

/**
 * Inner class that is a labelled VSlider that directly controls greenhouse gas concentration in the sim.
 */
class SliderControl extends Node {

  /**
   * @param {NumberProperty} concentrationProperty
   */
  constructor( concentrationProperty ) {
    super();

    const concentrationRange = concentrationProperty.range;
    const concentrationSlider = new VSlider( concentrationProperty, concentrationProperty.range, {
      trackSize: new Dimension2( 1, 100 ),
      thumbSize: new Dimension2( 20, 10 ),
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.concentration.greenhouseGasConcentration,
      labelTagName: 'label',
      helpText: greenhouseEffectStrings.a11y.concentrationPanel.concentration.concentrationSliderHelpText
    } );

    const delta = concentrationRange.getLength() / 10;
    for ( let i = concentrationRange.min + delta; i < concentrationRange.max; i += delta ) {
      concentrationSlider.addMinorTick( i );
    }
    concentrationSlider.scale( -1, 1 );

    // add labels to the slider
    const lotsText = new Text( lotsString, { font: GreenhouseEffectConstants.CONTENT_FONT } );
    const noneText = new Text( noneString, { font: GreenhouseEffectConstants.CONTENT_FONT } );

    this.addChild( concentrationSlider );
    this.addChild( lotsText );
    this.addChild( noneText );

    lotsText.centerBottom = concentrationSlider.centerTop;
    noneText.centerTop = concentrationSlider.centerBottom;
  }
}

class CompositionDataNode extends VBox {

  /**
   * @param {EnumerationProperty} dateProperty
   */
  constructor( dateProperty ) {
    super( {
      align: 'left'
    } );

    const textOptions = { font: GreenhouseEffectConstants.CONTENT_FONT };
    this.waterText = new RichText( '', textOptions );
    this.carbondDioxideText = new RichText( '', textOptions );
    this.methaneText = new RichText( '', textOptions );
    this.nitrousOxideText = new RichText( '', textOptions );

    this.children = [ this.waterText, this.carbondDioxideText, this.methaneText, this.nitrousOxideText ];

    dateProperty.link( this.updateCompositionReadout.bind( this ) );
  }

  /**
   * Update the readout of greenhouse gas composition data for the provided date.
   * NOTE: Don't have data or lookup yet, that needs to be implemented.
   * @private
   *
   * @param {ConcentrationModel.CONCENTRATION_DATE} date
   */
  updateCompositionReadout( date ) {
    const waterString = StringUtils.fillIn( waterConcentrationPatternString, { value: 70 } );
    const carbonDioxideString = StringUtils.fillIn( carbonDioxideConcentrationPatternString, { value: 414 } );
    const methaneString = StringUtils.fillIn( methaneConcentrationPatternString, { value: 1.876 } );
    const nitrousOxideString = StringUtils.fillIn( nitrousOxideConcentrationPatternString, { value: 0.332 } );

    this.waterText.text = waterString;
    this.carbondDioxideText.text = carbonDioxideString;
    this.methaneText.text = methaneString;
    this.nitrousOxideText.text = nitrousOxideString;
  }
}

class ConcentrationControlRadioButtonGroup extends RectangularRadioButtonGroup {
  constructor( property ) {

    const dateIcon = new CalendarAlt( {
      fill: 'black'
    } );

    // the CalendarAlt isn't square, scale it down and produce a square button
    dateIcon.setScaleMagnitude( 34 / dateIcon.width, 34 / dateIcon.height );

    const dummyProperty = new NumberProperty( 5, { range: new Range( 0, 10 ) } );
    const sliderIcon = new VSlider( dummyProperty, dummyProperty.range, {
      trackSize: new Dimension2( 2, dateIcon.height - 9 ),
      thumbSize: new Dimension2( 18, 9 ),
      trackFillEnabled: 'black',
      pickable: false
    } );

    const items = [
      {
        node: sliderIcon,
        value: ConcentrationModel.CONCENTRATION_CONTROL.VALUE,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.byConcentration
      },
      {
        node: dateIcon,
        value: ConcentrationModel.CONCENTRATION_CONTROL.DATE,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.byTimePeriod
      }
    ];

    super(
      property,
      items,
      merge(
        {
          orientation: 'horizontal',

          // pdom
          labelTagName: 'h4',
          labelContent: greenhouseEffectStrings.a11y.concentrationPanel.exploreMode,
          helpText: greenhouseEffectStrings.a11y.concentrationPanel.exploreModeHelpText
        },
        RADIO_BUTTON_GROUP_OPTIONS
      )
    );
  }
}

greenhouseEffect.register( 'ConcentrationControlPanel', ConcentrationControlPanel );
export default ConcentrationControlPanel;
