// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model that represents an atomic bond between two atoms.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import moleculesAndLight from '../../../moleculesAndLight.js';

class AtomicBond {

  /**
   * Constructor for an Atomic Bond between two atoms.
   *
   * @param {Atom} atom1 - Atom involved in the bond
   * @param {Atom} atom2 - Atom involved in the bond
   * @param {Object} [options]
   */
  constructor( atom1, atom2, options ) {

    options = merge( {
      // defaults
      bondCount: 1, // Indicates whether this is a single, double, triple, etc. bond.

      // {boolean} if true, the atom will be in the top layer in the visualization, to support 3D looking molecules
      topLayer: false,

      // offsets for the positions of the bond endpoints, relative to the centers of each atom in model coordinates
      atom1PositionOffset: new Vector2( 0, 0 ),
      atom2PositionOffset: new Vector2( 0, 0 )
    }, options );

    // @public (read-only)
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.bondCount = options.bondCount;
    this.topLayer = options.topLayer;
    this.atom1PositionOffset = options.atom1PositionOffset;
    this.atom2PositionOffset = options.atom2PositionOffset;
  }


  // serialization support
  // @public
  toStateObject() {
    return {
      bondCount: this.bondCount,
      atom1ID: this.atom1.uniqueID,
      atom2ID: this.atom2.uniqueID
    };
  }
}

moleculesAndLight.register( 'AtomicBond', AtomicBond );

export default AtomicBond;