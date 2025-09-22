// Copyright 2021-2025, University of Colorado Boulder

/**
 * Visual representation of a molecule.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Molecule from '../model/Molecule.js';
import AtomicBondNode from './AtomicBondNode.js';
import AtomNode from './AtomNode.js';

class MoleculeNode extends Node {

  // Carry this node through the scope in nested functions.
  private readonly modelViewTransform: ModelViewTransform2;

  /**
   * Constructor for a molecule node.
   */
  public constructor( molecule: Molecule, modelViewTransform: ModelViewTransform2, providedOptions?: NodeOptions ) {

    // supertype constructor
    super( providedOptions );

    this.modelViewTransform = modelViewTransform;

    // Instance Data
    const atomTopLayer = new Node();
    const atomBottomLayer = new Node();
    const bondTopLayer = new Node();
    const bondBottomLayer = new Node();

    this.addChild( bondBottomLayer );
    this.addChild( atomBottomLayer );
    this.addChild( bondTopLayer );
    this.addChild( atomTopLayer );

    const atoms = molecule.getAtoms();

    // Create nodes and add the atoms which compose this molecule to the atomLayer.
    for ( let i = 0; i < atoms.length; i++ ) {
      const atom = molecule.getAtoms()[ i ];
      const atomNode = new AtomNode( atom, this.modelViewTransform );
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
    const atomNodes = atomTopLayer.children.concat( atomBottomLayer.children ) as unknown as AtomNode[];
    molecule.highElectronicEnergyStateProperty.link( () => {
      for ( let i = 0; i < atomNodes.length; i++ ) {
        const atomNode = atomNodes[ i ];
        atomNode.setHighlighted( molecule.highElectronicEnergyStateProperty.get() );
      }
    } );
  }
}

greenhouseEffect.register( 'MoleculeNode', MoleculeNode );

export default MoleculeNode;