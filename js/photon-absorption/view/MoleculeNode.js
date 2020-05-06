// Copyright 2014-2020, University of Colorado Boulder

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
function MoleculeNode( molecule, modelViewTransform, options ) {

  // supertype constructor
  Node.call( this, options );

  // Carry this node through the scope in nested functions.
  const self = this;
  this.modelViewTransform = modelViewTransform; // @private

  // Instance Data
  const atomTopLayer = new Node();
  const atomBottomLayer = new Node();
  const bondTopLayer = new Node();
  const bondBottomLayer = new Node();

  self.addChild( bondBottomLayer );
  self.addChild( atomBottomLayer );
  self.addChild( bondTopLayer );
  self.addChild( atomTopLayer );

  const atoms = molecule.getAtoms();

  // Create nodes and add the atoms which compose this molecule to the atomLayer.
  for ( let i = 0; i < atoms.length; i++ ) {
    const atom = molecule.getAtoms()[ i ];
    const atomNode = new AtomNode( atom, self.modelViewTransform );
    if ( atom.topLayer ) {
      atomTopLayer.addChild( atomNode );
    }
    else {
      atomBottomLayer.addChild( atomNode );
    }
  }

  // Create and add the atomic bonds which form the structure of this molecule to the bondLayer
  const atomicBonds = molecule.getAtomicBonds();
  for ( let i = 0; i < atomicBonds.length; i++ ) {
    const bond = atomicBonds[ i ];
    const bondNode = new AtomicBondNode( atomicBonds[ i ], this.modelViewTransform );
    if ( bond.topLayer ) {
      bondTopLayer.addChild( bondNode );
    }
    else {
      bondBottomLayer.addChild( bondNode );
    }
  }

  // Link the high energy state to the property in the model.
  const atomNodes = atomTopLayer.children.concat( atomBottomLayer.children );
  molecule.highElectronicEnergyStateProperty.link( function() {
    for ( let i = 0; i < atomNodes.length; i++ ) {
      const atomNode = atomNodes[ i ];
      atomNode.setHighlighted( molecule.highElectronicEnergyStateProperty.get() );
    }
  } );
}

moleculesAndLight.register( 'MoleculeNode', MoleculeNode );

inherit( Node, MoleculeNode );
export default MoleculeNode;