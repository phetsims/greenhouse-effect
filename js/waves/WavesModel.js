// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import greenhouseEffect from '../greenhouseEffect.js';
import Wave from './Wave.js';
import WaveParameterModel from './WaveParameterModel.js';

class WavesModel {
  constructor( options ) {

    this.timeProperty = new NumberProperty( 0 );

    this.yellowWaveParameterModel = new WaveParameterModel( 'yellow' );
    this.redWaveParameterModel = new WaveParameterModel( 'red' );
    this.cloudsVisibleProperty = new BooleanProperty( true );

    this.waves = [];

    this.reset();
  }

  step( dt ) {
    this.timeProperty.value += dt;
    this.waves.forEach( wave => wave.step( dt ) );

    const GROUND_Y = 510;
    if ( this.waves[ 0 ].endPoint.y >= GROUND_Y && !this.redWave1 ) {
      this.redWave1 = new Wave( new Vector2( this.waves[ 0 ].startPoint.x, GROUND_Y ), Vector2.createPolar( 1, -Math.PI / 4 ), this.redWaveParameterModel, 10 );
      this.waves.push( this.redWave1 );
    }
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    delete this.redWave1;

    this.waves.length = 0;
    this.incomingYellowWave1 = new Wave( new Vector2( 100, 0 ), new Vector2( 0, 1 ), this.yellowWaveParameterModel, 5 );
    this.waves.push( this.incomingYellowWave1 );
    // this.waves.push( new Wave( new Vector2( 200, 0 ), new Vector2( 200, 1000 ), this.redWaveParameterModel ) );
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;