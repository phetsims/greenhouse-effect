//  Copyright 2002-2014, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  var Photon = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Photon' );
  var CO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO' );
  var N2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/N2' );
  var CO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO2' );
  var H2O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/H2O' );
  var NO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO2' );
  var O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );
  var O3 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O3' );
  var CH4 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CH4' );

  //----------------------------------------------------------------------------
  // Class Data
  //----------------------------------------------------------------------------
  // Constants that control where and how photons are emitted.
  var PHOTON_EMISSION_LOCATION = new Vector2( -2000, 0 );
  var PHOTON_EMISSION_ANGLE_RANGE = Math.PI / 2;

  // Velocity of emitted photons.  Since they are emitted horizontally, only one value is needed.
  var PHOTON_VELOCITY = 3.0;

  // Location used when a single molecule is sitting in the area where the
  // photons pass through.
  var SINGLE_MOLECULE_POSITION = new Vector2( 0, 0 );

  // Defaults for photon emission periods.
  var DEFAULT_PHOTON_EMISSION_PERIOD = Number.POSITIVE_INFINITY; // Milliseconds of sim time.

  // Default values for various parameters that weren't already covered.
  var DEFAULT_EMITTED_PHOTON_WAVELENGTH = WavelengthConstants.IR_WAVELENGTH;
  var INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED = 300;

  /**
   * Constructor for a photon absorption model.
   *
   * @param { Number } initialPhotonTarget - wavelength of the initial photon target.
   * @constructor
   */
  function PhotonAbsorptionModel( initialPhotonTarget ) {

    PropertySet.call( this, {
      emissionFrequency: 0,
      photonWavelength: WavelengthConstants.IR_WAVELENGTH,
      photonTarget: initialPhotonTarget,
      play: true // is the sim running or paused
    } );

    // Choices of targets for the photons.
    // We may not technically need these strings to be enumerated here and accessed in an array, but it serves as a
    // good point to document what all the possible types are.
    this.photonTargets = ['SINGLE_CO_MOLECULE', 'SINGLE_CO2_MOLECULE', 'SINGLE_H2O_MOLECULE', 'SINGLE_CH4_MOLECULE',
      'SINGLE_N2O_MOLECULE', 'SINGLE_N2_MOLECULE', 'SINGLE_NO2_MOLECULE', 'SINGLE_O2_MOLECULE', 'SINGLE_O3_MOLECULE',
      'CONFIGURABLE_ATMOSPHERE'];

    this.photons = new ObservableArray(); //Elements are of type Photon
    this.activeMolecules = new ObservableArray(); // Elements are of type Molecule.

    // The photon target is the thing that the photons are shot at, and based on its particular nature, it may or may
    // not absorb some of the photons.
    this.initialPhotonTarget = initialPhotonTarget;

    // Set the initial photon target to the molecule.
    this.setPhotonTarget( this.initialPhotonTarget );

    // Variables that control periodic photon emission.
    this.photonEmissionCountdownTimer = Number.POSITIVE_INFINITY;
    this.photonEmissionPeriodTarget = DEFAULT_PHOTON_EMISSION_PERIOD;
    this.previousEmissionAngle = 0;

    // Collection that contains the molecules that make up the configurable atmosphere.  Used in Greenhouse Gas
    // Simulation.
    this.configurableAtmosphereMolecules = []; // Elements are of type Molecule.

  }

  return inherit( PropertySet, PhotonAbsorptionModel, {

    /**
     * Reset the model to its initial state.
     */
    reset: function() {

      // Remove any photons that are currently in transit.
      this.removeAllPhotons();

      // Reset all active molecules, which will stop any vibrations.
      for ( var molecule = 0; molecule < this.activeMolecules.length; molecule++ ) {
        this.activeMolecules.get( molecule ).reset();
      }

      // Set default values.
      this.setPhotonTarget( this.initialPhotonTarget );
      this.setEmittedPhotonWavelength( DEFAULT_EMITTED_PHOTON_WAVELENGTH );
      this.setPhotonEmissionPeriod( DEFAULT_PHOTON_EMISSION_PERIOD );

      // Reset the configurable atmosphere.
      this.resetConfigurableAtmosphere();

      // Reset all associated properties.
      PropertySet.prototype.reset.call( this );

    },

    /**
     * Advance the molecules one step in time.  Called by the animation loop.
     *
     * @param {number} dt - The incremental time step.
     */
    step: function( dt ) {

      if ( this.play ) {

        // Check if it is time to emit any photons.
        this.checkEmissionTimer( dt );

        // Step the photons, marking and removing any that have moved beyond the model
        this.stepPhotons( dt );

        // Step the molecules.
        this.stepMolecules( dt );

      }
    },

    /**
     * Check if it is time to emit any photons from the photon emitter.
     *
     * @param { Number } dt - The incremental time step.
     */
    checkEmissionTimer: function( dt ) {

      dt *= 1000; // convert from milliseconds.
      if ( this.photonEmissionCountdownTimer !== Number.POSITIVE_INFINITY ) {
        this.photonEmissionCountdownTimer -= dt;
        if ( this.photonEmissionCountdownTimer <= 0 ) {
          // Time to emit.
          this.emitPhoton();
          this.photonEmissionCountdownTimer = this.photonEmissionPeriodTarget;
        }
      }
    },

    /**
     * Step the photons in time.
     *
     * @param { Number } dt - The incremental times step.
     */
    stepPhotons: function( dt ) {

      dt *= 1000; // convert from miliseconds.
      var photonsToRemove = [];
      for ( var photon = 0; photon < this.photons.length; photon++ ) {
        // See if any of the molecules wish to absorb this photon.
        for ( var molecule = 0; molecule < this.activeMolecules.length; molecule++ ) {
          if ( this.activeMolecules.get( molecule ).queryAbsorbPhoton( this.photons.get( photon ) ) ) {
            photonsToRemove.push( this.photons.get( photon ) );
          }
        }
        this.photons.get( photon ).step( dt );
      }
      // Remove any photons that were marked for removal.
      this.photons.removeAll( photonsToRemove );
    },

    /**
     * Step the molecules one step in time.
     *
     * @param { Number } dt - The incremental time step.
     */
    stepMolecules: function( dt ) {

      dt *= 1000; // convert from milliseconds.
      var moleculesToStep = this.activeMolecules.getArray().slice( 0 );
      for ( var molecule = 0; molecule < moleculesToStep.length; molecule++ ) {
        moleculesToStep[molecule].step( dt );
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
    },

    /**
     * Cause a photon to be emitted from the emission point.  Emitted photons will travel toward the photon target,
     * which will decide whether a given photon should be absorbed.
     */
    emitPhoton: function() {

      var photon = new Photon( this.photonWavelength );
      photon.setLocation( PHOTON_EMISSION_LOCATION.x, PHOTON_EMISSION_LOCATION.y );
      var emissionAngle = 0; // Straight to the right.
      if ( this.photonTargetProperty.get() === 'CONFIGURABLE_ATMOSPHERE' ) {
        // Photons can be emitted at an angle.  In order to get a more
        // even spread, we alternate emitting with an up or down angle.
        emissionAngle = Math.random() * PHOTON_EMISSION_ANGLE_RANGE / 2;
        if ( this.previousEmissionAngle > 0 ) {
          emissionAngle = -emissionAngle;
        }
        this.previousEmissionAngle = emissionAngle;
      }
      photon.setVelocity( PHOTON_VELOCITY * Math.cos( emissionAngle ),
          PHOTON_VELOCITY * Math.sin( emissionAngle ) );
      this.photons.add( photon );
    },

    /**
     * Set the wavelength of the photon to be emitted.
     *
     * @param {number} freq
     */
    setEmittedPhotonWavelength: function( freq ) {

      if ( this.photonWavelength !== freq ) {
        // Set the new value and send out notification of change to listeners.
        this.photonWavelength = freq;
      }
    },

    /**
     * Get the wavelength of the emitted photon.
     *
     * @returns {number}
     */
    getEmittedPhotonWavelength: function() {
      return this.photonWavelength;
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
        // so that the user doesn't have to wait too long in order to see something come out.
        if ( this.photonEmissionPeriodTarget === Number.POSITIVE_INFINITY && photonEmissionPeriod !== Number.POSITIVE_INFINITY ) {
          this.photonEmissionCountdownTimer = INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED;
        }
        // Handle the case where the new value is smaller than the current countdown value.
        else if ( photonEmissionPeriod < this.photonEmissionCountdownTimer ) {
          this.photonEmissionCountdownTimer = photonEmissionPeriod;
        }
        // If the new value is infinity, it means that emissions are being
        // turned off, so set the period to infinity right away.
        else if ( photonEmissionPeriod === Number.POSITIVE_INFINITY ) {
          this.photonEmissionCountdownTimer = photonEmissionPeriod; // Turn off emissions.
        }
        this.photonEmissionPeriodTarget = photonEmissionPeriod;
      }
    },

    /**
     * Get the current photon target.
     *
     * @returns {Property}
     */
    getPhotonTarget: function() {
      return this.photonTargetProperty.get();
    },

    /**
     * Get the period between photon emissions.
     *
     * @return {number} - Period between photons in milliseconds.
     */
    getPhotonEmissionPeriod: function() {
      return this.photonEmissionPeriodTarget;
    },

    /**
     * Set the current photon target, and remove the old value.
     *
     * @param {String} photonTarget - The string constant which represents the desired photon target.
     */
    setPhotonTarget: function( photonTarget ) {

      // If switching to the configurable atmosphere, photon emission is turned off (if it is happening).  This is done
      // because it just looks better.
      if ( photonTarget === "CONFIGURABLE_ATMOSPHERE" || this.photonTargetProperty.get() === "CONFIGURABLE_ATMOSPHERE" ) {
        this.setPhotonEmissionPeriod( Number.POSITIVE_INFINITY );
        this.removeAllPhotons();
      }

      // Update to the new value.
      this.photonTargetProperty.set( photonTarget );

      // Remove the old photon target(s).
      this.removeOldTarget();

      // Add the new photon target(s).
      var newMolecule = new Molecule( this );
      switch( photonTarget ) {
        case "SINGLE_CO_MOLECULE":
          newMolecule = new CO( this, {initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_CO2_MOLECULE":
          newMolecule = new CO2( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_H2O_MOLECULE":
          newMolecule = new H2O( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_CH4_MOLECULE":
          newMolecule = new CH4( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_N2_MOLECULE":
          newMolecule = new N2( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_O2_MOLECULE":
          newMolecule = new O2( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_O3_MOLECULE":
          newMolecule = new O3( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "SINGLE_NO2_MOLECULE":
          newMolecule = new NO2( this, { initialCenterOfGravityPos: SINGLE_MOLECULE_POSITION } );
          this.activeMolecules.add( newMolecule );
          break;

        case "CONFIGURABLE_ATMOSPHERE":
          // Add references for all the molecules in the configurable
          // atmosphere to the "active molecules" list.
          this.activeMolecules.addAll( this.configurableAtmosphereMolecules );
          break;

        default:
          console.error( "Error: Unhandled photon target." );
          break;
      }
    },

    /**
     * Get the active molecules in this photonAbsorption model.  Returns a new array object holding those molecules.
     *
     * @returns {Array} activeMolecules
     */
    getMolecules: function() {
      return this.activeMolecules.getArray().slice(0);
    },

    /**
     * Remove all photons in this PhotonAbsorptionModel
     */
    removeAllPhotons: function() {
      this.photons.clear();
    },

    /**
     * Remove the old photon target by clearing the array of active molecules in this PhotonAbsorptionModel.
     */
    removeOldTarget: function() {
      this.activeMolecules.clear(); // Clear the old active molecules array
    },

    /**
     * This method restores the photon target to whatever it is currently set to.  This may seem nonsensical, and in
     * some cases it is, but it is useful in cases where an atom has broken apart and needs to be restored to its
     * original condition.
     */
    restorePhotonTarget: function() {

      var currentTarget = this.photonTargetProperty.get();
      this.setPhotonTarget( currentTarget );
    },

    /**
     * Reset the configurable atmosphere by adding the initial levels of all gases.
     */
    resetConfigurableAtmosphere: function() {
      assert && assert( this.photonTargetProperty.get() !== 'CONFIGURABLE_ATMOSPHERE' );
    },

    /**
     * Get the initial starting position of a single molecule.
     *
     * @return {Array}
     */
    getSingleMoleculePosition: function() {
      return SINGLE_MOLECULE_POSITION;
    }

  } );
} );
