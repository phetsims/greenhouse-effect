// Copyright 2021, University of Colorado Boulder

/**
 * SunWaveSource produces waves of visible light that move in a downward direction.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import GreenhouseEffectModel from '../../common/model/GreenhouseEffectModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave from './Wave.js';

// constants
const STRAIGHT_DOWN_NORMALIZED_VECTOR = new Vector2( 0, -1 );

// x (horizontal) positions at which light waves can originate, y is assumed to be the top of the atmosphere
const LEFT_SIDE_LIGHT_WAVE_ORIGINS_X = [
  -0.3 * GreenhouseEffectConstants.SUNLIGHT_SPAN,
  -0.4 * GreenhouseEffectConstants.SUNLIGHT_SPAN
];
const RIGHT_SIDE_LIGHT_WAVE_ORIGINS_X = [
  0.3 * GreenhouseEffectConstants.SUNLIGHT_SPAN,
  0.4 * GreenhouseEffectConstants.SUNLIGHT_SPAN
];

const LIGHT_WAVE_ORIGIN_Y = GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE;
const LIGHT_WAVE_PRODUCTION_TIME = GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE * 0.75 /
                                   GreenhouseEffectConstants.SPEED_OF_LIGHT;

class SunWaveSource {

  /**
   * @param {Wave[]} waves
   * @param {SunEnergySource} sunEnergySource
   */
  constructor( waves, sunEnergySource ) {

    // @private
    this.waves = waves;

    // Add the initial waves when the sun starts shining.
    sunEnergySource.isShiningProperty.link( isShining => {
      if ( isShining ) {
        this.waves.push( new Wave(
          GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
          new Vector2( LEFT_SIDE_LIGHT_WAVE_ORIGINS_X[ 0 ], LIGHT_WAVE_ORIGIN_Y ),
          STRAIGHT_DOWN_NORMALIZED_VECTOR,
          0
        ) );
        this.waves.push( new Wave(
          GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
          new Vector2( RIGHT_SIDE_LIGHT_WAVE_ORIGINS_X[ 0 ], LIGHT_WAVE_ORIGIN_Y ),
          STRAIGHT_DOWN_NORMALIZED_VECTOR,
          0
        ) );
      }
      else {

        // Remove the waves.
        this.waves.length = 0;
      }
    } );
  }

  /**
   * @public
   */
  step() {

    // Remove any waves that were created by the sun but have fully propagated to their end point.
    _.remove( this.waves, wave =>
      wave.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH && !wave.sourced && wave.length === 0
    );

    // Get the waves that currently exist and are being produced by the sun.
    const wavesCurrentlyEmanatingFromSun = this.waves.filter( wave =>
      wave.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH &&
      wave.sourced &&
      wave.startPoint.y === LIGHT_WAVE_ORIGIN_Y
    );

    // Find all waves that should no longer be produced by the sun and should just propagate on their own.
    const fullyGeneratedWaves = wavesCurrentlyEmanatingFromSun.filter( wave =>
      wave.existanceTime >= LIGHT_WAVE_PRODUCTION_TIME
    );

    // If a wave is fully generated, mark it as unsourced so that it will propagate but won't extend, and then create
    // a new one from the alternative origin point near this one.
    fullyGeneratedWaves.forEach( wave => {
      wave.sourced = false;
      const xPositions = LEFT_SIDE_LIGHT_WAVE_ORIGINS_X.includes( wave.startPoint.x ) ?
                         LEFT_SIDE_LIGHT_WAVE_ORIGINS_X :
                         RIGHT_SIDE_LIGHT_WAVE_ORIGINS_X;
      const xPosIndex = ( xPositions.indexOf( wave.startPoint.x ) + 1 ) % xPositions.length;
      assert && assert( xPosIndex >= 0, 'wave position not found' );
      const xPos = xPositions[ xPosIndex ];
      this.waves.push( new Wave(
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        new Vector2( xPos, LIGHT_WAVE_ORIGIN_Y ),
        STRAIGHT_DOWN_NORMALIZED_VECTOR,
        0
      ) );
    } );
  }
}

greenhouseEffect.register( 'SunWaveSource', SunWaveSource );
export default SunWaveSource;