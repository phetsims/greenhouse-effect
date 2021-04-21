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
   * Constructor for creating an individual atom.  This is generally invoked using factory methods for specify atoms.
   *
   * @param {string} representationColor - The desired color of the atom
   * @param {number} radius - The radius of the model atom
   * @param {number} mass - Mass of this atom
   * @param {Object} options
   * @constructor
   */
  function Atom( representationColor, radius, mass, options ) {

    options = _.extend( {
      initialPosition: Vector2.ZERO,
      idOverride: null // used to override the generation of an ID, used only for deserialization
    }, options );

    PropertySet.call( this, {
      position: options.initialPosition
    } );

    // Instance Variables
    this.representationColor = representationColor;
    this.radius = radius;
    this.mass = mass;
    this.uniqueID = options.idOverride || instanceCount++;
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
    },

    // serialization support
    toStateObject: function() {
      return {
        representationColor: this.representationColor,
        radius: this.radius,
        mass: this.mass,
        uniqueID: this.uniqueID,
        position: this.positionProperty.value.toStateObject()
      };
    }
  }, {

    // @static factory functions for creating specific atoms
    carbon: function() { return new Atom( 'gray', 77, 12.011, {} ); },
    hydrogen: function() { return new Atom( 'white', 37, 1, {} ); },
    nitrogen: function() { return new Atom( 'blue', 75, 14.00674, {} ); },
    oxygen: function() { return new Atom( PhetColorScheme.RED_COLORBLIND.toCSS(), 73, 12.011, {} ); },

    // support for deserialization
    fromStateObject: function( stateObject ) {
      return new Atom( stateObject.representationColor, stateObject.radius, stateObject.mass, {
        idOverride: stateObject.uniqueID,
        initialPosition: Vector2.fromStateObject( stateObject.position )
      } );
    }
  } );

} );
