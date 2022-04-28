// Copyright 2021, University of Colorado Boulder

/**
 * Class that represents an atomic bond in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Line, Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants that control the width of the bond representation with with respect to the average atom radius.
const BOND_WIDTH_PROPORTION_SINGLE = 0.45;
const BOND_WIDTH_PROPORTION_DOUBLE = 0.28;
const BOND_WIDTH_PROPORTION_TRIPLE = 0.24;
const BOND_COLOR = 'rgb(0, 200, 0)';

class AtomicBondNode extends Node {

  /**
   * Constructor for an atomic bond node.
   *
   * @param {AtomicBond} atomicBond
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( atomicBond, modelViewTransform ) {
    assert && assert( atomicBond.bondCount > 0 && atomicBond.bondCount <= 3 );  // Only single through triple bonds currently supported.

    // supertype constructor
    super();

    // @private
    this.atomicBond = atomicBond;
    this.modelViewTransform = modelViewTransform;
    this.atomicBonds = []; // Array which holds the lines for the atomicBonds.

    // Carry this node through the scope in nested functions.

    // Calculate the width to use for the bond representation(s) // @private

    this.averageAtomRadius = modelViewTransform.modelToViewDeltaX( ( atomicBond.atom1.radius + atomicBond.atom2.radius ) / 2 );

    // Create the initial representation.
    this.initializeRepresentation();

    // Link the atomic bond view node to the model.  Atomic bonds must be updated when either atom changes position.
    this.atomicBond.atom1.positionProperty.link( () => {
      this.updateRepresentation();
    } );
    this.atomicBond.atom2.positionProperty.link( () => {
      this.updateRepresentation();
    } );

  }


  /**
   * Draw the initial lines which represent the atomic bonds.  This function should only be called once.  Drawing the
   * lines a single time should provide a performance benefit.  This will also set the bond width for the lines for
   * each case of 1, 2, or 3 atomic bonds.
   * @private
   */
  initializeRepresentation() {

    let bondWidth; // Width of the line representing this bond.  Dependent on the number of bonds between the atoms.
    let bond1; // First bond shared by the atoms.
    let bond2; // Second bond shared by the atoms.
    let bond3; // Third bond shared by the atoms.

    switch( this.atomicBond.bondCount ) {
      case 1:
        bondWidth = BOND_WIDTH_PROPORTION_SINGLE * this.averageAtomRadius;
        bond1 = new Line( { lineWidth: bondWidth, stroke: BOND_COLOR } );
        this.atomicBonds.push( bond1 );
        this.addChild( bond1 );
        break;

      case 2:
        bondWidth = BOND_WIDTH_PROPORTION_DOUBLE * this.averageAtomRadius;
        bond1 = new Line( { lineWidth: bondWidth, stroke: BOND_COLOR } );
        bond2 = new Line( { lineWidth: bondWidth, stroke: BOND_COLOR } );
        this.atomicBonds.push( bond1, bond2 );
        this.addChild( bond1 );
        this.addChild( bond2 );
        break;

      case 3:

        // Draw the bonds.
        bondWidth = BOND_WIDTH_PROPORTION_TRIPLE * this.averageAtomRadius;
        bond1 = new Line( { lineWidth: bondWidth, stroke: BOND_COLOR } );
        bond2 = new Line( { lineWidth: bondWidth, stroke: BOND_COLOR } );
        bond3 = new Line( { lineWidth: bondWidth, stroke: BOND_COLOR } );
        this.atomicBonds.push( bond1, bond2, bond3 );
        this.addChild( bond1 );
        this.addChild( bond2 );
        this.addChild( bond3 );
        break;

      default:
        console.error( ` - Error: Can't represent bond number, value = ${this.atomicBond.getBondCount()}` );
        assert && assert( false );
        break;
    }
  }

  /**
   * Update the atomic bond positions by setting the end points of line to the positions of the
   * atoms which share the bond.
   * @private
   */
  updateRepresentation() {

    // centers of the atoms in view coordinates
    const atom1Position = this.modelViewTransform.modelToViewPosition( this.atomicBond.atom1.positionProperty.get() );
    const atom2Position = this.modelViewTransform.modelToViewPosition( this.atomicBond.atom2.positionProperty.get() );

    // bond position offsets in view coordinates
    const p1BondOffset = this.modelViewTransform.modelToViewDelta( this.atomicBond.atom1PositionOffset );
    const p2BondOffset = this.modelViewTransform.modelToViewDelta( this.atomicBond.atom2PositionOffset );

    // Point describing position of one end of the line representing this atomic bond.
    const p1 = atom1Position.plus( p1BondOffset );

    // Point describing position of the other end of the line representing the atomic bond.
    const p2 = atom2Position.plus( p2BondOffset );

    let offsetVector; // Vector which places the atomic bonds an offset away from the center between the atoms.
    let angle; // An angle used to describe the offset vector.
    let transformedRadius; // A position required to calculate the offset vector.

    switch( this.atomicBond.bondCount ) {

      case 1:

        // Single bond, so connect it from the center of one atom to the center of the other
        this.atomicBonds[ 0 ].setLine( p1.x, p1.y, p2.x, p2.y );
        break;

      case 2:

        // Double bond.
        transformedRadius = this.modelViewTransform.modelToViewDeltaX( Math.min( this.atomicBond.atom1.radius,
          this.atomicBond.atom2.radius ) );
        // Get the center points of the two atoms.
        angle = Math.atan2( p1.x - p2.x, p1.y - p2.y );
        // Create a vector that will act as the offset from the center point to the origin of the bond line.
        offsetVector = Vector2.createPolar( transformedRadius / 3, angle );

        // Draw the bonds.
        this.atomicBonds[ 0 ].setLine( p1.x + offsetVector.x, p1.y - offsetVector.y, p2.x + offsetVector.x, p2.y - offsetVector.y );
        offsetVector.rotate( Math.PI );
        this.atomicBonds[ 1 ].setLine( p1.x + offsetVector.x, p1.y - offsetVector.y, p2.x + offsetVector.x, p2.y - offsetVector.y );
        break;

      case 3:

        // Triple bond.
        transformedRadius = this.modelViewTransform.modelToViewDeltaX( Math.min( this.atomicBond.atom1.radius,
          this.atomicBond.atom2.radius ) );
        // Get the center points of the two atoms.
        angle = Math.atan2( p1.x - p2.x, p1.y - p2.y );
        // Create a vector that will act as the offset from the center point to the origin of the bond line.
        offsetVector = Vector2.createPolar( transformedRadius * 0.6, angle );

        // Draw the bonds.
        this.atomicBonds[ 0 ].setLine( p1.x, p1.y, p2.x, p2.y );
        this.atomicBonds[ 1 ].setLine( p1.x + offsetVector.x, p1.y - offsetVector.y, p2.x + offsetVector.x, p2.y - offsetVector.y );
        offsetVector.rotate( Math.PI );
        this.atomicBonds[ 2 ].setLine( p1.x + offsetVector.x, p1.y - offsetVector.y, p2.x + offsetVector.x, p2.y - offsetVector.y );
        break;

      default:
        console.error( ` - Error: Can't represent bond number, value = ${this.atomicBond.bondCount}` );
        assert && assert( false );
        break;

    }
  }
}

greenhouseEffect.register( 'AtomicBondNode', AtomicBondNode );

export default AtomicBondNode;