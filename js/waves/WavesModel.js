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
    if ( this.yellowWave1Incoming && this.yellowWave1Incoming.leadingEdgeReachedDestination && !this.redWave1Incoming ) {
      const sourcePoint = new Vector2( this.waves[ 0 ].sourcePoint.x, GROUND_Y );

      const destinationPoint = sourcePoint.plus( Vector2.createPolar( 300, -Math.PI / 4 ) );
      this.redWave1Incoming = new Wave( sourcePoint, destinationPoint, this.redWaveParameterModel, 400 );
      this.waves.push( this.redWave1Incoming );
    }

    // if (this.yellowWave1Incoming)
    // this.incomingYellowWave2 = new Wave( new Vector2( incomingWaveX + 100, 100 ), new Vector2( incomingWaveX + 100, GROUND_Y ), this.yellowWaveParameterModel, 400 );
    // this.waves.push( this.incomingYellowWave2 );

    if ( this.redWave1Incoming && this.redWave1Incoming.leadingEdgeReachedDestination && !this.redWave1Reflected ) {
      this.redWave1Reflected = new Wave( this.redWave1Incoming.destinationPoint, new Vector2( this.redWave1Incoming.destinationPoint.x + 100, GROUND_Y ), this.redWaveParameterModel, this.redWave1Incoming.totalDistance );
      this.waves.push( this.redWave1Reflected );

      this.redWave1Transmitted = new Wave( this.redWave1Incoming.destinationPoint, new Vector2( this.redWave1Incoming.destinationPoint.x + 50, 0 ), this.redWaveParameterModel, this.redWave1Incoming.totalDistance );
      this.waves.push( this.redWave1Transmitted );
    }

    if ( this.yellowWave1Incoming && this.yellowWave1Incoming.almostDone && !this.yellowWave2Incoming ) {
      const sourcePoint = new Vector2( incomingWaveX + 100, 0 );
      const destinationPoint = new Vector2( incomingWaveX + 100, GROUND_Y );
      this.yellowWave2Incoming = new Wave( sourcePoint, destinationPoint, this.yellowWaveParameterModel, 900 );
      this.waves.push( this.yellowWave2Incoming );
    }

    if ( this.yellowWave2Incoming && this.yellowWave2Incoming.almostDone && !this.yellowWave1Incoming ) {
      const sourcePoint = new Vector2( incomingWaveX, 0 );
      const destinationPoint = new Vector2( incomingWaveX, GROUND_Y );
      this.yellowWave1Incoming = new Wave( sourcePoint, destinationPoint, this.yellowWaveParameterModel, 900 );
      this.waves.push( this.yellowWave1Incoming );
    }

    if ( this.yellowWave1Incoming && this.yellowWave1Incoming.trailingEdgeReachedDestination ) {
      delete this.yellowWave1Incoming;
    }
    if ( this.yellowWave2Incoming && this.yellowWave2Incoming.trailingEdgeReachedDestination ) {
      delete this.yellowWave2Incoming;
    }
    if ( this.redWave1Incoming && this.redWave1Incoming.trailingEdgeReachedDestination ) {
      delete this.redWave1Incoming;
    }
    if ( this.redWave1Transmitted && this.redWave1Transmitted.trailingEdgeReachedDestination ) {
      delete this.redWave1Transmitted;
    }
    if ( this.redWave1Reflected && this.redWave1Reflected.trailingEdgeReachedDestination ) {
      delete this.redWave1Reflected;
    }
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    delete this.redWave1Incoming;
    delete this.redWave1Reflected;
    delete this.redWave1Transmitted;
    delete this.yellowWave2Incoming;

    this.waves.length = 0;

    const sourcePoint = new Vector2( incomingWaveX, 0 );
    const destinationPoint = new Vector2( incomingWaveX, GROUND_Y );
    this.yellowWave1Incoming = new Wave( sourcePoint, destinationPoint, this.yellowWaveParameterModel, 800 );
    this.waves.push( this.yellowWave1Incoming );
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;