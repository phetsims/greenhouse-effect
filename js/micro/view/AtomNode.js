// Copyright 2021, University of Colorado Boulder

/**
 * Class that represents an atom in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Circle, Node, RadialGradient } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class AtomNode extends Node {

  /**
   * Constructor for an atom node.
   *
   * @param {Atom} atom
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( atom, modelViewTransform ) {

    // supertype constructor
    super();

    // Instance Data
    this.atom = atom; // @private
    this.modelViewTransform = modelViewTransform; // @private

    // Scale the radius to the modelViewTransform.
    const transformedRadius = modelViewTransform.modelToViewDeltaX( atom.radius );

    // Create a color gradient which is used when the molecule enters an excitation state.
    const haloGradientPaint = new RadialGradient( 0, 0, 0, 0, 0, transformedRadius * 2 ).addColorStop( 0, 'yellow' ).addColorStop( 1, 'rgba( 255, 255, 51, 0 )' );
    this.highlightNode = new Circle( transformedRadius * 2, { fill: haloGradientPaint } ); // @private
    // Don't add the highlight halo now - wait until the first time it is used.  This is done for performance reasons.

    // Represent the atom as a shaded sphere node.
    const atomNode = new ShadedSphereNode( transformedRadius * 2, { mainColor: this.atom.representationColor } );
    this.addChild( atomNode );

    // Link the model position to the position of this node.
    this.atom.positionProperty.link( () => {
      this.translation = this.modelViewTransform.modelToViewPosition( this.atom.positionProperty.get() );
    } );
  }


  /**
   * Highlight this atom to represent that it is in an excited state.
   * @param {boolean} highlighted
   * @public
   */
  setHighlighted( highlighted ) {
    if ( highlighted && !this.hasChild( this.highlightNode ) ) {
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
}

greenhouseEffect.register( 'AtomNode', AtomNode );

export default AtomNode;