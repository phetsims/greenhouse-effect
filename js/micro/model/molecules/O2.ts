// Copyright 2021, University of Colorado Boulder

/**
 * Class that represents O2 ( oxygen gas ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';
import Molecule, { MoleculeOptions } from '../Molecule.js';

// Model data for nitrogen molecule
const INITIAL_OXYGEN_OXYGEN_DISTANCE = 170; // In picometers.

class O2 extends Molecule {

  // Instance data for the nitrogen molecule
  private readonly oxygenAtom1 = Atom.oxygen();
  private readonly oxygenAtom2 = Atom.oxygen();

  /**
   * Constructor for an oxygen molecule
   */
  public constructor( options?: MoleculeOptions ) {

    // Supertype constructor
    super( options );

    // Configure the base class.
    this.addAtom( this.oxygenAtom1 );
    this.addAtom( this.oxygenAtom2 );
    this.addAtomicBond( new AtomicBond( this.oxygenAtom1, this.oxygenAtom2, { bondCount: 2 } ) );

    // Set the initial offsets
    this.initializeAtomOffsets();

  }


  /**
   * Initialize and set the COG offsets for the oxygen atoms which compose this molecule.
   */
  protected override initializeAtomOffsets(): void {

    this.addInitialAtomCogOffset( this.oxygenAtom1, new Vector2( -INITIAL_OXYGEN_OXYGEN_DISTANCE / 2, 0 ) );
    this.addInitialAtomCogOffset( this.oxygenAtom2, new Vector2( INITIAL_OXYGEN_OXYGEN_DISTANCE / 2, 0 ) );
    this.updateAtomPositions();

  }
}

greenhouseEffect.register( 'O2', O2 );

export default O2;