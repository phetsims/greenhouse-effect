// Copyright 2021, University of Colorado Boulder

/**
 * Class that represents N2 ( nitrogen ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Molecule from '../Molecule.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';

// Model data for nitrogen molecule
const INITIAL_NITROGEN_NITROGEN_DISTANCE = 170; // In picometers.

class N2 extends Molecule {

  /**
   * Constructor for a molecule of nitrogen.
   *
   * @param {Object} [options]
   */
  constructor( options ) {

    // Supertype constructor
    super( options );

    // Instance data for the nitrogen molecule
    // @private
    this.nitrogenAtom1 = Atom.nitrogen();
    this.nitrogenAtom2 = Atom.nitrogen();

    // Configure the base class.
    this.addAtom( this.nitrogenAtom1 );
    this.addAtom( this.nitrogenAtom2 );
    this.addAtomicBond( new AtomicBond( this.nitrogenAtom1, this.nitrogenAtom2, { bondCount: 3 } ) );

    // Set the initial offsets
    this.initializeAtomOffsets();

  }


  /**
   * Initialize and set the center of gravity offsets for the nitrogen atoms which compose this molecule.
   * @private
   */
  initializeAtomOffsets() {

    this.addInitialAtomCogOffset( this.nitrogenAtom1, new Vector2( -INITIAL_NITROGEN_NITROGEN_DISTANCE / 2, 0 ) );
    this.addInitialAtomCogOffset( this.nitrogenAtom2, new Vector2( INITIAL_NITROGEN_NITROGEN_DISTANCE / 2, 0 ) );
    this.updateAtomPositions();

  }
}

greenhouseEffect.register( 'N2', N2 );

export default N2;