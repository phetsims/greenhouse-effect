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
  var Color = require( 'SCENERY/util/Color' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

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
    var thisModel = model;
    this.model = model;
    this.color = color;

    var emissionControlSliderSize = new Dimension2( 10, 15 ); // This may be adjusted as needed for best look.
    this.emissionRateControlSlider = new HSlider( model.emissionFrequencyProperty, { min: 0, max: SLIDER_RANGE },
      { thumbSize: emissionControlSliderSize, trackSize: new Dimension2( 50, 1 ) } );

    // Create the default background box for this node.
    this.setBackgroundRectangle( new Color( 255, 85, 0 ) );

    // Listen to the model for events that may cause this node to change state.
    model.photonWavelengthProperty.link( function() { thisNode.update(); } );
    model.emissionFrequencyProperty.link( function() {
      var sliderProportion = thisModel.emissionFrequencyProperty.get() / SLIDER_RANGE;
      if ( sliderProportion === 0 ) {
        model.setPhotonEmissionPeriod( Number.POSITIVE_INFINITY );
      }
      else if ( model.getPhotonTarget() === 'CONFIGURABLE_ATMOSPHERE' ) {
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
     */
    update: function() {

      // Adjust the position of the slider.  Note that we do a conversion between period and frequency and map it into
      // the slider's range.
      var mappedFrequency;
      if ( this.model.getPhotonTarget() === 'CONFIGURABLE_ATMOSPHERE' ) {
        mappedFrequency = Math.round( MIN_PHOTON_EMISSION_PERIOD_MULTIPLE_TARGET /
                                      this.model.getPhotonEmissionPeriod() * SLIDER_RANGE );
      }
      else {
        mappedFrequency = Math.round( MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET /
                                      this.model.getPhotonEmissionPeriod() * SLIDER_RANGE );
      }

      this.emissionRateControlSlider.valueProperty = mappedFrequency;

      // Update the color of the slider.
      if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.IR_WAVELENGTH ) {
        // This is the rgb for PhetColorScheme.RED_COLORBLIND which tested well.
        this.setBackgroundRectangle( new Color( 255, 85, 0 ) );
      }
      else if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.VISIBLE_WAVELENGTH ) {
        this.setBackgroundRectangle( Color.YELLOW );
      }
      else if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.UV_WAVELENGTH ) {
        this.setBackgroundRectangle( new Color( 200, 0, 200 ) );
      }
      else if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.MICRO_WAVELENGTH ) {
        this.setBackgroundRectangle( new Color( 200, 200, 200 ) );
      }
      else {
        console.error( "Error: Unrecognized photon." );
      }
    },

    /**
     * Set the parameters of the background rectangle for teh emission rate control slider.
     *
     * @param {Color} baseColor - The base color for the background rectangle which holds the slider.
     */
    // Set the parameters of the background rectangle for the emission rate control slider.
    setBackgroundRectangle: function( baseColor ) {
      var rectHeight = this.emissionRateControlSlider.height;
      var rectWidth = this.emissionRateControlSlider.width;
      this.backgroundRect = new Rectangle( -this.emissionRateControlSlider.options.thumbSize.width / 2,
          -this.emissionRateControlSlider.options.thumbSize.height / 2,
          this.emissionRateControlSlider.options.trackSize.width +
          this.emissionRateControlSlider.options.thumbSize.width,
          this.emissionRateControlSlider.options.trackSize.height +
          this.emissionRateControlSlider.options.thumbSize.height,
        0, 0, { fill: new LinearGradient( 0, 0, rectWidth, rectHeight ).addColorStop( 0, 'black' ).addColorStop( 1, baseColor ),
          stroke: '#c0b9b9' } );
    }
  } );

} );
