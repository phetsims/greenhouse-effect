// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import greenhouseEffect from '../greenhouseEffect.js';

class Wave {
  constructor( startPoint, endPoint, parameterModel ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.parameterModel = parameterModel;
  }
}

greenhouseEffect.register( 'Wave', Wave );

export default Wave;