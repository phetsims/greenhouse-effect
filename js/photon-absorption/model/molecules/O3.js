// Copyright 2014-2020, University of Colorado Boulder

/**
 * Class that represents ozone (O3) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../../moleculesAndLight.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';
import BreakApartStrategy from '../BreakApartStrategy.js';
import Molecule from '../Molecule.js';
import RotationStrategy from '../RotationStrategy.js';
import VibrationStrategy from '../VibrationStrategy.js';
import WavelengthConstants from '../WavelengthConstants.js';
import O from './O.js';
import O2 from './O2.js';

// Model data for the O3 molecule
// These constants define the initial shape of the O3 atom.  The angle between the atoms is intended to be correct,
// and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
// bond length and/or the angle could be changed and the correct center of gravity will be maintained.
const OXYGEN_OXYGEN_BOND_LENGTH = 180;
const INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE = 120 * Math.PI / 180; // In radians.
const INITIAL_MOLECULE_HEIGHT = OXYGEN_OXYGEN_BOND_LENGTH * Math.cos( INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE / 2 );
const INITIAL_MOLECULE_WIDTH = 2 * OXYGEN_OXYGEN_BOND_LENGTH * Math.sin( INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE / 2 );
const INITIAL_CENTER_OXYGEN_VERTICAL_OFFSET = 2.0 / 3.0 * INITIAL_MOLECULE_HEIGHT;
const INITIAL_OXYGEN_VERTICAL_OFFSET = -INITIAL_CENTER_OXYGEN_VERTICAL_OFFSET / 2;
const INITIAL_OXYGEN_HORIZONTAL_OFFSET = INITIAL_MOLECULE_WIDTH / 2;
const BREAK_APART_VELOCITY = 3000;

//Random boolean generator.  Used to control the side on which the delocalized bond is depicted.
const RAND = {
  nextBoolean: function() {
    return phet.joist.random.nextDouble() < 0.50;
  }
};

/**
 * Constructor for an ozone molecule.
 *
 * @param {Object} [options]
 * @constructor
 */
function O3( options ) {

  // Supertype constructor
  Molecule.call( this, options );

  // Instance Data
  // @private
  this.centerOxygenAtom = Atom.oxygen();
  this.leftOxygenAtom = Atom.oxygen();
  this.rightOxygenAtom = Atom.oxygen();

  // Tracks the side on which the double bond is shown.  More on this where it is initialized.
  // @private
  this.doubleBondOnRight = RAND.nextBoolean();

  // Configure the base class.
  this.addAtom( this.centerOxygenAtom );
  this.addAtom( this.leftOxygenAtom );
  this.addAtom( this.rightOxygenAtom );

  // Create the bond structure.  O3 has a type of bond where each O-O has essentially 1.5 bonds, so we randomly choose
  // one side to sho two bonds and another to show one.
  if ( this.doubleBondOnRight ) {
    this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.leftOxygenAtom, { bondCount: 1 } ) );
    this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.rightOxygenAtom, { bondCount: 2 } ) );
  }
  else {
    this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.leftOxygenAtom, { bondCount: 2 } ) );
    this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.rightOxygenAtom, { bondCount: 1 } ) );
  }

  // Set up the photon wavelengths to absorb.
  this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
  this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );
  this.setPhotonAbsorptionStrategy( WavelengthConstants.UV_WAVELENGTH, new BreakApartStrategy( this ) );

  // Set the initial offsets.
  this.initializeAtomOffsets();
}

moleculesAndLight.register( 'O3', O3 );

inherit( Molecule, O3, {

  /**
   * Initialize and set the COG positions for each atom in this molecule.  These are the atom positions
   * when the molecule is at rest (not rotating or vibrating).
   */
  initializeAtomOffsets: function() {

    this.addInitialAtomCogOffset( this.centerOxygenAtom, new Vector2( 0, INITIAL_CENTER_OXYGEN_VERTICAL_OFFSET ) );
    this.addInitialAtomCogOffset( this.leftOxygenAtom, new Vector2( -INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET ) );
    this.addInitialAtomCogOffset( this.rightOxygenAtom, new Vector2( INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET ) );

    this.updateAtomPositions();

  },

  /**
   * Set the vibration behavior for this O3 molecule.  Sets the O3 molecule to a vibrating state then
   * calculates and sets the new position for each atom in the molecule.
   *
   * @param {number} vibrationRadians - Where this molecule is in its vibration cycle in radians.
   */
  setVibration: function( vibrationRadians ) {

    this.currentVibrationRadiansProperty.set( vibrationRadians );
    const multFactor = Math.sin( vibrationRadians );
    const maxCenterOxygenDisplacement = 30;
    const maxOuterOxygenDisplacement = 15;
    this.getVibrationAtomOffset( this.centerOxygenAtom ).setXY( 0, multFactor * maxCenterOxygenDisplacement );
    this.getVibrationAtomOffset( this.rightOxygenAtom ).setXY( -multFactor * maxOuterOxygenDisplacement, -multFactor * maxOuterOxygenDisplacement );
    this.getVibrationAtomOffset( this.leftOxygenAtom ).setXY( multFactor * maxOuterOxygenDisplacement, -multFactor * maxOuterOxygenDisplacement );
    this.updateAtomPositions();

  },

  /**
   * Define the break apart behavior for the O3 molecule.  Initializes and sets the velocity of constituent molecules.
   */
  breakApart: function() {

    // Create the constituent molecules that result from breaking apart.
    const diatomicOxygenMolecule = new O2();
    const singleOxygenMolecule = new O();
    this.brokeApartEmitter.emit( diatomicOxygenMolecule, singleOxygenMolecule );

    // Set up the direction and velocity of the constituent molecules. These are set up mostly to look good, and their
    // directions and velocities have little if anything to do with any physical rules of atomic dissociation.  If
    // the molecule happens to have been rotated before breaking apart, it is rotated back to the initial orientation
    // before dissociation.  This keeps things simple, and makes the products go off the top and bottom of the window
    // instead of potentially going back towards the photon source.  See issue #110.
    const diatomicMoleculeRotationAngle = ( ( Math.PI / 2 ) - ( INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE / 2 ) );
    let breakApartAngle;
    if ( this.doubleBondOnRight ) {
      diatomicOxygenMolecule.rotate( -diatomicMoleculeRotationAngle );
      diatomicOxygenMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.rightOxygenAtom ).x + this.getInitialAtomCogOffset( this.centerOxygenAtom ).x ) / 2,
        ( this.getInitialAtomCogOffset( this.centerOxygenAtom ).y + this.getInitialAtomCogOffset( this.rightOxygenAtom ).y ) / 2 );
      breakApartAngle = Math.PI / 4 + phet.joist.random.nextDouble() * Math.PI / 4;
      singleOxygenMolecule.setCenterOfGravityPos( -INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET );
    }
    else {
      diatomicOxygenMolecule.rotate( diatomicMoleculeRotationAngle );
      breakApartAngle = Math.PI / 2 + phet.joist.random.nextDouble() * Math.PI / 4;
      diatomicOxygenMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.leftOxygenAtom ).x + this.getInitialAtomCogOffset( this.centerOxygenAtom ).x ) / 2,
        ( this.getInitialAtomCogOffset( this.leftOxygenAtom ).y + this.getInitialAtomCogOffset( this.centerOxygenAtom ).y ) / 2 );
      singleOxygenMolecule.setCenterOfGravityPos( INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET );
    }
    diatomicOxygenMolecule.velocity.set(
      new Vector2( BREAK_APART_VELOCITY * 0.33 * Math.cos( breakApartAngle ),
        BREAK_APART_VELOCITY * 0.33 * Math.sin( breakApartAngle ) )
    );
    singleOxygenMolecule.velocity.set(
      new Vector2( -BREAK_APART_VELOCITY * 0.67 * Math.cos( breakApartAngle ),
        -BREAK_APART_VELOCITY * 0.67 * Math.sin( breakApartAngle ) )
    );

  }
} );

export default O3;