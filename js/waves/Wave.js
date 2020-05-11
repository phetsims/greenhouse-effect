// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

class Wave {
  constructor( sourcePoint, destinationPoint, parameterModel, totalDistance ) {
    this.sourcePoint = sourcePoint;
    this.destinationPoint = destinationPoint;
    this.parameterModel = parameterModel;
    this.endPoint = this.sourcePoint;
    this.time = 0;
    this.phi = 0;

    this.speed = 60;
    this.totalDistance = totalDistance;

    const totalTime = this.totalDistance / this.speed;

    const travelDistance = this.destinationPoint.minus( this.sourcePoint ).getMagnitude();

    // Time for the trailing edeg to reach the destination
    this.timeForTrailingEdgeToReachDestination = travelDistance / this.speed + totalTime;

    // Time for the leading edge to reach the destination
    this.timeForLeadingEdgeToReachDestination = travelDistance / this.speed;
  }

  step( dt ) {
    this.time += dt;
  }
}

greenhouseEffect.register( 'Wave', Wave );

export default Wave;