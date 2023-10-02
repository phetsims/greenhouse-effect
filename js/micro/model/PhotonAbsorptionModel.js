// Copyright 2021-2023, University of Colorado Boulder

/**
 * Model for Molecules and Light.  It is called PhotonAbsorptionModel because it came from the original Java version
 * in a file called PhotonAbsorptionModel.java, which is used by both "Molecules & Light" and "Greenhouse Gas"
 *
 * This models photons being absorbed (or often NOT absorbed) by various molecules.  The scale for this model is
 * picometers (10E-12 meters).
 *
 * The basic idea for this model is that there is some sort of photon emitter that emits photons, and some sort of
 * photon target that could potentially absorb some of the emitted photons and react in some way.  In many cases, the
 * photon target can re-emit one or more photons after absorption.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import MicroPhoton from './MicroPhoton.js';
import Molecule from './Molecule.js';
import CH4 from './molecules/CH4.js';
import CO from './molecules/CO.js';
import CO2 from './molecules/CO2.js';
import H2O from './molecules/H2O.js';
import N2 from './molecules/N2.js';
import NO2 from './molecules/NO2.js';
import O2 from './molecules/O2.js';
import O3 from './molecules/O3.js';
import PhotonTarget from './PhotonTarget.js';
import WavelengthConstants from './WavelengthConstants.js';

// constants

// constants that control where and how photons are emitted.
const PHOTON_EMISSION_POSITION = new Vector2( -1350, 0 );

// Velocity of emitted photons.  Since they are emitted horizontally, only one value is needed.
const PHOTON_VELOCITY = 3000; // picometers/second

// Defaults for photon emission periods.
const DEFAULT_PHOTON_EMISSION_PERIOD = Number.POSITIVE_INFINITY; // Milliseconds of sim time.

// Default values for various parameters that weren't already covered.
const DEFAULT_EMITTED_PHOTON_WAVELENGTH = WavelengthConstants.IR_WAVELENGTH;
const INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED = 0.0; // seconds, emitted right away

// photon emission periods, in seconds
const EMITTER_ON_EMISSION_PERIOD = 0.8;
const EMITTER_OFF_EMISSION_PERIOD = Number.POSITIVE_INFINITY;

// when stepping at "slow" speed, animate rate is reduced by this factor
const SLOW_SPEED_FACTOR = 0.5;

class PhotonAbsorptionModel extends PhetioObject {

  /**
   * Constructor for a photon absorption model.
   * @param {PhotonTarget} initialPhotonTarget - Initial molecule which the photon gets fired at.
   * @param {Tandem} tandem
   */
  constructor( initialPhotonTarget, tandem ) {
    super();

    this.photonAbsorptionModel = tandem; // @private

    // @private
    this.photonGroup = new PhetioGroup(
      ( tandem, wavelength, initialPosition ) => new MicroPhoton(
        wavelength,
        { tandem: tandem, initialPosition: initialPosition }
      ),
      [ WavelengthConstants.IR_WAVELENGTH, Vector2.ZERO ],
      {
        phetioType: PhetioGroup.PhetioGroupIO( MicroPhoton.PhotonIO ),
        tandem: tandem.createTandem( 'photonGroup' )
      }
    );

    // @public - Property that indicates whether photons are being emitted from the photon emitter
    this.photonEmitterOnProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'photonEmitterOnProperty' )
    } );

    // @public
    this.photonWavelengthProperty = new NumberProperty( WavelengthConstants.IR_WAVELENGTH, {
      tandem: tandem.createTandem( 'photonWavelengthProperty' ),
      units: 'm',
      validValues: [
        WavelengthConstants.MICRO_WAVELENGTH,
        WavelengthConstants.IR_WAVELENGTH,
        WavelengthConstants.VISIBLE_WAVELENGTH,
        WavelengthConstants.UV_WAVELENGTH
      ]
    } );

    // @public (read-only) {Property.<PhotonTarget>}
    this.photonTargetProperty = new Property( initialPhotonTarget, {
      tandem: tandem.createTandem( 'photonTargetProperty' ),
      phetioValueType: EnumerationIO( PhotonTarget ),
      validValues: PhotonTarget.VALUES,

      // This model was written early in PhET's HTML years, well before we tried to design such that models were
      // tolerant of changes to order dependencies.  Without this value set to true we see CT failures, see
      // https://github.com/phetsims/molecules-and-light/issues/394.
      hasListenerOrderDependencies: true
    } );

    // @public (read-only) {null|Molecule} - A reference to the current target molecule, determined from the
    // photonTargetProperty. If the molecule breaks apart this will become null again.
    this.targetMolecule = null;

    // @public (BooleanProperty) - Whether or the simulation is currently playing or paused
    this.runningProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'runningProperty' )
    } );

    // @public controls play speed of the simulation
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    // @public - convenience Property, indicating whether sim is running in slow motion
    this.slowMotionProperty = new DerivedProperty( [ this.timeSpeedProperty ], speed => speed === TimeSpeed.SLOW );

    // @public {ObservableArrayDef<Molecule>} - molecules present and active in the model
    this.activeMolecules = createObservableArray( {
      tandem: tandem.createTandem( 'activeMolecules' ),
      phetioType: createObservableArray.ObservableArrayIO( Molecule.MoleculeIO )
    } );

    // @public (read-only) {Emitter} - emitter for when a photon is emitted from the emission point - useful in addition
    // to the photons ObservableArrayDef because this is specifically for photon emission from the light source
    this.photonEmittedEmitter = new Emitter( { parameters: [ { valueType: MicroPhoton } ] } );

    // @public - Emits when the model has been reset
    this.resetEmitter = new Emitter();

    // @public - Emits an event when the user manually steps forward one frame
    this.manualStepEmitter = new Emitter();

    // Link the model's active molecule to the photon target property.  Note that this wiring must be done after the
    // listeners for the activeMolecules observable array have been implemented.
    this.photonTargetProperty.link( photonTarget => this.updateActiveMolecule( photonTarget, tandem ) );

    // when the photon emitter is on, set to default "on" and "off" period
    this.photonEmitterOnProperty.link( emitterOn => {
      this.setPhotonEmissionPeriod( emitterOn ? EMITTER_ON_EMISSION_PERIOD : EMITTER_OFF_EMISSION_PERIOD );
    } );

    // Clear all photons to avoid cases where photons of the previous wavelength
    // could be absorbed after new wavelength was selected. Some users interpreted
    // absorption of the previous wavelength as absorption of the selected wavelength
    this.photonWavelengthProperty.lazyLink( () => {
      this.resetPhotons();

      // after clearing, next photon should be emitted right away
      if ( this.photonEmitterOnProperty.get() ) {
        this.setEmissionTimerToInitialCountdown();
      }
    } );

    // Variables that control periodic photon emission.
    this.photonEmissionCountdownTimer = Number.POSITIVE_INFINITY; // @private
    this.photonEmissionPeriodTarget = DEFAULT_PHOTON_EMISSION_PERIOD; // @private
  }

  /**
   * Reset the model to its initial state.
   * @public
   */
  reset() {

    this.resetPhotons();

    // Reset all active molecules, which will stop any vibrations.
    for ( let molecule = 0; molecule < this.activeMolecules.length; molecule++ ) {
      this.activeMolecules.get( molecule ).reset();
    }

    // Set default values.
    this.photonTargetProperty.reset();
    this.setEmittedPhotonWavelength( DEFAULT_EMITTED_PHOTON_WAVELENGTH );
    this.setPhotonEmissionPeriod( DEFAULT_PHOTON_EMISSION_PERIOD );

    // Reset all associated properties.
    this.photonEmitterOnProperty.reset();
    this.photonWavelengthProperty.reset();
    this.runningProperty.reset();
    this.timeSpeedProperty.reset();
    this.photonTargetProperty.reset();

    // broadcast that the model has been reset
    this.resetEmitter.emit();
  }

  /**
   * Clears all photons.
   * @public
   */
  resetPhotons() {

    // If setting state, the state engine will do this step.
    if ( !isSettingPhetioStateProperty.value ) {
      this.photonGroup.clear();
    }
  }

  /**
   * Advance the molecules one step in time.  Called by the animation loop.
   * @param {number} dt - The incremental time step.
   * @public
   */
  step( dt ) {

    // Reject large dt values that often result from returning to this sim when it has been hidden, e.g. when another
    // tab was open in the browser or the browser was minimized.  The nominal dt value is based on 60 fps and is
    // 1/60 = 0.016667 sec.
    if ( dt > 0.2 ) {
      return;
    }

    // reduce time step if running in slow motion
    if ( this.slowMotionProperty.value ) {
      dt = dt * SLOW_SPEED_FACTOR;
    }

    if ( this.runningProperty.get() ) {

      // Step the photons, marking and removing any that have moved beyond the model
      this.stepPhotons( dt );

      // Check if it is time to emit any photons.
      this.checkEmissionTimer( dt );

      // Step the molecules.
      this.stepMolecules( dt );
    }
  }

  /**
   * Check if it is time to emit any photons from the photon emitter.
   * @param {number} dt - the incremental time step, in seconds
   * @public
   */
  checkEmissionTimer( dt ) {

    if ( this.photonEmissionCountdownTimer !== Number.POSITIVE_INFINITY ) {
      this.photonEmissionCountdownTimer -= dt;
      if ( this.photonEmissionCountdownTimer <= 0 ) {

        // Time to emit.
        this.emitPhoton( Math.abs( this.photonEmissionCountdownTimer ) );
        this.photonEmissionCountdownTimer = this.photonEmissionPeriodTarget;
      }
    }
  }

  /**
   * Sets the timer to the initial countdown time when emission is first enabled.
   * @public
   */
  setEmissionTimerToInitialCountdown() {
    this.photonEmissionCountdownTimer = INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED;
  }

  /**
   * Step the photons in time.
   * @param {number} dt - the incremental times step, in seconds
   * @public
   */
  stepPhotons( dt ) {
    const photonsToRemove = [];

    // check for possible interaction between each photon and molecule
    this.photonGroup.forEach( photon => {
      this.activeMolecules.forEach( molecule => {
        if ( molecule.queryAbsorbPhoton( photon ) ) {

          // the photon was absorbed, so put it on the removal list
          photonsToRemove.push( photon );
        }
      } );
      photon.step( dt );
    } );

    // Remove any photons that were marked for removal.
    photonsToRemove.forEach( photon => this.photonGroup.disposeElement( photon ) );
  }

  /**
   * Step the molecules one step in time.
   * @param {number} dt - The incremental time step.
   * @public
   */
  stepMolecules( dt ) {
    const moleculesToStep = this.activeMolecules.slice( 0 );
    for ( let molecule = 0; molecule < moleculesToStep.length; molecule++ ) {
      moleculesToStep[ molecule ].step( dt );
    }
  }

  /**
   * Step one frame manually.
   * @param {number} dt - time to step forward the model by, in seconds
   * @public
   */
  manualStep( dt ) {

    // Check if it is time to emit any photons.
    this.checkEmissionTimer( dt );

    // Step the photons, marking and removing any that have moved beyond the model bounds.
    this.stepPhotons( dt );

    // Step the molecules.
    this.stepMolecules( dt );

    this.manualStepEmitter.emit();
  }

  /**
   * Cause a photon to be emitted from the emission point.  Emitted photons will travel toward the photon target, which
   * will decide whether a given photon should be absorbed.
   * @param advanceAmount - amount of time that the photon should be "advanced" from its starting position.  This
   * makes it possible to make the emission stream look more constant in cases where there was a long delay between
   * frames.
   * @public
   */
  emitPhoton( advanceAmount ) {
    const photon = this.photonGroup.createNextElement(
      this.photonWavelengthProperty.get(),
      new Vector2( PHOTON_EMISSION_POSITION.x + PHOTON_VELOCITY * advanceAmount, PHOTON_EMISSION_POSITION.y )
    );
    const emissionAngle = 0; // Straight to the right.
    photon.setVelocity( PHOTON_VELOCITY * Math.cos( emissionAngle ), PHOTON_VELOCITY * Math.sin( emissionAngle ) );

    // Indicate that a photon has been emitted.
    this.photonEmittedEmitter.emit( photon );
  }

  /**
   * Set the wavelength of the photon to be emitted if desired frequency is not equal to the current value.
   * @param {number} freq
   * @public
   */
  setEmittedPhotonWavelength( freq ) {
    if ( this.photonWavelengthProperty.get() !== freq ) {
      // Set the new value and send out notification of change to listeners.
      this.photonWavelengthProperty.set( freq );
    }
  }

  /**
   * Get the emission position for this photonAbsorptionModel.  Useful when other models need access to this position.
   * @returns {Vector2}
   * @public
   */
  getPhotonEmissionPosition() {
    return PHOTON_EMISSION_POSITION;
  }

  /**
   * Set the emission period, i.e. the time between photons.
   * @param {number} photonEmissionPeriod - Period between photons in milliseconds.
   * @public
   */
  setPhotonEmissionPeriod( photonEmissionPeriod ) {

    assert && assert( photonEmissionPeriod >= 0 );
    if ( this.photonEmissionPeriodTarget !== photonEmissionPeriod ) {

      // If we are transitioning from off to on, set the countdown timer such that a photon will be emitted right away
      // so that the user doesn't have to wait too long in order to see something come out, but only if there
      // are no other photons in the observation window so we don't emit unlimitted photons when turning
      // on/off rapidly
      if ( this.photonEmissionPeriodTarget === Number.POSITIVE_INFINITY && photonEmissionPeriod !== Number.POSITIVE_INFINITY
           && this.photonGroup.count === 0 ) {

        // only reset time on emission of first photon, there should still be a delay after subsequent photons
        this.setEmissionTimerToInitialCountdown();
      }
      else if ( photonEmissionPeriod < this.photonEmissionCountdownTimer ) {

        // Handle the case where the new value is smaller than the current countdown value.
        this.photonEmissionCountdownTimer = photonEmissionPeriod;
      }
      else if ( photonEmissionPeriod === Number.POSITIVE_INFINITY ) {

        // If the new value is infinity, it means that emissions are being turned off, so set the period to infinity
        // right away.
        this.photonEmissionCountdownTimer = photonEmissionPeriod;
      }
      this.photonEmissionPeriodTarget = photonEmissionPeriod;
    }
  }

  /**
   * Update the active molecule to the current photon target.  Clear the old array of active molecules, create a new
   * molecule, and then add it to the active molecules array.  Add listeners to the molecule that check for when the
   * molecule should emit a photon or break apart into constituents.
   * @param {PhotonTarget} photonTarget - The string constant which represents the desired photon target.
   * @param {Tandem} tandem
   * @public
   */
  updateActiveMolecule( photonTarget, tandem ) {

    // Remove the old photon target(s).
    this.activeMolecules.forEach( molecule => { molecule.dispose(); } );
    this.activeMolecules.clear(); // Clear the old active molecules array

    // Add the new photon target(s).
    const newMolecule =
      photonTarget === PhotonTarget.SINGLE_CO_MOLECULE ? new CO( { tandem: tandem.createTandem( 'CO' ) } ) :
      photonTarget === PhotonTarget.SINGLE_CO2_MOLECULE ? new CO2( { tandem: tandem.createTandem( 'CO2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_H2O_MOLECULE ? new H2O( { tandem: tandem.createTandem( 'H2O' ) } ) :
      photonTarget === PhotonTarget.SINGLE_N2_MOLECULE ? new N2( { tandem: tandem.createTandem( 'N2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_O2_MOLECULE ? new O2( { tandem: tandem.createTandem( 'O2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_O3_MOLECULE ? new O3( { tandem: tandem.createTandem( 'O3' ) } ) :
      photonTarget === PhotonTarget.SINGLE_NO2_MOLECULE ? new NO2( { tandem: tandem.createTandem( 'NO2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_CH4_MOLECULE ? new CH4( { tandem: tandem.createTandem( 'CH4' ) } ) :
      assert && assert( false, 'unhandled photon target' );

    this.targetMolecule = newMolecule;
    this.activeMolecules.add( newMolecule );

    // Set the photonGroup so that photons created by the molecule can be registered for PhET-iO
    newMolecule.photonGroup = this.photonGroup;

    // Break apart into constituent molecules.
    newMolecule.brokeApartEmitter.addListener( ( constituentMolecule1, constituentMolecule2 ) => {

      // Remove the molecule from the photonAbsorptionModel's list of active molecules.
      this.activeMolecules.remove( newMolecule );
      this.targetMolecule = null;
      newMolecule.dispose();

      // Add the constituent molecules to the photonAbsorptionModel.
      this.activeMolecules.add( constituentMolecule1 );
      this.activeMolecules.add( constituentMolecule2 );
    } );
  }

  /**
   * Returns true if this model still contains both of the constituent molecules provided after a break apart.
   * @param {Molecule} moleculeA
   * @param {Molecule} moleculeB
   * @returns {boolean}
   * @public
   */
  hasBothConstituentMolecules( moleculeA, moleculeB ) {
    return this.activeMolecules.includes( moleculeA ) && this.activeMolecules.includes( moleculeB );
  }

  /**
   * This method restores the active molecule.  This may seem nonsensical, and in some cases it is, but it is useful
   * in cases where an atom has broken apart and needs to be restored to its original condition.
   * @public
   */
  restoreActiveMolecule() {
    const currentTarget = this.photonTargetProperty.get();
    this.updateActiveMolecule( currentTarget, this.photonAbsorptionModel );
  }
}

greenhouseEffect.register( 'PhotonAbsorptionModel', PhotonAbsorptionModel );

// @public {number} - horizontal velocity of photons when they leave the emitter, in picometers/second
PhotonAbsorptionModel.PHOTON_VELOCITY = PHOTON_VELOCITY;

export default PhotonAbsorptionModel;