// Copyright 2021, University of Colorado Boulder

/**
 * Class that represents a single atom of oxygen in the model.  I hate to name a class "O", but it is necessary for
 * consistency with other molecules names.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Molecule from '../Molecule.js';
import Atom from '../atoms/Atom.js';

class O extends Molecule {

  /**
   * Constructor for a single atom of oxygen.
   *
   * @param {Object} [options]
   */
  constructor( options ) {

    // Supertype constructor
    super( options );

    // Instance Data
    // @private
    this.oxygenAtom = Atom.oxygen();

    // Configure the base class.
    this.addAtom( this.oxygenAtom );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }


  /**
   * Initialize and set the center of gravity offsets for the position of this Oxygen atom.
   * @private
   */
  initializeAtomOffsets() {
    this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, 0 ) );
    this.updateAtomPositions();
  }
}

greenhouseEffect.register( 'O', O );

export default O;