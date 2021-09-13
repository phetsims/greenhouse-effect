// Copyright 2021, University of Colorado Boulder

/**
 * Node for a Cloud in the Greenhouse Effect simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const CLOUD_FILL = new Color( 255, 255, 255, 0.75 );
const CLOUD_BACKGROUND_STROKE = Color.BLACK;

class CloudNode extends Node {

  /**
   * @param {Cloud} cloud
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( cloud, modelViewTransform, options ) {

    options = merge( {

      // {boolean} - useful for debugging
      showReferenceEllipse: false

    }, options );

    super( options );

    const cloudPath = new Path( CloudNode.createCloudShape(
      modelViewTransform.modelToViewPosition( cloud.position ),
      Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
      Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) )
    ), {
      fill: CLOUD_FILL,
      stroke: CLOUD_BACKGROUND_STROKE,
      miterLimit: 1
    } );
    this.addChild( cloudPath );

    // If specified, show an ellipse that corresponds to the strict model shape of the cloud.  This is useful for debug.
    if ( options.showReferenceEllipse ) {
      this.addChild( new Path( modelViewTransform.modelToViewShape( cloud.modelShape ), {
        fill: new Color( 255, 0, 0, 0.5 ),
        stroke: new Color( 255, 0, 0, 0.9 ),
        lineWidth: 3
      } ) );
    }

    // Control the visibility of the cloud.
    const cloudEnabledObserver = cloud.enabledProperty.linkAttribute( this, 'visible' );

    this.disposeCloudNode = () => {
      cloud.enabledProperty.unlinkAttribute( cloudEnabledObserver );
    };
  }

  /**
   * Create a blobby cloud-like shape to represent the cloud. Returns a Shape to be used with a Path.
   *
   * TODO: This may be temporary, since we may have artwork or may refine the look of the cloud sometime in the future.
   *       See https://github.com/phetsims/greenhouse-effect/issues/49.
   *
   * @param {Vector2} position
   * @param {number} width
   * @param {number} height
   * @returns {Shape}
   * @public
   */
  static createCloudShape( position, width, height ) {

    const circleShapes = [];
    let drawnWidth = 0;
    const leftBound = position.x - width / 2;
    const rightBound = position.x + width / 2;

    // limits for circle sizes, empirically determined
    const circleMinimumRadius = height * 0.5;
    const circleMaximumRadius = height * 0.7;

    // horizontal position of the circle being drawn, updated with each iteration
    let arcCenterX = leftBound;

    // The vertical position is shifted down slightly so that the bottom of the cloud can look flat and still contain
    // the elliptical shape that is used in the model.
    const adjustedReferenceCenterY = position.y + circleMaximumRadius * 0.3;

    // max random shift up or down in the Y direction, empirically determined
    const maxYShift = circleMaximumRadius * 0.025;

    // used to align the circles
    let firstCircleRadius = 0;

    // Add a set of overlapping circles with some randomness of size and position to create the cloud shape.
    while ( leftBound + drawnWidth < rightBound ) {

      const proportionDrawn = drawnWidth / width;

      // The radius is random, but limited by the height and the Y position within the cloud.  The circles on the ends
      // are a little smaller than those in the middle.
      let minArcRadius = circleMinimumRadius;
      let maxArcRadius = circleMaximumRadius;
      if ( proportionDrawn < 0.25 ) {

        // This circle is on the left side, scale it down a bit.
        const reductionMultiplier = 1 - 2 * ( 0.25 - proportionDrawn );
        minArcRadius = reductionMultiplier * minArcRadius;
        maxArcRadius = reductionMultiplier * maxArcRadius;
      }
      else if ( proportionDrawn > 0.75 ) {

        // This circle is on the right side, scale it down a bit.
        const reductionMultiplier = 0.5 + 2 * ( 1 - proportionDrawn );
        minArcRadius = reductionMultiplier * minArcRadius;
        maxArcRadius = reductionMultiplier * maxArcRadius;
      }

      // Choose the arc radius using randomness and the constraints determined above.
      const arcRadius = dotRandom.nextDoubleBetween( minArcRadius, maxArcRadius );

      if ( circleShapes.length === 0 ) {

        // Keep track of the radius of the first circle so we can use it later to line things up.
        firstCircleRadius = arcRadius;
      }

      arcCenterX = arcCenterX + arcRadius;

      // Adjust the Y position so that the bottom of the cloud is more flat than the top.
      const arcCenterY = firstCircleRadius ?
                         adjustedReferenceCenterY - ( arcRadius - firstCircleRadius ) - dotRandom.nextDoubleBetween( -maxYShift, maxYShift ) :
                         adjustedReferenceCenterY;

      // Add this circle to our collection.
      const circleShape = Shape.arc( arcCenterX, arcCenterY, arcRadius, 0, 2 * Math.PI );
      circleShapes.push( circleShape );

      drawnWidth = arcCenterX + arcRadius - leftBound;
    }

    return Shape.union( circleShapes );
  }

  /**
   * Free memory references to avoid leaks.
   * @public
   */
  dispose() {
    this.disposeCloudNode();
    super.dispose();
  }
}

greenhouseEffect.register( 'CloudNode', CloudNode );
export default CloudNode;