// Copyright 2020, University of Colorado Boulder

/**
 * PhotonEmissionSoundGenerator is a sound generator that produces sounds when photons are emitted.  Photons that are
 * emitted from one area in the model use one set of sounds, since they are meant to convey the initial emission from
 * the lamps or other emitters, and those emitted from another position use a different set of sounds, since they are
 * emitted by a molecule that had previously absorbed a photon.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import infraredPhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-ir_mp3.js';
import microwavePhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-microwave_mp3.js';
import ultravioletPhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-uv_mp3.js';
import visiblePhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-visible_mp3.js';
import infraredPhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-ir_mp3.js';
import microwavePhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-microwave_mp3.js';
import ultravioletPhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-uv_mp3.js';
import visiblePhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-visible_mp3.js';
import merge from '../../../../phet-core/js/merge.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import WavelengthConstants from '../../photon-absorption/model/WavelengthConstants.js';

//---------------------------------------------------------------------------------------------------------------------
// constants
//---------------------------------------------------------------------------------------------------------------------

// sound output levels
const PHOTON_INITIAL_EMISSION_OUTPUT_LEVEL = 0.02;
const PHOTON_EMISSION_FROM_MOLECULE_OUTPUT_LEVEL = 0.09;

// X position at which the lamp emission sound is played, empirically determined
const PLAY_LAMP_EMISSION_X_POSITION = -1400;

// X position at which the molecule emission sound is played
const PLAY_MOLECULE_EMISSION_X_POSITION = 0;

class PhotonEmissionSoundGenerator extends SoundGenerator {

  /**
   * @param {ObservableArray<Photon>} photons
   * @param {Object} [options]
   */
  constructor( photons, options ) {

    options = merge( {}, options );
    super( options );

    const photonInitialEmissionSoundClipOptions = { initialOutputLevel: PHOTON_INITIAL_EMISSION_OUTPUT_LEVEL };
    const photonEmissionFromMoleculeSoundClipOptions = { initialOutputLevel: PHOTON_EMISSION_FROM_MOLECULE_OUTPUT_LEVEL };

    // map of photon wavelengths to initial emission sounds
    // Note - can't use initialization constructor for Map due to lack of support in IE.
    const photonInitialEmissionSoundPlayers = new Map();
    photonInitialEmissionSoundPlayers.set(
      WavelengthConstants.MICRO_WAVELENGTH,
      new SoundClip( microwavePhotonInitialEmissionSoundInfo, photonInitialEmissionSoundClipOptions )
    );
    photonInitialEmissionSoundPlayers.set(
      WavelengthConstants.IR_WAVELENGTH,
      new SoundClip( infraredPhotonInitialEmissionSoundInfo, photonInitialEmissionSoundClipOptions )
    );
    photonInitialEmissionSoundPlayers.set(
      WavelengthConstants.VISIBLE_WAVELENGTH,
      new SoundClip( visiblePhotonInitialEmissionSoundInfo, photonInitialEmissionSoundClipOptions )
    );
    photonInitialEmissionSoundPlayers.set(
      WavelengthConstants.UV_WAVELENGTH,
      new SoundClip( ultravioletPhotonInitialEmissionSoundInfo, photonInitialEmissionSoundClipOptions )
    );
    photonInitialEmissionSoundPlayers.forEach( value => {
      soundManager.addSoundGenerator( value );
    } );

    // map of wavelengths to the sounds used when photons are emitted from the active molecule
    // Note - can't use initialization constructor for Map due to lack of support in IE.
    const photonEmissionFromMoleculeSoundPlayers = new Map();
    photonEmissionFromMoleculeSoundPlayers.set(
      WavelengthConstants.MICRO_WAVELENGTH,
      new SoundClip( microwavePhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
    );
    photonEmissionFromMoleculeSoundPlayers.set(
      WavelengthConstants.IR_WAVELENGTH,
      new SoundClip( infraredPhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
    );
    photonEmissionFromMoleculeSoundPlayers.set(
      WavelengthConstants.VISIBLE_WAVELENGTH,
      new SoundClip( visiblePhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
    );
    photonEmissionFromMoleculeSoundPlayers.set(
      WavelengthConstants.UV_WAVELENGTH,
      new SoundClip( ultravioletPhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
    );
    photonEmissionFromMoleculeSoundPlayers.forEach( value => {
      soundManager.addSoundGenerator( value );
    } );

    // listen for new photons and play sounds or set them up to be played later when appropriate
    photons.addItemAddedListener( photon => {
      const photonXPosition = photon.locationProperty.value.x;

      if ( photonXPosition === PLAY_MOLECULE_EMISSION_X_POSITION ) {

        // this photon was just emitted from the active molecule, so play the appropriate emission sound
        photonEmissionFromMoleculeSoundPlayers.get( photon.wavelength ).play();
      }
      else if ( photonXPosition < PLAY_LAMP_EMISSION_X_POSITION ) {

        // A photon was emitted from the emitter (e.g. a lamp).  This generally occurs a little behind the lamp so that
        // the whole image is in place before it is emitted, but these means that we need to wait until it is in a good
        // position to play the sound.
        const playEmitFromLampSound = position => {
          if ( position.x >= PLAY_LAMP_EMISSION_X_POSITION ) {
            photonInitialEmissionSoundPlayers.get( photon.wavelength ).play();
            photon.locationProperty.unlink( playEmitFromLampSound );
          }
        };
        photon.locationProperty.link( playEmitFromLampSound );

        // Note that there is no need to have a listener for the case where the photon is removed before the sound is
        // played because photons are disposed when this happens.
      }
      else {
        assert && assert( false, 'photon emitted at unexpected location' );
      }
    } );
  }
}

moleculesAndLight.register( 'PhotonEmissionSoundGenerator', PhotonEmissionSoundGenerator );
export default PhotonEmissionSoundGenerator;