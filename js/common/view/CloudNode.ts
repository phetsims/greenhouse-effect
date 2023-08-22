// Copyright 2021-2023, University of Colorado Boulder

/**
 * Node for a Cloud in the Greenhouse Effect simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, DragListener, Node, NodeOptions, Path, SceneryEvent } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Cloud from '../model/Cloud.js';
import Random from '../../../../dot/js/Random.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const CLOUD_FILL = new Color( 255, 255, 255, 0.75 );
const CLOUD_BACKGROUND_STROKE = Color.BLACK;

type SelfOptions = {

  // useful for debugging
  showReferenceEllipse?: boolean;
};
type CloudNodeOptions = SelfOptions;

class CloudNode extends Node {
  private readonly disposeCloudNode: () => void;

  public constructor( cloud: Cloud,
                      modelViewTransform: ModelViewTransform2,
                      randomNumberGeneratorSeedProperty: TReadOnlyProperty<number>,
                      providedOptions?: CloudNodeOptions ) {

    const options = optionize<CloudNodeOptions, SelfOptions, NodeOptions>()( {
      showReferenceEllipse: false
    }, providedOptions );

    super( options );

    const cloudPath = new Path( null, {
      fill: CLOUD_FILL,
      stroke: CLOUD_BACKGROUND_STROKE,
      miterLimit: 1
    } );
    this.addChild( cloudPath );

    // Create the cloud shape, and update it if and when the random seed changes.  This is done for phet-io, so that the
    // clouds will look the same in the state wrappers and when configured and saved in Studio.
    randomNumberGeneratorSeedProperty.link( seed => {
      const random = new Random( { seed: seed } );
      const cloudShape = CloudNode.createCloudShape(
        modelViewTransform.modelToViewPosition( cloud.position ),
        Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
        Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) ),
        random
      );
      cloudPath.setShape( cloudShape );
    } );

    // If specified, show an ellipse that corresponds to the strict model shape of the cloud.  This is useful for debug.
    if ( options.showReferenceEllipse ) {
      this.addChild( new Path( modelViewTransform.modelToViewShape( cloud.modelShape ), {
        fill: new Color( 255, 0, 0, 0.5 ),
        stroke: new Color( 255, 0, 0, 0.9 ),
        lineWidth: 3
      } ) );
    }

    // Control the visibility of the cloud.
    const cloudEnabledObserver = ( enabled: boolean ) => { this.visible = enabled;};
    cloud.enabledProperty.link( cloudEnabledObserver );

    this.disposeCloudNode = () => {
      cloud.enabledProperty.unlink( cloudEnabledObserver );
    };

    const dragPoints: Vector2[] = [];
    const cloudBounds = modelViewTransform.modelToViewShape( cloud.modelShape ).getBounds();
    let isShip = false;
    this.addInputListener( new DragListener( {
      start: () => {
        dragPoints.length = 0;
      },
      drag: ( event: SceneryEvent ) => {
        dragPoints.push( this.globalToParentPoint( event.pointer.point ) );
      },
      end: () => {
        if ( !isShip ) {
          const allPointsInCloud = dragPoints.reduce(
            ( allInCloud, currentValue ) => {
              return cloudBounds.containsPoint( currentValue ) && allInCloud;
            },
            true
          );
          const pointsNearCenter = dragPoints.filter( p => p.distance( this.center ) < this.width / 20 );
          const cx = this.center.x;
          const cy = this.center.y;
          const pointsInUpperLeft = dragPoints.filter( p => cx - p.x > this.width / 8 && cy - p.y > this.height / 8 );
          const pointsInUpperRight = dragPoints.filter( p => p.x - cx > this.width / 8 && cy - p.y > this.height / 8 );
          const pointsInLowerLeft = dragPoints.filter( p => cx + p.x > this.width / 8 && p.y - cy > this.height / 8 );
          const pointsInLowerRight = dragPoints.filter( p => p.x - cx > this.width / 8 && p.y - cy > this.height / 8 );

          if ( allPointsInCloud &&
               pointsNearCenter.length > 0 &&
               pointsInUpperLeft.length > 0 &&
               pointsInLowerLeft.length > 0 &&
               pointsInUpperRight.length > 0 &&
               pointsInLowerRight.length > 0 ) {

            cloudPath.setShape( CloudNode.createAlternativeShape(
              modelViewTransform.modelToViewPosition( cloud.position ),
              Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
              Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) )
            ) );
            isShip = true;
          }
        }
        else {
          cloudPath.setShape( CloudNode.createCloudShape(
            modelViewTransform.modelToViewPosition( cloud.position ),
            Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
            Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) )
          ) );
          isShip = false;
        }
      },

      // phet-io
      tandem: Tandem.OPT_OUT
    } ) );
  }

  /**
   * Create a blobby cloud-like shape to represent the cloud. Returns a Shape to be used with a Path.
   */
  public static createCloudShape( centerPosition: Vector2,
                                  width: number,
                                  height: number,
                                  random: Random = dotRandom ): Shape {

    const circleShapes = [];
    const leftBound = centerPosition.x - width / 2;
    const rightBound = centerPosition.x + width / 2;

    // limits for individual circle sizes, empirically determined
    const circleMinimumRadius = height * 0.5;
    const circleMaximumRadius = height * 0.7;

    // horizontal position of the circle being drawn, updated with each iteration
    let nextLeftCircleCenterX = leftBound;
    let nextRightCircleCenterX = rightBound;

    // The vertical position is shifted down slightly so that the bottom of the cloud can look somewhat flat and still
    // contain the elliptical shape that is used in the model.
    const adjustedReferenceBottomY = centerPosition.y + circleMaximumRadius * 0.7;

    // max random shift in the up or down (Y) direction for each circle, empirically determined
    const maxYShift = circleMaximumRadius * 0.025;

    // Generate the circles that will be combined to define the shape.  This is done iteratively starting from the
    // left and right sides and working towards the middle.  The circles on the outer edges are smaller than those
    // towards the center.
    let circleSetComplete = false;
    while ( !circleSetComplete ) {

      // Compute a multiplier that will be used to scale the circles down at the left and right edges and allow them to
      // be full size in the center.  This equation was empirically determined.
      const scaleMultiplier = Math.min( 0.3 + 1 - ( centerPosition.x - nextLeftCircleCenterX ) / ( width / 2 ), 1 );

      // Create the min and max radius values for the circle based on where it is.
      const minArcRadius = circleMinimumRadius * scaleMultiplier;
      const maxArcRadius = circleMaximumRadius * scaleMultiplier;

      // Add the next circle on the left side, moving towards center.
      const nextLeftCircleRadius = random.nextDoubleBetween( minArcRadius, maxArcRadius );

      nextLeftCircleCenterX += nextLeftCircleRadius;

      // Set the Y position, but use a little bit of randomness for a more natural look.
      const nextLeftCircleCenterY = adjustedReferenceBottomY -
                                    nextLeftCircleRadius -
                                    random.nextDoubleBetween( -maxYShift, maxYShift );

      // Add the new circle to our collection.
      circleShapes.push(
        Shape.arc( nextLeftCircleCenterX, nextLeftCircleCenterY, nextLeftCircleRadius, 0, 2 * Math.PI )
      );

      // Add the next circle on the right side, moving towards center.
      const nextRightCircleRadius = random.nextDoubleBetween( minArcRadius, maxArcRadius );

      nextRightCircleCenterX -= nextRightCircleRadius;

      // Set the Y position, but use a little bit of randomness for a more natural look.
      const nextRightCircleCenterY = adjustedReferenceBottomY -
                                     nextRightCircleRadius -
                                     random.nextDoubleBetween( -maxYShift, maxYShift );

      // Add the new circle to our collection.
      circleShapes.push(
        Shape.arc( nextRightCircleCenterX, nextRightCircleCenterY, nextRightCircleRadius, 0, 2 * Math.PI )
      );

      // Decide if we're done by looking at how close the last two circles are.
      const interCircleDistance = nextRightCircleCenterX - nextLeftCircleCenterX;
      if ( interCircleDistance < minArcRadius ) {
        circleSetComplete = true;
      }
    }

    return Shape.union( circleShapes );
  }

  public static createAlternativeShape( centerPosition: Vector2,
                                        width: number,
                                        height: number ): Shape {
    const domeWidth = width / 2;
    const domeHeight = height * 0.4;
    const domeStart = centerPosition.plusXY( -domeWidth / 2, -domeHeight / 2 );
    const domeEnd = domeStart.plusXY( domeWidth, 0 );
    const shape = new Shape();
    shape.moveToPoint( domeStart );
    shape.ellipticalArcTo( domeWidth / 2, domeHeight, 0, false, true, domeEnd.x, domeEnd.y );
    shape.ellipticalArcTo( domeWidth / 2, domeHeight * 0.2, 0, false, true, domeStart.x, domeStart.y );
    shape.ellipticalArcTo( domeWidth, domeHeight, 0, true, false, domeEnd.x, domeEnd.y );
    shape.ellipticalArcTo( domeWidth / 2, domeHeight * 0.2, 0, false, true, domeStart.x, domeStart.y );

    const portalRadius = height / 8;
    const portalCenters = [
      centerPosition.plusXY( -width / 4, height / 4 * 0.7 ),
      centerPosition.plusXY( 0, height / 4 ),
      centerPosition.plusXY( width / 4, height / 4 * 0.7 )
    ];
    portalCenters.forEach( portalCenter => {
      shape.moveToPoint( portalCenter.plusXY( portalRadius, 0 ) );
      shape.circle( portalCenter, portalRadius );
    } );

    const faceCenter = portalCenters[ 2 ];
    const eyeRadiusX = portalRadius * 0.2;
    const eyeRadiusY = portalRadius * 0.1;
    const rightEyeCenter = faceCenter.plusXY( -portalRadius * 0.4, -portalRadius * 0.3 );
    shape.moveToPoint( rightEyeCenter );
    shape.ellipse( rightEyeCenter, eyeRadiusX, eyeRadiusY, Math.PI / 4 );
    const leftEyeCenter = faceCenter.plusXY( portalRadius * 0.4, -portalRadius * 0.3 );
    shape.moveToPoint( leftEyeCenter );
    shape.ellipse( leftEyeCenter, eyeRadiusX, eyeRadiusY, -Math.PI / 4 );
    const smileCenter = faceCenter.plusXY( 0, portalRadius / 3 );
    const smileWidth = portalRadius;
    shape.moveToPoint( smileCenter.plusXY( -smileWidth / 2, 0 ) );
    shape.ellipticalArcTo( portalRadius, portalRadius, 0, false, false, smileCenter.x + smileWidth / 2, smileCenter.y );

    return shape;
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