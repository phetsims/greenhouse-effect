// Copyright 2021, University of Colorado Boulder

/**
 * Controls for the concentration of greenhouse gasses in the sim. Concentration can be modified directly by value
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
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import CalendarAlt from '../../../../sherpa/js/fontawesome-5/regular/CalendarAlt.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import VSlider from '../../../../sun/js/VSlider.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import sliderSound01 from '../../../sounds/greenhouse-gas-concentration-slider-001_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import ConcentrationModel from '../model/ConcentrationModel.js';

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

// margins between content and panel borders
const PANEL_MARGINS = 5;

// spacing between contents within the panel
const CONTENT_SPACING = 10;

const LABEL_OPTIONS = { font: GreenhouseEffectConstants.CONTENT_FONT, maxWidth: 60 };

const RADIO_BUTTON_GROUP_OPTIONS = {
  baseColor: 'white',
  selectedStroke: 'rgb(0,173,221)',
  selectedLineWidth: 2
};

class ConcentrationControlPanel extends Panel {

  /**
   * @param {number} width - width the panel contents are limited to, for i18n and layout with other screen components
   * @param {ConcentrationModel} concentrationModel
   * @param {Object} [options]
   */
  constructor( width, concentrationModel, options ) {

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
    const sliderControl = new SliderControl( concentrationModel.manuallyControlledConcentrationProperty );

    // controls to select greenhouse gas concentration by date, and a visualization of relative concentration
    const dateControl = new DateControl(
      concentrationModel.dateProperty,
      concentrationModel.concentrationProperty,
      concentrationModel.concentrationControlModeProperty
    );

    // selects how the user is controlling concentration, by date or by value
    const controlRadioButtonGroup = new ConcentrationControlRadioButtonGroup( concentrationModel.concentrationControlModeProperty );

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
      compositionDataNode = new CompositionDataNode( concentrationModel.dateProperty );
      contentChildren.push( compositionDataNode );

      compositionDataNode.left = titleNode.left;
      compositionDataNode.top = controlRadioButtonGroup.bottom + CONTENT_SPACING;
    }

    const content = new Node( {
      children: contentChildren
    } );

    super( content, options );

    // only one form of controls is visible at a time
    concentrationModel.concentrationControlModeProperty.link( concentrationControl => {
      sliderControl.visible = ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_VALUE === concentrationControl;
      dateControl.visible = ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE === concentrationControl;

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
   * @param {Property.<number>} concentrationProperty - setting date will modify concentration
   * @param {EnumerationProperty} concentrationControlModeProperty - setting date will modify concentration
   */
  constructor( dateProperty, concentrationProperty, concentrationControlModeProperty ) {
    super();

    // numeric date representations are not translatable, see https://github.com/phetsims/greenhouse-effect/issues/21
    const twentyNineteenLabel = '2019';
    const nineteenFiftyLabel = '1950';
    const seventeenFiftyLabel = '1750';
    const iceAgeLabel = greenhouseEffectStrings.concentrationPanel.iceAge;

    // the radio buttons for the date control
    const items = [
      {
        node: new Text( twentyNineteenLabel, LABEL_OPTIONS ),
        value: ConcentrationModel.CONCENTRATION_DATE.TWO_THOUSAND_NINETEEN,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearTwentyNineteen
      },
      {
        node: new Text( nineteenFiftyLabel, LABEL_OPTIONS ),
        value: ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearNineteenFifty
      },
      {
        node: new Text( seventeenFiftyLabel, LABEL_OPTIONS ),
        value: ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.timePeriod.yearSeventeenFifty
      },
      {
        node: new Text( iceAgeLabel, LABEL_OPTIONS ),
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

    // Create the macroBox, which is the little rectangle that depicts the area that is being magnified.  This is sized
    // to automatically hold all of the possible concentration values that are associated with dates.
    const macroBoxProportionateHeight = ConcentrationModel.DATE_CONCENTRATION_RANGE.getLength() /
                                        ConcentrationModel.CONCENTRATION_RANGE.getLength() *
                                        1.2;
    const macroBoxProportionateCenterY = ConcentrationModel.DATE_CONCENTRATION_RANGE.getCenter() /
                                         ConcentrationModel.CONCENTRATION_RANGE.getLength();
    const macroValueTick = new Line( 0, 0, CONCENTRATION_METER_MACRO_TICK_WIDTH, 0, meterLineOptions );
    const macroValueBox = new Rectangle(
      0,
      0,
      CONCENTRATION_METER_MACRO_TICK_WIDTH * 2,
      CONCENTRATION_METER_HEIGHT * macroBoxProportionateHeight,
      meterLineOptions
    );

    // minor ticks on the micro line
    const minorTickLineOptions = { stroke: 'grey' };
    for ( let i = 0; i <= CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS; i++ ) {
      const tick = new Line( 0, 0, 9, 0, minorTickLineOptions );

      tick.center = microConcentrationLine.centerTop.plusXY(
        0,
        i * CONCENTRATION_METER_HEIGHT / CONCENTRATION_METER_NUMBER_OF_MICRO_TICKS
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

    const macroBoxCenter = macroConcentrationLine.centerBottom.plusXY(
      0,
      -CONCENTRATION_METER_HEIGHT * macroBoxProportionateCenterY
    );
    macroValueTick.center = macroBoxCenter;
    macroValueBox.center = macroBoxCenter;

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
    Property.multilink(
      [ concentrationProperty, concentrationControlModeProperty ],
      ( concentration, concentrationControlMode ) => {
        if ( concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE ) {
          const centerY = concentrationHeightFunction( concentration );
          valueCircle.centerY = centerY;
        }
      }
    );
  }
}

/**
 * Inner class that is a labelled VSlider that directly controls greenhouse gas concentration in the sim.
 */
class SliderControl extends Node {

  /**
   * @param {NumberProperty} manuallyControlledConcentrationProperty
   */
  constructor( manuallyControlledConcentrationProperty ) {
    super();

    // Create the sound generator.
    const concentrationSliderSoundGenerator = new ConcentrationSliderSoundGenerator( manuallyControlledConcentrationProperty, {
      initialOutputLevel: 0.1
    } );
    soundManager.addSoundGenerator( concentrationSliderSoundGenerator );

    const concentrationRange = manuallyControlledConcentrationProperty.range;
    const concentrationSlider = new VSlider( manuallyControlledConcentrationProperty, manuallyControlledConcentrationProperty.range, {
      trackSize: new Dimension2( 1, 100 ),
      thumbSize: new Dimension2( 20, 10 ),

      // sound generation
      drag: event => {
        concentrationSliderSoundGenerator.drag( event );
      },

      // pdom
      labelContent: greenhouseEffectStrings.a11y.concentrationPanel.concentration.greenhouseGasConcentration,
      labelTagName: 'label',
      helpText: greenhouseEffectStrings.a11y.concentrationPanel.concentration.concentrationSliderHelpText,
      keyboardStep: manuallyControlledConcentrationProperty.range.max / 10,
      shiftKeyboardStep: manuallyControlledConcentrationProperty.range.max / 20, // finer grain
      pageKeyboardStep: manuallyControlledConcentrationProperty.range.max / 4 // coarser grain
    } );

    const delta = concentrationRange.getLength() / 10;
    for ( let i = concentrationRange.min; i < concentrationRange.max + delta; i += delta ) {
      concentrationSlider.addMinorTick( i );
    }
    concentrationSlider.scale( -1, 1 );

    // add labels to the slider
    const lotsText = new Text( lotsString, LABEL_OPTIONS );
    const noneText = new Text( noneString, LABEL_OPTIONS );

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

    const textOptions = {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 200
    };
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
        value: ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_VALUE,
        labelContent: greenhouseEffectStrings.a11y.concentrationPanel.byConcentration
      },
      {
        node: dateIcon,
        value: ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE,
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

/**
 * Inner class used to generate the sounds for slider movements.
 */
class ConcentrationSliderSoundGenerator extends SoundGenerator {

  constructor( concentrationProperty, options ) {

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

    // @private - sound clip that forms the basis of all sounds that are produced
    this.mainSoundClip = new SoundClip( sliderSound01, {
      rateChangesAffectPlayingSounds: false
    } );
    this.mainSoundClip.connect( dynamicsCompressorNode );

    // @private - The number of bins was chosen to match the design of the slider.
    this.numberOfBins = 10;

    // @private - variables used by the methods below
    this.concentrationProperty = concentrationProperty;
    this.binSize = this.concentrationProperty.range.max / this.numberOfBins;
    this.previousConcentration = this.concentrationProperty.value;
  }

  /**
   * Get an zero-based index value (an integer) that indicates the bin into which the provided value falls.
   * @param {number} concentration
   * @returns {number}
   * @private
   */
  getBin( concentration ) {
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
  playMultipleTimesRandomized( minimumPlaybackRate, numberOfTimesToPlay ) {

    const minimumInterSoundTime = 0.06;
    const maximumInterSoundTime = minimumInterSoundTime * 1.5;

    let delayAmount = 0;
    _.times( numberOfTimesToPlay, () => {

      // Set the playback rate with some randomization.
      // this.mainSoundClip.setPlaybackRate( minimumPlaybackRate + dotRandom.nextDouble() * 0.5, 0 );
      this.mainSoundClip.setPlaybackRate( minimumPlaybackRate * ( 1 + dotRandom.nextDouble() * 0.2 ), 0 );

      // Put some spacing between each playing of the clip.  The parameters of the calculation are broken out to make
      // experimentation and adjustment easier.
      this.mainSoundClip.play( delayAmount );
      delayAmount = delayAmount + minimumInterSoundTime + dotRandom.nextDouble() * ( maximumInterSoundTime - minimumInterSoundTime );
    } );
    this.mainSoundClip.setPlaybackRate( 1, 0 );
  }

  /**
   * Handle a slider drag event by checking if the changes to the associated Property warrant the playing of a sound
   * and, if so, play it.
   * @public
   */
  drag( event ) {

    const currentConcentration = this.concentrationProperty.value;

    if ( this.previousConcentration !== currentConcentration ) {

      // First check for hitting a min or max and, if that didn't happen, check for a change of bins.
      if ( this.concentrationProperty.value === this.concentrationProperty.range.min ) {

        // Play sound for the minimum value.
        this.mainSoundClip.play();
      }
      else if ( this.concentrationProperty.value === this.concentrationProperty.range.max ) {

        // Play sound for the maximum value.
        this.playMultipleTimesRandomized( 3, Math.ceil( this.numberOfBins / 3 ) );
      }
      else {
        const previousBin = this.getBin( this.previousConcentration );
        const currentBin = this.getBin( currentConcentration );

        // Play a sound if a bin threshold has been crossed or if the change was due to keyboard interaction.
        if ( currentBin !== previousBin || event.pointer.type === 'pdom' ) {
          this.playMultipleTimesRandomized( 2 * currentBin / this.numberOfBins + 1, Math.floor( currentBin / 3 ) + 2 );
        }
      }
      this.previousConcentration = currentConcentration;
    }
  }
}

greenhouseEffect.register( 'ConcentrationControlPanel', ConcentrationControlPanel );
export default ConcentrationControlPanel;
