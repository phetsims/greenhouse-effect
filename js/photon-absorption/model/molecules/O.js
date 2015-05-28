// Copyright 2002-2014, University of Colorado

/**
 * Class that represents a single atom of oxygen in the model.  I hate to name a class "O", but it is necessary for
 * consistency with other molecules names.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  var Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );

  /**
   * Constructor for a single atom of oxygen.
   *
   * @param {Object} options
   * @constructor
   */
  function O( options ) {

    // Supertype constructor
    Molecule.call( this, options );

    // Instance Data
    this.oxygenAtom = Atom.oxygen();

    // Configure the base class.
    this.addAtom( this.oxygenAtom );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  return inherit( Molecule, O, {

    /**
     * Initialize and set the center of gravity offsets for the position of this Oxygen atom.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, 0 ) );
      this.updateAtomPositions();

    }

  } );
} );
