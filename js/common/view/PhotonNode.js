// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents a photon in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import infraredPhotonImage from '../../../images/photon-660_png.js';
import visiblePhotonImage from '../../../images/thin2_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Photon from '../model/Photon.js';

// Map of photon wavelengths to visual images used for representing them.
const mapWavelengthToImageName = {};
mapWavelengthToImageName[ Photon.IR_WAVELENGTH ] = infraredPhotonImage;
mapWavelengthToImageName[ Photon.VISIBLE_WAVELENGTH ] = visiblePhotonImage;

class PhotonNode extends Node {

  /**
   * @param {Photon} photon
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( photon, modelViewTransform, options ) {

    // supertype constructor
    super( options );

    // @private
    this.photon = photon;
    this.modelViewTransform = modelViewTransform;

    // Look up the image file that corresponds to the wavelength and add a centered image.
    assert && assert(
      mapWavelengthToImageName.hasOwnProperty( this.photon.wavelength ),
      `no image for wavelength ${this.photon.wavelength}`
    );
    this.addChild( new Image( mapWavelengthToImageName[ this.photon.wavelength ] ) );

    // Observe position changes.
    photon.positionProperty.link( position => {
      this.center = this.modelViewTransform.modelToViewPosition( position );
    } );
  }
}

greenhouseEffect.register( 'PhotonNode', PhotonNode );

export default PhotonNode;
