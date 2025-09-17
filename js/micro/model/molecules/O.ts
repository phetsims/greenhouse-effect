// Copyright 2021-2025, University of Colorado Boulder

/**
 * Class that represents a single atom of oxygen in the model.  I hate to name a class "O", but it is necessary for
 * consistency with other molecules names.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Atom from '../atoms/Atom.js';
import Molecule, { MoleculeOptions } from '../Molecule.js';

class O extends Molecule {

  private readonly oxygenAtom = Atom.oxygen();

  /**
   * Constructor for a single atom of oxygen.
   */
  public constructor( options?: MoleculeOptions ) {

    super( options );

    this.addAtom( this.oxygenAtom );

    this.initializeAtomOffsets();
  }

  /**
   * Initialize and set the center of gravity offsets for the position of this Oxygen atom.
   */
  protected override initializeAtomOffsets(): void {
    this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, 0 ) );
    this.updateAtomPositions();
  }
}

greenhouseEffect.register( 'O', O );

export default O;