// Copyright 2021-2025, University of Colorado Boulder

/**
 * Class that represents an atom in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Atom from '../model/atoms/Atom.js';

class AtomNode extends Node {
  private atom: Atom;
  private modelViewTransform: ModelViewTransform2;
  private readonly highlightNode: Circle;

  /**
   * Constructor for an atom node.
   *
   * @param atom - The atom represented by this view node.
   * @param modelViewTransform - Model-view transformation for positioning.
   */
  public constructor( atom: Atom, modelViewTransform: ModelViewTransform2 ) {
    super();

    this.atom = atom;
    this.modelViewTransform = modelViewTransform;

    // Scale the radius to the modelViewTransform.
    const transformedRadius = modelViewTransform.modelToViewDeltaX( atom.radius );

    // Create a color gradient which is used when the molecule enters an excitation state.
    const haloGradientPaint = new RadialGradient( 0, 0, 0, 0, 0, transformedRadius * 2 ).addColorStop( 0, 'yellow' ).addColorStop( 1, 'rgba( 255, 255, 51, 0 )' );
    this.highlightNode = new Circle( transformedRadius * 2, { fill: haloGradientPaint } );
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
   * @param highlighted
   */
  public setHighlighted( highlighted: boolean ): void {
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