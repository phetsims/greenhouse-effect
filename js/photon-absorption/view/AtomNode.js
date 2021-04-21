// Copyright 2002-2014, University of Colorado

/**
 * Class that represents an atom in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  /**
   * Constructor for an atom node.
   *
   * @param {Atom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function AtomNode( atom, modelViewTransform ) {

    // supertype constructor
    Node.call( this );

    // Carry this node through the scope in nested functions.
    var thisNode = this;

    // Instance Data
    thisNode.atom = atom; // @private
    thisNode.modelViewTransform = modelViewTransform; // @private

    // Scale the radius to the modelViewTransform.
    var transformedRadius = modelViewTransform.modelToViewDeltaX( atom.radius );

    // Create a color gradient which is used when the molecule enters an excitation state.
    var haloGradientPaint = new RadialGradient( 0, 0, 0, 0, 0, transformedRadius * 2 ).addColorStop( 0, 'yellow' ).addColorStop( 1, 'rgba( 255, 255, 51, 0 )' );
    this.highlightNode = new Circle( transformedRadius * 2, { fill: haloGradientPaint } ); // @private
    // Don't add the highlight halo now - wait until the first time it is used.  This is done for performance reasons.

    // Represent the atom as a shaded sphere node.
    var atomNode = new ShadedSphereNode( transformedRadius * 2, { mainColor: this.atom.representationColor } );
    thisNode.addChild( atomNode );

    // Link the model position to the position of this node.
    this.atom.positionProperty.link( function() {
      thisNode.translation = thisNode.modelViewTransform.modelToViewPosition( thisNode.atom.position );
    } );
  }

  return inherit( Node, AtomNode, {

    /**
     * Highlight this atom to represent that it is in an excited state.
     * @param {boolean} highlighted
     */
    setHighlighted: function( highlighted ) {
      if ( highlighted && !this.isChild( this.highlightNode ) ) {
        // add the highlight halo the first time it is needed (i.e. lazily) for better performance.
        this.addChild( this.highlightNode );
        this.highlightNode.moveToBack();
      }

      // Use opacity instead of visibility.  This performs better, especially on iPad.  See issues #91, #93, and #98.
      // It's also a workaround for an issue in scenery where visibility changes are costly, see
      // https://github.com/phetsims/scenery/issues/404.  When this issue is resolved, the workaround can be replaced
      // with a visibility setting (assuming the hints described in the issue are used).
      this.highlightNode.opacity = highlighted ? 0.99 : 0;
    }
  } );
} );
