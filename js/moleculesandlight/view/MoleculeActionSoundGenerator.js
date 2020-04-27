// Copyright 2020, University of Colorado Boulder

/**
 * A sound generator that produces sounds for the various actions that a molecule can take, such as vibrating, rotating,
 * becoming energized, and so forth.  This type watches a list of active molecules and hooks up listeners to each one
 * that will generate the various sounds.
 */

import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import photonAbsorbedSoundInfo from '../../../sounds/absorb-photon_mp3.js';
import moleculeEnergizedSoundInfo from '../../../sounds/energized_mp3.js';
import breakApartSoundInfo from '../../../sounds/break-apart_mp3.js';
import rotationClockwiseSlowMotionSoundInfo from '../../../sounds/rotation-clockwise-slow-motion_mp3.js';
import rotationClockwiseNormalSpeedSoundInfo from '../../../sounds/rotation-clockwise_mp3.js';
import rotationCounterclockwiseSlowMotionSoundInfo from '../../../sounds/rotation-counterclockwise-slow-motion_mp3.js';
import rotationCounterclockwiseNormalSpeedSoundInfo from '../../../sounds/rotation-counterclockwise_mp3.js';
import vibrationSlowMotionSoundInfo from '../../../sounds/vibration-slow-motion_mp3.js';
import vibrationNormalSpeedStereoSoundInfo from '../../../sounds/vibration_mp3.js';
import moleculesAndLight from '../../moleculesAndLight.js';

// constants
const ABSORPTION_TO_ACTIVITY_SOUND_DELAY = 0.2; // in seconds

class MoleculeActionSoundGenerator extends SoundGenerator {

  /**
   * @param {ObservableArray<Molecule>}activeMolecules
   * @param {BooleanProperty} simIsRunningProperty
   * @param {BooleanProperty} isSlowMotionProperty
   * @param {Object} [options]
   */
  constructor( activeMolecules, simIsRunningProperty, isSlowMotionProperty, options ) {

    options = merge( {}, options );
    super( options );

    // photon absorbed sound
    const photonAbsorbedSoundClip = new SoundClip( photonAbsorbedSoundInfo, { initialOutputLevel: 0.1 } );
    photonAbsorbedSoundClip.connect( this.masterGainNode );
    const photonAbsorbedSoundPlayer = () => {
      photonAbsorbedSoundClip.play();
    };

    // break apart sound
    const breakApartSound = new SoundClip( breakApartSoundInfo, { initialOutputLevel: 1 } );
    breakApartSound.connect( this.masterGainNode );
    const breakApartSoundPlayer = () => {
      breakApartSound.play();
    };

    // "energized" sound, which is played when the molecule enters a higher-energy state (depicted in the view as glowing)
    const moleculeEnergizedLoop = new SoundClip( moleculeEnergizedSoundInfo, {
      loop: true,
      initialOutputLevel: 0.3,
      enableControlProperties: [ simIsRunningProperty ]
    } );
    moleculeEnergizedLoop.connect( this.masterGainNode );
    const updateMoleculeEnergizedSound = moleculeEnergized => {
      if ( moleculeEnergized ) {
        moleculeEnergizedLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
      }
      else {
        moleculeEnergizedLoop.stop();
      }
    };

    // rotation sounds
    const rotationLoopOptions = {
      initialOutputLevel: 0.3,
      loop: true,
      enableControlProperties: [ simIsRunningProperty ]
    };

    // clockwise normal speed
    const rotateClockwiseNormalSpeedLoop = new SoundClip(
      rotationClockwiseNormalSpeedSoundInfo,
      rotationLoopOptions
    );
    rotateClockwiseNormalSpeedLoop.connect( this.masterGainNode );

    // clockwise slow motion
    const rotateClockwiseSlowMotionLoop = new SoundClip(
      rotationClockwiseSlowMotionSoundInfo,
      rotationLoopOptions
    );
    rotateClockwiseSlowMotionLoop.connect( this.masterGainNode );

    // counterclockwise normal speed
    const rotateCounterclockwiseNormalSpeedLoop = new SoundClip(
      rotationCounterclockwiseNormalSpeedSoundInfo,
      rotationLoopOptions
    );
    rotateCounterclockwiseNormalSpeedLoop.connect( this.masterGainNode );

    // counterclockwise slow motion
    const rotateCounterclockwiseSlowMotionLoop = new SoundClip(
      rotationCounterclockwiseSlowMotionSoundInfo,
      rotationLoopOptions
    );
    rotateCounterclockwiseSlowMotionLoop.connect( this.masterGainNode );

    const updateRotationSound = rotating => {
      if ( rotating ) {

        // Verify that there is only one molecule that needs this sound.  At the time of this writing - mid-March 2020 -
        // there are not multiple copies of the loops, and there would need to be in order to support more molecules.
        assert && assert( activeMolecules.length <= 1, 'sound generation can only be handled for one molecule' );

        // play a sound based on the direction of rotation and the currently selected sound from the options dialog
        const molecule = activeMolecules.get( 0 );
        if ( molecule.rotationDirectionClockwiseProperty.value ) {
          if ( isSlowMotionProperty.value ) {
            rotateClockwiseSlowMotionLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
          }
          else {
            rotateClockwiseNormalSpeedLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
          }
        }
        else {
          if ( isSlowMotionProperty.value ) {
            rotateCounterclockwiseSlowMotionLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
          }
          else {
            rotateCounterclockwiseNormalSpeedLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
          }
        }
      }
      else {
        rotateClockwiseNormalSpeedLoop.stop();
        rotateClockwiseSlowMotionLoop.stop();
        rotateCounterclockwiseNormalSpeedLoop.stop();
        rotateCounterclockwiseSlowMotionLoop.stop();
      }
    };

    // vibration sounds
    const vibrationLoopOptions = {
      initialOutputLevel: 0.4,
      loop: true,
      enableControlProperties: [ simIsRunningProperty ]
    };

    // vibration normal speed
    const moleculeVibrationNormalSpeedLoop = new SoundClip( vibrationNormalSpeedStereoSoundInfo, vibrationLoopOptions );
    moleculeVibrationNormalSpeedLoop.connect( this.masterGainNode );

    // vibration slow motion
    const moleculeVibrationSlowMotionLoop = new SoundClip( vibrationSlowMotionSoundInfo, {
      initialOutputLevel: 0.4,
      loop: true,
      enableControlProperties: [ simIsRunningProperty ]
    } );
    moleculeVibrationSlowMotionLoop.connect( this.masterGainNode );

    // function for updating the vibration sound
    const updateVibrationSound = vibrating => {
      if ( vibrating ) {

        // Verify that there is only one molecule that needs this sound.  At the time of this writing - mid-March 2020 -
        // there are not multiple copies of the loops, and there would need to be in order to support more molecules.
        assert && assert( activeMolecules.length <= 1, 'sound generation can only be handled for one molecule' );

        // start the vibration sound playing (this will have no effect if the sound is already playing)
        if ( isSlowMotionProperty.value ) {
          moleculeVibrationSlowMotionLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
        }
        else {
          moleculeVibrationNormalSpeedLoop.play( ABSORPTION_TO_ACTIVITY_SOUND_DELAY );
        }
      }
      else {
        moleculeVibrationNormalSpeedLoop.stop();
        moleculeVibrationSlowMotionLoop.stop();
      }
    };

    // switch between normal speed and slow motion sounds if the setting changes while a sound is playing
    isSlowMotionProperty.link( isSlowMotion => {

      if ( isSlowMotion ) {
        if ( moleculeVibrationNormalSpeedLoop.isPlaying ) {
          moleculeVibrationNormalSpeedLoop.stop();
          moleculeVibrationSlowMotionLoop.play();
        }
        if ( rotateClockwiseNormalSpeedLoop.isPlaying ) {
          rotateClockwiseNormalSpeedLoop.stop();
          rotateClockwiseSlowMotionLoop.play();
        }
        if ( rotateCounterclockwiseNormalSpeedLoop.isPlaying ) {
          rotateCounterclockwiseNormalSpeedLoop.stop();
          rotateCounterclockwiseSlowMotionLoop.play();
        }
      }
      else {
        if ( moleculeVibrationSlowMotionLoop.isPlaying ) {
          moleculeVibrationSlowMotionLoop.stop();
          moleculeVibrationNormalSpeedLoop.play();
        }
        if ( rotateClockwiseSlowMotionLoop.isPlaying ) {
          rotateClockwiseSlowMotionLoop.stop();
          rotateClockwiseNormalSpeedLoop.play();
        }
        if ( rotateCounterclockwiseSlowMotionLoop.isPlaying ) {
          rotateCounterclockwiseSlowMotionLoop.stop();
          rotateCounterclockwiseNormalSpeedLoop.play();
        }
      }
    } );

    // function that adds all of the listeners involved in producing the molecule action sounds
    const addSoundPlayersToMolecule = molecule => {
      molecule.photonAbsorbedEmitter.addListener( photonAbsorbedSoundPlayer );
      molecule.brokeApartEmitter.addListener( breakApartSoundPlayer );
      molecule.highElectronicEnergyStateProperty.link( updateMoleculeEnergizedSound );
      molecule.rotatingProperty.link( updateRotationSound );
      molecule.vibratingProperty.link( updateVibrationSound );
    };

    // hook up listeners for any molecules that are already on the list
    activeMolecules.forEach( activeMolecule => {
      addSoundPlayersToMolecule( activeMolecule );
    } );

    // listen for new molecules and add the listeners that produce the action sounds when one arrives
    activeMolecules.addItemAddedListener( addedMolecule => {
      addSoundPlayersToMolecule( addedMolecule );
    } );

    // remove the sound-producing listeners when a molecule is removed
    activeMolecules.addItemRemovedListener( removedMolecule => {
      if ( removedMolecule.photonAbsorbedEmitter.hasListener( photonAbsorbedSoundPlayer ) ) {
        removedMolecule.photonAbsorbedEmitter.removeListener( photonAbsorbedSoundPlayer );
      }
      if ( removedMolecule.brokeApartEmitter.hasListener( breakApartSoundPlayer ) ) {
        removedMolecule.brokeApartEmitter.removeListener( breakApartSoundPlayer );
      }
      if ( removedMolecule.highElectronicEnergyStateProperty.hasListener( updateMoleculeEnergizedSound ) ) {
        removedMolecule.highElectronicEnergyStateProperty.unlink( updateMoleculeEnergizedSound );
      }
      if ( removedMolecule.rotatingProperty.hasListener( updateRotationSound ) ) {
        removedMolecule.rotatingProperty.unlink( updateRotationSound );
      }
      if ( removedMolecule.vibratingProperty.hasListener( updateVibrationSound ) ) {
        removedMolecule.vibratingProperty.unlink( updateVibrationSound );
      }
    } );
  }
}

moleculesAndLight.register( 'MoleculeActionSoundGenerator', MoleculeActionSoundGenerator );
export default MoleculeActionSoundGenerator;