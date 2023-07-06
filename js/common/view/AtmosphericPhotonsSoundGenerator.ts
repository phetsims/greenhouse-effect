// Copyright 2022, University of Colorado Boulder

/**
 * AtmosphericPhotonsSoundGenerator is used to produce sounds related to photons being emitted by or absorbed into the
 * atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import emissionOfInfraredPhotonFromAtmosphere_mp3 from '../../../sounds/emissionOfInfraredPhotonFromAtmosphere_mp3.js';
import PhotonCollection from '../model/PhotonCollection.js';
import Photon from '../model/Photon.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

// constants
const PLAY_DECISION_THRESHOLD = 0.5; // controls what proportion of emissions cause sounds

// playback rate variation, one musical half step up and down
const PLAYBACK_RATE_RANGE = new Range( 0.94387431268, 1.05946309436 );

export default class AtmosphericPhotonsSoundGenerator extends SoundClip {

  public constructor( photonCollection: PhotonCollection ) {

    super( emissionOfInfraredPhotonFromAtmosphere_mp3, {
      initialOutputLevel: 0.03, // output level is pretty low, since a lot of these can be happening at once
      rateChangesAffectPlayingSounds: false
    } );

    photonCollection.photons.addItemAddedListener( addedPhoton => {

      // A new photon has been added to the collection.  Decide whether to play a sound signifying its arrival based on
      // a number of factors, one of which is a random threshold used to reduce the number of sounds produced so that it
      // doesn't become too distracting.
      const playSound = addedPhoton.isInfrared &&
                        addedPhoton.showState === Photon.ShowState.ALWAYS &&
                        addedPhoton.positionProperty.value.y > 0 && // don't play for photons coming from the ground
                        dotRandom.nextDouble() < PLAY_DECISION_THRESHOLD;

      if ( playSound ) {

        // Do a little randomization of the playback rate so that the sound isn't too repetitive.
        this.setPlaybackRate( dotRandom.nextDoubleInRange( PLAYBACK_RATE_RANGE ) );

        // Play the sound.
        this.play();
      }
    } );
  }
}

greenhouseEffect.register( 'AtmosphericPhotonsSoundGenerator', AtmosphericPhotonsSoundGenerator );