// Copyright 2021-2022, University of Colorado Boulder

/**
 * PhotonLandscapeObservationWindow adds the ability to depict photons to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffectPhotonsScreenIrPhotonAbsorbed_mp3 from '../../../sounds/greenhouseEffectPhotonsScreenIrPhotonAbsorbed_mp3.js';
import greenhouseEffectPhotonsScreenIrPhotonEmitted_mp3 from '../../../sounds/greenhouseEffectPhotonsScreenIrPhotonEmitted_mp3.js';
import greenhouseEffectPhotonsScreenVisibleLightPhotonAbsorbed_mp3 from '../../../sounds/greenhouseEffectPhotonsScreenVisibleLightPhotonAbsorbed_mp3.js';
import greenhouseEffectPhotonsScreenVisibleLightPhotonEmitted_mp3 from '../../../sounds/greenhouseEffectPhotonsScreenVisibleLightPhotonEmitted_mp3.js';
import reemissionOption1_mp3 from '../../../sounds/reemissionOption1_mp3.js';
import reemissionOption2_mp3 from '../../../sounds/reemissionOption2_mp3.js';
import reemissionOption3_mp3 from '../../../sounds/reemissionOption3_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import PhotonNode from '../../common/view/PhotonNode.js';
import Photon from '../../common/model/Photon.js';
import PhotonsModel from '../model/PhotonsModel.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';

// constants
const IR_PHOTON_EMITTED_FROM_ATMOSPHERE_SOUNDS = [
  greenhouseEffectPhotonsScreenIrPhotonEmitted_mp3,
  reemissionOption1_mp3,
  reemissionOption2_mp3,
  reemissionOption3_mp3
];

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {
  constructor( model: PhotonsModel, providedOptions?: LandscapeObservationWindowOptions ) {

    const options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions ) as Required<LandscapeObservationWindowOptions>;

    super( model, options );

    // Create a parent node to which the individual photon nodes will all be added.
    const photonsRootNode = new Node();
    this.presentationLayer.addChild( photonsRootNode );

    // Move the presentation node for the  photons to the back of the z-order so that it is behind the haze.
    photonsRootNode.moveToBack();

    // Add and remove photon nodes as they come and go in the model.
    // @ts-ignore
    model.photonCollection.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
      const photonNode = new PhotonNode( addedPhoton, this.modelViewTransform, { scale: 0.5 } );
      photonsRootNode.addChild( photonNode );
      const photonRemovedListener = ( removedPhoton: Photon ) => {
        if ( removedPhoton === addedPhoton ) {
          photonsRootNode.removeChild( photonNode );
          model.photonCollection.photons.removeItemRemovedListener( photonRemovedListener );
        }
      };
      model.photonCollection.photons.addItemRemovedListener( photonRemovedListener );
    } );

    // sound generation TODO: This is in the prototype phase as of early November 2021, and what is kept should
    //                        be modularized, probably into its own class.
    const photonSoundLevel = 0.04;
    const playThreshold = 0.5;
    const irPhotonAbsorbedSoundClip = new SoundClip( greenhouseEffectPhotonsScreenIrPhotonAbsorbed_mp3, { initialOutputLevel: 0 } );
    soundManager.addSoundGenerator( irPhotonAbsorbedSoundClip );
    const irPhotonEmittedSoundClip = new SoundClip( IR_PHOTON_EMITTED_FROM_ATMOSPHERE_SOUNDS[ 1 ], {
      initialOutputLevel: photonSoundLevel,
      rateChangesAffectPlayingSounds: false
    } );
    soundManager.addSoundGenerator( irPhotonEmittedSoundClip );
    const visiblePhotonAbsorbedSoundClip = new SoundClip( greenhouseEffectPhotonsScreenVisibleLightPhotonAbsorbed_mp3, { initialOutputLevel: 0 } );
    soundManager.addSoundGenerator( visiblePhotonAbsorbedSoundClip );
    const visiblePhotonEmittedSoundClip = new SoundClip( greenhouseEffectPhotonsScreenVisibleLightPhotonEmitted_mp3, { initialOutputLevel: 0 } );
    soundManager.addSoundGenerator( visiblePhotonEmittedSoundClip );

    // Range for playback of photon re-emission sounds, the numbers represent one musical half step up and down.
    const playbackRateRange = new Range( 0.94387431268, 1.05946309436 );

    // @ts-ignore
    model.photonCollection.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
      if ( dotRandom.nextDouble() > playThreshold ) {
        if ( addedPhoton.isInfrared && addedPhoton.positionProperty.value.y > 0 ) {
          irPhotonEmittedSoundClip.setPlaybackRate( dotRandom.nextDoubleInRange( playbackRateRange ) );
          irPhotonEmittedSoundClip.play();
        }
        else {
          visiblePhotonEmittedSoundClip.play();
        }
      }
    } );
    // @ts-ignore
    model.photonCollection.photons.addItemRemovedListener( ( removedPhoton: Photon ) => {
      if ( dotRandom.nextDouble() > playThreshold ) {
        if ( removedPhoton.isInfrared ) {
          irPhotonAbsorbedSoundClip.play();
        }
        else {
          visiblePhotonAbsorbedSoundClip.play();
        }
      }
    } );
  }
}

greenhouseEffect.register( 'PhotonLandscapeObservationWindow', PhotonLandscapeObservationWindow );
export default PhotonLandscapeObservationWindow;