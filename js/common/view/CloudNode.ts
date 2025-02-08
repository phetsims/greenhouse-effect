// Copyright 2021-2025, University of Colorado Boulder

/**
 * Node for a Cloud in the Greenhouse Effect simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Random from '../../../../dot/js/Random.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SceneryEvent from '../../../../scenery/js/input/SceneryEvent.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Cloud from '../model/Cloud.js';

// constants
const CLOUD_FILL = new Color( 255, 255, 255, 0.75 );
const CLOUD_BACKGROUND_STROKE = Color.BLACK;

type SelfOptions = {

  // useful for debugging
  showReferenceEllipse?: boolean;
};
type CloudNodeOptions = SelfOptions;

class CloudNode extends Node {
  private readonly cloudPath: Path;
  private randomlyGeneratedCloudShape: Shape;
  private isAlternative = false;
  private dragEventCount = 0;
  private readonly dragPoints: Vector2[] = [];
  private readonly disposeCloudNode: () => void;

  public constructor( cloud: Cloud,
                      modelViewTransform: ModelViewTransform2,
                      randomNumberGeneratorSeedProperty: TReadOnlyProperty<number>,
                      providedOptions?: CloudNodeOptions ) {

    const options = optionize<CloudNodeOptions, SelfOptions, NodeOptions>()( {
      showReferenceEllipse: false
    }, providedOptions );

    super( options );

    this.cloudPath = new Path( null, {
      fill: CLOUD_FILL,
      stroke: CLOUD_BACKGROUND_STROKE,
      miterLimit: 1
    } );
    this.addChild( this.cloudPath );

    // Create an initial dummy shape to keep TypeScript from complaining.
    this.randomlyGeneratedCloudShape = Shape.rect( 0, 0, 10, 10 );

    // Create the cloud shape, and update it if and when the random seed changes.  This is done for phet-io, so that the
    // clouds will look the same in the state wrappers and when configured and saved in Studio.
    randomNumberGeneratorSeedProperty.link( seed => {
      const random = new Random( { seed: seed } );
      this.randomlyGeneratedCloudShape = CloudNode.createCloudShape(
        modelViewTransform.modelToViewPosition( cloud.position ),
        Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
        Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) ),
        random
      );
      this.cloudPath.setShape( this.randomlyGeneratedCloudShape );
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

    // Happy Easter!
    let mostRecentDragEventTime = Number.NEGATIVE_INFINITY;
    let testLayer: Node;
    this.addInputListener( new DragListener( {
      start: () => {
        if ( this.dragEventCount !== 1 || mostRecentDragEventTime + 4000 < phet.joist.elapsedTime ) {
          this.dragPoints.length = 0;
          this.dragEventCount = 0;
          if ( testLayer && this.hasChild( testLayer ) ) {
            this.removeChild( testLayer );
          }
        }
      },
      drag: ( event: SceneryEvent ) => {
        this.dragPoints.push( this.globalToParentPoint( event.pointer.point ) );
      },
      end: () => {
        this.dragEventCount++;
        mostRecentDragEventTime = phet.joist.elapsedTime;
        if ( !this.isAlternative && this.dragEventCount === 2 ) {
          testLayer = new Node( { visible: false } );
          this.addChild( testLayer );

          // Add the points to the test layer.
          this.dragPoints.forEach( dp => {
            testLayer.addChild( new Circle( 0.5, {
              stroke: 'red',
              center: dp
            } ) );
          } );

          // Are all points within the bounds of the cloud?
          const cloudBounds = modelViewTransform.modelToViewShape( cloud.modelShape ).getBounds();
          const allPointsInCloudBounds = this.dragPoints.reduce(
            ( allInCloud, currentValue ) => {
              return cloudBounds.containsPoint( currentValue ) && allInCloud;
            },
            true
          );

          if ( allPointsInCloudBounds ) {

            // Calculate the bounds of the points created by the user's drag action.
            const draggedLinesBounds = Bounds2.NOTHING.copy();
            for ( const dragPoint of this.dragPoints ) {
              draggedLinesBounds.minX = Math.min( draggedLinesBounds.minX, dragPoint.x );
              draggedLinesBounds.minY = Math.min( draggedLinesBounds.minY, dragPoint.y );
              draggedLinesBounds.maxX = Math.max( draggedLinesBounds.maxX, dragPoint.x );
              draggedLinesBounds.maxY = Math.max( draggedLinesBounds.maxY, dragPoint.y );
            }

            // Are the bounds big enough and roughly rectangular?
            const area = draggedLinesBounds.width * draggedLinesBounds.height;
            const aspectRatio = draggedLinesBounds.width / draggedLinesBounds.height;
            if ( area > 200 && aspectRatio > 0.5 && aspectRatio < 1.5 ) {
              const centerBounds = draggedLinesBounds.dilatedXY(
                -draggedLinesBounds.width / 3,
                -draggedLinesBounds.height / 3
              );
              testLayer.addChild( Rectangle.bounds( draggedLinesBounds, { stroke: 'orange' } ) );
              testLayer.addChild( Rectangle.bounds( centerBounds, { stroke: 'red' } ) );
              const minDimension = Math.min( centerBounds.width, centerBounds.height );
              const squaredCenterBounds = new Bounds2(
                centerBounds.centerX - minDimension / 2,
                centerBounds.centerY - minDimension / 2,
                centerBounds.centerX + minDimension / 2,
                centerBounds.centerY + minDimension / 2
              );
              const createTestShape = ( xTranslation: number, yTranslation: number ) => Shape
                .bounds( squaredCenterBounds )
                .transformed( Matrix3.rotationAround( Math.PI / 4, centerBounds.centerX, centerBounds.centerY ) )
                .transformed( Matrix3.translation( xTranslation, yTranslation ) );
              const leftEdgeTestShape = createTestShape( -draggedLinesBounds.width / 2, 0 );
              testLayer.addChild( new Path( leftEdgeTestShape, { fill: 'blue' } ) );
              const rightEdgeTestShape = createTestShape( draggedLinesBounds.width / 2, 0 );
              testLayer.addChild( new Path( rightEdgeTestShape, { fill: 'yellow' } ) );
              const topEdgeTestShape = createTestShape( 0, draggedLinesBounds.height / 2 );
              testLayer.addChild( new Path( topEdgeTestShape, { fill: 'green' } ) );
              const bottomEdgeTestShape = createTestShape( 0, -draggedLinesBounds.height / 2 );
              testLayer.addChild( new Path( bottomEdgeTestShape, { fill: 'cyan' } ) );

              // Are the points in the right places and not in the wrong places?
              if ( CloudNode.boundsContainsPointFromList( centerBounds, this.dragPoints ) &&
                   !CloudNode.shapeContainsPointFromList( leftEdgeTestShape, this.dragPoints ) &&
                   !CloudNode.shapeContainsPointFromList( rightEdgeTestShape, this.dragPoints ) &&
                   !CloudNode.shapeContainsPointFromList( topEdgeTestShape, this.dragPoints ) &&
                   !CloudNode.shapeContainsPointFromList( bottomEdgeTestShape, this.dragPoints ) ) {

                // I want to believe.
                this.cloudPath.setShape( CloudNode.createAlternativeShape(
                  modelViewTransform.modelToViewPosition( cloud.position ),
                  Math.abs( modelViewTransform.modelToViewDeltaX( cloud.width ) ),
                  Math.abs( modelViewTransform.modelToViewDeltaY( cloud.height ) )
                ) );
                this.isAlternative = true;
              }
            }
          }
          this.dragEventCount = 0;
        }
        else if ( this.isAlternative ) {
          this.cloudPath.setShape( this.randomlyGeneratedCloudShape );
          this.isAlternative = false;
          this.dragEventCount = 0;
        }
        else if ( this.dragEventCount === 1 && this.dragPoints.length < 4 ) {

          // This is just a click, so start things over.
          this.dragEventCount = 0;
          this.dragPoints.length = 0;
        }
      },

      // phet-io
      tandem: Tandem.OPT_OUT
    } ) );
  }

  public reset(): void {
    if ( this.isAlternative ) {
      this.cloudPath.setShape( this.randomlyGeneratedCloudShape );
      this.isAlternative = false;
      this.dragPoints.length = 0;
      this.dragEventCount = 0;
    }
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
   * Test a set of points to see if at least one is contained within the provided bounds.
   */
  private static boundsContainsPointFromList( bounds: Bounds2, pointList: Vector2[] ): boolean {
    for ( const point of pointList ) {
      if ( bounds.containsPoint( point ) ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Test a set of points to see if at least one is contained within the provided Shape.
   */
  private static shapeContainsPointFromList( shape: Shape, pointList: Vector2[] ): boolean {
    for ( const point of pointList ) {
      if ( shape.containsPoint( point ) ) {
        return true;
      }
    }
    return false;
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