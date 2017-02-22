// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that implements a slider that is used to control the emission rate of photons.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HSlider = require( 'SUN/HSlider' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );

  // constants
  var THUMB_SIZE = new Dimension2( 10, 18 ); // size of the slider thumb
  var TRACK_SIZE = new Dimension2( 50, 0.25 ); // size of the slider track

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

    var self = this;
    this.model = model; // @private
    this.color = color; // @private

    // Create the slider.  Frequency mapped from 0 to 1 so that there is a direct map to PhotonEmitterNode 'on' image
    // opacity.
    this.emissionRateControlSlider = new HSlider( model.emissionFrequencyProperty, { min: 0, max: 1 }, {
      trackSize: TRACK_SIZE,
      thumbFillEnabled: 'rgb(0, 203, 230)',
      thumbNode: new EmissionRateThumbNode(),
      tandem: tandem
    } ); // @private

    // width of the background rectangle is larger than the slider to accentuate the thumb.
    var backgroundOffset = 4;
    this.backgroundRect = new Rectangle(
      -THUMB_SIZE.width / 2 - backgroundOffset,
      -THUMB_SIZE.height / 4,
      TRACK_SIZE.width + THUMB_SIZE.width + 8,
      TRACK_SIZE.height + THUMB_SIZE.height / 2,
      { stroke: '#c0b9b9' } ); // @private

    // Create the default background box for this node.
    this.setBackgroundRectColor( PhetColorScheme.RED_COLORBLIND );

    // Update layout and color when photon wavelength changes.
    model.photonWavelengthProperty.link( function() { self.update(); } );

    this.addChild( this.backgroundRect );
    this.addChild( this.emissionRateControlSlider );
  }

  moleculesAndLight.register( 'EmissionRateControlSliderNode', EmissionRateControlSliderNode );

  inherit( Node, EmissionRateControlSliderNode, {
    dispose: function() {
      this.emissionRateControlSlider.dispose();
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
      var wavelength = this.model.photonWavelength;
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
      var rectHeight = this.emissionRateControlSlider.height;
      var rectWidth = this.emissionRateControlSlider.width;
      this.backgroundRect.fill = new LinearGradient( 0, 0, rectWidth, rectHeight ).addColorStop( 0, 'rgb(51,51,51)' ).addColorStop( 1, baseColor );
    }
  } );

  /**
   * Constructor for the thumb node used in this control slider.  The shape is a partial octagon with three horizontal
   * lines near the center to simulate grippable notches on the thumb.  Notice that highlighting is not linked to any
   * property because the control slider will always be enabled for the sim 'Molecules and Light'.
   * @constructor
   */
  function EmissionRateThumbNode() {

    var self = this;

    // draw the partial octagon shape of the slider.
    var thumbShape = new Shape();
    thumbShape.moveTo( 0, 0 ); // Top left corner of the thumb.
    thumbShape.horizontalLineTo( THUMB_SIZE.width * 0.75 );
    thumbShape.lineTo( THUMB_SIZE.width, THUMB_SIZE.height * 0.33 );
    thumbShape.verticalLineTo( THUMB_SIZE.height * 0.66 );
    thumbShape.lineTo( THUMB_SIZE.width * 0.75, THUMB_SIZE.height );
    thumbShape.horizontalLineTo( 0 );
    thumbShape.close();

    // supertype constructor
    Path.call( this, thumbShape, {
      lineWidth: 1,
      lineJoin: 'bevel',
      stroke: 'black',
      fill: 'rgb(0, 203, 230)'
    } );

    // draw three lines along the vertical of the thumbNode.
    for ( var n = 1; n < 4; n++ ) {
      self.addChild( new Path(
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
    var buttonListener = new ButtonListener( {
      over: function( event ) {
        self.fill = 'rgb(80,250,255)';
      },
      up: function( event ) {
        self.fill = 'rgb(0, 203, 230)';
      }
    } );
    self.addInputListener( buttonListener );

    // make this easier to grab in touch environments
    this.touchArea = this.localBounds.dilatedXY( 20, 20 );

    this.disposeEmissionRateThumbNode = function() {
      self.removeInputListener( buttonListener );
    };
  }

  moleculesAndLight.register( 'EmissionRateThumbNode', EmissionRateThumbNode );

  inherit( Path, EmissionRateThumbNode, {
    dispose: function() {
      this.disposeEmissionRateThumbNode();
      Path.prototype.dispose.call( this );
    }
  } );

  return EmissionRateControlSliderNode;
} );

