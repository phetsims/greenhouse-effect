// Copyright 2021-2022, University of Colorado Boulder

/**
 * Node for a Cloud in the Greenhouse Effect simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Cloud from '../model/Cloud.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// constants
const CLOUD_FILL = new Color( 255, 255, 255, 0.75 );
const CLOUD_BACKGROUND_STROKE = Color.BLACK;

type CloudNodeOptions = {
  showReferenceEllipse: boolean;
} & NodeOptions;

class CloudNode extends Node {
  private readonly disposeCloudNode: () => void;

  /**
   * @param cloud
   * @param modelViewTransform
   * @param [options]
   */
  public constructor( cloud: Cloud, modelViewTransform: ModelViewTransform2, options?: CloudNodeOptions ) {

    options = merge( {

      // {boolean} - useful for debugging
      showReferenceEllipse: false

    }, options ) as CloudNodeOptions;

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
   */
  public static createCloudShape( position: Vector2, width: number, height: number ): Shape {

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
   */
  public override dispose(): void {
    this.disposeCloudNode();
    super.dispose();
  }
}

greenhouseEffect.register( 'CloudNode', CloudNode );
export default CloudNode;