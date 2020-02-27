// Copyright 2014-2019, University of Colorado Boulder

/**
 * Visual representation of a molecule.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import AtomicBondNode from './AtomicBondNode.js';
import AtomNode from './AtomNode.js';

/**
 * Constructor for a molecule node.
 *
 * @param {Molecule} molecule
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function MoleculeNode( molecule, modelViewTransform ) {

  // supertype constructor
  Node.call( this );

  // Carry this node through the scope in nested functions.
  const self = this;
  this.modelViewTransform = modelViewTransform; // @private

  // Instance Data
  const atomLayer = new Node();
  const bondLayer = new Node();
  self.addChild( bondLayer ); // Order the bond layer first so that atomic bonds are behind atoms in view
  self.addChild( atomLayer );

  // Create nodes and add the atoms which compose this molecule to the atomLayer.
  for ( let atom = 0; atom < molecule.getAtoms().length; atom++ ) {
    this.atomNode = new AtomNode( molecule.getAtoms()[ atom ], self.modelViewTransform );
    atomLayer.addChild( this.atomNode );
  }

  // Create and add the atomic bonds which form the structure of this molecule to the bondLayer
  const atomicBonds = molecule.getAtomicBonds();
  for ( let i = 0; i < atomicBonds.length; i++ ) {
    bondLayer.addChild( new AtomicBondNode( atomicBonds[ i ], this.modelViewTransform ) );
  }

  // Link the high energy state to the property in the model.
  molecule.highElectronicEnergyStateProperty.link( function() {
    for ( let i = 0; i < atomLayer.children.length; i++ ) {
      const atomNode = atomLayer.getChildAt( i );
      atomNode.setHighlighted( molecule.highElectronicEnergyStateProperty.get() );
    }

  } );
}

moleculesAndLight.register( 'MoleculeNode', MoleculeNode );

inherit( Node, MoleculeNode );
export default MoleculeNode;