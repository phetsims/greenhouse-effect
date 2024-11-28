// Copyright 2022-2024, University of Colorado Boulder

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

import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../scenery/js/imports.js';
import infraredPhoton_png from '../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../images/visiblePhoton_png.js';
import greenhouseEffect from '../greenhouseEffect.js';
import isVisible from './model/isVisible.js';
import LayersModel from './model/LayersModel.js';
import { ShowState } from './model/Photon.js';
import PhotonCollection from './model/PhotonCollection.js';
import GreenhouseEffectObservationWindow from './view/GreenhouseEffectObservationWindow.js';

// constants
const TARGET_PHOTON_IMAGE_WIDTH = 17; // empirically determined to match the design
const HORIZONTAL_RENDERING_SPAN = new Range(
  -LayersModel.SUNLIGHT_SPAN.width / 2,
  LayersModel.SUNLIGHT_SPAN.width / 2
);

class PhotonSprites extends Sprites {
  private readonly spriteInstances: SpriteInstance[];
  private readonly photonCollection: PhotonCollection;
  private readonly modelViewTransform: ModelViewTransform2;

  // The scale value used to render the photons.
  private readonly photonScale: number;

  // The sprite used to render the visible and infrared photons.
  private readonly visiblePhotonSprite: Sprite;
  private readonly infraredPhotonSprite: Sprite;

  public constructor( photonCollection: PhotonCollection, modelViewTransform: ModelViewTransform2 ) {

    // Create the sprites for the types of photons that will be displayed.
    const visiblePhotonSprite = new Sprite( new SpriteImage(
      visiblePhoton_png,
      new Vector2( visiblePhoton_png.width / 2, visiblePhoton_png.height / 2 ),
      { pickable: false }
    ) );
    const infraredPhotonSprite = new Sprite( new SpriteImage(
      infraredPhoton_png,
      new Vector2( infraredPhoton_png.width / 2, infraredPhoton_png.height / 2 ),
      { pickable: false }
    ) );

    // array of sprite instances, there will be one for each photon that is rendered
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: [ visiblePhotonSprite, infraredPhotonSprite ],
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false,
      canvasBounds: GreenhouseEffectObservationWindow.SIZE.toBounds()
    } );

    // Calculate the scale that will be used to render the photon images.
    this.photonScale = TARGET_PHOTON_IMAGE_WIDTH / infraredPhoton_png.width;
    assert && assert(
    this.photonScale > 0 && this.photonScale < 100,
      `photon scale factor not reasonable: ${this.photonScale}`
    );

    // Update the photons if the state of the "More Photons" feature changes.  This is necessary in case the state
    // changes while the sim is paused, since otherwise the periodic updates would handle it.
    photonCollection.showAllSimulatedPhotonsInViewProperty.lazyLink( () => {
      this.update();
    } );

    // local variables needed for the methods
    this.spriteInstances = spriteInstances;
    this.photonCollection = photonCollection;
    this.modelViewTransform = modelViewTransform;
    this.infraredPhotonSprite = infraredPhotonSprite;
    this.visiblePhotonSprite = visiblePhotonSprite;
  }

  /**
   * Update the information needed to render the photons as sprites and then trigger a re-rendering.
   */
  public update(): void {

    const photons = this.photonCollection.photons;
    const showAllPhotons = this.photonCollection.showAllSimulatedPhotonsInViewProperty.value;
    let numberOfPhotonsDisplayed = 0;

    for ( let i = 0; i < photons.length; i++ ) {

      // Convenience constants.
      const photon = photons[ i ];
      const photonPosition = photon.positionProperty.value;

      // Determine whether this photon should be displayed.
      const showThisPhoton = ( photon.showState === ShowState.ALWAYS || showAllPhotons ) &&
                             HORIZONTAL_RENDERING_SPAN.contains( photonPosition.x );

      if ( showThisPhoton ) {

        numberOfPhotonsDisplayed++;

        // Add a new sprite instance to our list if we don't have enough.
        if ( numberOfPhotonsDisplayed > this.spriteInstances.length ) {
          const newSpriteInstance = SpriteInstance.pool.fetch();
          newSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
          this.spriteInstances.push( newSpriteInstance );
        }

        // Update the matrix that controls where this photon is rendered.
        const spriteInstance = this.spriteInstances[ numberOfPhotonsDisplayed - 1 ];
        spriteInstance.sprite = isVisible( photon ) ? this.visiblePhotonSprite : this.infraredPhotonSprite;
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

greenhouseEffect.register( 'PhotonSprites', PhotonSprites );
export default PhotonSprites;