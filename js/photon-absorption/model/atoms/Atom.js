// Copyright 2002-2014, University of Colorado

/**
 * Class that represents an atom in the model.  This model is expected to be extended by specific atoms.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // Static data
  var instanceCount = 0; // Base count for the unique ID of this atom.

  /**
   * Constructor for the Atom.  Allows one to specify the color, radius, and mass of this atom.
   *
   * @param {string} representationColor - The desired color of the atom
   * @param {number} radius - The radius of the model atom
   * @param {number} mass - Mass of this atom
   * @constructor
   */
  function Atom( representationColor, radius, mass ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
    } );

    // Instance Variables
    this.representationColor = representationColor;
    this.radius = radius;
    this.mass = mass;
    this.uniqueID = instanceCount++;

  }

  return inherit( PropertySet, Atom, {

    /**
     * Set the position of this atom from a single vector.
     *
     * @param {Vector2} position - The desired position of this atom as a Vector
     */
    setPositionVec: function( position ) {
      if ( this.positionProperty !== position ) {
        this.positionProperty.set( position );
      }
    },

    /**
     * Set the position of this atom from point coordinates.
     *
     * @param {number} x - The desired x coordinate of this atom
     * @param {number} y - The desired y coordinate of this atom
     */
    setPosition: function( x, y ) {
      if ( this.positionProperty.get.x !== x || this.positionProperty.get.y !== y ) {
        this.positionProperty.set( new Vector2( x, y ) );
      }
    }
  }, {

    // @static factory functions, for creating specific atoms
    carbon: function() { return new Atom( 'gray', 77, 12.011 ); },
    hydrogen: function() { return new Atom( 'white', 37, 1 ); },
    nitrogen: function() { return new Atom( 'blue', 75, 14.00674 ); },
    oxygen: function() { return new Atom( PhetColorScheme.RED_COLORBLIND, 73, 12.011 ); }
  } );

} );
