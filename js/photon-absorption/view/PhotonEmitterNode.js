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
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  // images
  var microwaveTransmitterImage = require( 'image!MOLECULES_AND_LIGHT/microwave-source.png' );
  var flashlightTopImage = require( 'image!MOLECULES_AND_LIGHT/flashlight-top.png' );
  var flashlightBottomImage = require( 'image!MOLECULES_AND_LIGHT/flashlight-bottom.png' );
  var infraredTopImage = require( 'image!MOLECULES_AND_LIGHT/infrared-top.png' );
  var uvBottomImage = require( 'image!MOLECULES_AND_LIGHT/uv-bottom.png' );
  var uvTopImage = require( 'image!MOLECULES_AND_LIGHT/uv-top.png' );

  /**
   * Constructor for a bulb for a photon emitter. It is an Arc that spans the end of an emitter with a spherical
   * gradient to make it appear three dimensional.
   *
   * @param {number} radius - radius of the arc
   * @param {string} specularColor - color of the specular highlight
   * @param {string} diffuseColor - color of the diffuse reflection
   * @param {string} ambientColor - final fade color along the bulb perimeter
   * @constructor
   */
  function PhotonEmitterBulbNode( radius, specularColor, diffuseColor, ambientColor ) {

    // draw circular arc shape of the bulb and call the supertype constructor
    Path.call( this, new Shape.arc( 0, 0, radius, 7 * Math.PI / 4, Math.PI / 4, false ) );

    // extend scope
    this.radius = radius;

    // create linear mapping between photon emission frequency and rgb on/off color components
    var getFrequencyColorMap = function( offColor, onColor ) {
      // maximum scale value for interpolation, this is the max value of the frequency slider range
      var maxScale = 100;
      return {
        redMap: new LinearFunction( 0, maxScale, offColor.red, onColor.red ),
        blueMap: new LinearFunction( 0, maxScale, offColor.blue, onColor.blue ),
        greenMap: new LinearFunction( 0, maxScale, offColor.green, onColor.green )
      };
    };

    // declare the gray color components that represent the bulb being off
    var offSpecularColor = new Color( 'rgb(220,220,220)' );
    var offDiffuseColor = new Color( 'rgb(150,150,150)' );
    var offAmbientColor = new Color( 'rgb(106,106,106)' );

    // set the colors that represent the bulb being on
    var onSpecularColor = new Color( specularColor );
    var onDiffuseColor = new Color( diffuseColor );
    var onAmbientColor = new Color( ambientColor );

    // calculate the frequency/color map for specular, diffuse, and ambient color components
    this.specularMap = getFrequencyColorMap( offSpecularColor, onSpecularColor );
    this.ambientMap = getFrequencyColorMap( offAmbientColor, onAmbientColor );
    this.diffuseMap = getFrequencyColorMap( offDiffuseColor, onDiffuseColor );

  }

  inherit( Path, PhotonEmitterBulbNode, {

    /**
     * Update the color of the photon emitter bulb.
     *
     * @param {number} scaleFactor - scale along the linear mapping between frequency and color
     */
    updateFill: function( scaleFactor ) {

      // evaluate frequency/color map at the new frequency to get rgb values
      var getMappedColor = function( frequencyColorMap, frequencyScale ) {
        return new Color(
          frequencyColorMap.redMap( frequencyScale ),
          frequencyColorMap.greenMap( frequencyScale ),
          frequencyColorMap.blueMap( frequencyScale )
        );
      };

      var specularColor = getMappedColor( this.specularMap, scaleFactor );
      var diffuseColor = getMappedColor( this.diffuseMap, scaleFactor );
      var ambientColor = getMappedColor( this.ambientMap, scaleFactor );

      this.fill = new RadialGradient( this.radius * 0.75, this.radius * -0.10, 0, this.radius * 0.75, this.radius * -0.10, this.radius )
        .addColorStop( 0, 'white' )
        .addColorStop( 0.3, specularColor )
        .addColorStop( 0.5, diffuseColor )
        .addColorStop( 1, ambientColor );
    }
  } );

  /**
   * Constructor for the photon emitter node.
   *
   * @param {number} width - Desired width of the emitter image in screen coords.
   * @param {PhotonAbsorptionModel} model
   * @constructor
   */
  function PhotonEmitterNode( width, model ) {

    // supertype constructor
    Node.call( this );

    // cary this node through the scope in nested functions.
    var thisNode = this;

    this.model = model; // @private

    // listen to model for events that may cause this node to change emitted wavelength or frequency
    model.multilink( ['photonWavelength', 'emissionFrequency'], function( photonWavelength, emissionFrequency ) {
      thisNode.updateImage( width, photonWavelength, emissionFrequency );
    } );

  }

  return inherit( Node, PhotonEmitterNode, {

    /**
     * Set the appropriate images based on the current setting for the emission frequency and wavelength of the emitted
     * photons.  Photon emitters are built up from components and layered to look three dimensional.
     *
     * @param {number} emitterWidth
     * @param {number} photonWavelength - wavelength of emitted photon to determine if a new control slider needs to be added
     * @param {number} emissionFrequency - frequency of emitted photons (how fast they are emitted)
     * @private
     */
    updateImage: function( emitterWidth, photonWavelength, emissionFrequency ) {

      // remove any existing children
      this.removeAllChildren();

      // create the wavelength dependent images and nodes
      if ( photonWavelength === WavelengthConstants.IR_WAVELENGTH ) {
        this.photonEmitterTopImage = new Image( infraredTopImage );
        this.photonEmitterBulb = new PhotonEmitterBulbNode(
          ( this.photonEmitterTopImage.height / 2 ),
          'rgb(225,101,70)',
          'rgb(202,72,40)',
          'rgb(255,20,8)' );
      }
      else if ( photonWavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {
        this.photonEmitterTopImage = new Image( flashlightTopImage );
        this.photonEmitterBottomImage = new Image( flashlightBottomImage );
        this.photonEmitterBulb = new PhotonEmitterBulbNode( this.photonEmitterTopImage.height / 2,
          'rgb(255,255,102)',
          'rgb(255,255,2)',
          'rgb(204,204,2)' );
      }
      else if ( photonWavelength === WavelengthConstants.UV_WAVELENGTH ) {
        this.photonEmitterTopImage = new Image( uvTopImage );
        this.photonEmitterBottomImage = new Image( uvBottomImage );
        this.photonEmitterBulb = new PhotonEmitterBulbNode( this.photonEmitterTopImage.height / 2,
          'rgb(171,111,189)',
          'rgb(131,42,156)',
          'rgb(72,10,90)' );
      }
      else if ( photonWavelength === WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterTopImage = new Image( microwaveTransmitterImage );
      }

      // layer the photon emitter from its constituent parts so that it looks three dimensional
      this.layerPhotonEmitter( photonWavelength, emitterWidth );

      // if not a microwave emitter, update bulb fill - microwave emitter does not have a bulb
      if ( photonWavelength !== WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterBulb.updateFill( emissionFrequency );
      }

      // create the photon emission rate control slider
      this.emissionRateControlSliderNode = new EmissionRateControlSliderNode( this.model, 'rgb(0, 85, 0)' );

      // add the slider to the correct location on the photon emitter
      var xOffset = 10; // x offset necessary to fit the slider correctly on the microwave emitter.
      this.emissionRateControlSliderNode.center = new Vector2(
          this.photonEmitterTopImage.centerX - this.emissionRateControlSliderNode.centerX / 2 - xOffset,
          this.photonEmitterTopImage.centerY - this.emissionRateControlSliderNode.centerY / 2 );

      // ddd the slider to this node
      this.addChild( this.emissionRateControlSliderNode );

    },

    /**
     * Correctly layer the photonEmitterNode from constituent parts.  The photonEmitterNode can be built up from 1 or
     * more individual nodes depending on the type of emitter and these cases are handled here.
     *
     * @param {number} photonWavelength
     * @param {number} emitterrWidth - Desired width of the flashlight
     */
    layerPhotonEmitter: function( photonWavelength, emitterWidth ) {

      // small offsets to scale and position of bulb to make it fit cleanly in the emitter
      var bulbScaleOffset;
      var bulbPositionOffset;

      // if ultraviolet or visible light, correctly scale and layer the photon emitter parts and bulb
      if ( photonWavelength === WavelengthConstants.UV_WAVELENGTH || photonWavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {

        bulbScaleOffset= 2;
        bulbPositionOffset = 5;

        this.photonEmitterTopImage.scale( emitterWidth / this.photonEmitterTopImage.width );
        this.photonEmitterBottomImage.scale( this.photonEmitterTopImage.height / this.photonEmitterBottomImage.height );
        this.photonEmitterBulb.scale( (this.photonEmitterTopImage.height - bulbScaleOffset) / this.photonEmitterBulb.height );

        this.photonEmitterTopImage.center = new Vector2( 0, 0 );
        this.photonEmitterBottomImage.center = new Vector2( this.photonEmitterTopImage.right, 0 );
        this.photonEmitterBulb.right = this.photonEmitterTopImage.right + bulbPositionOffset;

        this.addChild( this.photonEmitterBottomImage );
        this.addChild( this.photonEmitterBulb );
        this.addChild( this.photonEmitterTopImage );
      }

      // if infrared, just layer the housing and bulb
      else if ( photonWavelength === WavelengthConstants.IR_WAVELENGTH ) {

        // small offsets to scale and position of bulb to make it fit cleanly in the emitter
        bulbScaleOffset = 5;
        bulbPositionOffset = 5;

        this.photonEmitterTopImage.scale( emitterWidth / this.photonEmitterTopImage.width );
        this.photonEmitterBulb.scale( (this.photonEmitterTopImage.height - bulbScaleOffset) / this.photonEmitterBulb.height );
        this.photonEmitterTopImage.center = new Vector2( 0, 0 );
        this.photonEmitterBulb.right = this.photonEmitterTopImage.right + bulbPositionOffset;

        this.addChild( this.photonEmitterBulb );
        this.addChild( this.photonEmitterTopImage );
      }

      // nothing to layer for microwave emitter
      else {
        this.photonEmitterTopImage.scale( emitterWidth / this.photonEmitterTopImage.width );
        this.photonEmitterTopImage.center = new Vector2( 0, 0 );
        this.addChild( this.photonEmitterTopImage );
      }
    }

  } );
} );