// Copyright 2014-2017, University of Colorado Boulder

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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var CO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO' );
  var CO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO2' );
  var H2O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/H2O' );
  var inherit = require( 'PHET_CORE/inherit' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var N2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/N2' );
  var NO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO2' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );
  var O3 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O3' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var ObservableArrayIO = require( 'AXON/ObservableArrayIO' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Photon = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Photon' );
  var PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2 = require( 'DOT/Vector2' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );

  // phet-io modules
  var MoleculeIO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/MoleculeIO' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );
  var PhotonAbsorptionModelIO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionModelIO' );
  var PhotonIO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonIO' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  // ------- constants -------------

  // constants that control where and how photons are emitted.
  var PHOTON_EMISSION_LOCATION = new Vector2( -2000, 0 );

  // Velocity of emitted photons.  Since they are emitted horizontally, only one value is needed.
  var PHOTON_VELOCITY = 3000; // picometers/second

  // Defaults for photon emission periods.
  var DEFAULT_PHOTON_EMISSION_PERIOD = Number.POSITIVE_INFINITY; // Milliseconds of sim time.

  // Default values for various parameters that weren't already covered.
  var DEFAULT_EMITTED_PHOTON_WAVELENGTH = WavelengthConstants.IR_WAVELENGTH;
  var INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED = 0.3; // seconds

  // Minimum for photon emission periods.
  var MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET = 0.4; // seconds

  /**
   * Constructor for a photon absorption model.
   *
   * @param {string} initialPhotonTarget - Initial molecule which the photon gets fired at.
   * @param {Tandem} tandem
   * @constructor
   */
  function PhotonAbsorptionModel( initialPhotonTarget, tandem ) {

    var self = this;

    this.photonAbsorptionModel = tandem; // @private

    // @private
    this.photonGroupTandem = tandem.createGroupTandem( 'photons' );

    // @public
    this.emissionFrequencyProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'emissionFrequencyProperty' ),
      units: 'hertz'
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

    this.photonTargetProperty = new Property( initialPhotonTarget, {
      tandem: tandem.createTandem( 'photonTargetProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    this.runningProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'runningProperty' )
    } );

    // @public
    this.photons = new ObservableArray( {
      tandem: tandem.createTandem( 'photons' ),
      phetioType: ObservableArrayIO( PhotonIO )
    } ); // Elements are of type Photon
    this.activeMolecules = new ObservableArray( {
      tandem: tandem.createTandem( 'molecules' ),
      phetioType: ObservableArrayIO( MoleculeIO )
    } ); // Elements are of type Molecule.

    // Link the model's active molecule to the photon target property.  Note that this wiring must be done after the
    // listeners for the activeMolecules observable array have been implemented.
    self.photonTargetProperty.link( function() {
      self.updateActiveMolecule( self.photonTargetProperty.get(), tandem );
    } );

    // Set the photon emission period from the emission frequency.
    this.emissionFrequencyProperty.link( function( emissionFrequency ) {
      if ( emissionFrequency === 0 ) {
        self.setPhotonEmissionPeriod( Number.POSITIVE_INFINITY );
      }
      else {
        var singleTargetPeriodFrequency = self.getSingleTargetPeriodFromFrequency( emissionFrequency );
        self.setPhotonEmissionPeriod( singleTargetPeriodFrequency );
      }
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

  return inherit( PhetioObject, PhotonAbsorptionModel, {

    /**
     * Reset the model to its initial state.
     */
    reset: function() {

      // Remove any photons that are currently in transit.
      this.photons.clear();

      // Reset all active molecules, which will stop any vibrations.
      for ( var molecule = 0; molecule < this.activeMolecules.length; molecule++ ) {
        this.activeMolecules.get( molecule ).reset();
      }

      // Set default values.
      this.photonTargetProperty.reset();
      this.setEmittedPhotonWavelength( DEFAULT_EMITTED_PHOTON_WAVELENGTH );
      this.setPhotonEmissionPeriod( DEFAULT_PHOTON_EMISSION_PERIOD );

      // Reset all associated properties.
      this.emissionFrequencyProperty.reset();
      this.photonWavelengthProperty.reset();
      this.runningProperty.reset();
      this.photonTargetProperty.reset();
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
     * Step the photons in time.
     *
     * @param {number} dt - the incremental times step, in seconds
     */
    stepPhotons: function( dt ) {
      var self = this;
      var photonsToRemove = [];

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
      for ( var i = 0; i < photonsToRemove.length; i++ ) {
        photonsToRemove[ i ].dispose();
      }
    },

    clearPhotons: function() {
      for ( var i = 0; i < this.photons.length; i++ ) {
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

      var moleculesToStep = this.activeMolecules.getArray().slice( 0 );
      for ( var molecule = 0; molecule < moleculesToStep.length; molecule++ ) {
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
    },

    /**
     * Cause a photon to be emitted from the emission point.  Emitted photons will travel toward the photon target,
     * which will decide whether a given photon should be absorbed.
     * @param advanceAmount - amount of time that the photon should be "advanced" from its starting location.  This
     * makes it possible to make the emission stream look more constant in cases where there was a long delay between
     * frames.
     */
    emitPhoton: function( advanceAmount ) {
      var photon = new Photon( this.photonWavelengthProperty.get(), this.photonGroupTandem.createNextTandem() );
      photon.locationProperty.set( new Vector2( PHOTON_EMISSION_LOCATION.x + PHOTON_VELOCITY * advanceAmount, PHOTON_EMISSION_LOCATION.y ) );
      var emissionAngle = 0; // Straight to the right.
      photon.setVelocity( PHOTON_VELOCITY * Math.cos( emissionAngle ), PHOTON_VELOCITY * Math.sin( emissionAngle ) );
      this.photons.add( photon );
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
     * Map the emission frequency to emission period.
     *
     * @param {number} emissionFrequency
     * @returns {number}
     */
    getSingleTargetPeriodFromFrequency: function( emissionFrequency ) {
      return MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET / emissionFrequency;
    },

    /**
     * Map the emission period to emission frequency for this photon emission period target.
     *
     * @returns {number}
     */
    getSingleTargetFrequencyFromPeriod: function() {
      return MIN_PHOTON_EMISSION_PERIOD_SINGLE_TARGET / this.photonEmissionPeriodTarget;
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
     * Update the active molecule to the current photon target.  Clear the old array of active molecules, create a new
     * molecule, and then add it to the active molecules array.  Add listeners to the molecule that check for when
     * the molecule should emit a photon or break apart into constituents.
     *
     * @param {string} photonTarget - The string constant which represents the desired photon target.
     * @param {Tandem} tandem
     */
    updateActiveMolecule: function( photonTarget, tandem ) {

      var self = this;

      this.activeMolecules.forEach( function( molecule ) { molecule.dispose(); } );

      // Remove the old photon target(s).
      this.activeMolecules.clear(); // Clear the old active molecules array

      // Add the new photon target(s).
      var newMolecule;
      switch( photonTarget ) {
        case PhotonTarget.SINGLE_CO_MOLECULE:
          newMolecule = new CO( { tandem: tandem.createTandem( 'CO' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        case PhotonTarget.SINGLE_CO2_MOLECULE:
          newMolecule = new CO2( { tandem: tandem.createTandem( 'CO2' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        case PhotonTarget.SINGLE_H2O_MOLECULE:
          newMolecule = new H2O( { tandem: tandem.createTandem( 'H2O' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        case PhotonTarget.SINGLE_N2_MOLECULE:
          newMolecule = new N2( { tandem: tandem.createTandem( 'N2' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        case PhotonTarget.SINGLE_O2_MOLECULE:
          newMolecule = new O2( { tandem: tandem.createTandem( 'O2' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        case PhotonTarget.SINGLE_O3_MOLECULE:
          newMolecule = new O3( { tandem: tandem.createTandem( 'O3' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        case PhotonTarget.SINGLE_NO2_MOLECULE:
          newMolecule = new NO2( { tandem: tandem.createTandem( 'NO2' ) } );
          this.activeMolecules.add( newMolecule );
          break;

        default:
          throw new Error( 'Error: Unhandled photon target.' );
      }

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
     * This method restores the active molecule.  This may seem nonsensical, and in some cases it is, but it is useful
     * in cases where an atom has broken apart and needs to be restored to its original condition.
     */
    restoreActiveMolecule: function() {
      var currentTarget = this.photonTargetProperty.get();
      this.updateActiveMolecule( currentTarget, this.photonAbsorptionModel );
    }
  } );
} );

