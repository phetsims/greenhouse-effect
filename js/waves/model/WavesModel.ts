// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavesModel uses a layer model for simulating temperature changes due to changes in the concentration of greenhouse
 * gases, and also creates and moves light waves that interact with the ground and atmosphere in a way that simulates
 * the way these things behave in Earth's atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO, { MapStateObject } from '../../../../tandem/js/types/MapIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationModel, { ConcentrationModelOptions, ConcentrationModelStateObject } from '../../common/model/ConcentrationModel.js';
import EnergyAbsorbingEmittingLayer from '../../common/model/EnergyAbsorbingEmittingLayer.js';
import GroundLayer from '../../common/model/GroundLayer.js';
import LayersModel from '../../common/model/LayersModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundWaveSource from './GroundWaveSource.js';
import SunWaveSource from './SunWaveSource.js';
import Wave, { WaveCreatorArguments, WaveOptions } from './Wave.js';
import isInfrared from '../../common/model/isInfrared.js';
import isVisible from '../../common/model/isVisible.js';

type SelfOptions = EmptySelfOptions;
type WaveModelOptions = SelfOptions & ConcentrationModelOptions;

// constants
const MAX_ATMOSPHERIC_INTERACTION_PROPORTION = 0.75; // max proportion of IR wave that can go back to Earth
const TWO_PI = Math.PI * 2;

// Wavelength values used when depicting the waves, in meters.  Far from real life.  Can be adjusted for desired look.
const REAL_TO_RENDERING_WAVELENGTH_MAP = new Map( [
  [ GreenhouseEffectConstants.VISIBLE_WAVELENGTH, 8000 ],
  [ GreenhouseEffectConstants.INFRARED_WAVELENGTH, 12000 ]
] );

const WAVE_AMPLITUDE_FOR_RENDERING = 2000;

class WavesModel extends ConcentrationModel {

  // phet-io group that is used to track and create the individual wave instances
  public readonly waveGroup: PhetioGroup<Wave, WaveCreatorArguments>;

  // an emitter that signals when the waves have changed so that the view can update them
  public readonly wavesChangedEmitter: TEmitter;

  // the source of visible-frequency waves
  private readonly sunWaveSource: SunWaveSource;

  // source of the IR waves that come from the ground
  private readonly groundWaveSource: GroundWaveSource;

  // a JS Map where the key is a wave coming into the cloud and the value is the reflected wave
  private cloudReflectedWavesMap: Map<Wave, Wave>;

  // a JS Map where the key is a wave coming into contact with the glacier and the value is the reflected wave
  private glacierReflectedWavesMap: Map<Wave, Wave>;

  // A JS Map containing atmospheric layers and ranges that define the x coordinate within which IR waves should
  // interact with that layer.
  private readonly atmosphereLayerToXRangeMap: Map<EnergyAbsorbingEmittingLayer, Range>;

  // the set of all places where the waves in the model are interacting with layers in the atmosphere
  public readonly waveAtmosphereInteractions: ObservableArray<WaveAtmosphereInteraction>;

  // Pre-allocated vectors and lines used for testing whether waves are crossing through interactive areas of the
  // atmosphere, reused by methods in order to reduce memory allocations.
  private readonly waveLineStart: Vector2;
  private readonly waveLineEnd: Vector2;
  private readonly waveLine: Line;
  private readonly atmosphereLineStart: Vector2;
  private readonly atmosphereLineEnd: Vector2;
  private readonly atmosphereLine: Line;

  public constructor( providedOptions: WaveModelOptions ) {

    const options = optionize<WaveModelOptions, SelfOptions, ConcentrationModelOptions>()( {
      phetioType: WavesModel.WavesModelIO,
      phetioState: true
    }, providedOptions );

    super( options );

    // For grouping model elements, see https://github.com/phetsims/greenhouse-effect/issues/281
    const wavesTandem = options.tandem.createTandem( 'waves' );

    // the electromagnetic waves that are currently active in the model
    this.waveGroup = new PhetioGroup(
      ( tandem, wavelength, origin, propagationDirection, propagationLimit, providedOptions ) => {
        const options = combineOptions<WaveOptions>( { tandem: tandem }, providedOptions );
        return new Wave( wavelength, origin, propagationDirection, propagationLimit, options );
      },
      [
        GreenhouseEffectConstants.INFRARED_WAVELENGTH,
        Vector2.ZERO,
        GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR,
        LayersModel.HEIGHT_OF_ATMOSPHERE,
        {}
      ],
      {
        tandem: wavesTandem.createTandem( 'waveGroup' ),
        phetioType: PhetioGroup.PhetioGroupIO( Wave.WaveIO )
      }
    );

    this.wavesChangedEmitter = new Emitter();

    // the source of the waves of visible light that come from the sun
    this.sunWaveSource = new SunWaveSource(
      this.waveGroup,
      this.sunEnergySource.isShiningProperty,
      LayersModel.HEIGHT_OF_ATMOSPHERE,
      0,
      { tandem: wavesTandem.createTandem( 'sunWaveSource' ) }
    );

    // the source of the waves of infrared light (i.e. the ones that come from the ground)
    this.groundWaveSource = new GroundWaveSource(
      this.waveGroup,
      0,
      LayersModel.HEIGHT_OF_ATMOSPHERE,
      this.surfaceTemperatureKelvinProperty,
      { tandem: wavesTandem.createTandem( 'groundWaveSource' ) }
    );

    this.cloudReflectedWavesMap = new Map<Wave, Wave>();
    this.glacierReflectedWavesMap = new Map<Wave, Wave>();

    this.atmosphereLayerToXRangeMap = new Map(
      [
        // leftmost interaction area
        [
          this.atmosphereLayers[ 4 ],
          new Range( -LayersModel.SUNLIGHT_SPAN.width / 2, -LayersModel.SUNLIGHT_SPAN.width / 4 )
        ],

        // central interaction area
        [
          this.atmosphereLayers[ 6 ],
          new Range( -LayersModel.SUNLIGHT_SPAN.width / 4, LayersModel.SUNLIGHT_SPAN.width / 4 )
        ],

        // rightmost interaction area
        [
          this.atmosphereLayers[ 3 ],
          new Range( LayersModel.SUNLIGHT_SPAN.width * 0.25, LayersModel.SUNLIGHT_SPAN.width )
        ]
      ]
    );

    // (read-only) {ObservableArrayDef.<WaveAtmosphereInteraction>} - An array of the interactions that are
    // currently occurring between IR waves and the atmosphere.
    this.waveAtmosphereInteractions = createObservableArray( {
      tandem: wavesTandem.createTandem( 'waveAtmosphereInteractions' ),
      phetioType: createObservableArray.ObservableArrayIO( WaveAtmosphereInteraction.WaveAtmosphereInteractionIO ),
      phetioDocumentation: 'Interactions between IR waves coming from the ground and the atmosphere'
    } );

    // Allocate the reusable elements used to test whether waves are moving through interactive atmosphere layers.
    this.waveLineStart = new Vector2( 0, 0 );
    this.waveLineEnd = new Vector2( 0, 1 );
    this.waveLine = new Line( this.waveLineStart, this.waveLineEnd );
    this.atmosphereLineStart = new Vector2( 0, 0 );
    this.atmosphereLineEnd = new Vector2( 0, 1 );
    this.atmosphereLine = new Line( this.atmosphereLineStart, this.atmosphereLineEnd );
  }

  /**
   * Step the model forward by the provided time.
   * @param dt - delta time, in seconds
   */
  public override stepModel( dt: number ): void {
    const numberOfWavesAtStartOfStep = this.waveGroup.count;
    super.stepModel( dt );
    this.sunWaveSource.step();
    this.groundWaveSource.step();
    this.waveGroup.forEach( wave => wave.step( dt ) );
    this.updateWaveCloudInteractions();
    this.updateWaveAtmosphereInteractions();
    this.updateWaveGlacierInteractions();

    // Remove any waves that have finished propagating.
    this.waveGroup.filter( wave => wave.isCompletelyPropagated ).forEach( wave => {
      this.waveGroup.disposeElement( wave );
    } );

    // Emit a notification if anything has changed about the waves during this step so that the view can be updated.
    if ( this.waveGroup.count > 0 || numberOfWavesAtStartOfStep > 0 ) {
      this.wavesChangedEmitter.emit();
    }
  }

  /**
   * Update the interactions between light waves and the cloud.
   */
  private updateWaveCloudInteractions(): void {

    if ( this.cloud ) {

      const cloud = this.cloud; // convenience var

      // The reflectivity value used visually is NOT the actual value used in the cloud model.  This is because the actual
      // value didn't produce enough of a visible wave.  In other words, this value is "Hollywooded" to get the look we
      // wanted.  See https://github.com/phetsims/greenhouse-effect/issues/82.
      const visualCloudReflectivity = 0.5;

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

        // Make a list of waves that originated from the sun and are currently passing through the cloud.
        const wavesCrossingTheCloud = this.waveGroup.filter( wave =>
          isVisible( wave ) &&
          wave.origin.y === this.sunWaveSource.waveStartAltitude &&
          wave.propagationDirection.y < 0 &&
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
                              GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.1 ) :
                              GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.1 );
            const reflectedWave = this.waveGroup.createNextElement(
              incidentWave.wavelength,
              new Vector2( incidentWave.origin.x, cloud.position.y ),
              direction,
              LayersModel.HEIGHT_OF_ATMOSPHERE, {
                intensityAtStart: incidentWave.intensityAtStart * visualCloudReflectivity,
                initialPhaseOffset: ( incidentWave.getPhaseAt( incidentWave.origin.y - cloud.position.y ) + Math.PI ) %
                                    ( 2 * Math.PI )
              }
            );
            this.cloudReflectedWavesMap.set( incidentWave, reflectedWave );
          }

          // If there is no attenuation of this wave as it passes through the cloud, create it.
          if ( !incidentWave.hasAttenuator( cloud ) ) {
            incidentWave.addAttenuator(
              incidentWave.startPoint.y - cloud.position.y,
              visualCloudReflectivity,
              cloud
            );
          }
        } );
      }
      else {

        // The cloud is not enabled, so if there are any waves that were being attenuated because of the cloud, stop that
        // from happening.
        this.waveGroup.forEach( wave => {
          if ( wave.hasAttenuator( cloud ) ) {
            wave.removeAttenuator( cloud );
          }
        } );
      }
    }
  }

  /**
   * Update the interactions between IR waves and the atmosphere.
   */
  private updateWaveAtmosphereInteractions(): void {

    // Calculate how much of each wave should go back towards the Earth and how much should continue on its way given
    // the current concentration of greenhouse gases.
    const irWaveAttenuation = mapGasConcentrationToAttenuation( this.concentrationProperty.value );

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
        this.waveAtmosphereInteractions.remove( interaction );
      }
      else {

        // Make sure the attenuation on the source wave is correct.
        interaction.sourceWave.setAttenuation( interaction.atmosphereLayer, irWaveAttenuation );

        // Set the intensity of the emitted wave.
        const sourceWaveIntensityAtInteraction =
          interaction.sourceWave.getIntensityAtAltitude( interaction.atmosphereLayer.altitude );
        const emittedWaveIntensity = sourceWaveIntensityAtInteraction * irWaveAttenuation;
        if ( interaction.emittedWave.intensityAtStart !== emittedWaveIntensity ) {
          interaction.emittedWave.setIntensityAtStart( emittedWaveIntensity );
        }
      }
    } );

    // Make a list of all IR waves that are currently emanating from the ground.
    const wavesFromTheGround = this.waveGroup.filter( wave => isInfrared( wave ) && wave.origin.y === 0 );

    // For each IR wave from the ground, check to see if there are any interactions with the atmosphere that should
    // exist but don't yet.
    wavesFromTheGround.forEach( waveFromTheGround => {

      const hasActiveInteraction = this.waveAtmosphereInteractions.reduce(
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
        waveFromTheGround.getEndPoint( this.waveLineEnd );
        this.waveLine.setEnd( this.waveLineEnd );

        // Check if this wave is crossing any of the atmosphere interaction areas.
        this.atmosphereLayerToXRangeMap.forEach( ( xRange, layer ) => {

          if ( layer.energyAbsorptionProportionProperty.value > 0 ) {

            // Establish the line in the atmosphere against which the wave is to be tested.
            this.atmosphereLineStart.setXY( xRange.min, layer.altitude );
            this.atmosphereLineEnd.setXY( xRange.max, layer.altitude );
            this.atmosphereLine.setStart( this.atmosphereLineStart );
            this.atmosphereLine.setEnd( this.atmosphereLineEnd );

            // See if there is an intersection and create a new wave if so.
            const intersection = Line.intersect( this.waveLine, this.atmosphereLine );
            if ( intersection.length > 0 ) {

              assert && assert( intersection.length === 1, 'multiple intersections are not expected' );

              const waveStartToIntersectionLength = ( this.atmosphereLine.start.y - waveFromTheGround.startPoint.y ) /
                                                    waveFromTheGround.propagationDirection.y;
              const waveOriginToIntersectionLength = ( this.atmosphereLine.start.y - waveFromTheGround.origin.y ) /
                                                     waveFromTheGround.propagationDirection.y;

              // Create the new emitted wave.
              const waveFromAtmosphericInteraction = this.waveGroup.createNextElement(
                waveFromTheGround.wavelength,
                intersection[ 0 ].point,
                new Vector2( waveFromTheGround.propagationDirection.x, -waveFromTheGround.propagationDirection.y ),
                0,
                {
                  // The emitted wave's intensity is a proportion of the wave that causes the interaction.
                  intensityAtStart: waveFromTheGround.intensityAtStart * irWaveAttenuation,

                  // Align the phase offsets because it looks better in the view.
                  initialPhaseOffset: ( waveFromTheGround.getPhaseAt( waveOriginToIntersectionLength ) + Math.PI ) %
                                      ( 2 * Math.PI )
                }
              );

              // Add an attenuator on the source wave.
              waveFromTheGround.addAttenuator(
                waveStartToIntersectionLength,
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
   * update the interactions between light waves and the glacier
   */
  private updateWaveGlacierInteractions(): void {

    // See if any of the currently reflected waves should stop reflecting.
    this.glacierReflectedWavesMap.forEach( ( reflectedWave, sourceWave ) => {
      if ( this.groundLayer.albedoProperty.value < GroundLayer.PARTIALLY_GLACIATED_LAND_ALBEDO ||
           !this.waveGroup.includes( sourceWave ) ) {

        // Either the albedo has gone below that of the ice age or the wave from the sun that was being reflected has
        // gone away.  In either case, free this wave to finish propagating on its own.
        reflectedWave.isSourced = false;
        this.glacierReflectedWavesMap.delete( sourceWave );
      }
    } );

    // See if any new waves should be created.
    if ( this.groundLayer.albedoProperty.value >= GroundLayer.PARTIALLY_GLACIATED_LAND_ALBEDO ) {

      // Make a list of waves that originated from the sun and are reaching the glacier.  This uses some fixed
      // positioning, so may need to be adjusted if the waves are moved around.
      const wavesHittingTheGlacier = this.waveGroup.filter( wave =>
        isVisible( wave ) &&
        wave.origin.x > 0 &&
        wave.origin.y === this.sunWaveSource.waveStartAltitude &&
        wave.propagationDirection.y < 0 &&
        wave.getEndPoint().y === 0
      );

      // Check if reflected waves are in place for these and, if not, add them.
      wavesHittingTheGlacier.forEach( incidentWave => {

        // If there is no reflected wave for this incident wave, create one.
        if ( !this.glacierReflectedWavesMap.has( incidentWave ) ) {
          const direction = GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.05 );
          const reflectedWave = this.waveGroup.createNextElement(
            incidentWave.wavelength,
            new Vector2( incidentWave.origin.x, 0 ),
            direction,
            LayersModel.HEIGHT_OF_ATMOSPHERE,
            {
              intensityAtStart: 0.25, // arbitrarily chose to look good
              initialPhaseOffset: ( incidentWave.getPhaseAt( LayersModel.HEIGHT_OF_ATMOSPHERE ) + Math.PI ) % TWO_PI
            }
          );
          this.glacierReflectedWavesMap.set( incidentWave, reflectedWave );
        }
      } );
    }
  }

  public override reset(): void {
    const numberOfWavesBeforeReset = this.waveGroup.count;
    super.reset();
    this.waveGroup.clear();
    this.surfaceTemperatureVisibleProperty.reset();
    this.cloudReflectedWavesMap.clear();
    this.glacierReflectedWavesMap.clear();
    this.waveAtmosphereInteractions.clear();
    if ( numberOfWavesBeforeReset > 0 ) {
      this.wavesChangedEmitter.emit();
    }
  }

  /**
   * WavesModelIO handles PhET-iO serialization of the WavesModel.  This uses reference-type serialization since
   * instances of this type persist for the lifetime of the sim.
   */
  public static readonly WavesModelIO = new IOType<WavesModel, WavesModelStateObject, WavesModelSelfStateObject>( 'WavesModelIO', {
    valueType: WavesModel,
    supertype: ConcentrationModel.ConcentrationModelIO,
    stateSchema: {
      cloudReflectedWavesMap: MapIO( ReferenceIO( Wave.WaveIO ), ReferenceIO( Wave.WaveIO ) ),
      glacierReflectedWavesMap: MapIO( ReferenceIO( Wave.WaveIO ), ReferenceIO( Wave.WaveIO ) )
    }
  } );

  // other static values
  public static readonly REAL_TO_RENDERING_WAVELENGTH_MAP = REAL_TO_RENDERING_WAVELENGTH_MAP;
  public static readonly WAVE_AMPLITUDE_FOR_RENDERING = WAVE_AMPLITUDE_FOR_RENDERING;
}

type WavesModelSelfStateObject = {
  cloudReflectedWavesMap: MapStateObject<ReferenceIOState, ReferenceIOState>;
  glacierReflectedWavesMap: MapStateObject<ReferenceIOState, ReferenceIOState>;
};

type WavesModelStateObject = ConcentrationModelStateObject & WavesModelSelfStateObject;

/**
 * Helper function for calculating an attenuation value that should be used in an atmospheric interaction based on the
 * concentration of greenhouse gases.
 */
const mapGasConcentrationToAttenuation = ( concentration: number ): number => {

  // This equation was empirically determined, and will only work if the wave intensity coming from the ground doesn't
  // change.  In other words, this is a touchy part of the whole system, so update as needed but be careful about it.
  return -0.84 * Math.pow( concentration, 2 ) + 1.66 * concentration;
};

/**
 * A simple inner class for tracking interactions between the IR waves and the atmosphere.
 */
class WaveAtmosphereInteraction {
  public readonly atmosphereLayer: EnergyAbsorbingEmittingLayer;
  public readonly sourceWave: Wave;
  public readonly emittedWave: Wave;

  public constructor( atmosphereLayer: EnergyAbsorbingEmittingLayer, sourceWave: Wave, emittedWave: Wave ) {
    this.atmosphereLayer = atmosphereLayer;
    this.sourceWave = sourceWave;
    this.emittedWave = emittedWave;
  }

  /**
   * WaveAtmosphereInteractionIO uses data-type serialization here because these are used as elements in an
   * ObservableArray which is itself serialized.
   */
  public static readonly WaveAtmosphereInteractionIO =
    new IOType<WaveAtmosphereInteraction, WaveAtmosphereInteractionStateObject>( 'WaveAtmosphereInteractionIO', {
      valueType: WaveAtmosphereInteraction,
      stateSchema: {
        atmosphereLayer: ReferenceIO( IOType.ObjectIO ),
        sourceWave: ReferenceIO( Wave.WaveIO ),
        emittedWave: ReferenceIO( Wave.WaveIO )
      },
      fromStateObject: ( stateObject: WaveAtmosphereInteractionStateObject ) => new WaveAtmosphereInteraction(
        ReferenceIO( IOType.ObjectIO ).fromStateObject( stateObject.atmosphereLayer ),
        ReferenceIO( Wave.WaveIO ).fromStateObject( stateObject.sourceWave ),
        ReferenceIO( Wave.WaveIO ).fromStateObject( stateObject.emittedWave ) )
    } );
}

type WaveAtmosphereInteractionStateObject = {
  atmosphereLayer: ReferenceIOState;
  sourceWave: ReferenceIOState;
  emittedWave: ReferenceIOState;
};

greenhouseEffect.register( 'WavesModel', WavesModel );
export type { WaveModelOptions };
export default WavesModel;