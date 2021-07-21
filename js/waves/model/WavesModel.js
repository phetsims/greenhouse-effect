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
import Line from '../../../../kite/js/segments/Line.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import waveReflectionSound from '../../../sounds/greenhouse-wave-reflection-vibrato_mp3.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import LayersModel from '../../common/model/LayersModel.js';
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

    // @private {Map.<Wave,Wave>} - map of waves from the ground to waves being produced by the atmosphere in response
    this.atmosphereWaveInteractionsMap = new Map();

    const heightOfCentralAtmosphericInteraction = this.atmosphereLayers[ this.atmosphereLayers.length / 2 ].altitude;

    // @private - line where IR waves that cross through the center of the model may interact with the atmosphere
    this.centerAtmosphericInteractionLine = new Line(
      new Vector2( -LayersModel.SUNLIGHT_SPAN / 4, heightOfCentralAtmosphericInteraction ),
      new Vector2( LayersModel.SUNLIGHT_SPAN / 4, heightOfCentralAtmosphericInteraction )
    );

    const heightOfLeftSideAtmosphericInteraction =
      this.atmosphereLayers[ Math.floor( this.atmosphereLayers.length / 3 ) ].altitude;

    // @private - line where IR waves on the left side of the model may interact with the atmosphere
    this.leftAtmosphericInteractionLine = new Line(
      new Vector2( -LayersModel.SUNLIGHT_SPAN / 2, heightOfLeftSideAtmosphericInteraction ),
      new Vector2( -LayersModel.SUNLIGHT_SPAN / 4, heightOfLeftSideAtmosphericInteraction )
    );

    // @private - pre-allocated vectors and lines, reused in order to reduce memory allocations
    this.lineStart = new Vector2( 0, 0 );
    this.lineEnd = new Vector2( 0, 1 );
    this.waveLine = new Line( this.lineStart, this.lineEnd );

    // TODO: This should be moved to the view, if kept at all.  It is here for prototype purposes at the moment,
    //       see https://github.com/phetsims/greenhouse-effect/issues/36.
    // sound generation
    this.waveReflectedSoundGenerator = new SoundClip( waveReflectionSound, { initialOutputLevel: 0.2 } );
    soundManager.addSoundGenerator( this.waveReflectedSoundGenerator );
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
    this.groundWaveSource.step( dt );
    this.waves.forEach( wave => wave.step( dt ) );
    this.updateCloudWaveInteractions();
    this.updateWaveAtmosphereInteractions();

    // Remove any waves that have finished propagating.
    _.remove( this.waves, wave => wave.isCompletelyPropagated );
  }

  /**
   * update the interactions between light waves and the cloud
   * @private
   */
  updateCloudWaveInteractions() {

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

      // Make a list of waves that originated from the sun and pass through the cloud.
      const wavesCrossingTheCloud = this.waves.filter( wave =>
        wave.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH &&
        wave.origin.y === SunEMWaveSource.LIGHT_WAVE_ORIGIN_Y &&
        wave.directionOfTravel.equals( GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR ) &&
        wave.startPoint.y > cloud.position.y &&
        wave.startPoint.y - wave.length < cloud.position.y &&
        wave.startPoint.x > cloud.position.x - cloud.width / 2 &&
        wave.startPoint.x < cloud.position.x + cloud.width / 2
      );

      // Check if reflected waves and attenuators are in place for this cloud and, if not, add them.
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
            LayersModel.HEIGHT_OF_ATMOSPHERE,
            { intensityAtStart: incidentWave.intensityAtStart * cloud.getReflectivity( incidentWave.wavelength ) }
          );
          this.waves.push( reflectedWave );
          this.cloudReflectedWavesMap.set( incidentWave, reflectedWave );

          // TODO: This should be moved to the view, if kept at all.  It is here for prototype purposes at the moment,
          //       see https://github.com/phetsims/greenhouse-effect/issues/36.
          this.waveReflectedSoundGenerator.play();
        }

        // If there is no attenuation of this wave as it passes through the cloud, create it.
        if ( !incidentWave.hasAttenuator( cloud ) ) {
          incidentWave.addAttenuator(
            incidentWave.startPoint.y - cloud.position.y,
            cloud.getReflectivity( incidentWave.wavelength ),
            cloud
          );
        }
      } );
    }
    else {

      // The cloud is not enabled, so if there are any waves that were being attenuated because of the cloud, stop that
      // from happening.
      this.waves.forEach( wave => {
        if ( wave.hasAttenuator( cloud ) ) {
          wave.removeAttenuator( cloud );
        }
      } );
    }
  }

  /**
   * update the interactions between IR waves and the atmosphere
   * @private
   */
  updateWaveAtmosphereInteractions() {

    // See if any of the waves that are being produced due to interactions with the atmosphere should be removed.
    this.atmosphereWaveInteractionsMap.forEach( ( producedWave, sourceWave ) => {
      if ( this.concentrationProperty.value === 0 || sourceWave.startPoint.y > producedWave.origin.y ) {

        // Either the greenhouse gas concentration has gone to zero or the source wave has fully based through the
        // interaction point.  In either case, it's time to stop producing the wave.
        producedWave.isSourced = false;
        this.atmosphereWaveInteractionsMap.delete( sourceWave );
      }
    } );

    if ( this.concentrationProperty.value > 0 ) {

      // Make a list of waves that already exist and originate from the ground.
      const wavesFromTheGround = this.waves.filter( wave =>
        wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
        wave.origin.y === 0
      );

      wavesFromTheGround.forEach( waveFromGround => {

        // Check if this wave should be causing another wave to be produced in the atmosphere.
        if ( !this.atmosphereWaveInteractionsMap.has( waveFromGround ) ) {

          // Get a line that represents where the wave starts and ends.
          this.waveLine.setStart( waveFromGround.startPoint );
          this.lineEnd = waveFromGround.getEndPoint( this.lineEnd );
          this.waveLine.setEnd( this.lineEnd );

          // If the wave crosses the central atmosphere interaction area, create a resulting wave the heads back down
          // to the ground.
          let intersection = Line.intersect( this.waveLine, this.centerAtmosphericInteractionLine );
          if ( intersection.length > 0 ) {

            assert && assert( intersection.length === 1, 'multiple intersections are not expected' );

            const waveFromAtmosphericInteraction = new Wave(
              waveFromGround.wavelength,
              intersection[ 0 ].point,
              GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR.rotated( Math.PI * 0.05 ),
              0,
              { intensityAtStart: 0.25 }
            );
            this.waves.push( waveFromAtmosphericInteraction );
            this.atmosphereWaveInteractionsMap.set( waveFromGround, waveFromAtmosphericInteraction );
          }

          // If the wave crosses the left atmosphere interaction area, create a resulting wave the heads back down to
          // the ground.
          intersection = Line.intersect( this.waveLine, this.leftAtmosphericInteractionLine );
          if ( intersection.length > 0 ) {

            assert && assert( intersection.length === 1, 'multiple intersections are not expected' );

            const waveFromAtmosphericInteraction = new Wave(
              waveFromGround.wavelength,
              intersection[ 0 ].point,
              GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR,
              0,
              { intensityAtStart: 0.25 }
            );
            this.waves.push( waveFromAtmosphericInteraction );
            this.atmosphereWaveInteractionsMap.set( waveFromGround, waveFromAtmosphericInteraction );
          }
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