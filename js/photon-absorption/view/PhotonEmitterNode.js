// Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that represents the photon emitter in the view.  The graphical representation of the emitter changes based on
 * the wavelength of photons that the model is set to emit. This node is set up such that setting its offset on the
 * photon emission point in the model should position it correctly.  This assumes that photons are emitted to the right.
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
  var Color = require( 'SCENERY/util/Color' );
  var EmissionRateControlSliderNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/EmissionRateControlSliderNode' );

  // images
  var heatLampImage = require( 'image!MOLECULES_AND_LIGHT/heat-lamp.png' );
  var flashlight2Image = require( 'image!MOLECULES_AND_LIGHT/flashlight2.png' );
  var microwaveTransmitter = require( 'image!MOLECULES_AND_LIGHT/microwave-transmitter.png' );
  var uvLight2 = require( 'image!MOLECULES_AND_LIGHT/uv_light_2.png' );

  /**
   * Constructor for the photon emitter node.
   *
   * @param {Number} wi dth - Desired width of the emitter image in screen coords. Height is based off image aspect ratio.
   * @param { ModelViewTransform2 } mvt
   * @param {PhotonAbsorptionModel} model
   * @constructor
   */
  function PhotonEmitterNode( width, mvt, model ) {

    // Supertype constructor
    Node.call( this, { photonWavelength: WavelengthConstants.VISIBLE_WAVELENGTH} );

    // Cary this node through the scope in nested functions.
    var thisNode = this;

    this.model = model;
    this.mvt = mvt;

    // Create the layers on which the other nodes will be placed.
    this.emitterImageLayer = new Node();
    this.addChild( this.emitterImageLayer );
    this.emissionControlSliderLayer = new Node();
    this.addChild( this.emissionControlSliderLayer );
    this.emitterImageWidth = width;

    // Listen to model for events that may cause this node to change emitted wavelength.
    model.photonWavelengthProperty.link( function() {
      thisNode.updateImage( thisNode.emitterImageWidth );
    } );

    // Add the initial image and photon emission slider.
    thisNode.updateImage( this.emitterImageWidth );

  }

  return inherit( Node, PhotonEmitterNode, {

    /**
     * Set the appropriate image based on the current setting for the wavelength of the emitted photons.
     *
     * @param {Number} flashlightWidth
     */
    updateImage: function( flashlightWidth ) {

      // Clear any existing image.
      this.emitterImageLayer.removeAllChildren();
      this.emissionControlSliderLayer.removeAllChildren();

      // Create the flashlight image node, setting the offset such that the center right side of the image is the
      // origin.  This assumes that photons will be emitted horizontally and to the right.
      if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.IR_WAVELENGTH ) {
        this.photonEmitterImage = new Image( heatLampImage );
      }
      else if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.VISIBLE_WAVELENGTH ) {
        this.photonEmitterImage = new Image( flashlight2Image );
      }
      else if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.UV_WAVELENGTH ) {
        this.photonEmitterImage = new Image( uvLight2 );
      }
      else if ( this.model.getEmittedPhotonWavelength() === WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterImage = new Image( microwaveTransmitter );
      }

      // Translate center and scale the emitter image
      this.photonEmitterImage.scale( flashlightWidth / this.photonEmitterImage.getWidth() );
      this.photonEmitterImage.setCenter( new Vector2( 0, 0 ) );
      this.emissionRateControlSliderNode = new EmissionRateControlSliderNode( this.model, new Color( 0, 85, 0 ) );

      // Add the emission rate control slider to the correct location on the photon emitter.
      this.emissionRateControlSliderNode.setCenter( new Vector2(
          this.photonEmitterImage.getCenterX() - this.emissionRateControlSliderNode.getCenterX() / 2,
          this.photonEmitterImage.getCenterY() - this.emissionRateControlSliderNode.getCenterY() / 2 ) );

      // Add the children to this node.
      this.emitterImageLayer.addChild( this.photonEmitterImage );
      this.emissionControlSliderLayer.addChild( this.emissionRateControlSliderNode );

    }
  } );
} );