// Copyright 2021, University of Colorado Boulder

/**
 * PhotonLandscapeObservationWindow adds the ability to depict photons to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import irPhotonAbsorbedSound from '../../../sounds/greenhouse-effect-photons-screen-ir-photon-absorbed_mp3.js';
import irPhotonEmittedSound from '../../../sounds/greenhouse-effect-photons-screen-ir-photon-emitted_mp3.js';
import visiblePhotonAbsorbedSound from '../../../sounds/greenhouse-effect-photons-screen-visible-light-photon-absorbed_mp3.js';
import visiblePhotonEmittedSound from '../../../sounds/greenhouse-effect-photons-screen-visible-light-photon-emitted_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import LandscapeObservationWindow from '../../common/view/LandscapeObservationWindow.js';
import { GreenhouseEffectObservationWindowOptions } from '../../common/view/GreenhouseEffectObservationWindow.js';
import PhotonNode from '../../common/view/PhotonNode.js';
import Photon from '../../common/model/Photon.js';
import PhotonsModel from '../model/PhotonsModel.js';

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {

  /**
   * @param {ConcentrationModel} model
   * @param {Tandem} tandem
   * @param {GreenhouseEffectObservationWindowOptions} [providedOptions]
   */
  constructor( model: PhotonsModel, tandem: Tandem, providedOptions?: GreenhouseEffectObservationWindowOptions ) {

    super( model, tandem, providedOptions );

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
    const photonSoundLevel = 0.08;
    const playThreshold = 0.5;
    const irPhotonAbsorbedSoundClip = new SoundClip( irPhotonAbsorbedSound, { initialOutputLevel: 0 } );
    soundManager.addSoundGenerator( irPhotonAbsorbedSoundClip );
    const irPhotonEmittedSoundClip = new SoundClip( irPhotonEmittedSound, { initialOutputLevel: photonSoundLevel } );
    soundManager.addSoundGenerator( irPhotonEmittedSoundClip );
    const visiblePhotonAbsorbedSoundClip = new SoundClip( visiblePhotonAbsorbedSound, { initialOutputLevel: 0 } );
    soundManager.addSoundGenerator( visiblePhotonAbsorbedSoundClip );
    const visiblePhotonEmittedSoundClip = new SoundClip( visiblePhotonEmittedSound, { initialOutputLevel: 0 } );
    soundManager.addSoundGenerator( visiblePhotonEmittedSoundClip );

    // @ts-ignore
    model.photonCollection.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
      if ( dotRandom.nextDouble() > playThreshold ) {
        if ( addedPhoton.isInfrared && addedPhoton.positionProperty.value.y > 0 ) {
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