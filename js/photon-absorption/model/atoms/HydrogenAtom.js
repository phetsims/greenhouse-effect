// Copyright 2002-2014, University of Colorado

/**
 * Class that represents an atom of hydrogen in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  var Property = require( 'AXON/Property' );

  // Model data for the Hydrogen atom
  var REPRESENTATION_COLOR = Color.WHITE;
  var MASS = 1;   // In atomic mass units (AMU).
  var RADIUS = 37;     // In picometers.

  // Static Variable
  var instanceCount = 0; // Base count for unique ID of this atom.

  /**
   * Constructor for a Hydrogen atom.
   *
   * @constructor
   */
  function HydrogenAtom() {

    // Supertype constructor
    Atom.call( this, REPRESENTATION_COLOR, RADIUS, MASS );

    this.uniqueID = 'hydrogen' + instanceCount++;

  }

  return inherit( Atom, HydrogenAtom );

} );
