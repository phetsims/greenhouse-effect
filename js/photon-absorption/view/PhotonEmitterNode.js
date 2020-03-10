// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents the photon emitter in the view.  The graphical representation of the emitter changes based on
 * the emission frequency and wavelength of photons that the model is set to emit. This node is set up such that setting
 * its offset on the photon emission point in the model should position it correctly.  This assumes that photons are
 * emitted to the right.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import BooleanRoundStickyToggleButton from '../../../../sun/js/buttons/BooleanRoundStickyToggleButton.js';
import flashlightOffImage from '../../../images/flashlight-off_png.js';
import heatLampOffImage from '../../../images/infrared-source-off_png.js';
import uvLightOffImage from '../../../images/uv-source-off_png.js';
import flashlightOnImage from '../../../mipmaps/flashlight_png.js';
import heatLampOnImage from '../../../mipmaps/infrared-source_png.js';
import microwaveTransmitterImage from '../../../mipmaps/microwave-source_png.js';
import uvLightOnImage from '../../../mipmaps/uv-source_png.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

/**
 * Constructor for the photon emitter node.
 *
 * @param {number} width - Desired width of the emitter image in screen coords.
 * @param {PhotonAbsorptionModel} model
 * @param {Tandem} tandem
 * @constructor
 */
function PhotonEmitterNode( width, model, tandem ) {

  // supertype constructor
  Node.call( this );

  // carry this through scope
  const self = this;

  this.model = model; // @private

  // update the photon emitter upon changes to the photon wavelength
  model.photonWavelengthProperty.link( function( photonWavelength ) {
    const emitterTandemName = WavelengthConstants.getTandemName( photonWavelength );
    self.updateImage( width, photonWavelength, model.emissionFrequencyProperty.value, tandem, emitterTandemName );
  } );

  // update brightness of emitter bulb upon changes to photon emission frequency
  model.emissionFrequencyProperty.link( function( emissionFrequency ) {
    self.updateOffImageOpacity( self.model.photonWavelengthProperty.get(), emissionFrequency );
  } );

}

moleculesAndLight.register( 'PhotonEmitterNode', PhotonEmitterNode );

export default inherit( Node, PhotonEmitterNode, {

  /**
   * Set the appropriate images based on the current setting for the emission frequency and wavelength of the emitted
   * photons.  The emitter is composed of layered 'on' and an 'off' images.  The emission frequency determines the
   * opacity of the 'on' image so that it is opaque when the emission frequency is at its maximum.
   *
   * @param {number} emitterWidth
   * @param {number} photonWavelength - wavelength of emitted photon to determine if a new control slider needs to be added
   * @param {number} emissionFrequency
   * @param {Tandem} tandem
   * @param {string} emitterTandemName
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

    // create the 'on' button for the emitter
    this.button = this.button || new BooleanRoundStickyToggleButton( this.model.photonEmitterOnProperty, {
      radius: 15,
      baseColor: '#33dd33'
    } );

    // add the button to the correct location on the photon emitter
    this.button.left = this.photonEmitterOffImage.centerX - 20;
    this.button.centerY = this.photonEmitterOffImage.centerY;
    if ( !this.hasChild( this.button ) ) {
      this.addChild( this.button );
    }
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