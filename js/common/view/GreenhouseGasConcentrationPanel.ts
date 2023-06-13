// Copyright 2021-2023, University of Colorado Boulder

/**
 * Controls for the concentration of greenhouse gases in the sim. Concentration can be modified directly by value or
 * greenhouse gas concentration can be selected from a particular date.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Circle, Color, FlowBox, HBox, Line, Node, Path, Rectangle, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import calendarAltRegularShape from '../../../../sherpa/js/fontawesome-5/calendarAltRegularShape.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import VSlider from '../../../../sun/js/VSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectColors from '../GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import ConcentrationSliderSoundGenerator from './ConcentrationSliderSoundGenerator.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import RadiationDescriber from './describers/RadiationDescriber.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

// constants
const lotsStringProperty = GreenhouseEffectStrings.concentrationPanel.lotsStringProperty;
const noneStringProperty = GreenhouseEffectStrings.concentrationPanel.noneStringProperty;
const carbonDioxideConcentrationPatternStringProperty = GreenhouseEffectStrings.concentrationPanel.carbonDioxideConcentrationPatternStringProperty;
const methaneConcentrationPatternStringProperty = GreenhouseEffectStrings.concentrationPanel.methaneConcentrationPatternStringProperty;
const nitrousOxideConcentrationPatternStringProperty = GreenhouseEffectStrings.concentrationPanel.nitrousOxideConcentrationPatternStringProperty;
const iceAgeStringProperty = GreenhouseEffectStrings.concentrationPanel.iceAgeStringProperty;

// Height in view coordinates of the concentration slider track (when controlling concentration by value) and the
// concentration meter graphic (when controlling by date). These are the same height so that the positions of values
// along the slider are at the same positions of values along the concentration meter.
const CONCENTRATION_SLIDER_TRACK_HEIGHT = 150;

// tick sizes for the concentration meter
const CONCENTRATION_METER_MACRO_BOX_WIDTH = 30;
const CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS = 14;

// margins between content and panel borders
const PANEL_MARGINS = 5;

// spacing between contents within the panel
const CONTENT_SPACING = 10;

// for text labels for the slider and meter
const LABEL_OPTIONS = { font: GreenhouseEffectConstants.CONTENT_FONT, maxWidth: 60 };

// spacing between the slider and the labels at the top and bottom
const SLIDER_TRACK_TO_LABEL_SPACING = 10;

// line width for the slider thumb
const SLIDER_THUMB_LINE_WIDTH = 1;

// color of meters and controls in this panel
const CONCENTRATION_CONTROLS_STROKE = 'black';

// numeric date representations are not translatable, see https://github.com/phetsims/greenhouse-effect/issues/21
const STRING_2020 = '2020';
const STRING_1950 = '1950';
const STRING_1750 = '1750';

const RADIO_BUTTON_GROUP_OPTIONS = {
  radioButtonOptions: {
    baseColor: GreenhouseEffectColors.controlPanelBackgroundColorProperty,
    buttonAppearanceStrategyOptions: {
      selectedStroke: GreenhouseEffectColors.radioButtonGroupSelectedStrokeColorProperty,
      selectedLineWidth: 2
    }
  }
};

type SelfOptions = {

  // If true, the panel will include a readout of the composition of greenhouse gases when selecting concentrations by
  // date.
  includeCompositionData?: boolean;
};
type GreenhouseGasConcentrationPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

class GreenhouseGasConcentrationPanel extends Panel {

  /**
   * @param width - overall width of the panel
   * @param concentrationModel
   * @param radiationDescriber
   * @param [providedOptions]
   */
  public constructor( width: number,
                      concentrationModel: ConcentrationModel,
                      radiationDescriber: RadiationDescriber,
                      providedOptions?: GreenhouseGasConcentrationPanelOptions ) {

    const options = optionize<GreenhouseGasConcentrationPanelOptions, SelfOptions, PanelOptions>()( {

      minWidth: width,
      maxWidth: width,
      includeCompositionData: false,
      xMargin: PANEL_MARGINS,
      yMargin: PANEL_MARGINS,
      fill: GreenhouseEffectColors.controlPanelBackgroundColorProperty,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.titleStringProperty,

      // phet-io
      visiblePropertyOptions: { phetioFeatured: true }
    }, providedOptions );

    // title for the whole panel
    const titleText = new Text( GreenhouseEffectStrings.concentrationPanel.greenhouseGasConcentrationStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGINS * 2
    } );

    // controls the concentration directly by value
    const concentrationControl = new ConcentrationControl(
      concentrationModel,
      radiationDescriber,
      options.tandem.createTandem( 'concentrationControl' )
    );

    // controls to select greenhouse gas concentration by date, and a meter displaying relative concentration
    const dateControl = new DateControl(
      concentrationModel.dateProperty,
      concentrationModel.concentrationProperty,
      concentrationModel.concentrationControlModeProperty,
      options.tandem.createTandem( 'dateControl' )
    );

    // selects how the user is controlling concentration, by date or by value
    const concentrationControlModeRadioButtonGroup = new ConcentrationControlModeRadioButtonGroup(
      concentrationModel.concentrationControlModeProperty,
      options.tandem.createTandem( 'concentrationControlModeRadioButtonGroup' )
    );

    // Put the two concentration controls into a single node where only one is visible at a time.
    const concentrationControlsParentNode = new FlowBox( {
      children: [ concentrationControl, dateControl ],
      minContentHeight: Math.max( concentrationControl.height, dateControl.height )
    } );

    const contentChildren = [ titleText, concentrationControlsParentNode, concentrationControlModeRadioButtonGroup ];

    let compositionDataNode: CompositionDataNode | null = null;
    if ( options.includeCompositionData ) {
      compositionDataNode = new CompositionDataNode( concentrationModel.dateProperty, width,
        options.tandem.createTandem( 'compositionDataNode' ) );
      contentChildren.push( compositionDataNode );
    }

    const content = new VBox( {
      children: contentChildren,
      spacing: CONTENT_SPACING,
      align: 'center'
    } );

    super( content, options );

    // Only one form of controls is visible at a time.
    concentrationModel.concentrationControlModeProperty.link( concentrationControlMode => {
      concentrationControl.visible = ConcentrationControlMode.BY_VALUE === concentrationControlMode;
      dateControl.visible = ConcentrationControlMode.BY_DATE === concentrationControlMode;

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
class DateControl extends HBox {

  /**
   * @param dateProperty
   * @param concentrationProperty - setting date will modify concentration
   * @param concentrationControlModeProperty - setting date will modify concentration
   * @param tandem
   */
  public constructor( dateProperty: EnumerationProperty<ConcentrationDate>,
                      concentrationProperty: TReadOnlyProperty<number>,
                      concentrationControlModeProperty: EnumerationProperty<ConcentrationControlMode>,
                      tandem: Tandem ) {

    // the radio buttons for the date control
    const items = [
      {
        createNode: () => new Text( STRING_2020, LABEL_OPTIONS ),
        value: ConcentrationDate.YEAR_2020,
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearTwentyTwentyStringProperty,
        tandemName: 'twentyTwentyRadioButton'
      },
      {
        createNode: () => new Text( STRING_1950, LABEL_OPTIONS ),
        value: ConcentrationDate.YEAR_1950,
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearNineteenFiftyStringProperty,
        tandemName: 'nineteenFiftyRadioButton'
      },
      {
        createNode: () => new Text( STRING_1750, LABEL_OPTIONS ),
        value: ConcentrationDate.YEAR_1750,
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearSeventeenFiftyStringProperty,
        tandemName: 'seventeenFiftyRadioButton'
      },
      {
        createNode: () => new Text( iceAgeStringProperty, LABEL_OPTIONS ),
        value: ConcentrationDate.ICE_AGE,
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.timePeriod.iceAgeStringProperty,
        tandemName: 'iceAgeRadioButton'
      }
    ];
    const dateRadioButtonGroup = new RectangularRadioButtonGroup(
      dateProperty,
      items,
      combineOptions<RectangularRadioButtonGroupOptions>( {

        // pdom
        labelTagName: 'h4',
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.timePeriod.labelStringProperty,
        helpText: GreenhouseEffectStrings.a11y.concentrationPanel.timePeriod.helpTextStringProperty,

        // phet-io
        tandem: tandem.createTandem( 'dateRadioButtonGroup' )
      }, RADIO_BUTTON_GROUP_OPTIONS )
    );

    // relative concentration graphic
    const meterLineOptions = { stroke: CONCENTRATION_CONTROLS_STROKE, lineWidth: 2 };
    const macroConcentrationLine = new Line( 0, 0, 0, CONCENTRATION_SLIDER_TRACK_HEIGHT, meterLineOptions );
    const microConcentrationLine = new Line( 0, 0, 0, CONCENTRATION_SLIDER_TRACK_HEIGHT, meterLineOptions );

    // Create the macroBox, which is the little rectangle that depicts the area that is being magnified.  This is sized
    // to automatically hold all possible concentration values associated with dates.
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
    const lotsText = new Text( lotsStringProperty, LABEL_OPTIONS );
    const noneText = new Text( noneStringProperty, LABEL_OPTIONS );

    // lines between macro and micro lines showing that the micro line is a zoomed in view of the macro line, end
    // points are set after layout
    const connectionLineOptions = { stroke: 'gray', lineDash: [ 5, 5 ] };
    const topConnectionLine = new Line( 0, 0, 0, 0, connectionLineOptions );
    const bottomConnectionLine = new Line( 0, 0, 0, 0, connectionLineOptions );

    const valueCircle = new Circle( 5, { fill: 'black' } );

    // Put the macro line in a VBox with the labels that go at the top and the bottom of it for easier alignment and
    // handling of dynamic strings.
    const labeledMacroLine = new VBox( {
      children: [ lotsText, macroConcentrationLine, noneText ],
      spacing: SLIDER_TRACK_TO_LABEL_SPACING
    } );

    // Put all the elements that comprise the concentration range graphic together into one node.
    const concentrationRangeGraphic = new Node( {
      children: [
        macroValueBox,
        labeledMacroLine,
        microConcentrationLine,
        topConnectionLine,
        bottomConnectionLine,
        valueCircle
      ]
    } );

    // Lay out the graphic based on the position of the macro line.  This will do the initial layout and will update the
    // layout when the strings that label the macro line are updated.
    labeledMacroLine.boundsProperty.link( bounds => {

      // Position the box that indicates the blown up region.
      macroValueBox.center = bounds.center.plusXY(
        0,
        -CONCENTRATION_SLIDER_TRACK_HEIGHT * ( macroBoxProportionateCenterY - 0.5 )
      );

      // Position the micro line, which represents the blown up region.
      microConcentrationLine.center = bounds.center.plusXY( 70, 0 );

      // Update the lines that go from the corners of the macro box to the blown up line.
      topConnectionLine.setPoint1( macroValueBox.rightTop );
      topConnectionLine.setPoint2( microConcentrationLine.centerTop );
      bottomConnectionLine.setPoint1( macroValueBox.rightBottom );
      bottomConnectionLine.setPoint2( microConcentrationLine.centerBottom );

      // Center the value indicator in the horizontal direction.
      valueCircle.center = microConcentrationLine.center;
    } );

    // Update the vertical position of the concentration indicator when the concentration changes.
    const concentrationRangeLength = ConcentrationModel.CONCENTRATION_RANGE.getLength();
    const concentrationHeightFunction = new LinearFunction(
      concentrationRangeLength * ( macroBoxProportionateCenterY - macroBoxProportionateHeight / 2 ),
      concentrationRangeLength * ( macroBoxProportionateCenterY + macroBoxProportionateHeight / 2 ),
      microConcentrationLine.bottom,
      microConcentrationLine.top
    );
    Multilink.multilink(
      [ concentrationProperty, concentrationControlModeProperty ],
      ( concentration, concentrationControlMode ) => {
        if ( concentrationControlMode === ConcentrationControlMode.BY_DATE ) {
          valueCircle.centerY = concentrationHeightFunction.evaluate( concentration );
        }
      }
    );

    // Put the graphical zoom in representation and the radio buttons next to each other in an HBox.
    super( {
      children: [ concentrationRangeGraphic, dateRadioButtonGroup ],
      spacing: CONTENT_SPACING
    } );
  }
}

/**
 * Inner class representing a labeled vertical slider that directly controls greenhouse gas concentration.
 */
class ConcentrationControl extends VBox {
  public constructor( concentrationModel: ConcentrationModel, radiationDescriber: RadiationDescriber, tandem: Tandem ) {

    const sliderRange = concentrationModel.manuallyControlledConcentrationProperty.range;
    const sliderSoundGenerator = new ConcentrationSliderSoundGenerator(
      concentrationModel.concentrationProperty,
      sliderRange
    );

    const slider = new VSlider( concentrationModel.manuallyControlledConcentrationProperty, sliderRange, {
      trackSize: new Dimension2( 1, CONCENTRATION_SLIDER_TRACK_HEIGHT ),
      thumbSize: GreenhouseEffectConstants.VERTICAL_SLIDER_THUMB_SIZE,
      thumbLineWidth: SLIDER_THUMB_LINE_WIDTH,

      // constrain the value a bit to avoid some oddities with floating point math
      constrainValue: n => Utils.toFixedNumber( n, 6 ),

      // sound generation
      soundGenerator: sliderSoundGenerator,

      // pdom
      labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.concentration.greenhouseGasConcentrationStringProperty,
      labelTagName: 'label',
      helpText: GreenhouseEffectStrings.a11y.concentrationPanel.concentration.concentrationSliderHelpTextStringProperty,
      keyboardStep: 0.05,
      shiftKeyboardStep: 0.01, // finer grain
      pageKeyboardStep: 0.2, // coarser grain,
      a11yCreateAriaValueText: ( value: number ) => {
        return ConcentrationDescriber.getConcentrationDescriptionWithValue( value, true, false );
      },

      // phet-io
      tandem: tandem.createTandem( 'slider' ),
      phetioVisiblePropertyInstrumented: false
    } );
    slider.scale( -1, 1 );

    // labels
    const lotsText = new Text( lotsStringProperty, LABEL_OPTIONS );
    const noneText = new Text( noneStringProperty, LABEL_OPTIONS );

    // Position the labels at the top and bottom such that they will be the same distance from the ends of the slider
    // track as they will be in the concentration range graphic.
    const sliderToLabelSpacing = SLIDER_TRACK_TO_LABEL_SPACING -
                                 GreenhouseEffectConstants.VERTICAL_SLIDER_THUMB_SIZE.height / 2 -
                                 SLIDER_THUMB_LINE_WIDTH;
    assert && assert(
      sliderToLabelSpacing >= 0,
      'slider-to-label spacing less than zero, adjust constants to make this work'
    );

    // Put the labels and the slider together into the VBox.
    super( {
      children: [ lotsText, slider, noneText ],
      spacing: sliderToLabelSpacing,

      // phetio
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

class CompositionDataNode extends VBox {

  public constructor( dateProperty: EnumerationProperty<ConcentrationDate>, panelWidth: number, tandem: Tandem ) {

    const textOptions = {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: panelWidth - 2 * PANEL_MARGINS
    };

    // Set up the data and text that will be used for the concentration display.  Note that H2O is handled as a special
    // case in this code because it can have a null value, since we don't have data for it's value during the ice age.
    assert && assert( GREENHOUSE_GAS_CONCENTRATIONS.has( dateProperty.value ), `no concentration data for ${dateProperty.value}` );
    const initialConcentrationData = GREENHOUSE_GAS_CONCENTRATIONS.get( dateProperty.value );
    const carbonDioxideConcentrationProperty = new NumberProperty( initialConcentrationData!.carbonDioxideConcentration );
    const methaneConcentrationProperty = new NumberProperty( initialConcentrationData!.methaneConcentration );
    const nitrousOxideConcentrationProperty = new NumberProperty( initialConcentrationData!.nitrousOxideConcentration );
    dateProperty.link( date => {
      assert && assert( GREENHOUSE_GAS_CONCENTRATIONS.has( date ), `no concentration data for ${date}` );
      const concentrationData = GREENHOUSE_GAS_CONCENTRATIONS.get( date );
      carbonDioxideConcentrationProperty.set( concentrationData!.carbonDioxideConcentration );
      methaneConcentrationProperty.set( concentrationData!.methaneConcentration );
      nitrousOxideConcentrationProperty.set( concentrationData!.nitrousOxideConcentration );
    } );

    const carbonDioxideStringProperty = new PatternStringProperty( carbonDioxideConcentrationPatternStringProperty, {
      value: carbonDioxideConcentrationProperty
    }, {
      tandem: tandem.createTandem( 'carbonDioxideStringProperty' )
    } );
    const carbonDioxideText = new RichText( carbonDioxideStringProperty, textOptions );

    const methaneStringProperty = new PatternStringProperty( methaneConcentrationPatternStringProperty, {
      value: methaneConcentrationProperty
    }, {
      tandem: tandem.createTandem( 'methaneStringProperty' )
    } );
    const methaneText = new RichText( methaneStringProperty, textOptions );

    const nitrousOxideStringProperty = new PatternStringProperty( nitrousOxideConcentrationPatternStringProperty, {
      value: nitrousOxideConcentrationProperty
    }, {
      tandem: tandem.createTandem( 'nitrousOxideStringProperty' )
    } );
    const nitrousOxideText = new RichText( nitrousOxideStringProperty, textOptions );

    super( {
      children: [ carbonDioxideText, methaneText, nitrousOxideText ],
      align: 'left',
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false // visibility is controlled by the sim
    } );
  }
}

/**
 * data-only class used for mapping the concentrations of various greenhouse gasses to points in time
 */
class GreenhouseGasConcentrationData {

  // relative humidity, in percent, null indicates "unknown"
  public readonly relativeHumidity: number | null;

  // concentration of CO2, in PPM
  public readonly carbonDioxideConcentration: number;

  // concentration of CH4, in PPB
  public readonly methaneConcentration: number;

  // concentration of N2O, in PPB
  public readonly nitrousOxideConcentration: number;

  /**
   * @param relativeHumidity - percentage
   * @param carbonDioxideConcentration - in ppm
   * @param methaneConcentration - in ppb
   * @param nitrousOxideConcentration - in ppb
   */
  public constructor( relativeHumidity: number | null,
                      carbonDioxideConcentration: number,
                      methaneConcentration: number,
                      nitrousOxideConcentration: number ) {
    this.relativeHumidity = relativeHumidity;
    this.carbonDioxideConcentration = carbonDioxideConcentration;
    this.methaneConcentration = methaneConcentration;
    this.nitrousOxideConcentration = nitrousOxideConcentration;
  }
}

// Map the dates to greenhouse gas concentration data.  The values came from the design document.
const GREENHOUSE_GAS_CONCENTRATIONS = new Map( [
  [ ConcentrationDate.YEAR_2020, new GreenhouseGasConcentrationData( 70, 413, 1889, 333 ) ],
  [ ConcentrationDate.YEAR_1950, new GreenhouseGasConcentrationData( 70, 311, 1116, 288 ) ],
  [ ConcentrationDate.YEAR_1750, new GreenhouseGasConcentrationData( 70, 277, 694, 271 ) ],
  [ ConcentrationDate.ICE_AGE, new GreenhouseGasConcentrationData( null, 180, 380, 215 ) ]
] );

/**
 * An inner class for the control panel that creates a RadioButtonGroup that selects between controlling concentration
 * by date or by value.
 */
class ConcentrationControlModeRadioButtonGroup extends RectangularRadioButtonGroup<ConcentrationControlMode> {

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

    const items = [
      {
        createNode: () => new VSlider( dummyProperty, dummyProperty.range, {
          trackSize: new Dimension2( 2, dateIcon.height - 9 ),
          thumbSize: new Dimension2( 18, 9 ),
          thumbFill: Color.LIGHT_GRAY,
          thumbCenterLineStroke: Color.DARK_GRAY,
          trackFillEnabled: 'black',
          pickable: false,

          // slider icon should not have representation in the PDOM, accessibility is managed by the checkbox
          tagName: null,

          // phet-io - opting out of the Tandem for the icon
          tandem: Tandem.OPT_OUT
        } ),
        value: ConcentrationControlMode.BY_VALUE,
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.byConcentrationStringProperty,
        tandemName: 'byConcentrationRadioButton'
      },
      {
        createNode: () => dateIcon,
        value: ConcentrationControlMode.BY_DATE,
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.byTimePeriodStringProperty,
        tandemName: 'byTimePeriodRadioButton'
      }
    ];

    super(
      property,
      items,
      combineOptions<RectangularRadioButtonGroupOptions>( {
        orientation: 'horizontal' as const,

        // pdom
        labelTagName: 'h4',
        labelContent: GreenhouseEffectStrings.a11y.concentrationPanel.experimentModeStringProperty,
        helpText: GreenhouseEffectStrings.a11y.concentrationPanel.experimentModeHelpTextStringProperty,

        // phet-io
        tandem: tandem
      }, RADIO_BUTTON_GROUP_OPTIONS ) );
  }
}

greenhouseEffect.register( 'GreenhouseGasConcentrationPanel', GreenhouseGasConcentrationPanel );
export default GreenhouseGasConcentrationPanel;
