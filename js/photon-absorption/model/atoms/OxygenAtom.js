// Copyright 2002-2014, University of Colorado

/**
 * Class that represents an atom of Oxygen in the model.
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

  // Model data for the Oxygen atom.
  var REPRESENTATION_COLOR = new Color( 255, 85, 0 ); // Reddish color that also looks good in colorblind tests
  var MASS = 12.011;   // In atomic mass units (AMU).
  var RADIUS = 73;     // In picometers.

  // Static Data
  var instanceCount = 0; // Base count for the unique ID of this atom

  /**
   * Constructor for an Oxygen atom.  There is an optional Vector2 parameter
   * which specifies the location of this Oxygen atom.
   *
   * @param {Object} [options]
   * @constructor
   */
  function OxygenAtom( options ) {
    // Supertype constructor
    Atom.call( this, options );

    options = _.extend( {
      // defaults
      positionProperty: new Property( new Vector2( 0, 0 ) ) // position of the atom
    }, options );

    this.options = options;
    this.uniqueID = 'oxygen' + instanceCount++;
    this.representationColor = REPRESENTATION_COLOR;
    this.radius = RADIUS;
    this.mass = MASS;
    this.positionProperty = options.positionProperty;

  }

  return inherit( Atom, OxygenAtom );

} );
