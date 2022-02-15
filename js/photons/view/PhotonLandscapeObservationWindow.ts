// Copyright 2021-2022, University of Colorado Boulder

/**
 * PhotonLandscapeObservationWindow adds the ability to depict photons to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import reemissionOption1_mp3 from '../../../sounds/reemissionOption1_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import Photon from '../../common/model/Photon.js';
import PhotonsModel from '../model/PhotonsModel.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhotonSprites from '../../common/PhotonSprites.js';

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {
  private readonly photonsNode: PhotonSprites;

  constructor( model: PhotonsModel, providedOptions?: LandscapeObservationWindowOptions ) {

    const options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions ) as Required<LandscapeObservationWindowOptions>;

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // sound generation
    const playThreshold = 0.5;
    const irPhotonEmittedSoundClip = new SoundClip( reemissionOption1_mp3, {
      initialOutputLevel: 0.04, // empirically determined, pretty low because a lot of plays can be happening at once
      rateChangesAffectPlayingSounds: false
    } );
    soundManager.addSoundGenerator( irPhotonEmittedSoundClip );

    // Range for playback of photon re-emission sounds, the numbers represent one musical half step up and down.
    const playbackRateRange = new Range( 0.94387431268, 1.05946309436 );

    // @ts-ignore
    model.photonCollection.photons.addItemAddedListener( ( addedPhoton: Photon ) => {

      // A new photon has been added to the collection.  Decide whether to play a sound signifying its arrival based on
      // a number of factors, one of which is a random threshold used to reduce the number of sounds produced so that it
      // doesn't become too distracting.
      const playSound = addedPhoton.isInfrared &&
                        addedPhoton.showState === Photon.ShowState.ALWAYS &&
                        addedPhoton.positionProperty.value.y > 0 && // don't play for photons coming from the ground
                        dotRandom.nextDouble() > playThreshold;

      if ( playSound ) {

        // Do a little randomization of the playback rate so that the sound isn't too repetitive.
        irPhotonEmittedSoundClip.setPlaybackRate( dotRandom.nextDoubleInRange( playbackRateRange ) );

        // Play it.
        irPhotonEmittedSoundClip.play();
      }
    } );
  }

  step( dt: number ) {
    this.photonsNode.update();
    super.step( dt );
  }
}

greenhouseEffect.register( 'PhotonLandscapeObservationWindow', PhotonLandscapeObservationWindow );
export default PhotonLandscapeObservationWindow;