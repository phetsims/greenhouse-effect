// Copyright 2021, University of Colorado Boulder

/**
 * Node for a Cloud of Greenhouse Effect.
 *
 * @author Jesse Greenberg
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const CLOUD_FILL = 'white';
const CLOUD_BACKGROUND_STROKE = 'black';

class CloudNode extends Node {

  /**
   * @param {Cloud} cloud
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( cloud, modelViewTransform, options ) {
    super( options );

    const cloudBackgroundPath = new Path( this.createBlobShape(
      modelViewTransform.modelToViewPosition( cloud.position ),
      Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
      Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) )
    ), {
      fill: CLOUD_FILL,
      stroke: CLOUD_BACKGROUND_STROKE,
      miterLimit: 1
    } );
    this.addChild( cloudBackgroundPath );
  }

  /**
   * Create a blobby cloud like shape to represent the cloud. Returns a Shape to be used with a Path.
   *
   * NOTE: this is temporary, may have artwork or refine the look of the cloud sometime in the future.
   *
   * @private
   *
   * @param position
   * @param width
   * @param height
   * @returns {Shape}
   */
  createBlobShape( position, width, height ) {
    const circleShapes = [];
    let drawnWidth = 0;

    // center and radius of the circle being drawn updated each iteration
    let arcCenterX = position.x - width / 2;
    let arcRadius = 0;

    while ( drawnWidth < position.x + width / 2 ) {

      // radius is random, but limited by the height
      arcRadius = dotRandom.nextDoubleBetween( height * 0.6, height * 0.8 );

      // the final arc should not be larger than the available width of the cloud
      arcRadius = Math.min( arcRadius, position.x + width / 2 - drawnWidth );
      assert && assert( arcRadius > 0, 'Radius needs to be larger than zero to draw arc' );

      arcCenterX = arcCenterX + arcRadius;
      const circleShape = Shape.arc( arcCenterX, position.y, arcRadius, 0, 2 * Math.PI );
      circleShapes.push( circleShape );

      drawnWidth = arcCenterX + arcRadius;
    }

    return Shape.union( circleShapes );
  }
}

greenhouseEffect.register( 'CloudNode', CloudNode );
export default CloudNode;