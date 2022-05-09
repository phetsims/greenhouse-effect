// Copyright 2021-2022, University of Colorado Boulder

/**
 * RandomIcon is a Scenery node that meets the size constraints of the screen icons needed for PhET simulations.  It is
 * intended to be used as a temporary icon while development is in progress, eventually being replaced with something
 * "real".
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Random from '../../../../dot/js/Random.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Screen from '../../../../joist/js/Screen.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color, LinearGradient, Path, Rectangle } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const NUM_SHAPES = 2;
const NUM_SEGMENTS_PER_SHAPE = 5;

class RandomIcon extends ScreenIcon {

  /**
   * @param {number} seed - seed value for the random number generator
   */
  constructor( seed: number ) {

    const maxX = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
    const maxY = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
    const random = new Random( { seed: seed } );

    // add the background
    const background = new Rectangle( 0, 0, maxX, maxY, 0, 0, {
      fill: generateRandomLinearGradient( maxX, maxY, random )
    } );

    // set a clip area, since sometimes the random control points can cause the shape to go outside the icon bounds
    background.clipArea = Shape.rect( 0, 0, maxX, maxY );

    // create the artwork
    _.times( NUM_SHAPES, () => {
      const shape = generateRandomShape( NUM_SEGMENTS_PER_SHAPE, maxX, maxY, random );
      background.addChild( new Path( shape, {
        fill: generateRandomLinearGradient( maxX, maxY, random ),
        stroke: generateRandomColor( random )
      } ) );
    } );

    super( background );
  }
}

/**
 * @private, function to generate a random color
 */
const generateRandomColor = ( random: Random ): Color => {
  const r = Math.floor( random.nextDouble() * 256 );
  const g = Math.floor( random.nextDouble() * 256 );
  const b = Math.floor( random.nextDouble() * 256 );
  return new Color( r, g, b );
};

/**
 * utility function to generate a random linear gradient
 */
const generateRandomLinearGradient = ( maxX: number, maxY: number, random: Random ): LinearGradient => {
  const vertical = random.nextDouble() > 0.5;
  let gradient;
  if ( vertical ) {
    gradient = new LinearGradient( random.nextDouble() * maxX, 0, random.nextDouble() * maxX, maxY );
  }
  else {
    gradient = new LinearGradient( 0, random.nextDouble() * maxY, maxX, random.nextDouble() * maxY );
  }
  gradient.addColorStop( 0, generateRandomColor( random ) );
  gradient.addColorStop( 1, generateRandomColor( random ) );
  return gradient;
};

/**
 * utility function to generate a random point
 */
const generateRandomPoint = ( maxX: number, maxY: number, random: Random ): Vector2 => {
  return new Vector2( random.nextDouble() * maxX, random.nextDouble() * maxY );
};

/**
 * utility function to generate a random shape segment
 * @param shape
 * @param maxX
 * @param maxY
 * @param {Random} random
 * @private
 */
const addRandomSegment = ( shape: Shape, maxX: number, maxY: number, random: Random ) => {
  const decider = random.nextDouble();
  const endpoint = generateRandomPoint( maxX, maxY, random );
  let controlPoint1;
  let controlPoint2;
  if ( decider < 0.33 ) {

    // add a line segment
    shape.lineToPoint( endpoint );
  }
  else if ( decider < 0.66 ) {

    // add a quadratic curve
    controlPoint1 = generateRandomPoint( maxX, maxY, random );
    shape.quadraticCurveTo( controlPoint1.x, controlPoint1.y, endpoint.x, endpoint.y );
  }
  else {

    // add a cubic curve
    controlPoint1 = generateRandomPoint( maxX, maxY, random );
    controlPoint2 = generateRandomPoint( maxX, maxY, random );
    shape.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endpoint.x, endpoint.y );
  }
};

/**
 * utility function to generate random shape
 */
const generateRandomShape = ( numSegments: number, maxX: number, maxY: number, random: Random ): Shape => {
  const shape = new Shape();
  shape.moveToPoint( generateRandomPoint( maxX, maxY, random ) );
  for ( let i = 0; i < numSegments; i++ ) {
    addRandomSegment( shape, maxX, maxY, random );
  }
  shape.close();
  return shape;
};

greenhouseEffect.register( 'RandomIcon', RandomIcon );
export default RandomIcon;