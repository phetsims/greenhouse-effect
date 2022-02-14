// Copyright 2022, University of Colorado Boulder

import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../scenery/js/imports.js';
import Photon from './model/Photon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import infraredPhoton_png from '../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../images/visiblePhoton_png.js';
import Vector2 from '../../../dot/js/Vector2.js';

// constants
const INFRARED_PHOTON_SPRITE_IMAGE = new SpriteImage(
  infraredPhoton_png,
  new Vector2( infraredPhoton_png.width / 2, infraredPhoton_png.height / 2 )
);
const INFRARED_PHOTON_SPRITE = new Sprite( INFRARED_PHOTON_SPRITE_IMAGE );
const VISIBLE_PHOTON_SPRITE_IMAGE = new SpriteImage(
  visiblePhoton_png,
  new Vector2( visiblePhoton_png.width / 2, visiblePhoton_png.height / 2 )
);
const VISIBLE_PHOTON_SPRITE = new Sprite( VISIBLE_PHOTON_SPRITE_IMAGE );
const TARGET_PHOTON_IMAGE_WIDTH = 17; // empirically determined to match the design

class PhotonSprites extends Sprites {
  private readonly spriteInstances: SpriteInstance[];
  private readonly photons: ObservableArray<Photon>;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly photonScale: number;

  constructor( photons: ObservableArray<Photon>, modelViewTransform: ModelViewTransform2 ) {

    const sprites = [ INFRARED_PHOTON_SPRITE, VISIBLE_PHOTON_SPRITE ];

    // {SpriteInstance[]} a SpriteInstance for each Particle
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false
    } );

    // TODO: For initial testing, remove eventually.
    this.photonScale = TARGET_PHOTON_IMAGE_WIDTH / infraredPhoton_png.width;
    assert && assert(
    this.photonScale > 0 && this.photonScale < 100,
      `photon scale factor not reasonable: ${this.photonScale}`
    );
    let testPhotonSpriteInstance = new SpriteInstance();
    testPhotonSpriteInstance.sprite = INFRARED_PHOTON_SPRITE;
    testPhotonSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
    testPhotonSpriteInstance.matrix.setToAffine(
      this.photonScale,
      0,
      modelViewTransform.modelToViewX( 0 ),
      0,
      this.photonScale,
      modelViewTransform.modelToViewY( 0 )
    );
    spriteInstances.push( testPhotonSpriteInstance );

    testPhotonSpriteInstance = new SpriteInstance();
    testPhotonSpriteInstance.sprite = INFRARED_PHOTON_SPRITE;
    testPhotonSpriteInstance.matrix.setToTranslation( 100, 100 );
    spriteInstances.push( testPhotonSpriteInstance );

    testPhotonSpriteInstance = new SpriteInstance();
    testPhotonSpriteInstance.sprite = VISIBLE_PHOTON_SPRITE;
    testPhotonSpriteInstance.matrix.setToTranslation( 200, 200 );
    spriteInstances.push( testPhotonSpriteInstance );

    // @private
    this.spriteInstances = spriteInstances;
    this.photons = photons;
    this.modelViewTransform = modelViewTransform;
  }

  update() {

    for ( let i = 0; i < this.photons.length; i++ ) {

      // Add a new sprite instance if we don't have enough.
      if ( i + 1 > this.spriteInstances.length ) {
        const newSpriteInstance = SpriteInstance.dirtyFromPool();
        newSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
        this.spriteInstances.push( newSpriteInstance );
      }

      const photon = this.photons[ i ];
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

    // Free up any unused sprite instances.
    while ( this.spriteInstances.length > this.photons.length ) {
      const unusedSpriteInstance = this.spriteInstances.pop();
      unusedSpriteInstance && unusedSpriteInstance.freeToPool();
    }

    // Trigger a re-rendering of the sprites.
    this.invalidatePaint();
  }
}

export default PhotonSprites;