// Copyright 2002-2014, University of Colorado

/**
 * Class that represents an atom of Nitrogen in the model.
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

  // Model data for the Nitrogen atom
  var REPRESENTATION_COLOR = Color.BLUE;
  var MASS = 14.00674;   // In atomic mass units (AMU).
  var RADIUS = 75;     // In picometers.

  // Static data
  var instanceCount = 0; // Base count for the unique ID of this atom.

  /**
   * Constructor for a Nitrogen atom.  There is an optional Vector2 parameter
   * which specifies the location of this Nitrogen atom.
   *
   * @constructor
   */
  function NitrogenAtom() {

    // Supertype constructor
    Atom.call( this, REPRESENTATION_COLOR, RADIUS, MASS );

    this.uniqueID = 'nitrogen' + instanceCount++;

  }

  return inherit( Atom, NitrogenAtom );

} );
