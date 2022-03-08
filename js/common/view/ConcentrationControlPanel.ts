// Copyright 2021-2022, University of Colorado Boulder

/**
 * Controls for the concentration of greenhouse gases in the sim. Concentration can be modified directly by value
 * or greenhouse gas concentration can be selected from a particular date.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Circle, Line, Node, Path, Rectangle, RichText, SceneryEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import calendarAltRegularShape from '../../../../sherpa/js/fontawesome-5/calendarAltRegularShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import VSlider from '../../../../sun/js/VSlider.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sliderMovement_mp3 from '../../../sounds/sliderMovement_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import ConcentrationModel, { ConcentrationControlMode } from '../model/ConcentrationModel.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import RadiationDescriber from './describers/RadiationDescriber.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

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

type ConcentrationControlPanelOptions = {
  includeCompositionData?: boolean
} & PanelOptions;

class ConcentrationControlPanel extends Panel {

  /**
   * @param width - width the panel contents are limited to, for i18n and layout with other screen components
   * @param concentrationModel
   * @param radiationDescriber
   * @param [options]
   */
  constructor( width: number, concentrationModel: ConcentrationModel, radiationDescriber: RadiationDescriber, providedOptions?: ConcentrationControlPanelOptions ) {

    const options = merge( {

      xMargin: PANEL_MARGINS,
      yMargin: PANEL_MARGINS,

      // {boolean} - if true, the panel will include a readout of the composition of greenhouse gases when selecting
      // concentrations by date
      includeCompositionData: false,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.title,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions ) as ConcentrationControlPanelOptions & { tandem: Tandem };

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
   * @param {EnumerationDeprecatedProperty} dateProperty
   * @param {Property.<number>} concentrationProperty - setting date will modify concentration
   * @param {EnumerationDeprecatedProperty} concentrationControlModeProperty - setting date will modify concentration
   * @param {Tandem} tandem
   */
  constructor( dateProperty: EnumerationDeprecatedProperty,
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
        // @ts-ignore
        value: ConcentrationModel.CONCENTRATION_DATE.TWENTY_TWENTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearTwentyTwenty,
        tandemName: 'twentyTwentyRadioButton'
      },
      {
        node: new Text( nineteenFiftyLabel, LABEL_OPTIONS ),
        // @ts-ignore
        value: ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearNineteenFifty,
        tandemName: 'nineteenFiftyRadioButton'
      },
      {
        node: new Text( seventeenFiftyLabel, LABEL_OPTIONS ),
        // @ts-ignore
        value: ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearSeventeenFifty,
        tandemName: 'seventeenFiftyRadioButton'
      },
      {
        node: new Text( iceAgeLabel, LABEL_OPTIONS ),
        // @ts-ignore
        value: ConcentrationModel.CONCENTRATION_DATE.ICE_AGE,
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
    topConnectionLine.setPoint2( microConcentrationLine.centerTop ); // @ts-ignore

    bottomConnectionLine.setPoint1( macroValueBox.rightBottom );
    bottomConnectionLine.setPoint2( microConcentrationLine.centerBottom ); // @ts-ignore

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
    Property.multilink(
      [ concentrationProperty, concentrationControlModeProperty ],
      ( concentration: number, concentrationControlMode: any ) => {
        if ( concentrationControlMode === ConcentrationControlMode.BY_DATE ) {
          // @ts-ignore
          const centerY = concentrationHeightFunction.evaluate( concentration );
          valueCircle.centerY = centerY;
        }
      }
    );
  }
}

/**
 * Inner class that is a labelled VSlider that directly controls greenhouse gas concentration in the sim.
 */
class ConcentrationSlider extends Node {
  constructor( concentrationModel: ConcentrationModel, radiationDescriber: RadiationDescriber, tandem: Tandem ) {

    super( { tandem: tandem } );

    // Create the sound generator.
    const concentrationSliderSoundGenerator = new ConcentrationSliderSoundGenerator(
      concentrationModel.manuallyControlledConcentrationProperty,
      { initialOutputLevel: 0.1 }
    );
    soundManager.addSoundGenerator( concentrationSliderSoundGenerator );

    const sliderRange = concentrationModel.manuallyControlledConcentrationProperty.range!;

    const slider = new VSlider( concentrationModel.manuallyControlledConcentrationProperty, sliderRange, { // @ts-ignore
      trackSize: new Dimension2( 1, CONCENTRATION_SLIDER_TRACK_HEIGHT ),
      thumbSize: new Dimension2( 20, 10 ),

      // sound generation
      soundGenerator: null,
      drag: ( event: SceneryEvent ) => {
        concentrationSliderSoundGenerator.drag( event );
      },

      // pdom
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.concentration.greenhouseGasConcentration,
      labelTagName: 'label',
      helpText: greenhouseEffectStrings.a11y.concentrationPanel.concentration.concentrationSliderHelpText,
      keyboardStep: sliderRange.max / 10,
      shiftKeyboardStep: sliderRange.max / 20, // finer grain
      pageKeyboardStep: sliderRange.max / 4, // coarser grain,
      a11yCreateAriaValueText: ( value: number ) => {
        return ConcentrationDescriber.getConcentrationDescriptionWithValue( value );
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

  /**
   * @param {EnumerationDeprecatedProperty} dateProperty
   */
  constructor( dateProperty: EnumerationDeprecatedProperty ) {
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
   * @private
   *
   * @param {ConcentrationModel.CONCENTRATION_DATE} date
   */
  updateCompositionReadout( date: any ) {
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
// @ts-ignore improve enumeration pattern
class ConcentrationControlRadioButtonGroup extends RectangularRadioButtonGroup<any> {

  /**
   * @param {EnumerationDeprecatedProperty} property - Property for the method of controlling concentration
   * @param {Tandem} tandem
   */
  constructor( property: EnumerationProperty<ConcentrationControlMode>, tandem: Tandem ) {

    const dateIcon = new Path( calendarAltRegularShape, {
      fill: 'black'
    } );

    // the CalendarAlt isn't square, scale it down and produce a square button
    dateIcon.setScaleMagnitude( 34 / dateIcon.width, 34 / dateIcon.height );

    const dummyProperty = new NumberProperty( 5, { range: new Range( 0, 10 ) } );
    assert && assert( dummyProperty.range );
    const sliderIcon = new VSlider( dummyProperty, dummyProperty.range!, { // @ts-ignore
      trackSize: new Dimension2( 2, dateIcon.height - 9 ),
      thumbSize: new Dimension2( 18, 9 ),
      trackFillEnabled: 'black',
      pickable: false,

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

/**
 * Inner class used to generate the sounds for slider movements.
 */
class ConcentrationSliderSoundGenerator extends SoundGenerator {
  private readonly baseSoundClip: SoundClip;
  private readonly numberOfBins: number;
  private readonly binSize: number;
  private readonly concentrationProperty: NumberProperty;
  private previousConcentration: number;

  constructor( concentrationProperty: NumberProperty, options?: Partial<SoundGeneratorOptions> ) {

    super( options );

    // Create a dynamics compressor so that the output of this sound generator doesn't go too high when lots of sounds
    // are being played.
    const dynamicsCompressorNode = this.audioContext.createDynamicsCompressor();

    // The following values were empirically determined through informed experimentation.
    // TODO: Use the peak detector and make sure this is doing what is intended.  See https://github.com/phetsims/greenhouse-effect/issues/28.
    const now = this.audioContext.currentTime;
    dynamicsCompressorNode.threshold.setValueAtTime( -3, now );
    dynamicsCompressorNode.knee.setValueAtTime( 0, now ); // hard knee
    dynamicsCompressorNode.ratio.setValueAtTime( 12, now );
    dynamicsCompressorNode.attack.setValueAtTime( 0, now );
    dynamicsCompressorNode.release.setValueAtTime( 0.25, now );
    dynamicsCompressorNode.connect( this.masterGainNode );

    // the sound clip that forms the basis of all sounds that are produced
    this.baseSoundClip = new SoundClip( sliderMovement_mp3, {
      rateChangesAffectPlayingSounds: false
    } );
    // @ts-ignore TODO: typing for AudioParam
    this.baseSoundClip.connect( dynamicsCompressorNode );

    // The number of bins was chosen to match the design of the slider.
    this.numberOfBins = 10;

    // variables used by the methods below
    this.concentrationProperty = concentrationProperty;
    this.binSize = this.concentrationProperty.range!.max / this.numberOfBins;
    this.previousConcentration = this.concentrationProperty.value;
  }

  /**
   * Get an zero-based index value (an integer) that indicates the bin into which the provided value falls.
   * @param {number} concentration
   * @returns {number}
   * @private
   */
  getBin( concentration: number ) {
    return Math.min( Math.floor( concentration / this.binSize ), this.numberOfBins - 1 );
  }

  /**
   * Play the main sound clip multiple times with some randomization around the center pitch and the delay between each
   * play.
   *
   * The algorithm used here was determine by informed trial-and-error based on an initial sound design that used a
   * bunch of separate sound clips.  See https://github.com/phetsims/greenhouse-effect/issues/28.
   *
   * @param {number} minimumPlaybackRate
   * @param {number} numberOfTimesToPlay
   * @private
   */
  playMultipleTimesRandomized( minimumPlaybackRate: number, numberOfTimesToPlay: number ) {

    // parameters the bound the randomization, empirically determined
    const minimumInterSoundTime = 0.06;
    const maximumInterSoundTime = minimumInterSoundTime * 1.5;

    let delayAmount = 0;
    _.times( numberOfTimesToPlay, () => {

      // Set the playback rate with some randomization.
      this.baseSoundClip.setPlaybackRate( minimumPlaybackRate * ( 1 + dotRandom.nextDouble() * 0.2 ), 0 );

      // Put some spacing between each playing of the clip.  The parameters of the calculation are broken out to make
      // experimentation and adjustment easier.
      this.baseSoundClip.play( delayAmount );
      delayAmount = delayAmount + minimumInterSoundTime + dotRandom.nextDouble() * ( maximumInterSoundTime - minimumInterSoundTime );
    } );
    this.baseSoundClip.setPlaybackRate( 1, 0 );
  }

  /**
   * Handle a slider drag event by checking if the changes to the associated Property warrant the playing of a sound
   * and, if so, play it.
   * @param {SceneryEvent} event
   * @public
   */
  drag( event: SceneryEvent ) {

    const currentConcentration = this.concentrationProperty.value;

    if ( this.previousConcentration !== currentConcentration ) {

      // First check for hitting a min or max and, if that didn't happen, check for a change of bins.
      if ( this.concentrationProperty.value === this.concentrationProperty.range!.min ) {

        // Play sound for the minimum value.
        this.baseSoundClip.play();
      }
      else if ( this.concentrationProperty.value === this.concentrationProperty.range!.max ) {

        // Play sound for the maximum value.
        this.baseSoundClip.setPlaybackRate( 2 * ( this.numberOfBins + 1 ) / this.numberOfBins + 1 );
        this.baseSoundClip.play();
      }
      else {
        const previousBin = this.getBin( this.previousConcentration );
        const currentBin = this.getBin( currentConcentration );

        // Play a sound if a bin threshold has been crossed or if the change was due to keyboard interaction.
        if ( currentBin !== previousBin || event.pointer.type === 'pdom' ) {

          // Play a number of sounds, more as the value increases.  However, if there are already a number of sounds
          // playing, only add one more.  Otherwise, it gets to be a bit much.
          const numberOfInstancesToPlay = this.baseSoundClip.getNumberOfPlayingInstances() >= 2 ?
                                          1 :
                                          Math.floor( currentBin / 3 ) + 2;

          this.playMultipleTimesRandomized( 2 * currentBin / this.numberOfBins + 1, numberOfInstancesToPlay );
        }
      }
      this.previousConcentration = currentConcentration;
    }
  }
}

greenhouseEffect.register( 'ConcentrationControlPanel', ConcentrationControlPanel );
export default ConcentrationControlPanel;
