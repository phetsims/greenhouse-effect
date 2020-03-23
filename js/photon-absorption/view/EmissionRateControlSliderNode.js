// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that implements a slider that is used to control the emission rate of photons.
 *
 * NOTE: This is not currently used in MAL, it was replaced by an "on" and "off" button.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */


// modules
// const StringUtils = require( '/phetcommon/js/util/StringUtils' );
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import FocusHighlightFromNode from '../../../../scenery/js/accessibility/FocusHighlightFromNode.js';
import ButtonListener from '../../../../scenery/js/input/ButtonListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import HSlider from '../../../../sun/js/HSlider.js';
import moleculesAndLightStrings from '../../molecules-and-light-strings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

const verySlowString = moleculesAndLightStrings.a11y.verySlow;
const slowString = moleculesAndLightStrings.a11y.slow;
const fastString = moleculesAndLightStrings.a11y.fast;
const emissionSliderDescriptionString = moleculesAndLightStrings.a11y.emissionSliderDescription;
const lightSourceLabelPatternString = moleculesAndLightStrings.a11y.lightSourceLabelPattern;
const emitsPhotonsFastString = moleculesAndLightStrings.a11y.emitsPhotonsFast;
const isOffAndPointsString = moleculesAndLightStrings.a11y.isOffAndPoints;
const emitsPhotonsSlowlyString = moleculesAndLightStrings.a11y.emitsPhotonsSlowly;
const emitsPhotonsVerySlowString = moleculesAndLightStrings.a11y.emitsPhotonsVerySlow;
const lightSourceOffString = moleculesAndLightStrings.a11y.lightSourceOff;

// constants
const THUMB_SIZE = new Dimension2( 10, 18 ); // size of the slider thumb
const TRACK_SIZE = new Dimension2( 50, 0.25 ); // size of the slider track
const THUMB_RECTANGLE_WIDTH = 30; // a background rectangle behind the thumb, made visible when the slider has focus
const THUMB_RECTANGLE_HEIGHT = 45; // a background rectangle behind the thumb, made visible when the slider has focus

// constants
const SLIDER_RANGE = new Range( 0, 1 ); // range for the slider values
const KEYBOARD_STEP = SLIDER_RANGE.getLength() / 3;

// describes ranges along the slider range from "very slow" to "fast"
const VERY_SLOW_RANGE = new Range( SLIDER_RANGE.min, SLIDER_RANGE.min + KEYBOARD_STEP );
const SLOW_RANGE = new Range( SLIDER_RANGE.min + KEYBOARD_STEP, SLIDER_RANGE.min + 2 * KEYBOARD_STEP );
const FAST_RANGE = new Range( SLIDER_RANGE.min + 2 * KEYBOARD_STEP, SLIDER_RANGE.max );

// descriptions mapped to range for aria-valuetext
const RANGE_VALUE_TEXT_MAP = new Map();
RANGE_VALUE_TEXT_MAP.set( VERY_SLOW_RANGE, verySlowString );
RANGE_VALUE_TEXT_MAP.set( SLOW_RANGE, slowString );
RANGE_VALUE_TEXT_MAP.set( FAST_RANGE, fastString );

// descriptions mapped to range for use in other description contexts
const RANGE_DESCRIPTION_MAP = new Map();
RANGE_DESCRIPTION_MAP.set( VERY_SLOW_RANGE, emitsPhotonsVerySlowString );
RANGE_DESCRIPTION_MAP.set( SLOW_RANGE, emitsPhotonsSlowlyString );
RANGE_DESCRIPTION_MAP.set( FAST_RANGE, emitsPhotonsFastString );

/**
 * Constructor for an emission rate control slider.
 *
 * @param {PhotonAbsorptionModel} model
 * @param {Color} color
 * @param {Tandem} tandem
 * @constructor
 */
function EmissionRateControlSliderNode( model, color, tandem ) {

  // Supertype constructor
  Node.call( this );

  const self = this;
  this.model = model; // @private
  this.color = color; // @private

  // Create the slider.  Frequency mapped from 0 to 1 so that there is a direct map to PhotonEmitterNode 'on' image
  // opacity.
  const sliderThumb = new EmissionRateThumbNode();

  this.emissionRateControlSlider = new HSlider( model.emissionFrequencyProperty, SLIDER_RANGE, {
    trackSize: TRACK_SIZE,
    thumbNode: sliderThumb,
    tandem: tandem,

    // a11y
    labelTagName: 'label',
    descriptionContent: emissionSliderDescriptionString,
    appendDescription: true,
    numberDecimalPlaces: 1,
    keyboardStep: KEYBOARD_STEP,
    shiftKeyboardStep: KEYBOARD_STEP,
    pageKeyboardStep: KEYBOARD_STEP,
    a11yCreateAriaValueText: this.getAriaValueText.bind( this ),

    // whenever these Properties change we need to update the value text
    a11yDependencies: [ model.photonWavelengthProperty, model.photonTargetProperty ]
  } ); // @private

  this.emissionRateControlSlider.focusHighlight = new FocusHighlightFromNode( sliderThumb, {

    // the focus highlight needs to be within the grey background of the custom thumb when the slider
    // receives focus so that the pink highlight is visible along the colors of the photon emitter
    dilationCoefficient: -2
  } );

  // a11y
  this.emissionRateControlSlider.addInputListener( {
    focus: function() {
      sliderThumb.backgroundRectangle.visible = true;
    },
    blur: function() {
      sliderThumb.backgroundRectangle.visible = false;
    }
  } );

  // width of the background rectangle is larger than the slider to accentuate the thumb.
  const backgroundOffset = 4;
  this.backgroundRect = new Rectangle(
    -THUMB_SIZE.width / 2 - backgroundOffset,
    -THUMB_SIZE.height / 4,
    TRACK_SIZE.width + THUMB_SIZE.width + 8,
    TRACK_SIZE.height + THUMB_SIZE.height / 2,
    { stroke: '#c0b9b9' } ); // @private

  // Create the default background box for this node.
  this.setBackgroundRectColor( PhetColorScheme.RED_COLORBLIND );

  this.photonWavelengthListener = function( wavelength ) {

    // check if the current node is disposed
    if ( !self.isDisposed ) {
      self.update();
    }

    // PDOM - update accessible name for the slider
    const lightSourceString = WavelengthConstants.getLightSourceName( wavelength );
    self.emissionRateControlSlider.labelContent = StringUtils.fillIn( lightSourceLabelPatternString, {
      lightSource: lightSourceString
    } );
  };

  // Update layout and color when photon wavelength changes.
  model.photonWavelengthProperty.link( this.photonWavelengthListener );

  this.addChild( this.backgroundRect );
  this.addChild( this.emissionRateControlSlider );
}

moleculesAndLight.register( 'EmissionRateControlSliderNode', EmissionRateControlSliderNode );

inherit( Node, EmissionRateControlSliderNode, {
  dispose: function() {
    this.model.photonWavelengthProperty.unlink( this.photonWavelengthListener );
    this.emissionRateControlSlider.dispose();
    Node.prototype.dispose.call( this );
  },

  /**
   * Update function for the control slider node.  Sets the value property of the slider and the background color
   * of the rectangle which holds the HSlider.
   * @private
   */
  update: function() {

    // Adjust the position of the slider.  Note that we do a conversion between period and frequency and map it into
    // the slider's range.
    this.emissionRateControlSlider.value = this.model.getSingleTargetFrequencyFromPeriod();

    // Update the color of the slider.
    const wavelength = this.model.photonWavelengthProperty.get();
    if ( wavelength === WavelengthConstants.IR_WAVELENGTH ) {
      this.setBackgroundRectColor( PhetColorScheme.RED_COLORBLIND ); // This tested well.
    }
    else if ( wavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {
      this.setBackgroundRectColor( 'yellow' );
    }
    else if ( wavelength === WavelengthConstants.UV_WAVELENGTH ) {
      this.setBackgroundRectColor( 'rgb(200, 0, 200)' );
    }
    else if ( wavelength === WavelengthConstants.MICRO_WAVELENGTH ) {
      this.setBackgroundRectColor( 'rgb(200, 200, 200)' );
    }
    else {
      throw new Error( 'unrecognized photon wavelength: ' + wavelength );
    }
  },

  /**
   * Set the base color of the background rectangle for the emission rate control slider.
   *
   * @param {Color} baseColor - The base color for the background rectangle which holds the slider.
   * @private
   */
  setBackgroundRectColor: function( baseColor ) {
    const rectHeight = this.emissionRateControlSlider.height;
    const rectWidth = this.emissionRateControlSlider.width;
    this.backgroundRect.fill = new LinearGradient( 0, 0, rectWidth, rectHeight ).addColorStop( 0, 'rgb(51,51,51)' ).addColorStop( 1, baseColor );
  },

  /**
   * Get the aria-valuetext for the slider, which describes the current value. This is read to the user when
   * focus lands on the slider and whenever the value changes. Returns something like
   * "very slow" or
   * "fast"
   * @private
   *
   * @param {number} mappedValue - formatted value to be read
   * @param {number} newValue - new Property value driving this slider
   * @param {number} previousValue - old value before Property value changed
   * @returns {string}
   */
  getAriaValueText( mappedValue, newValue, previousValue ) {

    // "floor" decimal places beyond the tenths to accurately describe value range
    mappedValue = Math.floor( mappedValue * 10 ) / 10;

    let emissionRateString = null;
    if ( mappedValue === 0 ) {
      emissionRateString = lightSourceOffString;
    }
    else {
      RANGE_VALUE_TEXT_MAP.forEach( ( valueString, keyRange, map ) => {

        // cannot break early out of forEach but it is the best way to iterate over a Map, so only set if we
        // haven't already found a string
        if ( emissionRateString === null && keyRange.contains( mappedValue ) ) {
          emissionRateString = valueString;
        }
      } );
    }

    assert && assert( emissionRateString, 'No aria-valuetext found for provided value' );
    return emissionRateString;
  }
}, {

  /**
   * Get a description of the emission rate frequency, describing the emission rate with a little more context like
   * "emits photons slowly and" or
   * "emits photons fast and" or
   * "is off and points"
   *
   * Note that these are meant to be inserted into a another string in context. If you
   * need "slowly" or "quickly" on their own, break this function up into others.
   * @public
   *
   * @param {number} emissionFrequency - normalized, 0-1
   * @returns {string}
   */
  getEmissionFrequencyDescription( emissionFrequency ) {
    assert && assert( 0 <= emissionFrequency <= 1, 'frequency should be normalized' );

    // "floor" decimal places beyond the tenths to accurately describe value range
    const flooredValue = Math.floor( emissionFrequency * 10 ) / 10;

    let frequencyDescriptionString = null;
    if ( emissionFrequency === 0 ) {
      frequencyDescriptionString = isOffAndPointsString;
    }
    else {
      RANGE_DESCRIPTION_MAP.forEach( ( valueString, keyRange, map ) => {

        // cannot break early out of forEach but it is the best way to iterate over a Map, so only set if we
        // haven't already found a string
        if ( frequencyDescriptionString === null && keyRange.contains( flooredValue ) ) {
          frequencyDescriptionString = valueString;
        }
      } );
    }

    return frequencyDescriptionString;
  }
} );

/**
 * Constructor for the thumb node used in this control slider.  The shape is a partial octagon with three horizontal
 * lines near the center to simulate grippable notches on the thumb.  Notice that highlighting is not linked to any
 * property because the control slider will always be enabled for the sim 'Molecules and Light'.
 * @constructor
 */
function EmissionRateThumbNode() {

  Node.call( this );

  // draw the partial octagon shape of the slider.
  const thumbShape = new Shape();
  thumbShape.moveTo( 0, 0 ); // Top left corner of the thumb.
  thumbShape.horizontalLineTo( THUMB_SIZE.width * 0.75 );
  thumbShape.lineTo( THUMB_SIZE.width, THUMB_SIZE.height * 0.33 );
  thumbShape.verticalLineTo( THUMB_SIZE.height * 0.66 );
  thumbShape.lineTo( THUMB_SIZE.width * 0.75, THUMB_SIZE.height );
  thumbShape.horizontalLineTo( 0 );
  thumbShape.close();

  // @public (a11y) - so it can be made invisible, helps focus highlight stand out
  this.backgroundRectangle = Rectangle.bounds( new Bounds2( 0, 0, THUMB_RECTANGLE_WIDTH, THUMB_RECTANGLE_HEIGHT ), {
    fill: '#ababab',
    visible: false // not visible until slider is focused
  } );

  // supertype constructor
  const thumbPath = new Path( thumbShape, {
    lineWidth: 1,
    lineJoin: 'bevel',
    stroke: 'black',
    fill: 'rgb(0, 203, 230)'
  } );

  thumbPath.center = this.backgroundRectangle.center;

  this.addChild( this.backgroundRectangle );
  this.addChild( thumbPath );

  // draw three lines along the vertical of the thumbNode.
  for ( let n = 1; n < 4; n++ ) {
    thumbPath.addChild( new Path(
      Shape.lineSegment(
        n * THUMB_SIZE.width / 5,
        THUMB_SIZE.height / 5,
        n * THUMB_SIZE.width / 5,
        4 * THUMB_SIZE.height / 5
      ), {
        stroke: 'black',
        lineWidth: 1
      } ) );
  }

  // highlight thumb on pointer over
  const buttonListener = new ButtonListener( {
    over: function( event ) {
      thumbPath.fill = 'rgb(80,250,255)';
    },
    up: function( event ) {
      thumbPath.fill = 'rgb(0, 203, 230)';
    }
  } );
  thumbPath.addInputListener( buttonListener );

  // make this easier to grab in touch environments
  this.touchArea = thumbPath.bounds.dilatedXY( 20, 20 );

  this.disposeEmissionRateThumbNode = function() {
    thumbPath.removeInputListener( buttonListener );
  };
}

moleculesAndLight.register( 'EmissionRateThumbNode', EmissionRateThumbNode );

inherit( Node, EmissionRateThumbNode, {
  dispose: function() {
    this.disposeEmissionRateThumbNode();
    Path.prototype.dispose.call( this );
  }
} );

export default EmissionRateControlSliderNode;