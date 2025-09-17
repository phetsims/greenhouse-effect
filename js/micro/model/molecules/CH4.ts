// Copyright 2021-2025, University of Colorado Boulder

/**
 * Class that represents CH4 (methane) in the model. The CH4 molecule has atom and bond positions which make
 * the molecule appear three dimensional because it was important to convey the bond angles which were
 * innacurate in two dimensions. No 3D model is used to render this, but offsets are applied to atom
 * positions to create the appearance of three dimensions.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';
import Molecule, { MoleculeOptions } from '../Molecule.js';
import VibrationStrategy from '../VibrationStrategy.js';
import WavelengthConstants from '../WavelengthConstants.js';

// Model Data for Methane
const INITIAL_CARBON_HYDROGEN_DISTANCE = 155; // In picometers.

// Assume that the angle from the carbon to the hydrogen is 45 degrees.
const BOND_ANGLE = Math.PI * 0.9;
const ROTATED_HORIZONTAL_INITIAL_CARBON_HYDROGEN_DISTANCE = INITIAL_CARBON_HYDROGEN_DISTANCE * Math.cos( BOND_ANGLE );
const ROTATED_VERTICAL_INITIAL_CARBON_HYDROGEN_DISTANCE = INITIAL_CARBON_HYDROGEN_DISTANCE * Math.sin( BOND_ANGLE );

// offset applied to positions of atoms to create the effect of 3D appearance
const PERSPECTIVE_OFFSET = 30;

const HYDROGEN_VIBRATION_DISTANCE = 30;
const HYDROGEN_VIBRATION_ANGLE = Math.PI / 4;
const HYDROGEN_VIBRATION_DISTANCE_X = HYDROGEN_VIBRATION_DISTANCE * Math.cos( HYDROGEN_VIBRATION_ANGLE );
const HYDROGEN_VIBRATION_DISTANCE_Y = HYDROGEN_VIBRATION_DISTANCE * Math.sin( HYDROGEN_VIBRATION_ANGLE );

class CH4 extends Molecule {

  private readonly carbonAtom = Atom.carbon();
  private readonly hydrogenAtom1 = Atom.hydrogen( { topLayer: true } );
  private readonly hydrogenAtom2 = Atom.hydrogen();
  private readonly hydrogenAtom3 = Atom.hydrogen();
  private readonly hydrogenAtom4 = Atom.hydrogen( { topLayer: true } );

  /**
   * Constructor for a Methane molecule.
   */
  public constructor( providedOptions?: MoleculeOptions ) {

    // Supertype constructor
    super( providedOptions );

    // Configure the base class.
    this.addAtom( this.carbonAtom );
    this.addAtom( this.hydrogenAtom1 );
    this.addAtom( this.hydrogenAtom2 );
    this.addAtom( this.hydrogenAtom3 );
    this.addAtom( this.hydrogenAtom4 );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom1, { topLayer: true, atom1PositionOffset: new Vector2( 0, PERSPECTIVE_OFFSET ) } ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom2 ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom3 ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom4, { topLayer: true, atom1PositionOffset: new Vector2( PERSPECTIVE_OFFSET / 2, -PERSPECTIVE_OFFSET ) } ) );

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();
  }


  /**
   * Set the initial positions of the atoms which compose this molecule.
   */
  protected override initializeAtomOffsets(): void {

    this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( 0, 0 ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( -0,
      INITIAL_CARBON_HYDROGEN_DISTANCE ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( ROTATED_HORIZONTAL_INITIAL_CARBON_HYDROGEN_DISTANCE,
      -ROTATED_VERTICAL_INITIAL_CARBON_HYDROGEN_DISTANCE ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom3, new Vector2( -ROTATED_HORIZONTAL_INITIAL_CARBON_HYDROGEN_DISTANCE,
      -ROTATED_VERTICAL_INITIAL_CARBON_HYDROGEN_DISTANCE + PERSPECTIVE_OFFSET ) );
    this.addInitialAtomCogOffset( this.hydrogenAtom4, new Vector2( PERSPECTIVE_OFFSET,
      -INITIAL_CARBON_HYDROGEN_DISTANCE + PERSPECTIVE_OFFSET ) );

    this.updateAtomPositions();

  }

  /**
   * Set the vibration behavior for this CH4 molecule. Initialize and set center of gravity position offsets for the
   * composing atoms in its vibration cycle.
   *
   * @param vibrationRadians - Where this molecule is in its vibration cycle in radians.
   */
  public override setVibration( vibrationRadians: number ): void {

    // super.setVibration( vibrationRadians );

    this.currentVibrationRadiansProperty.set( vibrationRadians );
    const multFactor = 1.5 * Math.sin( vibrationRadians );

    if ( vibrationRadians !== 0 ) {

      this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
        INITIAL_CARBON_HYDROGEN_DISTANCE + -Math.abs( multFactor ) * HYDROGEN_VIBRATION_DISTANCE_Y ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( ROTATED_HORIZONTAL_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
        -ROTATED_VERTICAL_INITIAL_CARBON_HYDROGEN_DISTANCE - multFactor * HYDROGEN_VIBRATION_DISTANCE_Y ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom3, new Vector2( -ROTATED_HORIZONTAL_INITIAL_CARBON_HYDROGEN_DISTANCE - multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
        -ROTATED_VERTICAL_INITIAL_CARBON_HYDROGEN_DISTANCE - multFactor * HYDROGEN_VIBRATION_DISTANCE_Y + PERSPECTIVE_OFFSET ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom4, new Vector2( PERSPECTIVE_OFFSET + multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
        -INITIAL_CARBON_HYDROGEN_DISTANCE + Math.abs( multFactor ) * HYDROGEN_VIBRATION_DISTANCE_Y + PERSPECTIVE_OFFSET ) );

      // Position the carbon atom so that the center of mass of the molecule remains the same.
      const carbonXPos = -( this.hydrogenAtom1.mass / this.carbonAtom.mass ) *
                         ( this.getInitialAtomCogOffset( this.hydrogenAtom1 ).x + this.getInitialAtomCogOffset( this.hydrogenAtom2 ).x +
                           this.getInitialAtomCogOffset( this.hydrogenAtom3 ).x + this.getInitialAtomCogOffset( this.hydrogenAtom4 ).x );
      const carbonYPos = -( this.hydrogenAtom1.mass / this.carbonAtom.mass ) *
                         ( this.getInitialAtomCogOffset( this.hydrogenAtom1 ).y + this.getInitialAtomCogOffset( this.hydrogenAtom2 ).y +
                           this.getInitialAtomCogOffset( this.hydrogenAtom3 ).y + this.getInitialAtomCogOffset( this.hydrogenAtom4 ).y );
      this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( carbonXPos, carbonYPos ) );
    }

    else {
      this.initializeAtomOffsets();
    }

    this.updateAtomPositions();
  }
}

greenhouseEffect.register( 'CH4', CH4 );

export default CH4;