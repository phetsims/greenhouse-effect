// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents a photon in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Photon from '../model/Photon.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

// Map of photon wavelengths to visual images used for representing them.
const mapWavelengthToImageName = new Map<any, Object>( [
  [ Photon.IR_WAVELENGTH, infraredPhoton_png ],
  [ Photon.VISIBLE_WAVELENGTH, visiblePhoton_png ]
] );

class PhotonNode extends Node {
  private readonly photon: Photon;
  private readonly modelViewTransform: ModelViewTransform2;

  /**
   * @param {Photon} photon
   * @param {ModelViewTransform2} modelViewTransform
   * @param {NodeOptions} [options]
   */
  constructor( photon: Photon, modelViewTransform: ModelViewTransform2, options?: NodeOptions ) {

    // supertype constructor
    super( options );

    // @private
    this.photon = photon;
    this.modelViewTransform = modelViewTransform;

    // Look up the image file that corresponds to the wavelength and add a centered image.
    assert && assert(
      mapWavelengthToImageName.has( this.photon.wavelength ),
      `no image for wavelength ${this.photon.wavelength}`
    );
    // @ts-ignore
    this.addChild( new Image( mapWavelengthToImageName.get( this.photon.wavelength ) ) );

    // Observe position changes.
    photon.positionProperty.link( position => {
      this.center = this.modelViewTransform.modelToViewPosition( position );
    } );
  }
}

greenhouseEffect.register( 'PhotonNode', PhotonNode );

export default PhotonNode;
