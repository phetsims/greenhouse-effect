// Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that represents the photon emitter in the view.  The graphical representation of the emitter changes based on
 * the emission frequency and wavelength of photons that the model is set to emit. This node is set up such that setting
 * its offset on the photon emission point in the model should position it correctly.  This assumes that photons are
 * emitted to the right.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var EmissionRateControlSliderNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/EmissionRateControlSliderNode' );
  var Property = require( 'AXON/Property' );

  // images
  var heatLampOnImage = require( 'image!MOLECULES_AND_LIGHT/infrared-source.png' );
  var flashlightOnImage = require( 'image!MOLECULES_AND_LIGHT/flashlight.png' );
  var microwaveTransmitterImage = require( 'image!MOLECULES_AND_LIGHT/microwave-source.png' );
  var uvLightOnImage = require( 'image!MOLECULES_AND_LIGHT/uv-source.png' );
  var heatLampOffImage = require( 'image!MOLECULES_AND_LIGHT/infrared-source-off.png' );
  var flashlightOffImage = require( 'image!MOLECULES_AND_LIGHT/flashlight-off.png' );
  var uvLightOffImage = require( 'image!MOLECULES_AND_LIGHT/uv-source-off.png' );

  /**
   * Constructor for the photon emitter node.
   *
   * @param {number} width - Desired width of the emitter image in screen coords.
   * @param {PhotonAbsorptionModel} model
   * @param {Tandem} tandem - support for exporting instances from the sim
   * @constructor
   */
  function PhotonEmitterNode( width, model, tandem ) {

    // supertype constructor
    Node.call( this );

    // carry this through scope
    var thisNode = this;

    this.model = model; // @private
    this.emissionFrequencyProperty = new Property( 0 ); // frequency of photon emission

    // update the photon emitter upon changes to the photon wavelength
    model.photonWavelengthProperty.link( function( photonWavelength ) {
      var emitterTandemName = WavelengthConstants.getTandemName( photonWavelength );
      thisNode.updateImage( width, photonWavelength, thisNode.emissionFrequencyProperty.value, tandem, emitterTandemName );
    } );

    // update brightness of emitter bulb upon changes to photon emission frequency
    this.emissionFrequencyProperty.link( function( emissionFrequency ) {
      thisNode.updateOffImageOpacity( thisNode.model.photonWavelength, emissionFrequency );
    } );

  }

  return inherit( Node, PhotonEmitterNode, {

    /**
     * Set the appropriate images based on the current setting for the emission frequency and wavelength of the emitted
     * photons.  The emitter is composed of layered 'on' and an 'off' images.  The emission frequency determines the
     * opacity of the 'on' image so that it is opaque when the emission frequency is at its maximum.
     *
     * @param {number} emitterWidth
     * @param {number} photonWavelength - wavelength of emitted photon to determine if a new control slider needs to be added
     * @param {number} emissionFrequency
     * @private
     */
    updateImage: function( emitterWidth, photonWavelength, emissionFrequency, tandem, emitterTandemName ) {

      // remove any existing children
      this.removeAllChildren();

      // create the wavelength dependent images and nodes
      if ( photonWavelength === WavelengthConstants.IR_WAVELENGTH ) {
        this.photonEmitterOnImage = new Image( heatLampOnImage );
        this.photonEmitterOffImage = new Image( heatLampOffImage );
      }
      else if ( photonWavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {
        this.photonEmitterOnImage = new Image( flashlightOnImage );
        this.photonEmitterOffImage = new Image( flashlightOffImage );
      }
      else if ( photonWavelength === WavelengthConstants.UV_WAVELENGTH ) {
        this.photonEmitterOnImage = new Image( uvLightOnImage );
        this.photonEmitterOffImage = new Image( uvLightOffImage );
      }
      else if ( photonWavelength === WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterOnImage = new Image( microwaveTransmitterImage );
      }

      // scale the on image by the desired width of the emitter and add to top
      this.photonEmitterOnImage.scale( emitterWidth / this.photonEmitterOnImage.width );
      this.photonEmitterOnImage.center = new Vector2( 0, 0 );
      this.addChild( this.photonEmitterOnImage );

      // scale, center, and set opacity of 'off' image - no 'off' image for microwave emitter
      if ( photonWavelength !== WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterOffImage.scale( emitterWidth / this.photonEmitterOffImage.width );
        this.photonEmitterOffImage.center = new Vector2( 0, 0 );
        this.photonEmitterOffImage.setOpacity( 1 - emissionFrequency );
        this.addChild( this.photonEmitterOffImage );
      }

      this.emissionRateControlSliderNode && this.emissionRateControlSliderNode.dispose();

      // create the photon emission rate control slider
      this.emissionRateControlSliderNode = new EmissionRateControlSliderNode( this.model, 'rgb(0, 85, 0)',
        this.emissionFrequencyProperty, tandem.createTandem( emitterTandemName + 'Slider' ) );

      // add the slider to the correct location on the photon emitter
      var xOffset = 12; // x offset necessary to fit the slider correctly on the microwave emitter.
      this.emissionRateControlSliderNode.center = new Vector2(
        this.photonEmitterOffImage.centerX - this.emissionRateControlSliderNode.centerX / 2 - xOffset,
        this.photonEmitterOffImage.centerY - this.emissionRateControlSliderNode.centerY / 2 );
      this.addChild( this.emissionRateControlSliderNode );

    },

    /**
     * Update transparency of the 'off' emitter image.  The opacity of the off emitter is used because this seems to
     * perform better than using the on emitter.  See issue #90.
     *
     * @param {number} photonWavelength
     * @param {number} emissionFrequency
     */
    updateOffImageOpacity: function( photonWavelength, emissionFrequency ) {
      if ( photonWavelength !== WavelengthConstants.MICRO_WAVELENGTH ) {
        // TODO: For performance reasons, a max opacity value of 0.99 is used instead of making the image fully opaque.
        // This is a workaround for a Scenery issue, see https://github.com/phetsims/scenery/issues/404.  The
        // workaround can be removed once the Scenery issue is resolved, but performance should be re-verified.
        this.photonEmitterOffImage.opacity = Math.min( 1 - emissionFrequency, 0.99 );
      }
    }
  } );
} );