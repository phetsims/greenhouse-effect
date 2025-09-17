// Copyright 2021-2025, University of Colorado Boulder

/**
 * Class that represents NO ( nitrogen monoxide ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';
import Molecule, { MoleculeOptions } from '../Molecule.js';

// Model Data for the nitrogen monoxide molecule.
const INITIAL_NITROGEN_OXYGEN_DISTANCE = 170; // In picometers.

class NO extends Molecule {

  private readonly nitrogenAtom = Atom.nitrogen();
  private readonly oxygenAtom = Atom.oxygen();

  /**
   * Constructor for a nitrogen monoxide molecule.
   */
  public constructor( options?: MoleculeOptions ) {

    // Supertype constructor
    super( options );

    this.addAtom( this.nitrogenAtom );
    this.addAtom( this.oxygenAtom );
    this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.oxygenAtom, { bondCount: 2 } ) );

    // Set up the photon wavelengths to absorb.

    // Set the initial offsets.
    this.initializeAtomOffsets();
  }

  /**
   * Initialize and set the COG positions for each atom which compose this NO molecule.
   */
  protected override initializeAtomOffsets(): void {

    this.addInitialAtomCogOffset( this.nitrogenAtom, new Vector2( -INITIAL_NITROGEN_OXYGEN_DISTANCE / 2, 0 ) );
    this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( INITIAL_NITROGEN_OXYGEN_DISTANCE / 2, 0 ) );
    this.updateAtomPositions();

  }
}

greenhouseEffect.register( 'NO', NO );

export default NO;