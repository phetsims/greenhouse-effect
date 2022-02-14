// Copyright 2022, University of Colorado Boulder

/**
 * PhotonSprites is a class that can be used to perform high-performance rendering of a set of photons.  It uses
 * scenery's Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'.
 *
 * Understanding this implementation requires an understanding of the scenery Sprites API. In a nutshell: Sprites has an
 * array of Sprite and an array of SpriteInstance. The array of Sprite is the complete unique set of images used to
 * render all SpriteInstances. Each SpriteInstance has a reference to a Sprite (which determines what it looks like) and
 * a Matrix3 (which determines how it's transformed).  At each model step, the positions of the PhotonInstance instances
 * are updated by adjusting their matrix, and then invalidatePaint is called to re-render the sprites.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import infraredPhoton_png from '../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../images/visiblePhoton_png.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PhotonCollection from './model/PhotonCollection.js';
import { ShowState } from './model/Photon.js';

// constants
const TARGET_PHOTON_IMAGE_WIDTH = 17; // empirically determined to match the design
const INFRARED_PHOTON_SPRITE = new Sprite( new SpriteImage(
  infraredPhoton_png,
  new Vector2( infraredPhoton_png.width / 2, infraredPhoton_png.height / 2 )
) );
const VISIBLE_PHOTON_SPRITE = new Sprite( new SpriteImage(
  visiblePhoton_png,
  new Vector2( visiblePhoton_png.width / 2, visiblePhoton_png.height / 2 )
) );

class PhotonSprites extends Sprites {
  private readonly spriteInstances: SpriteInstance[];
  private readonly photonCollection: PhotonCollection;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly photonScale: number;

  constructor( photonCollection: PhotonCollection, modelViewTransform: ModelViewTransform2 ) {

    const sprites = [ INFRARED_PHOTON_SPRITE, VISIBLE_PHOTON_SPRITE ];

    // array of sprite instances, there will be one for each photon that is rendered
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false
    } );

    // Calculate the scale that will be used to render the photon images.
    this.photonScale = TARGET_PHOTON_IMAGE_WIDTH / infraredPhoton_png.width;
    assert && assert(
    this.photonScale > 0 && this.photonScale < 100,
      `photon scale factor not reasonable: ${this.photonScale}`
    );

    // local variables needed for the methods
    this.spriteInstances = spriteInstances;
    this.photonCollection = photonCollection;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Update the information needed to render the photons as sprites and then trigger a re-rendering.
   */
  update() {

    const photons = this.photonCollection.photons;
    const showAllPhotons = this.photonCollection.showAllSimulatedPhotonsInViewProperty.value;
    let numberOfPhotonsDisplayed = 0;

    for ( let i = 0; i < photons.length; i++ ) {

      // Convenience constants.
      const photon = photons[ i ];
      const showThisPhoton = photon.showState === ShowState.ALWAYS || showAllPhotons;

      if ( showThisPhoton ) {

        numberOfPhotonsDisplayed++;

        // Add a new sprite instance to our list if we don't have enough.
        if ( i + 1 > this.spriteInstances.length ) {
          const newSpriteInstance = SpriteInstance.dirtyFromPool();
          newSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
          this.spriteInstances.push( newSpriteInstance );
        }

        // Update the matrix that controls where this photon is rendered.
        const photonPosition = photon.positionProperty.value;
        const spriteInstance = this.spriteInstances[ i ];
        spriteInstance.sprite = photon.isVisible ? VISIBLE_PHOTON_SPRITE : INFRARED_PHOTON_SPRITE;
        spriteInstance.matrix.setToAffine(
          this.photonScale,
          0,
          this.modelViewTransform.modelToViewX( photonPosition.x ),
          0,
          this.photonScale,
          this.modelViewTransform.modelToViewY( photonPosition.y )
        );
      }
    }

    // Free up any unused sprite instances.
    while ( this.spriteInstances.length > numberOfPhotonsDisplayed ) {
      const unusedSpriteInstance = this.spriteInstances.pop();
      unusedSpriteInstance && unusedSpriteInstance.freeToPool();
    }

    // Trigger a re-rendering of the sprites.
    this.invalidatePaint();
  }
}

export default PhotonSprites;