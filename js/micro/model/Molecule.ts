// Copyright 2021-2024, University of Colorado Boulder

/**
 * Base type for molecules.  This, by its nature, is essentially a composition of other objects, generally atoms and
 * atomic bonds.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectLiteralIO from '../../../../tandem/js/types/ObjectLiteralIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Atom, { AtomStateObject } from './atoms/Atom.js';
import AtomicBond from './atoms/AtomicBond.js';
import MicroPhoton from './MicroPhoton.js';
import NullPhotonAbsorptionStrategy from './NullPhotonAbsorptionStrategy.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

// constants
const PHOTON_EMISSION_SPEED = 3000; // Picometers per second.
const PHOTON_ABSORPTION_DISTANCE = 100; // Distance where the molecule begins to query photon for absorption.
const VIBRATION_FREQUENCY = 5;  // Cycles per second of sim time.
const ROTATION_RATE = 1.1;  // Revolutions per second of sim time.
const ABSORPTION_HYSTERESIS_TIME = 0.2; // seconds
const PASS_THROUGH_PHOTON_LIST_SIZE = 10; // Size of list which tracks photons not absorbed due to random probability.

type SelfOptions = {
  initialPosition?: Vector2; // initial position of the molecule's center of gravity
  isForIcon?: boolean; // whether or not this molecule is being used in an icon, which means it doesn't need to be fully instrumented
} & PickOptional<PhetioObjectOptions, 'tandem'>;

// AtomicBondStateObject type
// TODO: Move to AtomicBond.ts, see #423
type AtomicBondStateObject = {
  atom1ID: number;
  atom2ID: number;
  bondCount: number;
};

// PhET-iO state object, for serialization
export type MoleculeStateObject = {
  highElectronicEnergyState: boolean;
  centerOfGravity: Vector2StateObject;
  atoms: AtomStateObject[];
  atomicBonds: AtomicBondStateObject[];
  velocity: Vector2StateObject;
  absorptionHysteresisCountdownTime: number;
  currentVibrationRadians: number;
  currentRotationRadians: number;
};

type MoleculeOptions = SelfOptions;

// utility method used for serialization
function serializeArray( array: Atom[] ): AtomStateObject[];
function serializeArray( array: AtomicBond[] ): AtomicBondStateObject[];
function serializeArray( array: ( Atom | AtomicBond )[] ): ( AtomStateObject | AtomicBondStateObject )[] {
  return array.map( element => element.toStateObject() );
}

// utility method for finding atom with the specified ID in a list
function findAtomWithID( atomArray: Atom[], id: number ): Atom | null {
  for ( let i = 0; i < atomArray.length; i++ ) {
    if ( atomArray[ i ].uniqueID === id ) {
      return atomArray[ i ];
    }
  }
  // ID not found
  return null;
}

class Molecule {

  private readonly highElectronicEnergyStateProperty: Property<boolean>;
  private readonly centerOfGravityProperty: Property<Vector2>;

  // Atoms and bonds that form this molecule.
  private atoms: Atom[];
  private readonly atomicBonds: AtomicBond[];

  // Structure of the molecule in terms of offsets from the center of gravity.  These indicate the atom's position in
  // the "relaxed" (i.e. non-vibrating), non-rotated state.
  // Object contains keys of the atom's uniqueID and values of type Vector2
  private readonly initialAtomCogOffsets: Record<number, Vector2>;

  // Vibration offsets - these represent the amount of deviation from the initial (a.k.a relaxed) configuration for
  // each molecule. Contains keys of the atom's uniqueID and values of type Vector2
  private readonly vibrationAtomOffsets: Record<number, Vector2>;

  // Map containing the atoms which compose this molecule.  Allows us to call on each atom by their unique ID.
  // Object contains keys of the atom's uniqueID, and values of type atom.
  private readonly atomsByID: Record<number, Atom>;

  // Velocity for this molecule.
  public velocity: Vector2;

  // Map that matches photon wavelengths to photon absorption strategies. The strategies contained in this structure
  // define whether the molecule can absorb a given photon and, if it does absorb it, how it will react.
  // Object will contain keys of type Number and values of type PhotonAbsorptionStrategy
  private readonly mapWavelengthToAbsorptionStrategy: Record<number, PhotonAbsorptionStrategy>;

  // Currently active photon absorption strategy, active because a photon was absorbed that activated it.
  public activePhotonAbsorptionStrategy: PhotonAbsorptionStrategy;

  // Variable that prevents reabsorption for a while after emitting a photon.
  private absorptionHysteresisCountdownTime: number;

  // The "pass through photon list" keeps track of photons that were not absorbed due to random probability
  // (essentially a simulation of quantum properties).  If this molecule has no absorption strategy for the photon,
  // it is also added to this list. This is needed since the absorption of a given photon will likely be tested at
  // many time steps as the photon moves past the molecule, and we don't want to keep deciding about the same photon.
  // Array will have size PASS_THROUGH_PHOTON_LIST_SIZE with type MicroPhoton.
  private readonly passThroughPhotonList: MicroPhoton[];

  // The current point within this molecule's vibration sequence.
  public readonly currentVibrationRadiansProperty: Property<number>;

  // The amount of rotation currently applied to this molecule.  This is relative to its original, non-rotated state.
  public currentRotationRadians: number;

  // Boolean values that track whether the molecule is vibrating or rotating.
  public readonly vibratingProperty: Property<boolean>;
  private readonly rotatingProperty: Property<boolean>;

  // Controls the direction of rotation.
  private readonly rotationDirectionClockwiseProperty: Property<boolean>;

  // is the molecule is "stretching" or "contracting" in its vibration.
  private readonly isStretchingProperty: TReadOnlyProperty<boolean>;

  // set by PhotonAbsorptionModel
  public photonGroup: null | PhetioGroup<MicroPhoton, [ number, Vector2 ]>;

  // emitter for when a photon is absorbed
  private readonly photonAbsorbedEmitter: Emitter<[ MicroPhoton ]>;

  // emitter for when a photon is emitted
  private readonly photonEmittedEmitter: Emitter<[ MicroPhoton ]>;

  // emitter for when a photon passes through the molecule without absorptions
  private readonly photonPassedThroughEmitter: Emitter<[ MicroPhoton ]>;

  // Emitter for 'brokeApart' event, when a molecule breaks into two new molecules
  public readonly brokeApartEmitter: Emitter<[ Molecule, Molecule ]>;

  /**
   * Constructor for a molecule.
   */
  public constructor( providedOptions?: MoleculeOptions ) {

    const options = optionize<MoleculeOptions>()( {
      initialPosition: Vector2.ZERO,
      isForIcon: false,
      tandem: Tandem.OPTIONAL // not needed when part of the selection radio buttons.
    }, providedOptions );

    // TODO (phet-io): Should this be an assertion?  Why is this here?  See https://github.com/phetsims/greenhouse-effect/issues/324.
    options.tandem = Tandem.OPTIONAL;

    this.highElectronicEnergyStateProperty = new BooleanProperty( false, !options.isForIcon ? {
      tandem: options.tandem.createTandem( 'highElectronicEnergyStateProperty' ), // Instrumentation requested in https://github.com/phetsims/phet-io-wrappers/issues/53
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } : {} );

    this.centerOfGravityProperty = new Vector2Property( options.initialPosition );

    this.atoms = [];
    this.atomicBonds = [];
    this.initialAtomCogOffsets = {};
    this.vibrationAtomOffsets = {};
    this.atomsByID = {};
    this.velocity = new Vector2( 0, 0 );
    this.mapWavelengthToAbsorptionStrategy = {};
    this.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this );
    this.absorptionHysteresisCountdownTime = 0;
    this.passThroughPhotonList = [];
    this.currentVibrationRadiansProperty = new NumberProperty( 0 );

    this.currentRotationRadians = 0;
    this.vibratingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'vibratingProperty' ),
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } );
    this.rotatingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'rotatingProperty' ),
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } );
    this.rotationDirectionClockwiseProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'rotationDirectionClockwiseProperty' ),
      phetioState: false // Too tricky to load dynamic particle state in the state wrapper, and not enough benefit.  Opt out for now.
    } );
    this.isStretchingProperty = new DerivedProperty( [ this.currentVibrationRadiansProperty ], vibrationRadians => {

      // more displacement with -sin( vibrationRadians ) and so when the slope of that function is negative
      // (derivative of sin is cos) the atoms are expanding
      return Math.cos( vibrationRadians ) < 0;
    } );

    this.photonGroup = null;

    this.photonAbsorbedEmitter = new Emitter( { parameters: [ { valueType: MicroPhoton } ] } );
    this.photonEmittedEmitter = new Emitter( { parameters: [ { valueType: MicroPhoton } ] } );
    this.photonPassedThroughEmitter = new Emitter( { parameters: [ { valueType: MicroPhoton } ] } );
    this.brokeApartEmitter = new Emitter( {
      parameters: [
        { valueType: Molecule },
        { valueType: Molecule }
      ]
    } );
  }

  /**
   * Reset the molecule.  Any photons that have been absorbed are forgotten, and any vibration is reset.
   **/
  public reset(): void {
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
  }

  /**
   * These properties are owned by this molecule so they can be disposed directly.
   */
  public dispose(): void {
    this.vibratingProperty.dispose();
    this.rotatingProperty.dispose();
    this.rotationDirectionClockwiseProperty.dispose();
    this.highElectronicEnergyStateProperty.dispose();
    this.photonEmittedEmitter.dispose();
    this.photonPassedThroughEmitter.dispose();
  }

  /**
   * Set the photon absorption strategy for this molecule for a given photon wavelength.
   *
   * @param wavelength - wavelength attributed to this absorption strategy.
   * @param strategy
   */
  public setPhotonAbsorptionStrategy( wavelength: number, strategy: PhotonAbsorptionStrategy ): void {
    this.mapWavelengthToAbsorptionStrategy[ wavelength ] = strategy;
  }

  /**
   * Get the absorption strategy for this molecule for the provided wavelength. Note that this does NOT return
   * the active absorption strategy after an absorption.
   * Returns null if there is no strategy for the specified wavelength.
   */
  public getPhotonAbsorptionStrategyForWavelength( wavelength: number ): PhotonAbsorptionStrategy | null {
    return this.mapWavelengthToAbsorptionStrategy[ wavelength ] || null;
  }

  /**
   * Checks to see if a photon has been absorbed.
   */
  public isPhotonAbsorbed(): boolean {

    // If there is an active non-null photon absorption strategy, it indicates that a photon has been absorbed.
    return !( this.activePhotonAbsorptionStrategy instanceof NullPhotonAbsorptionStrategy );
  }

  /**
   * Add an initial offset from the molecule's Center of Gravity (COG). The offset is "initial" because this is where
   * the atom should be when it is not vibrating or rotating.
   *
   * @param atom
   * @param offset - Initial COG offset for when atom is not vibrating or rotating.
   */
  protected addInitialAtomCogOffset( atom: Atom, offset: Vector2 ): void {
    // Check that the specified atom is a part of this molecule.  While it would probably work to add the offsets
    // first and the atoms later, that's not how the sim was designed, so this is some enforcement of the "add the
    // atoms first" policy.
    assert && assert( this.atoms.includes( atom ) );
    this.initialAtomCogOffsets[ atom.uniqueID ] = offset;
  }

  /**
   * Get the initial offset from the molecule's center of gravity (COG) for the specified atom.
   **/
  public getInitialAtomCogOffset( atom: Atom ): Vector2 {
    if ( !( atom.uniqueID in this.initialAtomCogOffsets ) ) {
      console.log( ' - Warning: Attempt to get initial COG offset for atom that is not in molecule.' );
    }
    return this.initialAtomCogOffsets[ atom.uniqueID ];
  }

  /**
   * Get the current vibration offset from the molecule's center of gravity (COG) for the specified molecule.
   * @returns Vector representing position of vibration offset from molecule's center of gravity.
   */
  public getVibrationAtomOffset( atom: Atom ): Vector2 {
    if ( !( atom.uniqueID in this.vibrationAtomOffsets ) ) {
      console.log( ' - Warning: Attempt to get vibrational COG offset for atom that is not in molecule.' );
    }
    return this.vibrationAtomOffsets[ atom.uniqueID ];
  }

  /**
   * Advance the molecule one step in time.
   **/
  public step( dt: number ): void {
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
  }

  /**
   * Create a new Vector2 describing the position of this molecule's center of gravity.
   **/
  public getCenterOfGravityPos(): Vector2 {
    return new Vector2( this.centerOfGravityProperty.get().x, this.centerOfGravityProperty.get().y );
  }

  /**
   * Set the position of this molecule by specifying the center of gravity.  This will be unique to each molecule's
   * configuration, and it will cause the individual molecules to be located such that the center of gravity is in
   * the specified position.  The relative orientation of the atoms that comprise the molecules will not be changed.
   *
   * @param x - the x position to set
   * @param y - the y position to set
   **/
  public setCenterOfGravityPos( x: number, y: number ): void {
    if ( this.centerOfGravityProperty.get().x !== x || this.centerOfGravityProperty.get().y !== y ) {
      this.centerOfGravityProperty.set( new Vector2( x, y ) );
      this.updateAtomPositions();
    }
  }

  /**
   * Set the position of this molecule by specifying the center of gravity. Allows passing a Vector2 into
   * setCenterOfGravityPos.
   *
   * @param centerOfGravityPos - A vector representing the desired position for this molecule.
   **/
  public setCenterOfGravityPosVec( centerOfGravityPos: Vector2 ): void {
    this.setCenterOfGravityPos( centerOfGravityPos.x, centerOfGravityPos.y );
  }

  /**
   * Placeholder for setVibration function.  This should be implemented in descendant molecules that have vibration
   * strategies.
   */
  public setVibration( vibrationRadians: number ): void {

    // Implements no vibration by default, override in descendant classes as needed.
    this.currentVibrationRadiansProperty.set( vibrationRadians );
  }

  /**
   * Advance the vibration by the prescribed radians.
   * deltaRadians - Change of vibration angle in radians.
   **/
  private advanceVibration( deltaRadians: number ): void {
    this.currentVibrationRadiansProperty.set( this.currentVibrationRadiansProperty.get() + deltaRadians );
    this.setVibration( this.currentVibrationRadiansProperty.get() );
  }

  /**
   * Rotate the molecule about the center of gravity by the specified number of radians.
   * @param deltaRadians - Change in radians of the Molecule's angle about the center of Gravity.
   **/
  public rotate( deltaRadians: number ): void {
    this.setRotation( ( this.currentRotationRadians + deltaRadians ) % ( Math.PI * 2 ) );
  }

  /**
   * Set the rotation angle of the Molecule in radians.
   **/
  public setRotation( radians: number ): void {
    if ( radians !== this.currentRotationRadians ) {
      this.currentRotationRadians = radians;
      this.updateAtomPositions();
    }
  }

  /**
   * Cause the molecule to dissociate, i.e. to break apart.
   */
  public breakApart(): void {
    console.error( 'Error: breakApart invoked on a molecule for which the action is not implemented.' );
    assert && assert( false );
  }

  /**
   * Mark a photon for passing through the molecule. This means that the photon will not interact with the molecule.
   *
   * @param photon - The photon to be passed through.
   */
  public markPhotonForPassThrough( photon: MicroPhoton ): void {
    if ( this.passThroughPhotonList.length >= PASS_THROUGH_PHOTON_LIST_SIZE ) {
      // Make room for this photon be deleting the oldest one.
      this.passThroughPhotonList.shift();
    }
    this.passThroughPhotonList.push( photon );
  }

  /**
   * Determine if a photon is marked to be passed through this molecule.
   *
   * @param photon - The photon to check.
   * @returns boolean
   */
  public isPhotonMarkedForPassThrough( photon: MicroPhoton ): boolean {
    return this.passThroughPhotonList.includes( photon );
  }

  /**
   * Create a new array containing the atoms which compose this molecule.
   *
   * @returns Array containing the atoms which compose this molecule.
   */
  public getAtoms(): Atom[] {
    return this.atoms.slice( 0 );
  }

  /**
   * Create a new array containing this molecule's atomic bonds.
   *
   * @returns Array containing the atomic bonds constructing this molecule.
   */
  public getAtomicBonds(): AtomicBond[] {
    return this.atomicBonds.slice( 0 );
  }

  /**
   * Decide whether or not to absorb the offered photon. If the photon is absorbed, the matching absorption strategy
   * is set so that it can control the molecule's post-absorption behavior.
   *
   * @param photon - The photon offered for absorption.
   */
  public queryAbsorbPhoton( photon: MicroPhoton ): boolean {

    let absorbPhoton = false;

    if ( this.absorptionHysteresisCountdownTime <= 0 &&
         photon.positionProperty.get().distance( this.getCenterOfGravityPos() ) < PHOTON_ABSORPTION_DISTANCE &&
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
  }

  /**
   * Add an atom to the list of atoms which compose this molecule.
   *
   * @param atom - The atom to be added.
   */
  public addAtom( atom: Atom ): void {
    this.atoms.push( atom );
    this.initialAtomCogOffsets[ atom.uniqueID ] = new Vector2( 0, 0 );
    this.vibrationAtomOffsets[ atom.uniqueID ] = new Vector2( 0, 0 );
    this.atomsByID[ atom.uniqueID ] = atom;
  }

  /**
   * Add an atomic bond to this molecule's list of atomic bonds.
   *
   * @param atomicBond - The atomic bond to be added.
   */
  public addAtomicBond( atomicBond: AtomicBond ): void {
    this.atomicBonds.push( atomicBond );
  }

  /**
   * Emit a photon of the specified wavelength in a random direction.
   *
   * @param wavelength - The photon to be emitted.
   */
  public emitPhoton( wavelength: number ): void {
    const centerOfGravityPosRef = this.centerOfGravityProperty.get();

    affirm( this.photonGroup !== null, 'photonGroup should be defined by now.' );
    const photonToEmit = this.photonGroup.createNextElement(
      wavelength,
      new Vector2( centerOfGravityPosRef.x, centerOfGravityPosRef.y )
    );
    const emissionAngle = dotRandom.nextDouble() * Math.PI * 2;
    photonToEmit.setVelocity(
      PHOTON_EMISSION_SPEED * Math.cos( emissionAngle ),
      ( PHOTON_EMISSION_SPEED * Math.sin( emissionAngle ) )
    );
    this.absorptionHysteresisCountdownTime = ABSORPTION_HYSTERESIS_TIME;
    this.photonEmittedEmitter.emit( photonToEmit );
  }

  /**
   * Returns true if the atoms the molecule 'vibration' is represented by stretching. If false, vibration is represented
   * with bending.
   */
  public vibratesByStretching(): boolean {
    return this.atoms.length <= 2;
  }

  /**
   * Update the positions of all atoms that comprise this molecule based on the current center of gravity and the
   * offset for each atom.
   **/
  public updateAtomPositions(): void {

    for ( const uniqueID in this.initialAtomCogOffsets ) {
      if ( this.initialAtomCogOffsets.hasOwnProperty( uniqueID ) ) {
        const atomOffset = new Vector2( this.initialAtomCogOffsets[ uniqueID ].x, this.initialAtomCogOffsets[ uniqueID ].y );
        // Add the vibration, if any exists.
        atomOffset.add( this.vibrationAtomOffsets[ uniqueID ] );
        // Rotate.
        atomOffset.rotate( this.currentRotationRadians );
        // Set position based on combination of offset and current center
        // of gravity.
        this.atomsByID[ uniqueID ].positionProperty.set( new Vector2( this.centerOfGravityProperty.get().x + atomOffset.x, this.centerOfGravityProperty.get().y + atomOffset.y ) );
      }
    }
  }

  /**
   * Initialize the offsets from the center of gravity for each atom within this molecule. This should be in the
   * 'relaxed' (i.e. non-vibrating) state.
   * @abstract
   */
  protected initializeAtomOffsets(): void {
    throw new Error( 'initializeAtomOffsets should be implemented in descendant molecules.' );
  }

  // serialization support
  public toStateObject(): MoleculeStateObject {
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


  // deserialization support
  public static fromStateObject( stateObject: MoleculeStateObject ): Molecule {

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
    molecule.atoms = _.map( stateObject.atoms, atom => Atom.fromStateObject( atom ) );

    // add the bonds
    stateObject.atomicBonds.forEach( bondStateObject => {
      const atom1 = findAtomWithID( molecule.atoms, bondStateObject.atom1ID );
      const atom2 = findAtomWithID( molecule.atoms, bondStateObject.atom2ID );
      assert && assert( atom1 && atom2, 'Error: Couldn\'t match atom ID in bond with atoms in molecule' );
      molecule.addAtomicBond( new AtomicBond( atom1, atom2, { bondCount: bondStateObject.bondCount } ) );
    } );

    return molecule;
  }

  public static readonly PHOTON_ABSORPTION_DISTANCE = PHOTON_ABSORPTION_DISTANCE;

  public static readonly MoleculeIO = new IOType( 'MoleculeIO', {
    valueType: Molecule,
    toStateObject: ( molecule: Molecule ) => molecule.toStateObject(),
    fromStateObject: x => Molecule.fromStateObject( x ),
    stateSchema: {
      highElectronicEnergyState: BooleanIO,
      centerOfGravity: Vector2.Vector2IO,

      // TODO: https://github.com/phetsims/greenhouse-effect/issues/40 more specific schema
      atoms: ArrayIO( ObjectLiteralIO ),
      atomicBonds: ArrayIO( ObjectLiteralIO ),
      velocity: Vector2.Vector2IO,
      absorptionHysteresisCountdownTime: NumberIO,
      currentVibrationRadians: NumberIO,
      currentRotationRadians: NumberIO
    }
  } );
}

greenhouseEffect.register( 'Molecule', Molecule );

export default Molecule;