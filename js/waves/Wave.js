// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

class Wave {
  constructor( startPoint, unitVector, parameterModel, timeToTriggerEnd ) {
    this.startPoint = startPoint;
    this.parameterModel = parameterModel;
    this.unitVector = unitVector;
    this.endPoint = this.startPoint;
    this.timeToTriggerEnd = timeToTriggerEnd;
    this.time = 0;
    this.phi = 0;
  }

  step( dt ) {
    this.time += dt;

    const dx = dt * 60;
    this.endPoint = this.endPoint.plus( this.unitVector.timesScalar( dx ) );
    if ( this.time >= this.timeToTriggerEnd ) {
      this.startPoint = this.startPoint.plus( this.unitVector.timesScalar( dx ) );

      // kx-wt+phi => dphi = dkx
      this.phi += this.parameterModel.kProperty.value * dx;
    }
  }
}

greenhouseEffect.register( 'Wave', Wave );

export default Wave;