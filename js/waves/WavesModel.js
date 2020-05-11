// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import arrayRemove from '../../../phet-core/js/arrayRemove.js';
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

    const toRemove = this.waves.filter( wave => wave.trailingEdgeReachedDestination );
    toRemove.forEach( wave => arrayRemove( this.waves, wave ) );

    // if ( this.yellowWave1Incoming && this.yellowWave1Incoming.almostDone && !this.yellowWave2Incoming ) {
    //   const sourcePoint = new Vector2( incomingWaveX + 100, 0 );
    //   const destinationPoint = new Vector2( incomingWaveX + 100, GROUND_Y );
    //   this.yellowWave2Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.yellowWaveParameterModel, 900 );
    //   this.waves.push( this.yellowWave2Incoming );
    // }
    //
    // if ( this.yellowWave2Incoming && this.yellowWave2Incoming.almostDone && !this.yellowWave1Incoming ) {
    //   const sourcePoint = new Vector2( incomingWaveX, 0 );
    //   const destinationPoint = new Vector2( incomingWaveX, GROUND_Y );
    //   this.yellowWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.yellowWaveParameterModel, 900 );
    //   this.waves.push( this.yellowWave1Incoming );
    // }
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    this.waves.length = 0;

    const sourcePoint = new Vector2( incomingWaveX, 0 );
    const destinationPoint = new Vector2( incomingWaveX, GROUND_Y );
    const yellowWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.yellowWaveParameterModel, 800, {
      onLeadingEdgeReachesTarget: parentWave => {
        const sourcePoint = parentWave.destinationPoint;
        const destinationPoint = sourcePoint.plus( Vector2.createPolar( 300, -Math.PI / 4 ) );
        const redWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.redWaveParameterModel, 680, {
          onLeadingEdgeReachesTarget: parentWave => {

            const redWave1Reflected = new Wave( 'reflected', parentWave.destinationPoint, new Vector2( parentWave.destinationPoint.x + 100, GROUND_Y ), this.redWaveParameterModel, parentWave.totalDistance );
            this.waves.push( redWave1Reflected );

            const redWave1Transmitted = new Wave( 'transmitted', parentWave.destinationPoint, new Vector2( parentWave.destinationPoint.x + 50, 0 ), this.redWaveParameterModel, parentWave.totalDistance );
            this.waves.push( redWave1Transmitted );
          }
        } );
        this.waves.push( redWave1Incoming );
      },

      onAlmostDone: parentWave => {

      }
    } );
    this.waves.push( yellowWave1Incoming );
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;