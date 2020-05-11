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

// constants
const GROUND_Y = 510;
const incomingWaveX = 400;

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

    // Yellow wave leading edge reaches earth
    if ( this.waves[ 0 ].time >= this.waves[ 0 ].timeForLeadingEdgeToReachDestination && !this.redWave1 ) {
      const sourcePoint = new Vector2( this.waves[ 0 ].sourcePoint.x, GROUND_Y );
      const destinationPoint = sourcePoint.plus( Vector2.createPolar( 500, -Math.PI / 4 ) );
      this.redWave1 = new Wave( sourcePoint, destinationPoint, this.redWaveParameterModel, 400 );
      this.waves.push( this.redWave1 );

      this.incomingYellowWave2 = new Wave( new Vector2( incomingWaveX + 100, 100 ), new Vector2( incomingWaveX + 100, GROUND_Y ), this.yellowWaveParameterModel, 400 );
      this.waves.push( this.incomingYellowWave2 );
    }

    // detect tail reaching the destination
    // if ( this.waves[ 0 ].time >= this.waves[ 0 ].timeForTrailingEdgeToReachDestination ) {
    //   this.reset();
    // }
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    delete this.redWave1;

    this.waves.length = 0;


    const sourcePoint = new Vector2( incomingWaveX, 100 );
    const destinationPoint = new Vector2( incomingWaveX, GROUND_Y );
    this.incomingYellowWave1 = new Wave( sourcePoint, destinationPoint, this.yellowWaveParameterModel, 200 );
    this.waves.push( this.incomingYellowWave1 );
    // this.waves.push( new Wave( new Vector2( 200, 0 ), new Vector2( 200, 1000 ), this.redWaveParameterModel ) );
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;