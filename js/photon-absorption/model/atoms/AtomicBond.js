// Copyright 2002-2014, University of Colorado

/**
 * Model that represents an atomic bond between two atoms.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor for an Atomic Bond between two atoms.
   *
   * @param {Atom} atom1 - Atom involved in the bond
   * @param {Atom} atom2 - Atom involved in the bond
   * @param {Object} [options]
   * @constructor
   */
  function AtomicBond( atom1, atom2, options ) {

    options = _.extend( {
      // defaults
      bondCount: 1 // Indicates whether this is a single, double, triple, etc. bond.
    }, options );

    // @public (read-only)
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.bondCount = options.bondCount;

  }

  return inherit( Object, AtomicBond, {

    // serialization support
    toStateObject: function(){
      return {
        bondCount: this.bondCount,
        atom1ID: this.atom1.uniqueID,
        atom2ID: this.atom2.uniqueID
      };
  }
  } );
} );
