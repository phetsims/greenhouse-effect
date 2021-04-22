// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents a photon in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import microwavePhotonImage from '../../../images/microwave-photon_png.js';
import photon100Image from '../../../images/photon-100_png.js';
import photon660Image from '../../../images/photon-660_png.js';
import thin2Image from '../../../images/thin2_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

// Map of photon wavelengths to visual images used for representing them.
const mapWavelengthToImageName = {};
mapWavelengthToImageName[ WavelengthConstants.MICRO_WAVELENGTH ] = microwavePhotonImage;
mapWavelengthToImageName[ WavelengthConstants.IR_WAVELENGTH ] = photon660Image;
mapWavelengthToImageName[ WavelengthConstants.VISIBLE_WAVELENGTH ] = thin2Image;
mapWavelengthToImageName[ WavelengthConstants.UV_WAVELENGTH ] = photon100Image;

class MicroPhotonNode extends Node {

  /**
   * Constructor for a photon node.
   *
   * @param {Photon} photon
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( photon, modelViewTransform ) {

    // supertype constructor
    super();

    // Carry this node through the scope in nested functions.

    // @private
    this.photon = photon;
    this.modelViewTransform = modelViewTransform;

    // Lookup the image file that corresponds to the wavelength and add a centered image.
    assert && assert( mapWavelengthToImageName.hasOwnProperty( this.photon.wavelength ) );
    const photonImage = new Image( mapWavelengthToImageName[ this.photon.wavelength ] );

    this.addChild( photonImage );

    // Observe position changes.
    photon.positionProperty.link( position => {
      // Set overall position.
      this.center = this.modelViewTransform.modelToViewPosition( position );
    } );
  }
}

greenhouseEffect.register( 'MicroPhotonNode', MicroPhotonNode );

export default MicroPhotonNode;
