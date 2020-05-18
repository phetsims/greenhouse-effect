// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents a photon in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import microwavePhotonImage from '../../../images/microwave-photon_png.js';
import photon100Image from '../../../images/photon-100_png.js';
import photon660Image from '../../../images/photon-660_png.js';
import thin2Image from '../../../images/thin2_png.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

// Map of photon wavelengths to visual images used for representing them.
const mapWavelengthToImageName = {};
mapWavelengthToImageName[ WavelengthConstants.MICRO_WAVELENGTH ] = microwavePhotonImage;
mapWavelengthToImageName[ WavelengthConstants.IR_WAVELENGTH ] = photon660Image;
mapWavelengthToImageName[ WavelengthConstants.VISIBLE_WAVELENGTH ] = thin2Image;
mapWavelengthToImageName[ WavelengthConstants.UV_WAVELENGTH ] = photon100Image;

/**
 * Constructor for a photon node.
 *
 * @param {Photon} photon
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function PhotonNode( photon, modelViewTransform ) {

  // supertype constructor
  Node.call( this );

  // Carry this node through the scope in nested functions.
  const self = this;

  // @private
  this.photon = photon;
  this.modelViewTransform = modelViewTransform;

  // Lookup the image file that corresponds to the wavelength and add a centered image.
  assert && assert( mapWavelengthToImageName.hasOwnProperty( this.photon.wavelength ) );
  const photonImage = new Image( mapWavelengthToImageName[ this.photon.wavelength ] );

  this.addChild( photonImage );

  // Observe position changes.
  photon.positionProperty.link( function( position ) {
    // Set overall position.
    self.center = self.modelViewTransform.modelToViewPosition( position );
  } );
}

moleculesAndLight.register( 'PhotonNode', PhotonNode );

inherit( Node, PhotonNode );
export default PhotonNode;
