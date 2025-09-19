// Copyright 2021-2025, University of Colorado Boulder

/**
 * Node that represents a photon in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import microwavePhoton_png from '../../../images/microwavePhoton_png.js';
import ultravioletPhoton_png from '../../../images/ultravioletPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import MicroPhoton from '../model/MicroPhoton.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

// Map of photon wavelengths to visual images used for representing them.
const mapWavelengthToImageName: Record<number, HTMLImageElement> = {};
mapWavelengthToImageName[ WavelengthConstants.MICRO_WAVELENGTH ] = microwavePhoton_png;
mapWavelengthToImageName[ WavelengthConstants.IR_WAVELENGTH ] = infraredPhoton_png;
mapWavelengthToImageName[ WavelengthConstants.VISIBLE_WAVELENGTH ] = visiblePhoton_png;
mapWavelengthToImageName[ WavelengthConstants.UV_WAVELENGTH ] = ultravioletPhoton_png;

class MicroPhotonNode extends Node {

  private readonly photon: MicroPhoton;
  private readonly modelViewTransform: ModelViewTransform2;

  /**
   * Constructor for a photon node.
   */
  public constructor( photon: MicroPhoton, modelViewTransform: ModelViewTransform2 ) {
    super();

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