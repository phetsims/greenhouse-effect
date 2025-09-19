// Copyright 2021-2024, University of Colorado Boulder

/**
 * A sound generator that produces sounds for the various actions that a molecule can take, such as vibrating, rotating,
 * becoming energized, and so forth.  This type watches a list of active molecules and hooks up listeners to each one
 * that will generate the various sounds.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import absorbPhoton_mp3 from '../../../sounds/absorbPhoton_mp3.js';
import breakApart_mp3 from '../../../sounds/breakApart_mp3.js';
import energized_mp3 from '../../../sounds/energized_mp3.js';
import rotationClockwise_mp3 from '../../../sounds/rotationClockwise_mp3.js';
import rotationClockwiseSlowMotion_mp3 from '../../../sounds/rotationClockwiseSlowMotion_mp3.js';
import rotationCounterclockwise_mp3 from '../../../sounds/rotationCounterclockwise_mp3.js';
import rotationCounterclockwiseSlowMotion_mp3 from '../../../sounds/rotationCounterclockwiseSlowMotion_mp3.js';
import vibration_mp3 from '../../../sounds/vibration_mp3.js';
import vibrationSlowMotion_mp3 from '../../../sounds/vibrationSlowMotion_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Molecule from '../model/Molecule.js';

// constants
const ABSORPTION_TO_ACTIVITY_SOUND_DELAY = 0.2; // in seconds

class MoleculeActionSoundGenerator extends SoundGenerator {
  public constructor( activeMolecules: ObservableArray<Molecule>, simIsRunningProperty: Property<boolean>, isSlowMotionProperty: TReadOnlyProperty<boolean>, options?: SoundGeneratorOptions ) {
    super( options );

    // photon absorbed sound
    const photonAbsorbedSoundClip = new SoundClip( absorbPhoton_mp3, { initialOutputLevel: 0.1 } );
    photonAbsorbedSoundClip.connect( this.soundSourceDestination );
    const photonAbsorbedSoundPlayer = () => {
      photonAbsorbedSoundClip.play();
    };

    // break apart sound
    const breakApartSoundClip = new SoundClip( breakApart_mp3, { initialOutputLevel: 1 } );
    breakApartSoundClip.connect( this.soundSourceDestination );
    const breakApartSoundPlayer = () => {
      breakApartSoundClip.play();
    };

    // "energized" sound, which is played when the molecule enters a higher-energy state (depicted in the view as glowing)
    const moleculeEnergizedLoop = new SoundClip( energized_mp3, {
      loop: true,
      initialOutputLevel: 0.3,
      enabledProperty: simIsRunningProperty
    } );
    moleculeEnergizedLoop.connect( this.soundSourceDestination );
    const updateMoleculeEnergizedSound = ( moleculeEnergized: boolean ) => {
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
      enabledProperty: simIsRunningProperty
    };

    // clockwise normal speed
    const rotateClockwiseNormalSpeedLoop = new SoundClip(
      rotationClockwise_mp3,
      rotationLoopOptions
    );
    rotateClockwiseNormalSpeedLoop.connect( this.soundSourceDestination );

    // clockwise slow motion
    const rotateClockwiseSlowMotionLoop = new SoundClip(
      rotationClockwiseSlowMotion_mp3,
      rotationLoopOptions
    );
    rotateClockwiseSlowMotionLoop.connect( this.soundSourceDestination );

    // counterclockwise normal speed
    const rotateCounterclockwiseNormalSpeedLoop = new SoundClip(
      rotationCounterclockwise_mp3,
      rotationLoopOptions
    );
    rotateCounterclockwiseNormalSpeedLoop.connect( this.soundSourceDestination );

    // counterclockwise slow motion
    const rotateCounterclockwiseSlowMotionLoop = new SoundClip(
      rotationCounterclockwiseSlowMotion_mp3,
      rotationLoopOptions
    );
    rotateCounterclockwiseSlowMotionLoop.connect( this.soundSourceDestination );

    const updateRotationSound = ( rotating: boolean ) => {
      if ( rotating ) {

        // Verify that there is only one molecule that needs this sound.  At the time of this writing - mid-March 2020 -
        // there are not multiple copies of the loops, and there would need to be in order to support more molecules.
        assert && assert( activeMolecules.length <= 1, 'sound generation can only be handled for one molecule' );

        // play a sound based on the direction of rotation and the currently selected sound from the Preferences dialog
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
      enabledProperty: simIsRunningProperty
    };

    // vibration normal speed
    const moleculeVibrationNormalSpeedLoop = new SoundClip( vibration_mp3, vibrationLoopOptions );
    moleculeVibrationNormalSpeedLoop.connect( this.soundSourceDestination );

    // vibration slow motion
    const moleculeVibrationSlowMotionLoop = new SoundClip( vibrationSlowMotion_mp3, {
      initialOutputLevel: 0.4,
      loop: true,
      enabledProperty: simIsRunningProperty
    } );
    moleculeVibrationSlowMotionLoop.connect( this.soundSourceDestination );

    // function for updating the vibration sound
    const updateVibrationSound = ( vibrating: boolean ) => {
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
    const addSoundPlayersToMolecule = ( molecule: Molecule ) => {
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

greenhouseEffect.register( 'MoleculeActionSoundGenerator', MoleculeActionSoundGenerator );
export default MoleculeActionSoundGenerator;