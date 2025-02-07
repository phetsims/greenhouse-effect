// Copyright 2022-2023, University of Colorado Boulder

/**
 * PhotonSpriteInstance is a specialization of SpriteInstance for photons.  It keeps a reference to the associated
 * photon model element, and updates its transformation matrix to match the photon's position.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Sprite from '../../../scenery/js/util/Sprite.js';
import SpriteInstance, { SpriteInstanceTransformType } from '../../../scenery/js/util/SpriteInstance.js';
import greenhouseEffect from '../greenhouseEffect.js';
import Photon from './model/Photon.js';

class PhotonSpriteInstance extends SpriteInstance {
  private readonly photonListener: () => void;
  private photon: Photon;
  private modelViewTransform: ModelViewTransform2;

  public constructor( photon: Photon, sprite: Sprite, modelViewTransform: ModelViewTransform2 ) {
    // args are validated by initialize

    super();

    // Set the transform type field in super SpriteInstance.
    this.transformType = SpriteInstanceTransformType.TRANSLATION;

    this.photonListener = this.updateMatrix.bind( this );

    // Initialize the fields here even though they will be set in the call to initialize because TypeScript requires it.
    this.photon = photon;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Updates the matrix to match the organism's position and xDirection.
   */
  private updateMatrix(): void {

    const photonPosition = this.photon.positionProperty.value;

    // compute scale and position, in view coordinates
    const viewX = this.modelViewTransform.modelToViewX( photonPosition.x );
    const viewY = this.modelViewTransform.modelToViewY( photonPosition.y );

    // update the matrix in the most efficient way possible
    this.matrix.set02( viewX );
    this.matrix.set12( viewY );
    assert && assert( this.matrix.isFinite(), 'matrix should be finite' );
  }

  /**
   * Release references to avoid memory leaks.
   */
  public dispose(): void {
    this.photon.positionProperty.unlink( this.photonListener );
  }
}

greenhouseEffect.register( 'PhotonSpriteInstance', PhotonSpriteInstance );
export default PhotonSpriteInstance;