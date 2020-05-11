// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import greenhouseEffect from '../greenhouseEffect.js';

class Wave {
  constructor( type, sourcePoint, destinationPoint, parameterModel, totalDistance, options ) {
    options = merge( {
      onLeadingEdgeReachesTarget: _.noop,
      onAlmostDone: _.noop,
      onTrailingEdgeReachesTarget: _.noop
    }, options );
    this.type = type;
    this.sourcePoint = sourcePoint;
    this.destinationPoint = destinationPoint;
    this.parameterModel = parameterModel;
    this.endPoint = this.sourcePoint;
    this.time = 0;
    this.phi = 0;

    this.speed = 80;
    this.totalDistance = totalDistance;

    const totalTime = this.totalDistance / this.speed;

    const travelDistance = this.destinationPoint.minus( this.sourcePoint ).getMagnitude();

    // Time for the trailing edeg to reach the destination
    this.timeForTrailingEdgeToReachDestination = travelDistance / this.speed + totalTime;

    // Time for the leading edge to reach the destination
    this.timeForLeadingEdgeToReachDestination = travelDistance / this.speed;

    this.onLeadingEdgeReachesTarget = options.onLeadingEdgeReachesTarget;
    this.onAlmostDone = options.onAlmostDone;
    this.onTrailingEdgeReachesTarget = options.onTrailingEdgeReachesTarget;
  }

  step( dt ) {

    if ( this.parameterModel.modeProperty.value !== 'Paused' ) {
      this.time += dt;

      if ( this.onLeadingEdgeReachesTarget && this.leadingEdgeReachedDestination ) {
        this.onLeadingEdgeReachesTarget( this );
        delete this.onLeadingEdgeReachesTarget;
      }
      if ( this.onAlmostDone && this.almostDone ) {
        this.onAlmostDone( this );
        delete this.onAlmostDone;
      }
      if ( this.onTrailingEdgeReachesTarget && this.trailingEdgeReachedDestination ) {
        this.onTrailingEdgeReachesTarget( this );
        delete this.onTrailingEdgeReachesTarget;
      }
    }
  }

  get leadingEdgeReachedDestination() {
    return this.time >= this.timeForLeadingEdgeToReachDestination;
  }

  get almostDone() {
    return this.time >= this.timeForLeadingEdgeToReachDestination * 0.6 + this.timeForTrailingEdgeToReachDestination * 0.4;
  }

  get trailingEdgeReachedDestination() {
    return this.time >= this.timeForTrailingEdgeToReachDestination;
  }
}

greenhouseEffect.register( 'Wave', Wave );

export default Wave;