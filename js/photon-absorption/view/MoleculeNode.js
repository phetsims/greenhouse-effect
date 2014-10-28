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
   * @param { Molecule } molecule
   * @param { ModelViewTransform2 } mvt
   * @constructor
   */
  function MoleculeNode( molecule, mvt ) {

    /// supertype constructor
    Node.call( this );

    // Cary this node through the scope in nested functions.
    var thisNode = this;
    this.mvt = mvt;

    // Hold the atom count to carry through scope of nested functions.
    this.atomCount = 0;

    // Instance Data
    thisNode.atomLayer = new Node();
    thisNode.bondLayer = new Node();
    thisNode.addChild( thisNode.atomLayer );
    thisNode.addChild( thisNode.bondLayer );

    // Create nodes and add the atoms which compose this molecule to the atomLayer.
    for ( var atom = 0; atom < molecule.getAtoms().length; atom++ ) {
      this.atomNode = new AtomNode( molecule.getAtoms()[atom], thisNode.mvt );
      this.atomLayer.addChild( this.atomNode );
    }

    // Create and add the atomic bonds which form the structure of this molecule to the bondLayer
    var atomicBonds = molecule.getAtomicBonds();
    for ( var i = 0; i < atomicBonds.length; i++ ) {
      thisNode.bondLayer.addChild( new AtomicBondNode( atomicBonds[i], this.mvt ) );
    }

    // Link the high energy state to the property in the model.
    molecule.highElectronicEnergyStateProperty.link( function() {
      for ( var i = 0; i < thisNode.atomLayer.children.length; i++ ) {
        var atomNode = thisNode.atomLayer.getChildAt( i );
        atomNode.setHighlighted( molecule.isHighElectronicEnergyState() );
      }

    } );

    // Move the bond layer behind the atoms.
    this.bondLayer.moveToBack();

    // Make sure the highlighting is correct when the simulation starts.
    molecule.trigger( 'electronicEnergyStateChanged' );

  }

  return inherit( Node, MoleculeNode );

} );