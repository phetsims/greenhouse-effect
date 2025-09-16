// Copyright 2021, University of Colorado Boulder

/**
 * Model that represents an atomic bond between two atoms.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import Atom from './Atom.js';

// State object for serialization
export type AtomicBondStateObject = {
  atom1ID: number;
  atom2ID: number;
  bondCount: number;
};

type AtomicBondOptions = {

  // Indicates whether this is a single, double, triple, etc. bond.
  bondCount?: number;

  // if true, the atom will be in the top layer in the visualization, to support 3D looking molecules
  topLayer?: boolean;

  // offsets for the positions of the bond endpoints, relative to the centers of each atom in model coordinates
  atom1PositionOffset?: Vector2;
  atom2PositionOffset?: Vector2;
};

class AtomicBond {
  public readonly atom1: Atom;
  public readonly atom2: Atom;
  public readonly bondCount: number;
  public readonly topLayer: boolean;
  public readonly atom1PositionOffset: Vector2;
  public readonly atom2PositionOffset: Vector2;

  /**
   * Constructor for an Atomic Bond between two atoms.
   *
   * @param atom1 - Atom involved in the bond
   * @param atom2 - Atom involved in the bond
   * @param [providedOptions]
   */
  public constructor( atom1: Atom, atom2: Atom, providedOptions: AtomicBondOptions ) {

    const options = optionize<AtomicBondOptions>()( {
      bondCount: 1,
      topLayer: false,
      atom1PositionOffset: new Vector2( 0, 0 ),
      atom2PositionOffset: new Vector2( 0, 0 )
    }, providedOptions );

    this.atom1 = atom1;
    this.atom2 = atom2;
    this.bondCount = options.bondCount;
    this.topLayer = options.topLayer;
    this.atom1PositionOffset = options.atom1PositionOffset;
    this.atom2PositionOffset = options.atom2PositionOffset;
  }

  // serialization support
  public toStateObject(): AtomicBondStateObject {
    return {
      bondCount: this.bondCount,
      atom1ID: this.atom1.uniqueID,
      atom2ID: this.atom2.uniqueID
    };
  }
}

greenhouseEffect.register( 'AtomicBond', AtomicBond );

export default AtomicBond;