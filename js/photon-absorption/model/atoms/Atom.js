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

  /**
   * Constructor for the Atom.  Allows one to specify the color, radius, and mass of this atom.
   *
   * @param {Color} representationColor - The desired color of the atom
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

  }

  return inherit( PropertySet, Atom, {

    /**
     * Get the position of this Atom.
     *
     * @return {Vector2} - The position vector of this atom.
     */
    getPositionRef: function() {
      return this.positionProperty.get();
    },

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
    },

    /**
     * Get the representation color of this atom.
     *
     * @return {Color} representationColor - The color representing this atom
     */
    getRepresentationColor: function() {
      return this.representationColor;
    },

    /**
     * Get the radius of this atom.
     *
     * @return {number} radius - The radius of this atom
     */
    getRadius: function() {
      return this.radius;
    },

    /**
     * Get the mass of this atom.
     *
     * @return {number} mass - The mass of this atom.
     */
    getMass: function() {
      return this.mass;
    }
  } );
} );
