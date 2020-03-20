// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../greenhouseEffect.js';
import WaveParameterModel from './WaveParameterModel.js';

class WavesModel {
  constructor( options ) {

    this.timeProperty = new NumberProperty( 0 );

    this.yellowWaveParameterModel = new WaveParameterModel( 'yellow' );
    this.redWaveParameterModel = new WaveParameterModel( 'red' );
  }

  step( dt ) {
    this.timeProperty.value += dt;
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;