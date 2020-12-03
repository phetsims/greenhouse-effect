// Copyright 2014-2020, University of Colorado Boulder

/**
 * Class that represents an atom in the model.  This model is expected to be extended by specific atoms.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Property from '../../../../../axon/js/Property.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import moleculesAndLight from '../../../moleculesAndLight.js';

// Static data
let instanceCount = 0; // Base count for the unique ID of this atom.

class Atom {

  /**
   * Constructor for creating an individual atom.  This is generally invoked using factory methods for specify atoms.
   *
   * @param {string} representationColor - The desired color of the atom
   * @param {number} radius - The radius of the model atom
   * @param {number} mass - Mass of this atom
   * @param {Object} [options]
   */
  constructor( representationColor, radius, mass, options ) {

    options = merge( {
      initialPosition: Vector2.ZERO,

      // if true, the atom will be on the top layer of atoms in the visualization, to support 3D looking molecules
      topLayer: false,

      idOverride: null // used to override the generation of an ID, used only for deserialization
    }, options );

    // @public
    this.positionProperty = new Property( options.initialPosition, options );

    // @public (read-only) {boolean}
    this.topLayer = options.topLayer;

    // @public (read-only)
    this.representationColor = representationColor;
    this.radius = radius;
    this.mass = mass;
    this.uniqueID = options.idOverride || instanceCount++;
  }


  /**
   * Set the position of this atom from a single vector.
   * @private
   *
   * @param {Vector2} position - The desired position of this atom as a Vector
   */
  setPositionVec( position ) {
    if ( this.positionProperty.get() !== position ) {
      this.positionProperty.set( position );
    }
  }

  /**
   * Set the position of this atom from point coordinates.
   * @public
   *
   * @param {number} x - The desired x coordinate of this atom
   * @param {number} y - The desired y coordinate of this atom
   */
  setPosition( x, y ) {
    if ( this.positionProperty.get().x !== x || this.positionProperty.get().y !== y ) {
      this.positionProperty.set( new Vector2( x, y ) );
    }
  }

  // serialization support
  // @public
  toStateObject() {
    return {
      representationColor: this.representationColor,
      radius: this.radius,
      mass: this.mass,
      uniqueID: this.uniqueID,
      position: this.positionProperty.get().toStateObject()
    };
  }

  // @static
  // @public
  static carbon( options ) { return new Atom( 'gray', 77, 12.011, options ); }

  // @static
  // @public
  static hydrogen( options ) { return new Atom( 'white', 37, 1, options ); }

  // @static
  // @public
  static nitrogen( options ) { return new Atom( 'blue', 75, 14.00674, options ); }

  // @static
  // @public
  static oxygen( options ) { return new Atom( PhetColorScheme.RED_COLORBLIND.toCSS(), 73, 12.011, options ); }

  // support for deserialization
  // @public
  static fromStateObject( stateObject ) {
    return new Atom( stateObject.representationColor, stateObject.radius, stateObject.mass, {
      idOverride: stateObject.uniqueID,
      initialPosition: Vector2.fromStateObject( stateObject.position )
    } );
  }
}

moleculesAndLight.register( 'Atom', Atom );

export default Atom;