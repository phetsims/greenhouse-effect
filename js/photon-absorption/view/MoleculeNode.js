// Copyright 2014-2017, University of Colorado Boulder

/**
 * Visual representation of a molecule.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const AtomicBondNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/AtomicBondNode' );
  const AtomNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/AtomNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const Node = require( 'SCENERY/nodes/Node' );

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
    var self = this;
    this.modelViewTransform = modelViewTransform; // @private

    // Instance Data
    var atomLayer = new Node();
    var bondLayer = new Node();
    self.addChild( bondLayer ); // Order the bond layer first so that atomic bonds are behind atoms in view
    self.addChild( atomLayer );

    // Create nodes and add the atoms which compose this molecule to the atomLayer.
    for ( var atom = 0; atom < molecule.getAtoms().length; atom++ ) {
      this.atomNode = new AtomNode( molecule.getAtoms()[ atom ], self.modelViewTransform );
      atomLayer.addChild( this.atomNode );
    }

    // Create and add the atomic bonds which form the structure of this molecule to the bondLayer
    var atomicBonds = molecule.getAtomicBonds();
    for ( var i = 0; i < atomicBonds.length; i++ ) {
      bondLayer.addChild( new AtomicBondNode( atomicBonds[ i ], this.modelViewTransform ) );
    }

    // Link the high energy state to the property in the model.
    molecule.highElectronicEnergyStateProperty.link( function() {
      for ( var i = 0; i < atomLayer.children.length; i++ ) {
        var atomNode = atomLayer.getChildAt( i );
        atomNode.setHighlighted( molecule.highElectronicEnergyStateProperty.get() );
      }

    } );

  }

  moleculesAndLight.register( 'MoleculeNode', MoleculeNode );

  return inherit( Node, MoleculeNode );

} );