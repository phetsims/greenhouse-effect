// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavesModel uses a layer model for simulating temperature changes due to changes in the concentration of greenhouse
 * gasses, and also creates and moves light waves that interact with the ground and atmosphere in a way that simulates
 * that behavior in Earth's atmosphere.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import SunWaveSource from './SunWaveSource.js';
import Wave from './Wave.js';
import WaveParameterModel from './WaveParameterModel.js';

// constants
const GROUND_Y = 450;

class WavesModel extends ConcentrationModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, { numberOfClouds: 1 } );

    this.timeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'timeProperty' )
    } );

    // @public (read-only) {Wave[]} - the waves that are currently active in the model
    this.waves = [];

    // @public {BooleanProperty} - whether or not the glowing representation of surface temperature is visible
    this.surfaceTemperatureVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'surfaceTemperatureVisibleProperty' )
    } );

    this.yellowWaveParameterModel = new WaveParameterModel( GreenhouseEffectConstants.SUNLIGHT_COLOR );
    this.redWaveParameterModel = new WaveParameterModel( GreenhouseEffectConstants.INFRARED_COLOR );

    this.irWavesBegan = true;

    // @private - the source of the waves that appear to come from the sun
    this.sunWaveSource = new SunWaveSource( this.waves, this.sunEnergySource );
  }

  /**
   * Step the model forward by the provided time.
   * @protected
   * @override
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt ) {
    super.stepModel( dt );
    this.timeProperty.value += dt;
    this.sunWaveSource.step();
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
    const startPoint = new Vector2( x, GROUND_Y );

    const degreesToRadians = Math.PI * 2 / 360;
    const destinationPoint = startPoint.plus( Vector2.createPolar( 300, -Math.PI / 2 + angle * degreesToRadians ) );
    const redWave1Incoming = new Wave( 'incoming', startPoint, destinationPoint, this.redWaveParameterModel, distance, {
      onLeadingEdgeReachesTarget: parentWave => {

        const reflectedDestination = straightDown ? new Vector2( parentWave.destinationPoint.x, GROUND_Y ) : new Vector2( parentWave.destinationPoint.x + 100, GROUND_Y );
        const redWave1Reflected = new Wave( 'reflected', parentWave.destinationPoint, reflectedDestination, this.redWaveParameterModel, parentWave.totalDistance );
        this.waves.push( redWave1Reflected );

        const redWave1Transmitted = new Wave( 'transmitted', parentWave.destinationPoint, parentWave.destinationPoint.plus( Vector2.createPolar( 1000, parentWave.angle ) ), this.redWaveParameterModel, parentWave.totalDistance );
        this.waves.push( redWave1Transmitted );
      },
      onTrailingEdgeAppears: parentWave => {
        this.createIRWave1( x === a ? b : a, a, b, 1800, angle, straightDown );
      }
    } );
    redWave1Incoming.jbFlag = true;
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
    const startPoint = new Vector2( x, 0 );
    const destinationPoint = new Vector2( x, GROUND_Y );
    const yellowWave1Incoming = new Wave(
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      'incoming',
      startPoint,
      destinationPoint,
      this.yellowWaveParameterModel,
      distance,
      {
        onTrailingEdgeAppears: wave => {
          this.createIncomingYellowWave( x === a ? b : a, a, b, 1200 );
        },
        onLeadingEdgeReachesTarget: parentWave => {
          this.triggerIRWavesToBegin();
        },
        debugTag: 'oldStyle'
      }
    );
    this.waves.push( yellowWave1Incoming );
  }

  /**
   * @public
   */
  reset() {
    this.surfaceTemperatureVisibleProperty.reset();
    this.timeProperty.reset();
    this.yellowWaveParameterModel.reset();
    this.redWaveParameterModel.reset();
    super.reset();

    this.waves.length = 0;
    this.irWavesBegan = false;
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;