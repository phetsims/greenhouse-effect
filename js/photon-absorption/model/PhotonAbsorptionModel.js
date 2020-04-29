// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for Molecules and Light.  It is called PhotonAbsorptionModel because it came from the original Java version
 * in a file called PhotonAbsorptionModel.java, which is used by both "Molecules & Light" and "Greenhouse Gas"
 *
 * This models photons being absorbed (or often NOT absorbed) by various molecules.  The scale for this model is
 * picometers (10E-12 meters).
 *
 * The basic idea for this model is that there is some sort of photon emitter that emits photons, and some sort of
 * photon target that could potentially some of the emitted photons and react in some way.  In many cases, the photon
 * target can re-emit one or more photons after absorption.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import ObservableArrayIO from '../../../../axon/js/ObservableArrayIO.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EnumerationIO from '../../../../phet-core/js/EnumerationIO.js';
import inherit from '../../../../phet-core/js/inherit.js';
import TimeControlSpeed from '../../../../scenery-phet/js/TimeControlSpeed.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import MoleculeIO from './MoleculeIO.js';
import CH4 from './molecules/CH4.js';
import CO from './molecules/CO.js';
import CO2 from './molecules/CO2.js';
import H2O from './molecules/H2O.js';
import N2 from './molecules/N2.js';
import NO2 from './molecules/NO2.js';
import O2 from './molecules/O2.js';
import O3 from './molecules/O3.js';
import Photon from './Photon.js';
import PhotonAbsorptionModelIO from './PhotonAbsorptionModelIO.js';
import PhotonIO from './PhotonIO.js';
import PhotonTarget from './PhotonTarget.js';
import WavelengthConstants from './WavelengthConstants.js';

// ------- constants -------------

// constants that control where and how photons are emitted.
const PHOTON_EMISSION_LOCATION = new Vector2( -1350, 0 );

// Velocity of emitted photons.  Since they are emitted horizontally, only one value is needed.
const PHOTON_VELOCITY = 3000; // picometers/second

// Defaults for photon emission periods.
const DEFAULT_PHOTON_EMISSION_PERIOD = Number.POSITIVE_INFINITY; // Milliseconds of sim time.

// Default values for various parameters that weren't already covered.
const DEFAULT_EMITTED_PHOTON_WAVELENGTH = WavelengthConstants.IR_WAVELENGTH;
const INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED = 0.0; // seconds, emitted right away

// photon emission periods, in seconds
const PHOTON_ON_EMISSION_PERIOD = 0.8;
const PHOTON_OFF_EMISSION_PERIOD = Number.POSITIVE_INFINITY;

// when stepping at "slow" speed, animate rate is reduced by this factor
const SLOW_SPEED_FACTOR = 0.5;

/**
 * Constructor for a photon absorption model.
 *
 * @param {PhotonTarget} initialPhotonTarget - Initial molecule which the photon gets fired at.
 * @param {Tandem} tandem
 * @constructor
 */
function PhotonAbsorptionModel( initialPhotonTarget, tandem ) {

  const self = this;

  this.photonAbsorptionModel = tandem; // @private

  // @private
  this.photonGroupTandem = tandem.createGroupTandem( 'photons' );

  // @public - Property that indicating whether photons are being emitted from the photon emittter
  this.photonEmitterOnProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'photonEmitterOnProperty' )
  } );

  // @public
  this.photonWavelengthProperty = new Property( WavelengthConstants.IR_WAVELENGTH, {
    tandem: tandem.createTandem( 'photonWavelengthProperty' ),
    units: 'meters',
    validValues: [
      WavelengthConstants.MICRO_WAVELENGTH,
      WavelengthConstants.IR_WAVELENGTH,
      WavelengthConstants.VISIBLE_WAVELENGTH,
      WavelengthConstants.UV_WAVELENGTH
    ],
    phetioType: PropertyIO( NumberIO )
  } );

  // {Property.<PhotonTarget>}
  this.photonTargetProperty = new Property( initialPhotonTarget, {
    tandem: tandem.createTandem( 'photonTargetProperty' ),
    phetioType: PropertyIO( EnumerationIO( PhotonTarget ) ),
    validValues: PhotonTarget.VALUES
  } );

  // @public (read-only) {null|Molecule} - A reference to the current target molecule, determined from the
  // photonTargetProperty. If the molecule breaks apart this will become null again.
  this.targetMolecule = null;

  // @public (BooleanProperty) - Whether or the simulation is currently playing or paused
  this.runningProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'runningProperty' )
  } );

  // @public {EnumerationProperty.<TimeControlSpeed>} - controls play speed of the simulation
  this.timeControlSpeedProperty = new EnumerationProperty( TimeControlSpeed, TimeControlSpeed.NORMAL, {
    tandem: tandem.createTandem( 'timeControlSpeedProperty' )
  } );

  // @public - convenience Property, indicating whether sim is running in slow motion
  this.slowMotionProperty = new DerivedProperty( [ this.timeControlSpeedProperty ], speed => speed === TimeControlSpeed.SLOW );

  // @public
  this.photons = new ObservableArray( {
    tandem: tandem.createTandem( 'photons' ),
    phetioType: ObservableArrayIO( PhotonIO )
  } ); // Elements are of type Photon

  this.activeMolecules = new ObservableArray( {
    tandem: tandem.createTandem( 'molecules' ),
    phetioType: ObservableArrayIO( MoleculeIO )
  } ); // Elements are of type Molecule.

  // @public (read-only) {Emitter} - emitter for when a photon is emitted from the emission point - useful in addition
  // to the photons ObservableArray because this is specifically for photon emission from the light source
  this.photonEmittedEmitter = new Emitter( { parameters: [ { valueType: Photon } ] } );

  // @public - Emits when the model has been reset
  this.resetEmitter = new Emitter();

  // @public - Emits an event when the user manually steps forward one frame
  this.manualStepEmitter = new Emitter();

  // Link the model's active molecule to the photon target property.  Note that this wiring must be done after the
  // listeners for the activeMolecules observable array have been implemented.
  self.photonTargetProperty.link( photonTarget => self.updateActiveMolecule( photonTarget, tandem ) );

  // when the photon emitter is on, set to default "on" and "off" period
  this.photonEmitterOnProperty.link( emitterOn => {
    this.setPhotonEmissionPeriod( emitterOn ? PHOTON_ON_EMISSION_PERIOD : PHOTON_OFF_EMISSION_PERIOD );
  } );

  // Variables that control periodic photon emission.
  this.photonEmissionCountdownTimer = Number.POSITIVE_INFINITY; // @private
  this.photonEmissionPeriodTarget = DEFAULT_PHOTON_EMISSION_PERIOD; // @private

  PhetioObject.call( this, {
    tandem: tandem,
    phetioType: PhotonAbsorptionModelIO,
    phetioState: false
  } );
}

moleculesAndLight.register( 'PhotonAbsorptionModel', PhotonAbsorptionModel );

export default inherit( PhetioObject, PhotonAbsorptionModel, {

  /**
   * Reset the model to its initial state.
   */
  reset: function() {

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
    this.timeControlSpeedProperty.reset();
    this.photonTargetProperty.reset();

    // broadcast that the model has been reset
    this.resetEmitter.emit();
  },

  /**
   * Clears all photons.
   */
  resetPhotons() {

    // Remove and dispose any photons that are currently in transit.
    this.photons.forEach( photon => photon.dispose() );
    this.photons.clear();
  },

  /**
   * Advance the molecules one step in time.  Called by the animation loop.
   *
   * @param {number} dt - The incremental time step.
   */
  step: function( dt ) {

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
  },

  /**
   * Check if it is time to emit any photons from the photon emitter.
   *
   * @param {number} dt - the incremental time step, in seconds
   */
  checkEmissionTimer: function( dt ) {

    if ( this.photonEmissionCountdownTimer !== Number.POSITIVE_INFINITY ) {
      this.photonEmissionCountdownTimer -= dt;
      if ( this.photonEmissionCountdownTimer <= 0 ) {
        // Time to emit.
        this.emitPhoton( Math.abs( this.photonEmissionCountdownTimer ) );
        this.photonEmissionCountdownTimer = this.photonEmissionPeriodTarget;
      }
    }
  },

  /**
   * Sets the timer to the initial countdown time when emission is first enabled.
   * @public
   */
  setEmissionTimerToInitialCountdown: function() {
    this.photonEmissionCountdownTimer = INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED;
  },

  /**
   * Step the photons in time.
   *
   * @param {number} dt - the incremental times step, in seconds
   */
  stepPhotons: function( dt ) {
    const self = this;
    const photonsToRemove = [];

    // check for possible interaction between each photon and molecule
    this.photons.forEach( function( photon ) {
      self.activeMolecules.forEach( function( molecule ) {
        if ( molecule.queryAbsorbPhoton( photon ) ) {

          // the photon was absorbed, so put it on the removal list
          photonsToRemove.push( photon );
        }
      } );
      photon.step( dt );
    } );

    // Remove any photons that were marked for removal.
    this.photons.removeAll( photonsToRemove );
    for ( let i = 0; i < photonsToRemove.length; i++ ) {
      photonsToRemove[ i ].dispose();
    }
  },

  clearPhotons: function() {
    for ( let i = 0; i < this.photons.length; i++ ) {
      this.photons.get( i ).dispose();
    }
    this.photons.clear();
  },

  /**
   * Step the molecules one step in time.
   *
   * @param {number} dt - The incremental time step.
   */
  stepMolecules: function( dt ) {
    const moleculesToStep = this.activeMolecules.getArray().slice( 0 );
    for ( let molecule = 0; molecule < moleculesToStep.length; molecule++ ) {
      moleculesToStep[ molecule ].step( dt );
    }
  },

  /**
   * Step one frame manually.  Assuming 60 frames per second.
   */
  manualStep: function() {

    // Check if it is time to emit any photons.
    this.checkEmissionTimer( 1 / 60 );

    // Step the photons, marking and removing any that have moved beyond the model bounds.
    this.stepPhotons( 1 / 60 );

    // Step the molecules.
    this.stepMolecules( 1 / 60 );

    this.manualStepEmitter.emit();
  },

  /**
   * Cause a photon to be emitted from the emission point.  Emitted photons will travel toward the photon target,
   * which will decide whether a given photon should be absorbed.
   * @param advanceAmount - amount of time that the photon should be "advanced" from its starting location.  This
   * makes it possible to make the emission stream look more constant in cases where there was a long delay between
   * frames.
   */
  emitPhoton: function( advanceAmount ) {
    const photon = new Photon( this.photonWavelengthProperty.get(), this.photonGroupTandem.createNextTandem() );
    photon.locationProperty.set( new Vector2( PHOTON_EMISSION_LOCATION.x + PHOTON_VELOCITY * advanceAmount, PHOTON_EMISSION_LOCATION.y ) );
    const emissionAngle = 0; // Straight to the right.
    photon.setVelocity( PHOTON_VELOCITY * Math.cos( emissionAngle ), PHOTON_VELOCITY * Math.sin( emissionAngle ) );
    this.photons.add( photon );

    // indicate that a photon has been emitted from the initial emission point
    this.photonEmittedEmitter.emit( photon );
  },

  /**
   * Set the wavelength of the photon to be emitted if desired frequency is not equal to the current value.
   *
   * @param {number} freq
   */
  setEmittedPhotonWavelength: function( freq ) {
    if ( this.photonWavelengthProperty.get() !== freq ) {
      // Set the new value and send out notification of change to listeners.
      this.photonWavelengthProperty.set( freq );
    }
  },

  /**
   * Get the emission location for this photonAbsorptionModel.  Useful when other models need access to this position.
   *
   * @returns {Vector2}
   */
  getPhotonEmissionLocation: function() {
    return PHOTON_EMISSION_LOCATION;
  },

  /**
   * Set the emission period, i.e. the time between photons.
   *
   * @param {number} photonEmissionPeriod - Period between photons in milliseconds.
   */
  setPhotonEmissionPeriod: function( photonEmissionPeriod ) {

    assert && assert( photonEmissionPeriod >= 0 );
    if ( this.photonEmissionPeriodTarget !== photonEmissionPeriod ) {

      // If we are transitioning from off to on, set the countdown timer such that a photon will be emitted right away
      // so that the user doesn't have to wait too long in order to see something come out, but only if there
      // are no other photons in the observation window so we don't emit unlimitted photons when turning
      // on/off rapidly
      if ( this.photonEmissionPeriodTarget === Number.POSITIVE_INFINITY && photonEmissionPeriod !== Number.POSITIVE_INFINITY && this.photons.length === 0 ) {

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
  },

  /**
   * Update the active molecule to the current photon target.  Clear the old array of active molecules, create a new
   * molecule, and then add it to the active molecules array.  Add listeners to the molecule that check for when
   * the molecule should emit a photon or break apart into constituents.
   *
   * @param {PhotonTarget} photonTarget - The string constant which represents the desired photon target.
   * @param {Tandem} tandem
   */
  updateActiveMolecule: function( photonTarget, tandem ) {
    const self = this;

    this.activeMolecules.forEach( function( molecule ) { molecule.dispose(); } );

    // Remove the old photon target(s).
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
      assert && assert( false, 'unhandled photon target.' );

    this.targetMolecule = newMolecule;
    this.activeMolecules.add( newMolecule );

    // Set the photonGroupTandem so that photons created by the molecule can be registered for PhET-iO
    newMolecule.photonGroupTandem = this.photonGroupTandem;

    // Emit a new photon from this molecule after absorption.
    newMolecule.photonEmittedEmitter.addListener( function( photon ) {
      self.photons.add( photon );
    } );

    // Break apart into constituent molecules.
    newMolecule.brokeApartEmitter.addListener( function( constituentMolecule1, constituentMolecule2 ) {
      // Remove the molecule from the photonAbsorptionModel's list of active molecules.

      newMolecule.dispose();
      self.targetMolecule = null;

      self.activeMolecules.remove( newMolecule );
      // Add the constituent molecules to the photonAbsorptionModel.
      self.activeMolecules.add( constituentMolecule1 );
      self.activeMolecules.add( constituentMolecule2 );

    } );
  },

  /**
   * Get the active molecules in this photonAbsorption model.  Returns a new array object holding those molecules.
   *
   * @returns {Array.<Molecule>} activeMolecules
   */
  getMolecules: function() {
    return this.activeMolecules.getArray().slice( 0 );
  },

  /**
   * Returns true if this model still contains both of the constituent molecules provided after a break apart.
   * @public
   *
   * @param {Molecule} moleculeA
   * @param {Molecule} moleculeB
   * @returns {boolean}
   */
  hasBothConstituentMolecules( moleculeA, moleculeB ) {
    return this.activeMolecules.contains( moleculeA ) && this.activeMolecules.contains( moleculeB );
  },

  /**
   * This method restores the active molecule.  This may seem nonsensical, and in some cases it is, but it is useful
   * in cases where an atom has broken apart and needs to be restored to its original condition.
   */
  restoreActiveMolecule: function() {
    const currentTarget = this.photonTargetProperty.get();
    this.updateActiveMolecule( currentTarget, this.photonAbsorptionModel );
  }
} );