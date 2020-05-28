// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Prototype, enter at own risk.
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
    this.showGapProperty = new BooleanProperty( true );

    this.waves = [];
    this.irWavesBegan = true;

    this.reset();

    this.showGapProperty.link( () => this.reset() );
  }

  /**
   * @param d
   * @returns {number|*}
   * @private
   */
  toWaveDistance( d ) {
    if ( this.showGapProperty.value ) {
      return d;
    }
    else {
      return 100000;
    }
  }

  /**
   * @param dt
   * @public
   */
  step( dt ) {
    this.timeProperty.value += dt;
    this.waves.forEach( wave => wave.step( dt ) );

    const toRemove = this.waves.filter( wave => wave.trailingEdgeReachedDestination );
    toRemove.forEach( wave => arrayRemove( this.waves, wave ) );
  }

  /**
   * @param x
   * @param a
   * @param b
   * @param distance
   * @param angle
   * @param straightDown
   * @private
   */
  createIRWave1( x, a, b, distance, angle = 30, straightDown = false ) {
    const sourcePoint = new Vector2( x, GROUND_Y );

    const degreesToRadians = Math.PI * 2 / 360;
    const destinationPoint = sourcePoint.plus( Vector2.createPolar( 300, -Math.PI / 2 + angle * degreesToRadians ) );
    const redWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.redWaveParameterModel, this.toWaveDistance( distance ), {
      onLeadingEdgeReachesTarget: parentWave => {

        const reflectedDestination = straightDown ? new Vector2( parentWave.destinationPoint.x, GROUND_Y ) : new Vector2( parentWave.destinationPoint.x + 100, GROUND_Y );
        const redWave1Reflected = new Wave( 'reflected', parentWave.destinationPoint, reflectedDestination, this.redWaveParameterModel, this.toWaveDistance( parentWave.totalDistance ) );
        this.waves.push( redWave1Reflected );

        const redWave1Transmitted = new Wave( 'transmitted', parentWave.destinationPoint, parentWave.destinationPoint.plus( Vector2.createPolar( 1000, parentWave.angle ) ), this.redWaveParameterModel, this.toWaveDistance( parentWave.totalDistance ) );
        this.waves.push( redWave1Transmitted );
      },
      onTrailingEdgeAppears: parentWave => {
        this.createIRWave1( x === a ? b : a, a, b, 1800, angle, straightDown );
      }
    } );
    this.waves.push( redWave1Incoming );
  }

  /**
   * @private
   */
  triggerIRWavesToBegin() {
    if ( this.irWavesBegan ) {
      return;
    }
    this.irWavesBegan = true;
    this.createIRWave1( 200, 200, 150, 600, -20, true );
    this.createIRWave1( 350, 400, 350, 1200 );
    this.createIRWave1( 700, 700, 750, 1800 );
  }

  /**
   * @param x
   * @param a
   * @param b
   * @param distance
   * @private
   */
  createIncomingYellowWave( x, a, b, distance ) {
    const sourcePoint = new Vector2( x, 0 );
    const destinationPoint = new Vector2( x, GROUND_Y );
    const yellowWave1Incoming = new Wave( 'incoming', sourcePoint, destinationPoint, this.yellowWaveParameterModel, this.toWaveDistance( distance ), {
      onTrailingEdgeAppears: wave => {
        this.createIncomingYellowWave( x === a ? b : a, a, b, 1200 );
      },
      onLeadingEdgeReachesTarget: parentWave => {
        this.triggerIRWavesToBegin();
      }
    } );
    this.waves.push( yellowWave1Incoming );
  }

  /**
   * @public
   */
  reset() {
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();

    this.waves.length = 0;
    this.irWavesBegan = false;

    this.createIncomingYellowWave( 250, 300, 250, 1200 );
    this.createIncomingYellowWave( 650, 700, 650, 600 );

    // auto-start ir waves
    // this.triggerIRWavesToBegin();
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;