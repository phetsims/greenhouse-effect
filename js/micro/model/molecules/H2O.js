// Copyright 2014-2020, University of Colorado Boulder

/**
 * Class that represents H2O ( water ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import moleculesAndLight from '../../../moleculesAndLight.js';
import Molecule from '../Molecule.js';
import RotationStrategy from '../RotationStrategy.js';
import VibrationStrategy from '../VibrationStrategy.js';
import WavelengthConstants from '../WavelengthConstants.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';

// Model Data for the water molecule
// These constants define the initial shape of the water atom.  The angle between the atoms is intended to be correct,
// and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
// bond length and/or the angle could be changed and the correct center of gravity will be maintained.
const OXYGEN_HYDROGEN_BOND_LENGTH = 130;
const INITIAL_HYDROGEN_OXYGEN_HYDROGEN_ANGLE = 109 * Math.PI / 180;
const INITIAL_MOLECULE_HEIGHT = OXYGEN_HYDROGEN_BOND_LENGTH * Math.cos( INITIAL_HYDROGEN_OXYGEN_HYDROGEN_ANGLE / 2 );
const INITIAL_HYDROGEN_HORIZONTAL_OFFSET = OXYGEN_HYDROGEN_BOND_LENGTH * Math.sin( INITIAL_HYDROGEN_OXYGEN_HYDROGEN_ANGLE / 2 );

class H2O extends Molecule {

  /**
   * Constructor for a water molecule.
   *
   * @param {Object} [options]
   */
  constructor( options ) {

    // Supertype constructor
    super( options );

    // Instance Data
    // @private
    this.oxygenAtom = Atom.oxygen();
    this.hydrogenAtom1 = Atom.hydrogen();
    this.hydrogenAtom2 = Atom.hydrogen();
    this.totalMoleculeMass = this.oxygenAtom.mass + ( 2 * this.hydrogenAtom1.mass );
    this.initialOxygenVerticalOffset = INITIAL_MOLECULE_HEIGHT * ( ( 2 * this.hydrogenAtom1.mass ) / this.totalMoleculeMass );
    this.initialHydrogenVerticalOffset = -( INITIAL_MOLECULE_HEIGHT - this.initialOxygenVerticalOffset );

    // Configure the base class.
    this.addAtom( this.oxygenAtom );
    this.addAtom( this.hydrogenAtom1 );
    this.addAtom( this.hydrogenAtom2 );
    this.addAtomicBond( new AtomicBond( this.oxygenAtom, this.hydrogenAtom1, { bondCount: 1 } ) );
    this.addAtomicBond( new AtomicBond( this.oxygenAtom, this.hydrogenAtom2, { bondCount: 1 } ) );

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();
  }


  /**
   * Initialize and set the initial center of gravity positions for each atom in this molecule.
   * @private
   */
  initializeAtomOffsets() {

    this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, this.initialOxygenVerticalOffset ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( INITIAL_HYDROGEN_HORIZONTAL_OFFSET, this.initialHydrogenVerticalOffset ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( -INITIAL_HYDROGEN_HORIZONTAL_OFFSET, this.initialHydrogenVerticalOffset ) );
    this.updateAtomPositions();
  }

  /**
   * Set the vibration behavior for this water molecule.  Set the current angle in vibration cycle, update center of
   * gravity offsets, and update the atom positions.
   * @public
   *
   * @param {number} vibrationRadians - The current angle of the vibration cycle in radians.
   */
  setVibration( vibrationRadians ) {

    this.currentVibrationRadiansProperty.set( vibrationRadians );
    const multFactor = Math.sin( vibrationRadians );
    const maxOxygenDisplacement = 3;
    const maxHydrogenDisplacement = 18;
    this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, this.initialOxygenVerticalOffset - multFactor * maxOxygenDisplacement ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( INITIAL_HYDROGEN_HORIZONTAL_OFFSET + multFactor * maxHydrogenDisplacement,
      this.initialHydrogenVerticalOffset + multFactor * maxHydrogenDisplacement ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( -INITIAL_HYDROGEN_HORIZONTAL_OFFSET - multFactor * maxHydrogenDisplacement,
      this.initialHydrogenVerticalOffset + multFactor * maxHydrogenDisplacement ) );
    this.updateAtomPositions();
  }
}

moleculesAndLight.register( 'H2O', H2O );

export default H2O;
