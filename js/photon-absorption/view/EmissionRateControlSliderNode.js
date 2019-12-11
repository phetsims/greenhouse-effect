// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node that implements a slider that is used to control the emission rate of photons.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  // const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ButtonListener = require( 'SCENERY/input/ButtonListener' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );

  // PDOM strings
  const verySlowString = MoleculesAndLightA11yStrings.verySlowString.value;
  const slowString = MoleculesAndLightA11yStrings.slowString.value;
  const fastString = MoleculesAndLightA11yStrings.fastString.value;

  // constants
  const THUMB_SIZE = new Dimension2( 10, 18 ); // size of the slider thumb
  const TRACK_SIZE = new Dimension2( 50, 0.25 ); // size of the slider track
  const THUMB_RECTANGLE_WIDTH = 30; // a background rectangle behind the thumb, made visible when the slider has focus
  const THUMB_RECTANGLE_HEIGHT = 45; // a background rectangle behind the thumb, made visible when the slider has focus

  // a11y strings
  const emissionSliderDescriptionString = MoleculesAndLightA11yStrings.emissionSliderDescriptionString.value;
  const lightSourceLabelPatternString = MoleculesAndLightA11yStrings.lightSourceLabelPatternString.value;
  const emitsPhotonsQuicklyString = MoleculesAndLightA11yStrings.emitsPhotonsQuicklyString.value;
  const isOffAndPointsString = MoleculesAndLightA11yStrings.isOffAndPointsString.value;
  const emitsPhotonsSlowlyString = MoleculesAndLightA11yStrings.emitsPhotonsSlowlyString.value;
  const emitsPhotonsVerySlowlyString = MoleculesAndLightA11yStrings.emitsPhotonsVerySlowlyString.value;
  const lightSourceOffString = MoleculesAndLightA11yStrings.lightSourceOffString.value;
  const emissionRatePatternString = MoleculesAndLightA11yStrings.emissionRatePatternString.value;

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
    const sliderRange = new Range( 0, 1 );
    const sliderThumb = new EmissionRateThumbNode();
    this.emissionRateControlSlider = new HSlider( model.emissionFrequencyProperty, sliderRange, {
      trackSize: TRACK_SIZE,
      thumbNode: sliderThumb,
      tandem: tandem,

      // a11y
      labelTagName: 'label',
      descriptionContent: emissionSliderDescriptionString,
      appendDescription: true,
      numberDecimalPlaces: 1,
      keyboardStep: sliderRange.getLength() / 10,
      shiftKeyboardStep: sliderRange.getLength() / 20,
      pageKeyboardStep: sliderRange.getLength() / 5,
      a11yMapValue: value => Util.toFixedNumber( value, 1 ),
      a11yCreateAriaValueText: this.getAriaValueText.bind( this ),

      // whenever these Properties change we need to update the value text
      a11yDependencies: [ model.photonWavelengthProperty, model.photonTargetProperty ]
    } ); // @private

    this.emissionRateControlSlider.focusHighlight = new FocusHighlightFromNode( sliderThumb, {

      // the focus highlight needs to be within the grey background of the custom thumb when the slider
      // receives focus so that the pink highlight is visible along the colors of the photon emitter
      dilationCoefficient: -2
    } );

    // @private (PDOM) - maps ranges of the emission frequency value to the described emission rate in the PDOM
    this.pdomValueDescriptonMap = new Map();

    const rangeDelta = sliderRange.getLength() / 3;
    this.pdomValueDescriptonMap.set( new Range( sliderRange.min, rangeDelta ), verySlowString );
    this.pdomValueDescriptonMap.set( new Range( sliderRange.min + rangeDelta, sliderRange.min + 2 * rangeDelta ), slowString );
    this.pdomValueDescriptonMap.set( new Range( sliderRange.min + 2 * rangeDelta, sliderRange.max ), fastString );

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
     * focus lands on the slider and whenever the value changes.
     * @private
     *
     * @param {number} mappedValue - formatted value to be read
     * @param {number} newValue - new Property value driving this slider
     * @param {number} previousValue - old value before Property value changed
     * @returns {string}
     */
    getAriaValueText( mappedValue, newValue, previousValue ) {
      if ( mappedValue === 0 ) {
        return lightSourceOffString;
      }
      else {
        let emissionRateString = '';
        this.pdomValueDescriptonMap.forEach( ( valueString, rangeKey, map ) => {
          if ( rangeKey.contains( mappedValue ) ) {
            emissionRateString = valueString;
            return;
          }
        } );

        return emissionRateString;
      }
    }
  }, {

    /**
     * Get a description of the emission rate frequency, like
     * "emits photons slowly and" or
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

      let frequencyDescriptionString = null;
      if ( emissionFrequency === 0 ) {
        frequencyDescriptionString = isOffAndPointsString;
      }
      else if ( emissionFrequency <= 0.3 ) {
        frequencyDescriptionString = emitsPhotonsVerySlowlyString;
      }
      else if ( emissionFrequency <= 0.6 ) {
        frequencyDescriptionString = emitsPhotonsSlowlyString;
      }
      else {
        frequencyDescriptionString = emitsPhotonsQuicklyString;
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

  return EmissionRateControlSliderNode;
} );

