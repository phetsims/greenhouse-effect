// Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that implements the slider that is used to control the emission rate of photons.  The slider will update its
 * background color based on the emission wavelength, and will adjust its position as the corresponding setting in the
 * model changes.
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

  // Size of the slider thumb;
  var THUMB_SIZE = new Dimension2( 10, 16 );
  // Maximum value for slider range.
  var SLIDER_RANGE = 100;

  // Minima for photon emission periods.
  var MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET = 400;
  var MIN_PHOTON_EMISSION_PERIOD_MULTIPLE_TARGET = 100;

  /**
   * Constructor for an emission rate control slider.
   *
   * @param {PhotonAbsorptionModel} model
   * @param {Color} color
   * @constructor
   */
  function EmissionRateControlSliderNode( model, color ) {

    // Supertype constructor
    Node.call( this );

    var thisNode = this;
    this.model = model; // @private
    this.color = color; // @private

    // The following define the dimensions of the HSlider and can be adjusted as needed for best look.
    var controlSliderThumbSize = new Dimension2( 10, 18 );
    var controlSliderTrackSize = new Dimension2( 50, 0.25 );

    // Draw the desired thumb shape of the slider.
    var thumbShape = new Shape();
    thumbShape.moveTo( 0, 0 ); // Top left corner of the thumb.
    thumbShape.horizontalLineTo( THUMB_SIZE.width * 0.75 );
    thumbShape.lineTo( THUMB_SIZE.width, THUMB_SIZE.height * 0.33 );
    thumbShape.verticalLineTo( THUMB_SIZE.height * 0.66 );
    thumbShape.lineTo( THUMB_SIZE.width * 0.75, THUMB_SIZE.height );
    thumbShape.horizontalLineTo( 0 );
    thumbShape.close();

    var thumbNode = new Path( thumbShape, {
      lineWidth: 1,
      lineJoin: 'bevel',
      stroke: 'black',
      fill: 'rgb(0, 203, 230)'
    } );

    // Draw three lines along the vertical of the thumbNode.
    for( var n = 1; n < 4; n++ ){
      thumbNode.addChild( new Path( Shape.lineSegment( n*THUMB_SIZE.width/5, THUMB_SIZE.height/5, n*THUMB_SIZE.width/5, 4*THUMB_SIZE.height/5 ),{ stroke: 'black', lineWidth: 1 } ) );
    }

    this.emissionRateControlSlider = new HSlider( model.emissionFrequencyProperty, { min: 0, max: SLIDER_RANGE },
      { thumbSize: controlSliderThumbSize, trackSize: controlSliderTrackSize, thumbFillEnabled: 'rgb(0, 203, 230)', thumbNode: thumbNode} ); // @private

    this.backgroundRect = new Rectangle(
        -controlSliderThumbSize.width / 2,
        -controlSliderThumbSize.height / 4,
        controlSliderTrackSize.width + controlSliderThumbSize.width,
        controlSliderTrackSize.height + controlSliderThumbSize.height / 2,
      { stroke: '#c0b9b9' } ); // @private

    // Create the default background box for this node.
    this.setBackgroundRectColor( 'rgb(255, 85, 0)' );

    // Listen to the model for events that may cause this node to change state.
    model.photonWavelengthProperty.link( function() { thisNode.update(); } );
    model.emissionFrequencyProperty.link( function( emissionFrequency ) {
      var sliderProportion = emissionFrequency / SLIDER_RANGE;
      if ( sliderProportion === 0 ) {
        model.setPhotonEmissionPeriod( Number.POSITIVE_INFINITY );
      }
      else if ( model.photonTarget === 'CONFIGURABLE_ATMOSPHERE' ) {
        // Note the implicit conversion from frequency to period in the following line.
        model.setPhotonEmissionPeriod( (MIN_PHOTON_EMISSION_PERIOD_MULTIPLE_TARGET / sliderProportion) );
      }
      else {
        // Note the implicit conversion from frequency to period in the following line.
        model.setPhotonEmissionPeriod( (MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET / sliderProportion) );
      }
    } );

    this.addChild( this.backgroundRect );
    this.addChild( this.emissionRateControlSlider );

  }

  return inherit( Node, EmissionRateControlSliderNode, {

    /**
     * Update function for the control slider node.  Sets the value property of the slider and the background color
     * of the rectangle which holds the HSlider.
     * @private
     */
    update: function() {

      // Adjust the position of the slider.  Note that we do a conversion between period and frequency and map it into
      // the slider's range.
      var mappedFrequency;
      if ( this.model.photonTarget === 'CONFIGURABLE_ATMOSPHERE' ) {
        mappedFrequency = Math.round( MIN_PHOTON_EMISSION_PERIOD_MULTIPLE_TARGET /
                                      this.model.photonEmissionPeriodTarget * SLIDER_RANGE );
      }
      else {
        mappedFrequency = Math.round( MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET /
                                      this.model.photonEmissionPeriodTarget * SLIDER_RANGE );
      }

      this.emissionRateControlSlider.value = mappedFrequency;

      // Update the color of the slider.
      var wavelength = this.model.photonWavelength;
      if ( wavelength === WavelengthConstants.IR_WAVELENGTH ) {
        // This is the rgb for PhetColorScheme.RED_COLORBLIND which tested well.
        this.setBackgroundRectColor( 'rgb(255, 85, 0)' );
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

} );
