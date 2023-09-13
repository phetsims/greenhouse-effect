// Copyright 2021-2023, University of Colorado Boulder

/**
 * PhotonEmissionSoundGenerator is a sound generator that produces sounds when photons are emitted in the model.
 * Photons that are emitted from one area in the model use one set of sounds, since they are meant to convey the initial
 * emission from the lamps or other emitters, and those emitted from another position use a different set of sounds,
 * since they are emitted by a molecule that had previously absorbed a photon.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import photonEmitIr_mp3 from '../../../sounds/photonEmitIr_mp3.js';
import photonEmitMicrowave_mp3 from '../../../sounds/photonEmitMicrowave_mp3.js';
import photonEmitUv_mp3 from '../../../sounds/photonEmitUv_mp3.js';
import photonEmitVisible_mp3 from '../../../sounds/photonEmitVisible_mp3.js';
import photonReleaseIr_mp3 from '../../../sounds/photonReleaseIr_mp3.js';
import photonReleaseMicrowave_mp3 from '../../../sounds/photonReleaseMicrowave_mp3.js';
import photonReleaseUv_mp3 from '../../../sounds/photonReleaseUv_mp3.js';
import photonReleaseVisible_mp3 from '../../../sounds/photonReleaseVisible_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

//---------------------------------------------------------------------------------------------------------------------
// constants
//---------------------------------------------------------------------------------------------------------------------

// sound output levels
const PHOTON_INITIAL_EMISSION_OUTPUT_LEVEL = 0.02;
const PHOTON_EMISSION_FROM_MOLECULE_OUTPUT_LEVEL = 0.09;

// X position at which the molecule emission sound is played
const PLAY_MOLECULE_EMISSION_X_POSITION = 0;

class PhotonEmissionSoundGenerator extends SoundGenerator {

  /**
   * @param {PhetioGroup} photonGroup
   * @param {Object} [options]
   */
  constructor( photonGroup, options ) {

    options = merge( {}, options );
    super( options );

    const photonInitialEmissionSoundClipOptions = { initialOutputLevel: PHOTON_INITIAL_EMISSION_OUTPUT_LEVEL };
    const photonEmissionFromMoleculeSoundClipOptions = { initialOutputLevel: PHOTON_EMISSION_FROM_MOLECULE_OUTPUT_LEVEL };

    // map of photon wavelengths to initial emission sounds
    const photonInitialEmissionSoundPlayerMap = new Map( [
      [
        WavelengthConstants.MICRO_WAVELENGTH,
        new SoundClip( photonEmitMicrowave_mp3, photonInitialEmissionSoundClipOptions )
      ],
      [
        WavelengthConstants.IR_WAVELENGTH,
        new SoundClip( photonEmitIr_mp3, photonInitialEmissionSoundClipOptions )
      ],
      [
        WavelengthConstants.VISIBLE_WAVELENGTH,
        new SoundClip( photonEmitVisible_mp3, photonInitialEmissionSoundClipOptions )
      ],
      [
        WavelengthConstants.UV_WAVELENGTH,
        new SoundClip( photonEmitUv_mp3, photonInitialEmissionSoundClipOptions )
      ]
    ] );

    photonInitialEmissionSoundPlayerMap.forEach( soundPlayer => {
      soundManager.addSoundGenerator( soundPlayer );
    } );

    // map of wavelengths to the sounds used when photons are emitted from the active molecule
    const photonEmissionFromMoleculeSoundPlayersMap = new Map( [
      [
        WavelengthConstants.MICRO_WAVELENGTH,
        new SoundClip( photonReleaseMicrowave_mp3, photonEmissionFromMoleculeSoundClipOptions )
      ],
      [
        WavelengthConstants.IR_WAVELENGTH,
        new SoundClip( photonReleaseIr_mp3, photonEmissionFromMoleculeSoundClipOptions )
      ],
      [
        WavelengthConstants.VISIBLE_WAVELENGTH,
        new SoundClip( photonReleaseVisible_mp3, photonEmissionFromMoleculeSoundClipOptions )
      ],
      [
        WavelengthConstants.UV_WAVELENGTH,
        new SoundClip( photonReleaseUv_mp3, photonEmissionFromMoleculeSoundClipOptions )
      ]
    ] );

    photonEmissionFromMoleculeSoundPlayersMap.forEach( soundPlayer => {
      soundManager.addSoundGenerator( soundPlayer );
    } );

    // Listen for new photons and play sounds or set them up to be played later when appropriate.
    photonGroup.elementCreatedEmitter.addListener( photon => {
      const photonXPosition = photon.positionProperty.value.x;

      if ( photonXPosition === PLAY_MOLECULE_EMISSION_X_POSITION ) {

        // This photon was just emitted from the active molecule, so play the appropriate emission sound.
        photonEmissionFromMoleculeSoundPlayersMap.get( photon.wavelength ).play();
      }
      else {
        photonInitialEmissionSoundPlayerMap.get( photon.wavelength ).play();
      }
    } );
  }
}

greenhouseEffect.register( 'PhotonEmissionSoundGenerator', PhotonEmissionSoundGenerator );
export default PhotonEmissionSoundGenerator;
