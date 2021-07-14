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
import Vector2 from '../../../../dot/js/Vector2.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import GreenhouseEffectModel from '../../common/model/GreenhouseEffectModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundEMWaveSource from './GroundEMWaveSource.js';
import SunEMWaveSource from './SunEMWaveSource.js';
import Wave from './Wave.js';

class WavesModel extends ConcentrationModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, { numberOfClouds: 1 } );

    // @public (read-only) {Wave[]} - the waves that are currently active in the model
    this.waves = [];

    // @public {BooleanProperty} - whether or not the glowing representation of surface temperature is visible
    this.surfaceTemperatureVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'surfaceTemperatureVisibleProperty' )
    } );

    // @private - the source of the waves of visible light that come from the sun
    this.sunWaveSource = new SunEMWaveSource( this.waves, this.sunEnergySource );

    // @private - the source of the waves of infrared light that come from the ground
    this.groundWaveSource = new GroundEMWaveSource( this.waves, this.surfaceTemperatureKelvinProperty );

    // @private {Map.<Wave,Wave>} - map of waves from the sun to waves reflected off of clouds
    this.cloudReflectedWavesMap = new Map();

    // TODO: Fast prototype of adding reflections from clouds, needs lots of refinement.
    // const wavesReflectedFromClouds = [];
    // this.numberOfActiveCloudsProperty.link( numberOfActiveClouds => {
    //   if ( numberOfActiveClouds === 1 ) {
    //     const cloud = this.clouds[ 0 ];
    //
    //     // If there is a wave from the sun going through this cloud, add a reflection.
    //     let firstIntersectingWave = null;
    //     this.waves.forEach( wave => {
    //       if ( !firstIntersectingWave && wave.startPoint.y > cloud.position.y ) {
    //
    //         if ( wave.startPoint.x > cloud.position.x - cloud.width / 2 &&
    //              wave.startPoint.x < cloud.position.x + cloud.width / 2 &&
    //              wave.startPoint.y - wave.length < cloud.position.y ) {
    //
    //           // Add a wave.
    //           const reflectedWave = new Wave(
    //             GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
    //             cloud.position,
    //             new Vector2( 0, 1 ).rotated( -Math.PI * 0.1 ),
    //             GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE
    //           );
    //           this.waves.push( reflectedWave );
    //           wavesReflectedFromClouds.push( reflectedWave );
    //         }
    //       }
    //     } );
    //   }
    //   else {
    //
    //     // Stop producing any currently reflected waves.  They will just fly away after this.
    //     wavesReflectedFromClouds.forEach( wave => {
    //       wave.isSourced = false;
    //     } );
    //   }
    // } );
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
    this.sunWaveSource.step();
    this.groundWaveSource.step();
    this.waves.forEach( wave => wave.step( dt ) );
    this.updateCloudReflectedWaves();

    // Remove any waves that have finished propagating.
    _.remove( this.waves, wave => wave.isCompletelyPropagated );
  }

  /**
   * @private
   */
  updateCloudReflectedWaves() {

    const cloud = this.clouds[ 0 ];

    // See if any of the currently reflected waves should stop reflecting.
    this.cloudReflectedWavesMap.forEach( ( reflectedWave, sourceWave ) => {
      if ( !cloud.enabledProperty.value || sourceWave.startPoint.y < cloud.position.y ) {

        // Either the cloud has disappeared or the wave from the sun that was being reflected has gone all the way
        // through the cloud.  In either case, it's time to stop reflecting the wave.
        reflectedWave.isSourced = false;
        this.cloudReflectedWavesMap.delete( sourceWave );
      }
    } );

    if ( cloud.enabledProperty.value ) {

      // Make a list of waves that are coming from the sun and pass through the cloud.
      const wavesCrossingTheCloud = this.waves.filter( wave =>
        wave.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH &&
        wave.origin.y === SunEMWaveSource.LIGHT_WAVE_ORIGIN_Y &&
        wave.directionOfTravel.equals( GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR ) &&
        wave.startPoint.y > cloud.position.y &&
        wave.startPoint.y - wave.length < cloud.position.y &&
        wave.startPoint.x > cloud.position.x - cloud.width / 2 &&
        wave.startPoint.x < cloud.position.x + cloud.width / 2
      );

      wavesCrossingTheCloud.forEach( incidentWave => {

        // If there is no reflected wave for this incident wave, create one.
        if ( !this.cloudReflectedWavesMap.has( incidentWave ) ) {
          const direction = incidentWave.origin.x > cloud.position.x ?
                            GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.2 ) :
                            GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.2 );
          const reflectedWave = new Wave(
            incidentWave.wavelength,
            new Vector2( incidentWave.origin.x, cloud.position.y ),
            direction,
            GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE
          );
          this.waves.push( reflectedWave );
          this.cloudReflectedWavesMap.set( incidentWave, reflectedWave );
        }
      } );
    }
  }

  /**
   * @public
   */
  reset() {
    super.reset();
    this.waves.length = 0;
    this.surfaceTemperatureVisibleProperty.reset();
    this.cloudReflectedWavesMap.clear();
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;