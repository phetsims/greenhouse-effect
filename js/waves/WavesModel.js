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
    if ( this.waves[ 0 ].leadingEdgeReachedDestination && !this.redWave1Incoming ) {
      const sourcePoint = new Vector2( this.waves[ 0 ].sourcePoint.x, GROUND_Y );

      // TODO: may be in phase if integral number of wavelengths
      // const k=2pi/L;
      // const L = 2pi/k;
      const L = Math.PI * 2 / this.redWaveParameterModel.kProperty.value;
      const destinationPoint = sourcePoint.plus( Vector2.createPolar( L * 5, -Math.PI / 4 ) );
      this.redWave1Incoming = new Wave( sourcePoint, destinationPoint, this.redWaveParameterModel, 400 );
      this.waves.push( this.redWave1Incoming );

      // this.incomingYellowWave2 = new Wave( new Vector2( incomingWaveX + 100, 100 ), new Vector2( incomingWaveX + 100, GROUND_Y ), this.yellowWaveParameterModel, 400 );
      // this.waves.push( this.incomingYellowWave2 );
    }

    if ( this.redWave1Incoming && this.redWave1Incoming.leadingEdgeReachedDestination && !this.redWave1Reflected ) {
      this.redWave1Reflected = new Wave( this.redWave1Incoming.destinationPoint, new Vector2( this.redWave1Incoming.destinationPoint.x + 100, GROUND_Y ), this.redWaveParameterModel, this.redWave1Incoming.totalDistance );
      this.waves.push( this.redWave1Reflected );

      this.redWave1Transmitted = new Wave( this.redWave1Incoming.destinationPoint, new Vector2( this.redWave1Incoming.destinationPoint.x + 50, 0 ), this.redWaveParameterModel, this.redWave1Incoming.totalDistance );
      this.waves.push( this.redWave1Transmitted );
    }
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    delete this.redWave1Incoming;
    delete this.redWave1Reflected;

    this.waves.length = 0;

    const sourcePoint = new Vector2( incomingWaveX, 100 );
    const destinationPoint = new Vector2( incomingWaveX, GROUND_Y );
    this.yellowWave1Incoming = new Wave( sourcePoint, destinationPoint, this.yellowWaveParameterModel, 200 );
    this.waves.push( this.yellowWave1Incoming );
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;