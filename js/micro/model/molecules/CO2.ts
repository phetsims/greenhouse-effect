// Copyright 2021-2025, University of Colorado Boulder

/**
 * Class that represents CO2 (carbon dioxide) in the model.
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

// Model data for the carbon-dioxide molecule.
const INITIAL_CARBON_OXYGEN_DISTANCE = 170; // In picometers.

// Deflection amounts used for vibration.  Calculated such that the actual
// center of gravity remains constant.
const CARBON_MAX_DEFLECTION = 40;
const OXYGEN_MAX_DEFLECTION =
  ( Atom.carbon().mass * CARBON_MAX_DEFLECTION ) / ( 2 * Atom.oxygen().mass );

class CO2 extends Molecule {

  private readonly carbonAtom = Atom.carbon();
  private readonly oxygenAtom1 = Atom.oxygen();
  private readonly oxygenAtom2 = Atom.oxygen();

  /**
   * Constructor for a carbon-dioxide molecule.
   */
  public constructor( options?: MoleculeOptions ) {

    super( options );

    this.addAtom( this.carbonAtom );
    this.addAtom( this.oxygenAtom1 );
    this.addAtom( this.oxygenAtom2 );

    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.oxygenAtom1, { bondCount: 2 } ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.oxygenAtom2, { bondCount: 2 } ) );

    // Photon wavelengths absorbed by CO₂.
    this.setPhotonAbsorptionStrategy(
      WavelengthConstants.IR_WAVELENGTH,
      new VibrationStrategy( this )
    );

    // Set the initial offsets
    this.initializeAtomOffsets();
  }

  /**
   * Set the vibration behavior for this CO2 molecule. Initialize and set center of gravity position offsets for the
   * composing atoms.
   *
   * @param vibrationRadians – Where this molecule is in its vibration cycle.
   */
  public override setVibration( vibrationRadians: number ): void {

    this.currentVibrationRadiansProperty.set( vibrationRadians );
    const multFactor = Math.sin( vibrationRadians );
    this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( 0, multFactor * CARBON_MAX_DEFLECTION ) );
    this.addInitialAtomCogOffset( this.oxygenAtom1, new Vector2( INITIAL_CARBON_OXYGEN_DISTANCE, -multFactor * OXYGEN_MAX_DEFLECTION ) );
    this.addInitialAtomCogOffset( this.oxygenAtom2, new Vector2( -INITIAL_CARBON_OXYGEN_DISTANCE, -multFactor * OXYGEN_MAX_DEFLECTION ) );
    this.updateAtomPositions();
  }

  /**
   * Set the initial positions of the atoms that compose this molecule.
   */
  protected override initializeAtomOffsets(): void {

    this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( 0, 0 ) );
    this.addInitialAtomCogOffset( this.oxygenAtom1, new Vector2( INITIAL_CARBON_OXYGEN_DISTANCE, 0 ) );
    this.addInitialAtomCogOffset( this.oxygenAtom2, new Vector2( -INITIAL_CARBON_OXYGEN_DISTANCE, 0 ) );
    this.updateAtomPositions();
  }
}

greenhouseEffect.register( 'CO2', CO2 );

export default CO2;