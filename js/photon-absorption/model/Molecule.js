//  Copyright 2002-2014, University of Colorado

/**
 * A model for a particular molecule.  This, by its nature, is essentially a composition of other objects, generally
 * atoms and atomic bonds.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NullPhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/NullPhotonAbsorptionStrategy' );
  var Photon = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Photon' );
  var PropertySet = require( 'AXON/PropertySet' );

  //------------------------------------------------------------------------
  // Class Data
  //------------------------------------------------------------------------
  var PHOTON_EMISSION_SPEED = 3; // Picometers per second.
  var PHOTON_ABSORPTION_DISTANCE = 100; // Distance where the molecule begins to query photon for absorption.
  var VIBRATION_FREQUENCY = 5;  // Cycles per second of sim time.
  var ROTATION_RATE = 1.1;  // Revolutions per second of sim time.
  var ABSORPTION_HYSTERESIS_TIME = 200; // Milliseconds of sim time.
  var PASS_THROUGH_PHOTON_LIST_SIZE = 10; // Size of list which tracks photons not absorbed due to random probability.

  /**
   * Constructor for a molecule.
   *
   * @param { PhotonAbsorptionModel } model - The model which will add this molecule to its observable array.
   * @constructor
   */
  function Molecule( model ) {

    PropertySet.call( this, {
      emittedPhoton: null,
      highElectronicEnergyState: false,
      centerOfGravity: new Vector2( 0, 0 )
    } );

    // Atoms and bonds that form this molecule.
    this.atoms = []; // Elements are of type Atoms
    this.atomicBonds = []; // Elements are of type AtomicBonds

    // Structure of the molecule in terms of offsets from the center of gravity.  These indicate the atom's position in
    // the "relaxed" (i.e. non-vibrating), non-rotated state.
    this.initialAtomCogOffsets = {}; // Object contains keys of the atom's uniqueID and values of type Vector2

    // Vibration offsets - these represent the amount of deviation from the initial (a.k.a relaxed) configuration for
    // each molecule.
    this.vibrationAtomOffsets = {}; // Object contains keys of the atom's uniqueID and values of type Vector2

    //  Map containing the atoms which compose this molecule.  Allows us to call on each atom by their unique ID.
    this.atomsByID = {};  // Objects contains keys of the atom's uniqueID, and values of type atom.

    // Velocity for this molecule.
    this.velocity = new Vector2();

    // Map that matches photon wavelengths to photon absorption strategies. The strategies contained in this structure
    // define whether the molecule can absorb a given photon and, if it does absorb it, how it will react.
    this.mapWavelengthToAbsorptionStrategy = {}; // Object will contain keys of type Number and values of type PhotonAbsorptionStrategy

    // Currently active photon absorption strategy, active because a photon was absorbed that activated it.
    this.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this );

    // Variable that prevents reabsorption for a while after emitting a photon.
    this.absorbtionHysteresisCountdownTime = 0;

    // The "pass through photon list" keeps track of photons that were not absorbed due to random probability
    // (essentially a simulation of quantum properties).  This is needed since the absorption of a given photon will
    // likely be tested at many time steps as the photon moves past the molecule, and we don't want to keep deciding
    // about the same photon.
    this.passThroughPhotonList = []; // Array will have size PASS_THROUGH_PHOTON_LIST_SIZE with type Photon.

    // The current point within this molecule's vibration sequence.
    this.currentVibrationRadians = 0;

    // The amount of rotation currently applied to this molecule.  This is relative to its original, non-rotated state.
    this.currentRotationRadians = 0;

    // Boolean values that track whether the molecule is vibrating or rotating.
    this.vibrating = false;
    this.rotating = false;
    this.rotationDirectionClockwise = true; // Controls the direction of rotation.

    // List of constituent molecules. This comes into play only when the molecule breaks apart, which many of the
    // molecules never do.
    this.constituentMolecules = []; // Elements of type Molecule

    this.photonAbsorptionModel = model;

  }

  return inherit( PropertySet, Molecule, {
    /**
     * Reset the molecule.  Any photons that have been absorbed are forgotten, and any vibration is reset.
     **/
    reset: function() {

      this.activePhotonAbsorptionStrategy.reset();
      this.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this );
      this.absorbtionHysteresisCountdownTime = 0;
      this.setVibrating( false );
      this.setVibration( 0 );
      this.setRotating( false );
      this.setRotation( 0 );

    },

    setPhotonAbsorptionStrategy: function( wavelength, strategy ) {
      this.mapWavelengthToAbsorptionStrategy[ wavelength ] = strategy;
    },

    /**
     * Checks to see if a photon has been absorbed.
     *
     * @return {boolean}
     */
    isPhotonAbsorbed: function() {
      // If there is an active non-null photon absorption strategy, it indicates that a photon has been absorbed.
      return !( this.activePhotonAbsorptionStrategy instanceof NullPhotonAbsorptionStrategy );
    },

    /**
     * Add an initial offset from the molecule's Center of Gravity (COG). The offset is "initial" because this is where
     * the atom should be when it is not vibrating or rotating.
     *
     * @param {Atom || CarbonAtom || HydrogenAtom || NitrogenAtom || OxygenAtom} atom
     * @param {Vector2} offset - Initial COG offset for when atom is not vibrating or rotating.
     */
    addInitialAtomCogOffset: function( atom, offset ) {
      // Check that the specified atom is a part of this molecule.  While it would probably work to add the offsets
      // first and the atoms later, that's not how the sim was designed, so this is some enforcement of the "add the
      // atoms first" policy.
      assert && assert( this.atoms.indexOf( atom ) >= 0 );
      this.initialAtomCogOffsets[ atom.uniqueID ] = offset;
    },

    /**
     * Get the initial offset from the molecule's center of gravity (COG) for the specified atom.
     *
     * @param {Atom} atom
     * @return {Vector2}
     **/
    getInitialAtomCogOffset: function( atom ) {
      if ( !(atom.uniqueID in this.initialAtomCogOffsets) ) {
        console.log( " - Warning: Attempt to get initial COG offset for atom that is not in molecule." );
      }
      return this.initialAtomCogOffsets[atom.uniqueID];
    },

    /**
     * Get the current vibration offset from the molecule's center of gravity (COG) for the specified molecule.
     *
     * @param {Atom} atom
     * @return {Vector2} - Vector representing location of vibration offset from molecule's center of gravity.
     */
    getVibrationAtomOffset: function( atom ) {
      if ( !(atom.uniqueID in this.vibrationAtomOffsets) ) {
        console.log( " - Warning: Attempt to get vibrational COG offset for atom that is not in molecule." );
      }
      return this.vibrationAtomOffsets[atom.uniqueID];
    },

    /**
     * Add a "constituent molecule" to this molecule's list.  Constituent molecules are what this molecule will break
     * into if it breaks apart. Note that this does NOT check for any sort of conservation of atoms, so use this
     * carefully or weird break apart behaviors could result.
     *
     * @param {Molecule} molecule
     **/
    addConstituentMolecule: function( molecule ) {
      this.constituentMolecules.push( molecule );
    },

    /**
     * Determine if the molecule is currently vibrating.
     *
     * @return {boolean} vibrating
     */
    isVibrating: function() {
      return this.vibrating;
    },

    /**
     * Advance the molecule one step in time.
     *
     * @param {number} dt - The change in time.
     **/
    step: function( dt ) {
      this.activePhotonAbsorptionStrategy.step( dt );

      if ( this.absorbtionHysteresisCountdownTime >= 0 ) {
        this.absorbtionHysteresisCountdownTime -= dt;
      }

      if ( this.vibrating ) {
        this.advanceVibration( dt * VIBRATION_FREQUENCY / 1000 * 2 * Math.PI );
      }

      if ( this.rotating ) {
        var directionMultiplier = this.rotationDirectionClockwise ? -1 : 1;
        this.rotate( dt * ROTATION_RATE / 1000 * 2 * Math.PI * directionMultiplier );
      }

      // Do any linear movement that is required.
      this.setCenterOfGravityPosVec( this.getDestination( this.centerOfGravityProperty.get() ) );
      this.setCenterOfGravityPos( this.centerOfGravityProperty.get().x + this.velocity.x * dt, this.centerOfGravityProperty.get().y + this.velocity.y * dt );
    },

    /**
     * Set the molecule state to vibrating.
     *
     * @param {boolean} vibration
     **/
    setVibrating: function( vibration ) {
      this.vibrating = vibration;
    },

    /**
     * Determine if this molecule is currently rotating.
     *
     * @return {boolean}
     **/
    isRotating: function() {
      return this.rotating;
    },

    /**
     * Set the current molecule state to rotating.
     *
     * @param {boolean} rotating
     **/
    setRotating: function( rotating ) {
      this.rotating = rotating;
    },

    /**
     * Set the molecule rotation direction to Clockwise.
     *
     * @param {boolean} rotationDirectionClockwise
     **/
    setRotationDirectionClockwise: function( rotationDirectionClockwise ) {
      this.rotationDirectionClockwise = rotationDirectionClockwise;
    },

    /**
     * Create a new Vector2 describing the location of this molecules center of gravity.
     *
     * @return {Vector2}
     **/
    getCenterOfGravityPos: function() {
      return new Vector2( this.centerOfGravityProperty.get().x, this.centerOfGravityProperty.get().y );
    },

    /**
     * Get the location of this molecules center of gravity.
     *
     * @return {Vector2} - centerOfGravity
     **/
    getCenterOfGravityPosRef: function() {
      return this.centerOfGravityProperty.get();
    },

    /**
     * Set the location of this molecule by specifying the center of gravity.  This will be unique to each molecule's
     * configuration, and it will cause the individual molecules to be located such that the center of gravity is in
     * the specified location.  The relative orientation of the atoms that comprise the molecules will not be changed.
     *
     * @param {number} x - the x location to set
     * @param {number} y - the y location to set
     **/
    setCenterOfGravityPos: function( x, y ) {
      if ( this.centerOfGravityProperty.get().x !== x || this.centerOfGravityProperty.get().y !== y ) {
        this.centerOfGravityProperty.set( new Vector2( x, y ) );
        this.updateAtomPositions();
      }
    },

    /**
     * Set the location of this molecule by specifying the center of gravity. Allows passing a Vector2 into
     * setCenterOfGravityPos.
     *
     * @param {Vector2} centerOfGravityPos - A vector representing the desired location for this molecule.
     **/
    setCenterOfGravityPosVec: function( centerOfGravityPos ) {
      this.setCenterOfGravityPos( centerOfGravityPos.x, centerOfGravityPos.y );
    },

    /**
     * Set the angle, in terms of radians from 0 to 2*PI, where this molecule is in its vibration cycle.
     *
     * @param {number} vibrationRadians - The angle describing where this molecule is in its vibration.
     **/
    setVibration: function( vibrationRadians ) {
      this.currentVibrationRadians = vibrationRadians;
    },

    /**
     * Advance the vibration by the prescribed radians.
     *
     * @param {number} deltaRadians - Change of vibration angle in radians.
     **/
    advanceVibration: function( deltaRadians ) {
      this.currentVibrationRadians += deltaRadians;
      this.setVibration( this.currentVibrationRadians );
    },

    /**
     * Rotate the molecule about the center of gravity by the specified number of radians.
     *
     * @param {number} deltaRadians - Change in radians of the Molecule's angle about the center of Gravity.
     **/
    rotate: function( deltaRadians ) {
      this.setRotation( ( this.currentRotationRadians + deltaRadians ) % ( Math.PI * 2 ) );
    },

    /**
     * Set the rotation angle of the Molecule in radians.
     *
     * @param {number} radians
     **/
    setRotation: function( radians ) {
      if ( radians !== this.currentRotationRadians ) {
        this.currentRotationRadians = radians;
        this.updateAtomPositions();
      }
    },

    /**
     * Get this Molecule's current rotation angle in Radians.
     *
     * @return {number} currentRotationRadians - The current angle of rotation.
     **/
    getRotation: function() {
      return this.currentRotationRadians;
    },

    /**
     * Enable/disable a molecule's high electronic energy state, which in the real world is a state where one or more
     * electrons has moved to a higher orbit.  In this simulation, it is generally depicted by having the molecule
     * appear to glow.
     *
     * @param {boolean} highElectronicEnergyState
     **/
    setHighElectronicEnergyState: function( highElectronicEnergyState ) {
      this.highElectronicEnergyStateProperty.set( highElectronicEnergyState );
    },

    /**
     * Determine if the Molecule is in a high energy state.
     *
     * @return {boolean} highElectronEnergyState
     **/
    isHighElectronicEnergyState: function() {
      return this.highElectronicEnergyStateProperty.get();
    },

    /**
     * Cause the molecule to dissociate, i.e. to break apart.
     **/
    breakApart: function() {
      console.error( " Error: breakApart invoked on a molecule for which the action is not implemented." );
      assert && assert( false );
    },

    /**
     * Mark a photon for passing through the molecule.  This means that the photon will not interact with the molecule.
     *
     * @param {Photon} photon - The photon to be passed through.
     **/
    markPhotonForPassThrough: function( photon ) {
      if ( this.passThroughPhotonList.length >= PASS_THROUGH_PHOTON_LIST_SIZE ) {
        // Make room for this photon be deleting the oldest one.
        this.passThroughPhotonList.shift();
      }
      this.passThroughPhotonList.push( photon );
    },

    /**
     * Determine if a photon is marked to be passed through this molecule.
     *
     * @param {Photon} photon
     * @return {boolean}
     **/
    isPhotonMarkedForPassThrough: function( photon ) {
      // Use indexOf to see if the photon exists in the list.
      return this.passThroughPhotonList.indexOf( photon ) > -1;
    },

    /**
     * Create a new array containing the atoms which compose this molecule.
     *
     * @return {Array} - Array with elements of type Atom containing the atoms which compose this molecule.
     **/
    getAtoms: function() {
      return this.atoms.slice( 0 );
    },

    /**
     * Create a new array containing this Molecules atomic bonds.
     *
     * @return {Array} - Array with elements of type AtomicBond containing the atomic bonds constructing this molecule.
     **/
    getAtomicBonds: function() {
      return this.atomicBonds.slice();
    },

    /**
     * Decide whether or not to absorb the offered photon.  If the photon is absorbed, the matching absorption strategy
     * is set so that it can control the molecule's post-absorption behavior.
     *
     * @param {Photon} photon - The photon offered for absorption.
     * @return {boolean} absorbPhoton
     **/
    queryAbsorbPhoton: function( photon ) {

      var absorbPhoton = false;

      if ( !this.isPhotonAbsorbed() &&
           this.absorbtionHysteresisCountdownTime <= 0 &&
           photon.getLocation().distance( this.getCenterOfGravityPos() ) < PHOTON_ABSORPTION_DISTANCE && !this.isPhotonMarkedForPassThrough( photon ) ) {

        // The circumstances for absorption are correct, but do we have an absorption strategy for this photon's
        // wavelength?
        var candidateAbsorptionStrategy = this.mapWavelengthToAbsorptionStrategy[ photon.getWavelength() ];
        if ( typeof candidateAbsorptionStrategy !== "undefined" ) {
          // Yes, there is a strategy available for this wavelength.
          // Ask it if it wants the photon.
          if ( candidateAbsorptionStrategy.queryAndAbsorbPhoton( photon ) ) {
            // It does want it, so consider the photon absorbed.
            absorbPhoton = true;
            this.activePhotonAbsorptionStrategy = candidateAbsorptionStrategy;
            this.activePhotonAbsorptionStrategy.queryAndAbsorbPhoton( photon );
          }
          else {
            // We have the decision logic once for whether a photon should be absorbed, so it is not queried a second
            // time.
            this.markPhotonForPassThrough( photon );
          }
        }
      }

      return absorbPhoton;
    },

    /**
     * Set the photon absorption strategy for this molecule.
     *
     * @param {PhotonAbsorptionStrategy} activeStrategy - The strategy to be set.
     **/
    setActiveStrategy: function( activeStrategy ) {
      this.activePhotonAbsorptionStrategy = activeStrategy;
    },

    /**
     * Add an atom to the list of atoms which compose this molecule.
     *
     * @param {Atom} atom - The atom to be added
     **/
    addAtom: function( atom ) {
      this.atoms.push( atom );
      this.initialAtomCogOffsets[atom.uniqueID] = new Vector2( 0, 0 );
      this.vibrationAtomOffsets[atom.uniqueID] = new Vector2( 0, 0 );
      this.atomsByID[atom.uniqueID] = atom;
    },

    /**
     * Add an atomic bond to this Molecule's list of atomic bonds.
     *
     * @param {AtomicBond} atomicBond - The atomic bond to be added.
     **/
    addAtomicBond: function( atomicBond ) {
      this.atomicBonds.push( atomicBond );
    },

    /**
     * Emit the specified photon in a random direction
     *
     * @param {Photon} photonToEmit - The photon to be emitted.
     **/
    emitPhoton: function( photonToEmit ) {

      var emissionAngle = Math.random() * Math.PI * 2;
      photonToEmit.setVelocity( PHOTON_EMISSION_SPEED * Math.cos( emissionAngle ),
        ( PHOTON_EMISSION_SPEED * Math.sin( emissionAngle ) ) );
      var centerOfGravityPosRef = this.getCenterOfGravityPosRef();
      photonToEmit.setLocation( centerOfGravityPosRef.x, centerOfGravityPosRef.y );
      this.emittedPhotonProperty.set( photonToEmit );
      this.absorbtionHysteresisCountdownTime = ABSORPTION_HYSTERESIS_TIME;
      this.notifyPhotonEmitted( photonToEmit, this.photonAbsorptionModel );

    },

    /**
     * Cause the atom to emit a photon of the specified wavelength.
     *
     * @param {number} wavelength
     **/
    emitNewPhoton: function( wavelength ) {
      this.emitPhoton( new Photon( wavelength ) );
    },

    /**
     * Update the positions of all atoms that comprise this molecule based on the current center of gravity and the
     * offset for each atom.
     **/
    updateAtomPositions: function() {

      for ( var uniqueID in this.initialAtomCogOffsets ) {
        if ( this.initialAtomCogOffsets.hasOwnProperty( uniqueID ) ) {
          var atomOffset = new Vector2( this.initialAtomCogOffsets[uniqueID].x, this.initialAtomCogOffsets[uniqueID].y );
          // Add the vibration, if any exists.
          atomOffset.add( this.vibrationAtomOffsets[uniqueID] );
          // Rotate.
          atomOffset.rotate( this.currentRotationRadians );
          // Set location based on combination of offset and current center
          // of gravity.
          this.atomsByID[uniqueID].positionProperty.set( new Vector2( this.centerOfGravityProperty.get().x + atomOffset.x, this.centerOfGravityProperty.get().y + atomOffset.y ) );
        }
      }
    },

    /**
     * Set the velocity of this molecule from vector components.
     *
     * @param {number} vx - The x component of the velocity vector.
     * @param {number} vy - The y component of the velocity vector.
     **/
    setVelocity: function( vx, vy ) {
      this.setVelocityVec( new Vector2( vx, vy ) );
    },

    /**
     * Set the velocity of this molecule from a velocity vector.
     *
     * @param {Vector2} newVelocity - The velocity vector representing this molecules velocity.
     **/
    setVelocityVec: function( newVelocity ) {
      this.velocity.set( newVelocity );
    },

    /**
     * Get a the velocity vector of this molecule.
     *
     * @return {Vector2} velocity - The velocity vector of this molecule.
     */
    getVelocity: function() {
      return this.velocity;
    },

    /**
     * Notify the event listener that a photon has been emitted from this molecule by adding the photon to the photons
     * observable array.
     *
     * @param {Photon} photon - The emitted photon
     * @param {PhotonAbsorptionModel} model - The model which gets the notification.
     */
    notifyPhotonEmitted: function( photon, model ) {
      model.photons.add( photon );
    },

    /**
     * Initialize the offsets from the center of gravity for each atom within this molecule.  This should be in the
     * "relaxed" (i.e. non-vibrating) state.
     */
    initializeAtomOffsets: function() {
      throw new Error( 'initializeAtomOffsets should be implemented in descendant molecules.' );
    },

    getBreakApartConstituents: function() {
      return this.constituentMolecules;
    },

    /**
     * Get the instantaneous position destination of this molecule as a vector.
     *
     * @param {Vector2} startPt - The initial position of the object.
     * @return {Vector2} - The instantaneous destination of this object as a vector.
     */
    getDestination: function( startPt ) {
      return startPt.plus( this.velocity );
    }

  } );
} );
