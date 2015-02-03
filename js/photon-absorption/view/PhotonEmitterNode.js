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

  // images
  var heatLampImage = require( 'image!MOLECULES_AND_LIGHT/infrared-source.png' );
  var flashlightImage = require( 'image!MOLECULES_AND_LIGHT/flashlight.png' );
  var microwaveTransmitterImage = require( 'image!MOLECULES_AND_LIGHT/microwave-source.png' );
  var uvLightImage = require( 'image!MOLECULES_AND_LIGHT/uv-source.png' );
  var heatLampOffImage = require( 'image!MOLECULES_AND_LIGHT/infrared-source-off.png' );
  var flashlightOffImage = require( 'image!MOLECULES_AND_LIGHT/flashlight-off.png' );
  var uvLightOffImage = require( 'image!MOLECULES_AND_LIGHT/uv-source-off.png' );

  /**
   * Constructor for the photon emitter node.
   *
   * @param {number} width - Desired width of the emitter image in screen coords.
   * @param {PhotonAbsorptionModel} model
   * @constructor
   */
  function PhotonEmitterNode( width, model ) {

    // Supertype constructor
    Node.call( this );

    // Cary this node through the scope in nested functions.
    var thisNode = this;

    this.model = model; // @private
    this.photonWavelength = 0; // Keep track of when this emission frequency changes. @private

    // Listen to model for events that may cause this node to change emitted wavelength or frequency.
    model.multilink( ['photonWavelength', 'emissionFrequency'], function( photonWavelength, emissionFrequency ) {
      thisNode.updateImage( width, photonWavelength, emissionFrequency );
    } );

  }

  return inherit( Node, PhotonEmitterNode, {

    /**
     * Set the appropriate image based on the current setting for the emission frequency and wavelength of the emitted
     * photons.
     *
     * @param {number} flashlightWidth
     * @param {number} photonWavelength - wavelength of emitted photon to determine if a new control slider needs to be added
     * @param {number} emissionFrequency - frequency of emitted photons.
     * @private
     */
    updateImage: function( flashlightWidth, photonWavelength, emissionFrequency ) {

      // If there is already a photon emitter image child, remove it.
      if ( _.contains( this.children, this.photonEmitterImage ) ) {
        this.removeChild( this.photonEmitterImage );
      }

      // Create the wavelength and emission frequency dependent image node.  If the emission frequency is greater than
      // zero, represent the emitter as being 'on'.  Otherwise, emitter should appear 'off'.
      if ( this.model.photonWavelength === WavelengthConstants.IR_WAVELENGTH ) {
        if ( emissionFrequency > 0 ) {
          this.photonEmitterImage = new Image( heatLampImage );
        }
        else {
          this.photonEmitterImage = new Image( heatLampOffImage );
        }
      }
      else if ( this.model.photonWavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {
        if ( emissionFrequency > 0 ) {
          this.photonEmitterImage = new Image( flashlightImage );
        }
        else {
          this.photonEmitterImage = new Image( flashlightOffImage );
        }
      }
      else if ( this.model.photonWavelength === WavelengthConstants.UV_WAVELENGTH ) {
        if ( emissionFrequency > 0 ) {
          this.photonEmitterImage = new Image( uvLightImage );
        }
        else {
          this.photonEmitterImage = new Image( uvLightOffImage );
        }
      }
      else if ( this.model.photonWavelength === WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterImage = new Image( microwaveTransmitterImage );
      }

      // Translate center and scale the emitter image, setting the offset such that the center right side of the image
      // is at the origin.  This assumes that photons will be emitted horizontally and to the right.
      this.photonEmitterImage.scale( flashlightWidth / this.photonEmitterImage.width );
      this.photonEmitterImage.center = new Vector2( 0, 0 );

      // Add the image to this node, and move it to the back.
      this.addChild( this.photonEmitterImage );
      this.photonEmitterImage.moveToBack();

      // If photon wavelength changes, frequency control slider must also be updated.
      if ( this.photonWavelength !== photonWavelength ) {
        this.photonWavelength = photonWavelength; // Update to the new wavelength.

        // If there is already a frequency control slider, remove it.
        if ( _.contains( this.children, this.emissionRateControlSliderNode ) ) {
          this.removeChild( this.emissionRateControlSliderNode );
        }

        this.emissionRateControlSliderNode = new EmissionRateControlSliderNode( this.model, 'rgb(0, 85, 0)' );

        // Add the emission rate control slider to the correct location on the photon emitter.
        var xOffset = 10; // x offset necessary to fit the slider correctly on the microwave emitter.
        this.emissionRateControlSliderNode.center = new Vector2(
            this.photonEmitterImage.centerX - this.emissionRateControlSliderNode.centerX / 2 - xOffset,
            this.photonEmitterImage.centerY - this.emissionRateControlSliderNode.centerY / 2 );

        // Add the slider to this node.
        this.addChild( this.emissionRateControlSliderNode );
      }

    }
  } );
} );