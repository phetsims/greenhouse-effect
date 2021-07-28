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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Line from '../../../../kite/js/segments/Line.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import waveReflectionSound from '../../../sounds/greenhouse-wave-reflection-vibrato_mp3.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import LayersModel from '../../common/model/LayersModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource from './EMWaveSource.js';
import Wave from './Wave.js';

// constants
const MIN_TEMPERATURE = LayersModel.MINIMUM_GROUND_TEMPERATURE;
const MINIMUM_WAVE_INTENSITY = 0.01;
const MAX_ATMOSPHERIC_INTERACTION_PROPORTION = 0.75; // max proportion of IR wave that can go back to Earth

// Wavelength values used when depicting the waves, in meters.  Far from real life.  Can be adjusted for desired look.
const REAL_TO_RENDERING_WAVELENGTH_MAP = new Map( [
  [ GreenhouseEffectConstants.VISIBLE_WAVELENGTH, 8000 ],
  [ GreenhouseEffectConstants.INFRARED_WAVELENGTH, 12000 ]
] );

const WAVE_AMPLITUDE_FOR_RENDERING = 2000;

const IR_WAVE_GENERATION_SPECS = [

  // leftmost waves
  new EMWaveSource.WaveSourceSpec(
    -LayersModel.SUNLIGHT_SPAN * 0.32,
    -LayersModel.SUNLIGHT_SPAN * 0.27,
    GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.12 )
  ),

  // center-ish waves
  new EMWaveSource.WaveSourceSpec(
    -LayersModel.SUNLIGHT_SPAN * 0.1,
    -LayersModel.SUNLIGHT_SPAN * 0.05,
    GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.15 )
  ),

  // rightmost waves
  new EMWaveSource.WaveSourceSpec(
    LayersModel.SUNLIGHT_SPAN * 0.38,
    LayersModel.SUNLIGHT_SPAN * 0.43,
    GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.15 )
  )
];
const VISIBLE_WAVE_GENERATION_SPECS = [

  // leftmost waves
  new EMWaveSource.WaveSourceSpec(
    -LayersModel.SUNLIGHT_SPAN * 0.23,
    -LayersModel.SUNLIGHT_SPAN * 0.13,
    GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
  ),

  // rightmost waves
  new EMWaveSource.WaveSourceSpec(
    LayersModel.SUNLIGHT_SPAN * 0.25,
    LayersModel.SUNLIGHT_SPAN * 0.35,
    GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
  )
];

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
    this.sunWaveSource = new EMWaveSource(
      this.waves,
      this.sunEnergySource.isShiningProperty,
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      LayersModel.HEIGHT_OF_ATMOSPHERE,
      0,
      VISIBLE_WAVE_GENERATION_SPECS,
      { waveIntensityProperty: new NumberProperty( 0.5 ) }
    );

    // derived Property that controls when IR waves can be produced
    const produceIRWavesProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      temperature => temperature > MIN_TEMPERATURE + 8 // a few degrees higher than the minimum
    );

    // derived Property that maps temperature to the intensity of the IR waves
    const infraredWaveIntensityProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      temperature => Utils.clamp(
        ( temperature - 245 ) / ( 295 - 245 ), // min density at the lowest temperature, max at highest
        MINIMUM_WAVE_INTENSITY,
        1
      )
    );

    // @private - the source of the waves of infrared light (i.e. the ones that come from the ground)
    this.groundWaveSource = new EMWaveSource(
      this.waves,
      produceIRWavesProperty,
      GreenhouseEffectConstants.INFRARED_WAVELENGTH,
      0,
      LayersModel.HEIGHT_OF_ATMOSPHERE,
      IR_WAVE_GENERATION_SPECS,
      { waveIntensityProperty: infraredWaveIntensityProperty }
    );

    // @private {Map.<Wave,Wave>} - map of waves from the sun to waves reflected off of clouds
    this.cloudReflectedWavesMap = new Map();

    // @private {Map.<EnergyAbsorbingEmittingLayer,Range} - A Map containing atmospheric layers and ranges that define
    // the x coordinate within which IR waves should interact with that layer.
    this.atmosphereLayerToXRangeMap = new Map(
      [
        [
          this.atmosphereLayers[ Utils.roundSymmetric( LayersModel.NUMBER_OF_ATMOSPHERE_LAYERS / 2 ) ],
          new Range( -LayersModel.SUNLIGHT_SPAN / 4, LayersModel.SUNLIGHT_SPAN / 4 )
        ],
        [
          this.atmosphereLayers[ Utils.roundSymmetric( LayersModel.NUMBER_OF_ATMOSPHERE_LAYERS / 3 ) ],
          new Range( -LayersModel.SUNLIGHT_SPAN / 2, -LayersModel.SUNLIGHT_SPAN / 4 )
        ]
      ]
    );

    // @private {WaveAtmosphereInteraction[]} - An array of the interactions that are currently occurring between IR
    // waves and the atmosphere.
    this.waveAtmosphereInteractions = [];

    // @private - Pre-allocated vectors and lines used for testing whether waves are crossing through interactive areas
    // of the atmosphere, reused by methods in order to reduce memory allocations.
    this.waveLineStart = new Vector2( 0, 0 );
    this.waveLineEnd = new Vector2( 0, 1 );
    this.waveLine = new Line( this.waveLineStart, this.waveLineEnd );
    this.atmosphereLineStart = new Vector2( 0, 0 );
    this.atmosphereLineEnd = new Vector2( 0, 1 );
    this.atmosphereLine = new Line( this.atmosphereLineStart, this.atmosphereLineEnd );

    // TODO: This should be moved to the view, if kept at all.  It is here for prototype purposes at the moment,
    //       see https://github.com/phetsims/greenhouse-effect/issues/36.  UPDATE 7/27/2021 - This has been turned down
    //       to 0 in preparation for creating a dev version with a consistent but minimal initial sound design.
    // sound generation
    this.waveReflectedSoundGenerator = new SoundClip( waveReflectionSound, { initialOutputLevel: 0 } );
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
    this.sunWaveSource.step( dt );
    this.groundWaveSource.step( dt );
    this.waves.forEach( wave => wave.step( dt ) );
    this.updateWaveCloudInteractions();
    this.updateWaveAtmosphereInteractions();

    // Remove any waves that have finished propagating.
    _.remove( this.waves, wave => wave.isCompletelyPropagated );
  }

  /**
   * update the interactions between light waves and the cloud
   * @private
   */
  updateWaveCloudInteractions() {

    assert && assert( this.clouds.length === 1, 'this subclass assumes only one cloud in the model' );

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
        wave.origin.y === this.sunWaveSource.waveStartAltitude &&
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
            {
              intensityAtStart: incidentWave.intensityAtStart * cloud.getReflectivity( incidentWave.wavelength ),
              initialPhaseOffset: ( incidentWave.getPhaseAt( incidentWave.origin.y - cloud.position.y ) + Math.PI ) %
                                  ( 2 * Math.PI )

            }
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
   * Update the interactions between IR waves and the atmosphere.
   * @private
   */
  updateWaveAtmosphereInteractions() {

    // Calculate how much of each wave should go back towards the Earth and how much should continue on its way given
    // the current concentration of greenhouse gasses.
    const returnToEarthProportion = this.concentrationProperty.value * MAX_ATMOSPHERIC_INTERACTION_PROPORTION;

    // Update the existing interactions between the light waves and the atmosphere.
    this.waveAtmosphereInteractions.forEach( interaction => {

      // If the gas concentration has gone to zero or the source wave have moved all the way through this interaction
      // location, the interaction should end.
      if ( this.concentrationProperty.value === 0 ||
           interaction.sourceWave.startPoint.y > interaction.atmosphereLayer.altitude ) {

        // Free the wave that was being emitted to propagate on its own.
        interaction.emittedWave.isSourced = false;

        // Remove the attenuator that was associated with this interaction from the wave (if it hasn't happened
        // automatically yet).
        if ( interaction.sourceWave.hasAttenuator( interaction.atmosphereLayer ) ) {
          interaction.sourceWave.removeAttenuator( interaction.atmosphereLayer );
        }

        // Remove this interaction from our list.
        this.waveAtmosphereInteractions = this.waveAtmosphereInteractions.filter(
          testInteraction => testInteraction !== interaction
        );
      }
      else {

        // Make sure the attenuation on the source wave is correct.
        interaction.sourceWave.setAttenuation( interaction.atmosphereLayer, returnToEarthProportion );

        // Make sure the intensity of the emitted wave is correct.
        const emittedWaveIntensity = interaction.sourceWave.intensityAtStart * returnToEarthProportion;
        if ( interaction.emittedWave.intensityAtStart !== emittedWaveIntensity ) {
          interaction.emittedWave.setIntensityAtStart( emittedWaveIntensity );
        }
      }
    } );

    // Make a list of all IR waves that are currently emanating from the ground.
    const wavesFromTheGround = this.waves.filter( wave =>
      wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
      wave.origin.y === 0
    );

    // For each IR wave from the ground, check to see if there are any interactions with the atmosphere that should
    // exist but don't yet.
    wavesFromTheGround.forEach( waveFromTheGround => {

      const hasActiveInteraction = Array.from( this.waveAtmosphereInteractions.values() ).reduce(
        ( found, interaction ) => found || interaction.sourceWave === waveFromTheGround,
        false
      );

      // If there is already an atmospheric interaction that is driven by this wave, stop here and don't create a new
      // one.  This is a design choice, not a physical one.  If there is ever a need to have multiple interactions
      // driven by the same wave, this will need to change.
      if ( !hasActiveInteraction ) {

        // Get a line that represents where the wave starts and ends.  Use pre-allocated components to reduce
        // allocations.
        this.waveLine.setStart( waveFromTheGround.startPoint );
        this.waveLineEnd = waveFromTheGround.getEndPoint( this.waveLineEnd );
        this.waveLine.setEnd( this.waveLineEnd );

        // Check if this wave is crossing any of the atmosphere interaction areas.
        this.atmosphereLayerToXRangeMap.forEach( ( xRange, layer ) => {

          if ( layer.energyAbsorptionProportionProperty.value > 0 ) {

            // Establish the line in the atmosphere against which the wave is to be tested.
            this.atmosphereLineStart.setXY( xRange.min, layer.altitude );
            this.atmosphereLineEnd.setXY( xRange.max, layer.altitude );
            this.atmosphereLine.setStart( this.atmosphereLineStart );
            this.atmosphereLine.setEnd( this.atmosphereLineEnd );

            // See if there is an intersection.
            const intersection = Line.intersect( this.waveLine, this.atmosphereLine );
            if ( intersection.length > 0 ) {

              assert && assert( intersection.length === 1, 'multiple intersections are not expected' );

              const waveStartToIntersectionLength = this.atmosphereLine.start.y / waveFromTheGround.directionOfTravel.y;

              // Create the new emitted wave.
              const waveFromAtmosphericInteraction = new Wave(
                waveFromTheGround.wavelength,
                intersection[ 0 ].point,
                GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR,
                0,
                {
                  // The emitted wave's intensity is a proportion of the wave that causes the interaction.
                  intensityAtStart: waveFromTheGround.intensityAtStart *
                                    this.concentrationProperty.value *
                                    MAX_ATMOSPHERIC_INTERACTION_PROPORTION,

                  // Align the phase offsets because it looks better in the view.
                  initialPhaseOffset: ( waveFromTheGround.getPhaseAt( waveStartToIntersectionLength ) + Math.PI ) %
                                      ( 2 * Math.PI )
                }
              );
              this.waves.push( waveFromAtmosphericInteraction );

              // Add an attenuator on the source wave.
              waveFromTheGround.addAttenuator(
                layer.altitude / waveFromTheGround.directionOfTravel.y,
                this.concentrationProperty.value * MAX_ATMOSPHERIC_INTERACTION_PROPORTION,
                layer
              );

              // Add the wave-atmosphere interaction to our list.
              this.waveAtmosphereInteractions.push( new WaveAtmosphereInteraction(
                layer,
                waveFromTheGround,
                waveFromAtmosphericInteraction
              ) );
            }
          }
        } );
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    super.reset();
    this.waves.length = 0;
    this.surfaceTemperatureVisibleProperty.reset();
    this.cloudReflectedWavesMap.clear();
    this.sunWaveSource.reset();
    this.groundWaveSource.reset();
  }
}

/**
 * A simple inner class for tracking interactions between the IR waves and the atmosphere.
 */
class WaveAtmosphereInteraction {
  constructor( atmosphereLayer, sourceWave, emittedWave ) {
    this.atmosphereLayer = atmosphereLayer;
    this.sourceWave = sourceWave;
    this.emittedWave = emittedWave;
  }
}

// statics
WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP = REAL_TO_RENDERING_WAVELENGTH_MAP;
WavesModel.WAVE_AMPLITUDE_FOR_RENDERING = WAVE_AMPLITUDE_FOR_RENDERING;

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;