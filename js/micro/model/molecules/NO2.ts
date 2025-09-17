// Copyright 2021-2025, University of Colorado Boulder

/**
 * Class that represents NO2 ( nitrogen dioxide ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';
import BreakApartStrategy from '../BreakApartStrategy.js';
import ExcitationStrategy from '../ExcitationStrategy.js';
import Molecule, { MoleculeOptions } from '../Molecule.js';
import RotationStrategy from '../RotationStrategy.js';
import VibrationStrategy from '../VibrationStrategy.js';
import WavelengthConstants from '../WavelengthConstants.js';
import NO from './NO.js';
import O from './O.js';

// Model data for the NO2 molecule
// These constants define the initial shape of the NO2 atom.  The angle between the atoms is intended to be correct,
// and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
// bond length and/or the angle could be changed and the correct center of gravity will be maintained.
const NITROGEN_OXYGEN_BOND_LENGTH = 180;
const INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE = 120 * Math.PI / 180; // In radians.
const INITIAL_MOLECULE_HEIGHT = NITROGEN_OXYGEN_BOND_LENGTH * Math.cos( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 );
const BREAK_APART_VELOCITY = 3000;

//Random boolean generator.  Used to control the side on which the delocalized bond is depicted.
const RAND = {
  nextBoolean: () => dotRandom.nextDouble() < 0.50
};

class NO2 extends Molecule {
  private readonly nitrogenAtom = Atom.nitrogen();
  private readonly rightOxygenAtom = Atom.oxygen();
  private readonly leftOxygenAtom = Atom.oxygen();

  private readonly totalMoleculeMass =
    this.nitrogenAtom.mass + 2 * this.rightOxygenAtom.mass;

  private readonly initialNitrogenVerticalOffset =
    INITIAL_MOLECULE_HEIGHT *
    ( ( 2 * this.rightOxygenAtom.mass ) / this.totalMoleculeMass );

  private readonly initialOxygenVerticalOffset =
    -( INITIAL_MOLECULE_HEIGHT - this.initialNitrogenVerticalOffset );

  private readonly initialOxygenHorizontalOffset =
    NITROGEN_OXYGEN_BOND_LENGTH *
    Math.sin( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 );

  // Tracks the side on which the double bond is shown.
  private readonly doubleBondOnRight = RAND.nextBoolean();

  /**
   * Constructor for a nitrogen dioxide molecule.
   */
  public constructor( options?: MoleculeOptions ) {
    super( options );

    // Atoms
    this.addAtom( this.nitrogenAtom );
    this.addAtom( this.rightOxygenAtom );
    this.addAtom( this.leftOxygenAtom );

    // Create the bond structure.  NO2 has a type of bond where each N-O has essentially 1.5 bonds, so we randomly
    // choose one side to show two bonds and another to show one.
    if ( this.doubleBondOnRight ) {
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.rightOxygenAtom, { bondCount: 2 } ) );
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.leftOxygenAtom, { bondCount: 1 } ) );
    }
    else {
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.rightOxygenAtom, { bondCount: 1 } ) );
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.leftOxygenAtom, { bondCount: 2 } ) );
    }


    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.VISIBLE_WAVELENGTH, new ExcitationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.UV_WAVELENGTH, new BreakApartStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }


  /**
   * Initialize and set the COG positions for each atom in this molecule.  These are the atom positions when the
   * molecule is at rest (not rotating or vibrating).
   */
  protected override initializeAtomOffsets(): void {

    this.addInitialAtomCogOffset( this.nitrogenAtom, new Vector2( 0, this.initialNitrogenVerticalOffset ) );
    this.addInitialAtomCogOffset( this.rightOxygenAtom, new Vector2( this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset ) );
    this.addInitialAtomCogOffset( this.leftOxygenAtom, new Vector2( -this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset ) );

    this.updateAtomPositions();
  }

  /**
   * Set the vibration behavior for this NO2 molecule.  Sets the NO2 molecule to a vibrating state then calculates
   * and sets the new position for each atom in the molecule.
   * @param vibrationRadians - Where this molecule is in its vibration cycle in radians.
   */
  public override setVibration( vibrationRadians: number ): void {
    this.currentVibrationRadiansProperty.set( vibrationRadians );
    const multFactor = Math.sin( vibrationRadians );
    const maxNitrogenDisplacement = 30;
    const maxOxygenDisplacement = 15;
    this.addInitialAtomCogOffset( this.nitrogenAtom, new Vector2( 0, this.initialNitrogenVerticalOffset - multFactor * maxNitrogenDisplacement ) );
    this.addInitialAtomCogOffset( this.rightOxygenAtom, new Vector2( this.initialOxygenHorizontalOffset + multFactor * maxOxygenDisplacement,
      this.initialOxygenVerticalOffset + multFactor * maxOxygenDisplacement ) );
    this.addInitialAtomCogOffset( this.leftOxygenAtom, new Vector2( -this.initialOxygenHorizontalOffset - multFactor * maxOxygenDisplacement,
      this.initialOxygenVerticalOffset + multFactor * maxOxygenDisplacement ) );
    this.updateAtomPositions();

  }

  /**
   * Define the break apart behavior for the NO2 molecule.  Initializes and sets the velocity of constituent
   * molecules.
   */
  public override breakApart(): void {

    // Create the constituent molecules that result from breaking apart and add them to the activeMolecules observable array.
    const nitrogenMonoxideMolecule = new NO();
    const singleOxygenMolecule = new O();
    this.brokeApartEmitter.emit( nitrogenMonoxideMolecule, singleOxygenMolecule );

    // Set up the direction and velocity of the constituent molecules. These are set up mostly to look good, and their
    // directions and velocities have little if anything to do with any physical rules of atomic dissociation.  If
    // the molecule happens to have been rotated before breaking apart, it is rotated back to the initial orientation
    // before dissociation.  This keeps things simple, and makes the products go off the top and bottom of the window
    // instead of potentially going back towards the photon source.  See issue #110.
    const diatomicMoleculeRotationAngle = ( ( Math.PI / 2 ) - ( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 ) );
    let breakApartAngle;
    if ( this.doubleBondOnRight ) {
      nitrogenMonoxideMolecule.rotate( -diatomicMoleculeRotationAngle );
      nitrogenMonoxideMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.nitrogenAtom ).x + this.getInitialAtomCogOffset( this.rightOxygenAtom ).x ) / 2,
        ( this.getInitialAtomCogOffset( this.nitrogenAtom ).y + this.getInitialAtomCogOffset( this.rightOxygenAtom ).y ) / 2 );
      breakApartAngle = Math.PI / 4 + dotRandom.nextDouble() * Math.PI / 4;
      singleOxygenMolecule.setCenterOfGravityPos( -this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset );
    }
    else {
      nitrogenMonoxideMolecule.rotate( Math.PI + diatomicMoleculeRotationAngle );
      breakApartAngle = Math.PI / 2 + dotRandom.nextDouble() * Math.PI / 4;
      nitrogenMonoxideMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.nitrogenAtom ).x + this.getInitialAtomCogOffset( this.leftOxygenAtom ).x ) / 2,
        ( this.getInitialAtomCogOffset( this.nitrogenAtom ).y + this.getInitialAtomCogOffset( this.leftOxygenAtom ).y ) / 2 );
      singleOxygenMolecule.setCenterOfGravityPos( this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset );
    }
    nitrogenMonoxideMolecule.velocity.set( new Vector2( BREAK_APART_VELOCITY * 0.33 * Math.cos( breakApartAngle ), BREAK_APART_VELOCITY * 0.33 * Math.sin( breakApartAngle ) ) );
    singleOxygenMolecule.velocity.set( new Vector2( -BREAK_APART_VELOCITY * 0.67 * Math.cos( breakApartAngle ), -BREAK_APART_VELOCITY * 0.67 * Math.sin( breakApartAngle ) ) );
  }
}

greenhouseEffect.register( 'NO2', NO2 );

export default NO2;