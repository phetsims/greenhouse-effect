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
  }

  createIncomingYellowWave( x, a, b, isSteadyState ) {
    const sourcePoint = new Vector2( x, 0 );
    const destinationPoint = new Vector2( x, GROUND_Y );
    const yellowWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.yellowWaveParameterModel, isSteadyState ? 100000 : 600 + phet.joist.random.nextDouble() * 400, {
      // const yellowWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.yellowWaveParameterModel, 800, {
      onLeadingEdgeReachesTarget: parentWave => {
        const sourcePoint = parentWave.destinationPoint;

        const degreesToRadians = Math.PI * 2 / 360;
        const destinationPoint = sourcePoint.plus( Vector2.createPolar( 300, -Math.PI / 2 + 30 * degreesToRadians ) );
        const redWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.redWaveParameterModel, parentWave.totalDistance, {
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
        this.createIncomingYellowWave( x === a ? b : a, a, b, isSteadyState );
      }
    } );
    this.waves.push( yellowWave1Incoming );
  }

  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    this.waves.length = 0;

    // this.createIncomingYellowWave( 100, 100, 200, true );

    //

    // this.createIncomingYellowWave( 300, 300, 400, true );
    this.createIncomingYellowWave( 250, 300, 250, false );
    this.createIncomingYellowWave( 650, 700, 650, false );
    // this.createIncomingYellowWave( 900, 900, 1000, true );
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;