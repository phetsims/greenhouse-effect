// Copyright 2014-2020, University of Colorado Boulder

/**
 * Base type for molecules.  This, by its nature, is essentially a composition of other objects, generally atoms and
 * atomic bonds.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  const AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const NullPhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/NullPhotonAbsorptionStrategy' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Photon = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Photon' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // constants
  const PHOTON_EMISSION_SPEED = 3000; // Picometers per second.
  const PHOTON_ABSORPTION_DISTANCE = 100; // Distance where the molecule begins to query photon for absorption.
  const VIBRATION_FREQUENCY = 5;  // Cycles per second of sim time.
  const ROTATION_RATE = 1.1;  // Revolutions per second of sim time.
  const ABSORPTION_HYSTERESIS_TIME = 0.2; // seconds
  const PASS_THROUGH_PHOTON_LIST_SIZE = 10; // Size of list which tracks photons not absorbed due to random probability.

  // utility method used for serialization
  function serializeArray( array ) {
    const serializedArray = [];
    array.forEach( function( arrayElement ) {
      serializedArray.push( arrayElement.toStateObject() );
    } );
    return serializedArray;
  }

  // utility method for finding atom with the specified ID in a list
  function findAtomWithID( atomArray, id ) {
    for ( let i = 0; i < atomArray.length; i++ ) {
      if ( atomArray[ i ].uniqueID === id ) {
        return atomArray[ i ];
      }
    }

    // ID not found
    return null;
  }

  /**
   * Constructor for a molecule.
   *
   * @param {Object} options
   * @constructor
   */
  function Molecule( options ) {

    options = merge( {
      initialPosition: Vector2.ZERO,
      isForIcon: false,
      tandem: Tandem.OPTIONAL // not needed when part of the selection radio buttons.
    }, options );

    // TODO: Instrument using PhetioGroup, see https://github.com/phetsims/tandem/issues/87
    options.tandem = Tandem.OPTIONAL;

    this.highElectronicEnergyStateProperty = new BooleanProperty( false, !options.isForIcon ? {
      tandem: options.tandem.createTandem( 'highElectronicEnergyStateProperty' ), // Instrumentation requested in https://github.com/phetsims/phet-io-wrappers/issues/53
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } : {} );

    // TODO: visibility annotation
    this.centerOfGravityProperty = new Vector2Property( options.initialPosition );

    // Atoms and bonds that form this molecule.
    this.atoms = []; // @private Elements are of type Atoms
    this.atomicBonds = []; // @private Elements are of type AtomicBonds

    // Structure of the molecule in terms of offsets from the center of gravity.  These indicate the atom's position in
    // the "relaxed" (i.e. non-vibrating), non-rotated state.
    this.initialAtomCogOffsets = {}; // @private Object contains keys of the atom's uniqueID and values of type Vector2

    // Vibration offsets - these represent the amount of deviation from the initial (a.k.a relaxed) configuration for
    // each molecule.
    this.vibrationAtomOffsets = {}; // @private Object contains keys of the atom's uniqueID and values of type Vector2

    //  Map containing the atoms which compose this molecule.  Allows us to call on each atom by their unique ID.
    this.atomsByID = {};  // @private Objects contains keys of the atom's uniqueID, and values of type atom.

    // @public Velocity for this molecule.
    this.velocity = new Vector2( 0, 0 );

    // Map that matches photon wavelengths to photon absorption strategies. The strategies contained in this structure
    // define whether the molecule can absorb a given photon and, if it does absorb it, how it will react.
    // Object will contain keys of type Number and values of type PhotonAbsorptionStrategy
    this.mapWavelengthToAbsorptionStrategy = {}; // @private

    // Currently active photon absorption strategy, active because a photon was absorbed that activated it.
    // @public
    this.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this );

    // Variable that prevents reabsorption for a while after emitting a photon.
    // @private
    this.absorptionHysteresisCountdownTime = 0;

    // The "pass through photon list" keeps track of photons that were not absorbed due to random probability
    // (essentially a simulation of quantum properties).  If this molecule has no absorption strategy for the photon,
    // it is also added to this list. This is needed since the absorption of a given photon will likely be tested at
    // many time steps as the photon moves past the molecule, and we don't want to keep deciding about the same photon.
    // Array will have size PASS_THROUGH_PHOTON_LIST_SIZE with type Photon.
    // @private
    this.passThroughPhotonList = [];

    // @public {NumberProperty} - The current point within this molecule's vibration sequence.
    this.currentVibrationRadiansProperty = new NumberProperty( 0 );

    // The amount of rotation currently applied to this molecule.  This is relative to its original, non-rotated state.
    this.currentRotationRadians = 0; // @public

    // @public - Boolean values that track whether the molecule is vibrating or rotating.
    this.vibratingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'vibratingProperty' ),
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } );
    this.rotatingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'rotatingProperty' ),
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } );

    // Controls the direction of rotation.
    this.rotationDirectionClockwiseProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'rotationDirectionClockwiseProperty' ),
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } );

    // @public {DerivedProperty.<boolean>} - whether or not the molecule is "stretching" or "contracting" in its vibration.
    this.isStretchingProperty = new DerivedProperty( [ this.currentVibrationRadiansProperty ], vibrationRadians => {

      // more displacement with -sin( vibrationRadians ) and so when the slope of that function is negative
      // (derivative of sin is cos) the atoms are expanding
      return Math.cos( vibrationRadians ) < 0;
    } );

    // @public, set by PhotonAbsorptionModel
    this.photonGroupTandem = null;

    // @public (read-only) {Emitter} - emitter for when a photon is absorbed
    this.photonAbsorbedEmitter = new Emitter( { parameters: [ { valueType: Photon } ] } );

    // @public (read-only) {Emitter} - emitter for when a photon is emitted
    this.photonEmittedEmitter = new Emitter( { parameters: [ { valueType: Photon } ] } );

    // @public {Emitter} - emitter for when a photon passes through the molecule without absorptions
    this.photonPassedThroughEmitter =  new Emitter( { parameters: [ { valueType: Photon } ] } );

    // @public Emitter for 'brokeApart' event, when a molecule breaks into two new molecules
    this.brokeApartEmitter = new Emitter( {
      parameters: [
        { valueType: Molecule },
        { valueType: Molecule }
      ]
    } );
  }

  moleculesAndLight.register( 'Molecule', Molecule );

  return inherit( Object, Molecule, {
    /**
     * Reset the molecule.  Any photons that have been absorbed are forgotten, and any vibration is reset.
     **/
    reset: function() {
      this.highElectronicEnergyStateProperty.reset();
      this.centerOfGravityProperty.reset();
      this.activePhotonAbsorptionStrategy.reset();
      this.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this );
      this.absorptionHysteresisCountdownTime = 0;
      this.vibratingProperty.reset();
      this.rotatingProperty.reset();
      this.rotationDirectionClockwiseProperty.reset();
      this.setRotation( 0 );
      this.setVibration( 0 );
    },

    /**
     * These properties are owned by this molecule so they can be disposed directly.
     * @public
     */
    dispose: function() {
      this.vibratingProperty.dispose();
      this.rotatingProperty.dispose();
      this.rotationDirectionClockwiseProperty.dispose();
      this.highElectronicEnergyStateProperty.dispose();
      this.photonEmittedEmitter.dispose();
      this.photonPassedThroughEmitter.dispose();
    },

    /**
     * Set the photon absorption strategy for this molecule for a given photon wavelength.
     *
     * @param {number} wavelength - wavelength attributed to this absorption strategy.
     * @param {PhotonAbsorptionStrategy} strategy
     */
    setPhotonAbsorptionStrategy: function( wavelength, strategy ) {
      this.mapWavelengthToAbsorptionStrategy[ wavelength ] = strategy;
    },

    /**
     * Checks to see if a photon has been absorbed.
     *
     * @returns {boolean}
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
     * @returns {Vector2}
     **/
    getInitialAtomCogOffset: function( atom ) {
      if ( !( atom.uniqueID in this.initialAtomCogOffsets ) ) {
        console.log( ' - Warning: Attempt to get initial COG offset for atom that is not in molecule.' );
      }
      return this.initialAtomCogOffsets[ atom.uniqueID ];
    },

    /**
     * Get the current vibration offset from the molecule's center of gravity (COG) for the specified molecule.
     *
     * @param {Atom} atom
     * @returns {Vector2} - Vector representing location of vibration offset from molecule's center of gravity.
     */
    getVibrationAtomOffset: function( atom ) {
      if ( !( atom.uniqueID in this.vibrationAtomOffsets ) ) {
        console.log( ' - Warning: Attempt to get vibrational COG offset for atom that is not in molecule.' );
      }
      return this.vibrationAtomOffsets[ atom.uniqueID ];
    },

    /**
     * Advance the molecule one step in time.
     *
     * @param {number} dt - delta time, in seconds
     **/
    step: function( dt ) {
      this.activePhotonAbsorptionStrategy.step( dt );

      // Not equal to zero, because that case is covered when checking to emit the photon.
      if ( this.absorptionHysteresisCountdownTime > 0 ) {
        this.absorptionHysteresisCountdownTime -= dt;
      }

      if ( this.vibratingProperty.get() ) {
        this.advanceVibration( dt * VIBRATION_FREQUENCY * 2 * Math.PI );
      }

      if ( this.rotatingProperty.get() ) {
        const directionMultiplier = this.rotationDirectionClockwiseProperty.get() ? -1 : 1;
        this.rotate( dt * ROTATION_RATE * 2 * Math.PI * directionMultiplier );
      }

      // Do any linear movement that is required.
      this.setCenterOfGravityPos(
        this.centerOfGravityProperty.get().x + this.velocity.x * dt,
        this.centerOfGravityProperty.get().y + this.velocity.y * dt
      );
    },

    /**
     * Create a new Vector2 describing the location of this molecules center of gravity.
     *
     * @returns {Vector2}
     **/
    getCenterOfGravityPos: function() {
      return new Vector2( this.centerOfGravityProperty.get().x, this.centerOfGravityProperty.get().y );
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
     * Placeholder for setVibration function.  This should be implemented in descendant molecules that have vibration
     * strategies.
     *
     * @param {number} vibrationRadians
     */
    setVibration: function( vibrationRadians ) {
      // Implements no vibration by default, override in descendant classes as needed.
      this.currentVibrationRadiansProperty.set( vibrationRadians );
    },

    /**
     * Advance the vibration by the prescribed radians.
     *
     * @param {number} deltaRadians - Change of vibration angle in radians.
     **/
    advanceVibration: function( deltaRadians ) {
      this.currentVibrationRadiansProperty.set( this.currentVibrationRadiansProperty.get() + deltaRadians );
      this.setVibration( this.currentVibrationRadiansProperty.get() );
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
     * Cause the molecule to dissociate, i.e. to break apart.
     **/
    breakApart: function() {
      console.error( ' Error: breakApart invoked on a molecule for which the action is not implemented.' );
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
     * @returns {boolean}
     **/
    isPhotonMarkedForPassThrough: function( photon ) {
      // Use indexOf to see if the photon exists in the list. If the photon is not in the list, indexOf will return -1.
      return this.passThroughPhotonList.indexOf( photon ) > -1;
    },

    /**
     * Create a new array containing the atoms which compose this molecule.
     *
     * @returns {Array.<Atom>} - Array containing the atoms which compose this molecule.
     **/
    getAtoms: function() {
      return this.atoms.slice( 0 );
    },

    /**
     * Create a new array containing this Molecules atomic bonds.
     *
     * @returns {Array.<AtomicBond>} - Array containing the atomic bonds constructing this molecule.
     **/
    getAtomicBonds: function() {
      return this.atomicBonds.slice( 0 );
    },

    /**
     * Decide whether or not to absorb the offered photon.  If the photon is absorbed, the matching absorption strategy
     * is set so that it can control the molecule's post-absorption behavior.
     *
     * @param {Photon} photon - the photon offered for absorption
     * @returns {boolean} absorbPhoton
     **/
    queryAbsorbPhoton: function( photon ) {

      let absorbPhoton = false;

      // TODO: Need to determine if the photon as passed through and emit here.

      if ( this.absorptionHysteresisCountdownTime <= 0 &&
           photon.locationProperty.get().distance( this.getCenterOfGravityPos() ) < PHOTON_ABSORPTION_DISTANCE &&
           !this.isPhotonMarkedForPassThrough( photon ) ) {

        // The circumstances for absorption are correct, but do we have an absorption strategy for this photon's
        // wavelength?
        const candidateAbsorptionStrategy = this.mapWavelengthToAbsorptionStrategy[ photon.wavelength ];
        if ( candidateAbsorptionStrategy !== undefined && !this.isPhotonAbsorbed() ) {

          // Yes, there is a strategy available for this wavelength. Ask it if it wants the photon.
          if ( candidateAbsorptionStrategy.queryAndAbsorbPhoton( photon ) ) {

            // It does want it, so consider the photon absorbed.
            absorbPhoton = true;
            this.activePhotonAbsorptionStrategy = candidateAbsorptionStrategy;
            this.activePhotonAbsorptionStrategy.queryAndAbsorbPhoton( photon );
            this.photonAbsorbedEmitter.emit( photon );
          }
          else {

            // We have the decision logic once for whether a photon should be absorbed, so it is not queried a second
            // time.
            this.markPhotonForPassThrough( photon );
          }
        }
        else {

          this.markPhotonForPassThrough( photon );
        }

        // broadcast that it was decided that this photon should pass through the molecule - only done if the photon
        // was close enough
        if ( !absorbPhoton ) {
          this.photonPassedThroughEmitter.emit( photon );
        }
      }

      return absorbPhoton;
    },

    /**
     * Add an atom to the list of atoms which compose this molecule.
     *
     * @param {Atom} atom - The atom to be added
     **/
    addAtom: function( atom ) {
      this.atoms.push( atom );
      this.initialAtomCogOffsets[ atom.uniqueID ] = new Vector2( 0, 0 );
      this.vibrationAtomOffsets[ atom.uniqueID ] = new Vector2( 0, 0 );
      this.atomsByID[ atom.uniqueID ] = atom;
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
     * Emit a photon of the specified wavelength in a random direction.
     *
     * @param {number} wavelength - The photon to be emitted.
     **/
    emitPhoton: function( wavelength ) {
      const photonToEmit = new Photon( wavelength, this.photonGroupTandem.createNextTandem() );
      const emissionAngle = phet.joist.random.nextDouble() * Math.PI * 2;
      photonToEmit.setVelocity( PHOTON_EMISSION_SPEED * Math.cos( emissionAngle ),
        ( PHOTON_EMISSION_SPEED * Math.sin( emissionAngle ) ) );
      const centerOfGravityPosRef = this.centerOfGravityProperty.get();
      photonToEmit.location = new Vector2( centerOfGravityPosRef.x, centerOfGravityPosRef.y );
      this.absorptionHysteresisCountdownTime = ABSORPTION_HYSTERESIS_TIME;
      this.photonEmittedEmitter.emit( photonToEmit );
      // this.trigger( 'photonEmitted', photonToEmit );
    },

    /**
     * Returns true if the atoms the molecule 'vibration' is represented by stretching. If false, vibration is represented
     * with bending.
     *
     * @returns {boolean}
     */
    vibratesByStretching: function() {
      return this.atoms.length <= 2;
    },

    /**
     * Update the positions of all atoms that comprise this molecule based on the current center of gravity and the
     * offset for each atom.
     **/
    updateAtomPositions: function() {

      for ( const uniqueID in this.initialAtomCogOffsets ) {
        if ( this.initialAtomCogOffsets.hasOwnProperty( uniqueID ) ) {
          const atomOffset = new Vector2( this.initialAtomCogOffsets[ uniqueID ].x, this.initialAtomCogOffsets[ uniqueID ].y );
          // Add the vibration, if any exists.
          atomOffset.add( this.vibrationAtomOffsets[ uniqueID ] );
          // Rotate.
          atomOffset.rotate( this.currentRotationRadians );
          // Set location based on combination of offset and current center
          // of gravity.
          this.atomsByID[ uniqueID ].positionProperty.set( new Vector2( this.centerOfGravityProperty.get().x + atomOffset.x, this.centerOfGravityProperty.get().y + atomOffset.y ) );
        }
      }
    },

    /**
     * Initialize the offsets from the center of gravity for each atom within this molecule.  This should be in the
     * 'relaxed' (i.e. non-vibrating) state.
     */
    initializeAtomOffsets: function() {
      throw new Error( 'initializeAtomOffsets should be implemented in descendant molecules.' );
    },

    // serialization support
    toStateObject: function() {
      // This serializes the minimum set of attributes necessary to deserialize when provided back.  I (jblanco) am not
      // absolutely certain that this is everything needed, so feel free to add some of the other attributes if needed.
      return {
        highElectronicEnergyState: this.highElectronicEnergyStateProperty.get(),
        centerOfGravity: this.centerOfGravityProperty.get().toStateObject(),
        atoms: serializeArray( this.atoms ),
        atomicBonds: serializeArray( this.atomicBonds ),
        velocity: this.velocity.toStateObject(),
        absorptionHysteresisCountdownTime: this.absorptionHysteresisCountdownTime,
        currentVibrationRadians: this.currentVibrationRadiansProperty.get(),
        currentRotationRadians: this.currentRotationRadians
      };
    }
  }, {

    // deserialization support
    fromStateObject: function( stateObject ) {

      // Create a molecule that is basically blank.
      const molecule = new Molecule();

      // Fill in the straightforward stuff
      molecule.highElectronicEnergyStateProperty.set( stateObject.highElectronicEnergyState );
      molecule.centerOfGravityProperty.set( Vector2.fromStateObject( stateObject.centerOfGravity ) );
      molecule.velocity = Vector2.fromStateObject( stateObject.velocity );
      molecule.absorptionHysteresisCountdownTime = stateObject.absorptionHysteresisCountdownTime;
      molecule.currentVibrationRadiansProperty.set( stateObject.currentVibrationRadians );
      molecule.currentRotationRadians = stateObject.currentRotationRadians;

      // add the atoms
      molecule.atoms = _.map( stateObject.atoms, function( atom ) { return Atom.fromStateObject( atom ); } );

      // add the bonds
      stateObject.atomicBonds.forEach( function( bondStateObject ) {
        const atom1 = findAtomWithID( molecule.atoms, bondStateObject.atom1ID );
        const atom2 = findAtomWithID( molecule.atoms, bondStateObject.atom2ID );
        assert && assert( atom1 && atom2, 'Error: Couldn\'t match atom ID in bond with atoms in molecule' );
        molecule.addAtomicBond( new AtomicBond( atom1, atom2, { bondCount: bondStateObject.bondCount } ) );
      } );

      return molecule;
    }
  } );
} );
