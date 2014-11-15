// Copyright 2002-2014, University of Colorado

/**
 * Visual representation of a molecule.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AtomNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/AtomNode' );
  var AtomicBondNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/AtomicBondNode' );

  /**
   * Constructor for a molecule node.
   *
   * @param {Molecule} molecule
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function MoleculeNode( molecule, mvt ) {

    // supertype constructor
    Node.call( this );

    // Carry this node through the scope in nested functions.
    var thisNode = this;
    this.mvt = mvt;

    // Instance Data
    var atomLayer = new Node();
    var bondLayer = new Node();
    thisNode.addChild( bondLayer ); // Order the bond layer first so that atomic bonds are behind atoms in view
    thisNode.addChild( atomLayer );

    // Create nodes and add the atoms which compose this molecule to the atomLayer.
    for ( var atom = 0; atom < molecule.getAtoms().length; atom++ ) {
      this.atomNode = new AtomNode( molecule.getAtoms()[atom], thisNode.mvt );
      atomLayer.addChild( this.atomNode );
    }

    // Create and add the atomic bonds which form the structure of this molecule to the bondLayer
    var atomicBonds = molecule.getAtomicBonds();
    for ( var i = 0; i < atomicBonds.length; i++ ) {
      bondLayer.addChild( new AtomicBondNode( atomicBonds[i], this.mvt ) );
    }

    // Link the high energy state to the property in the model.
    molecule.highElectronicEnergyStateProperty.link( function() {
      for ( var i = 0; i < atomLayer.children.length; i++ ) {
        var atomNode = atomLayer.getChildAt( i );
        atomNode.setHighlighted( molecule.highElectronicEnergyStateProperty.get() );
      }

    } );

  }

  return inherit( Node, MoleculeNode );

} );