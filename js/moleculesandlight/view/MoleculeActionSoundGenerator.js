// Copyright 2020, University of Colorado Boulder

/**
 * A sound generator that produces sounds for the various actions that a molecule can take, such as vibrating, rotating,
 * becoming energized, and so forth.  This type watches a list of active molecules and hooks up listeners to each one
 * that will generate the various sounds.
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import photonAbsorbedSoundInfo from '../../../sounds/absorb-based-on-photon_mp3.js';
import breakApartSoundInfo from '../../../sounds/break-apart-stereo-reverb_mp3.js';
import moleculeEnergizedSoundInfo from '../../../sounds/glow-loop-higher_mp3.js';
import rotationClockwiseSoundInfo from '../../../sounds/rotate-clockwise_mp3.js';
import rotationCounterclockwiseSoundInfo from '../../../sounds/rotate-counterclockwise_mp3.js';
import rotationDirections001SlowMotionSoundInfo from '../../../sounds/rotate-directions-001-slow-mo_mp3.js';
import rotationDirections001SoundInfo from '../../../sounds/rotate-directions-001-spatialized_mp3.js';
import rotationDirections002SlowMotionSoundInfo from '../../../sounds/rotate-directions-002-slow-mo_mp3.js';
import rotationDirections002SoundInfo from '../../../sounds/rotate-directions-002-spatialized_mp3.js';
import vibrationSlowMotionSoundInfo from '../../../sounds/vibration-slow-mo_mp3.js';
import vibrationSpatializedSoundInfo from '../../../sounds/vibration-spatialized_mp3.js';
import vibrationSoundInfo from '../../../sounds/vibration_mp3.js';
import MoleculesAndLightConstants from '../../common/MoleculesAndLightConstants.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import merge from '../../../../phet-core/js/merge.js';

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
        moleculeEnergizedLoop.play();
      }
      else {
        moleculeEnergizedLoop.stop();
      }
    };

    // rotation sounds
    const cwRotationSoundInfo = MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? rotationDirections001SoundInfo
                                                                                  : rotationClockwiseSoundInfo;
    const rotationLoopOptions = {
      initialOutputLevel: 0.3,
      loop: true,
      enableControlProperties: [ simIsRunningProperty ]
    };
    const rotateClockwiseNormalSpeedLoop = new SoundClip( cwRotationSoundInfo, rotationLoopOptions );
    rotateClockwiseNormalSpeedLoop.connect( this.masterGainNode );
    const rotateClockwiseSlowMotionLoop = new SoundClip( rotationDirections001SlowMotionSoundInfo, rotationLoopOptions );
    rotateClockwiseSlowMotionLoop.connect( this.masterGainNode );
    const ccwRotationSoundInfo = MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? rotationDirections002SoundInfo : rotationCounterclockwiseSoundInfo;
    const rotateCounterclockwiseNormalSpeedLoop = new SoundClip( ccwRotationSoundInfo, rotationLoopOptions );
    rotateCounterclockwiseNormalSpeedLoop.connect( this.masterGainNode );
    const rotateCounterclockwiseSlowMotionLoop = new SoundClip( rotationDirections002SlowMotionSoundInfo, rotationLoopOptions );
    rotateCounterclockwiseSlowMotionLoop.connect( this.masterGainNode );

    const updateRotationSound = rotating => {
      if ( rotating ) {

        // this is only set up for a single molecule
        assert && assert( activeMolecules.length === 1 );

        // play a sound based on the direction of rotation and the currently selected sound from the options dialog
        const molecule = activeMolecules.get( 0 );
        if ( molecule.rotationDirectionClockwiseProperty.value ) {
          if ( isSlowMotionProperty.value ) {
            rotateClockwiseSlowMotionLoop.play();
          }
          else {
            rotateClockwiseNormalSpeedLoop.play();
          }
        }
        else {
          if ( isSlowMotionProperty.value ) {
            rotateCounterclockwiseSlowMotionLoop.play();
          }
          else {
            rotateCounterclockwiseNormalSpeedLoop.play();
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

    // vibration sound
    const moleculeVibrationSoundInfo = MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? vibrationSpatializedSoundInfo : vibrationSoundInfo;
    const moleculeVibrationNormalSpeedLoop = new SoundClip( moleculeVibrationSoundInfo, {
      initialOutputLevel: 0.4,
      loop: true,
      enableControlProperties: [ simIsRunningProperty ]
    } );
    moleculeVibrationNormalSpeedLoop.connect( this.masterGainNode );
    const moleculeVibrationSlowMotionLoop = new SoundClip( vibrationSlowMotionSoundInfo, {
      initialOutputLevel: 0.4,
      loop: true,
      enableControlProperties: [ simIsRunningProperty ]
    } );
    moleculeVibrationSlowMotionLoop.connect( this.masterGainNode );

    // function for updating the vibration sound
    const updateVibrationSound = vibrating => {
      if ( vibrating ) {

        // start the vibration sound playing (this will have no effect if the sound is already playing)
        if ( isSlowMotionProperty.value ) {
          moleculeVibrationSlowMotionLoop.play();
        }
        else {
          moleculeVibrationNormalSpeedLoop.play();
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