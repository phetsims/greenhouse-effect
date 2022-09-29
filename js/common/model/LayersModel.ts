// Copyright 2021-2022, University of Colorado Boulder

/**
 * The LayersModel of GreenhouseEffect is a superclass for several of the sim screens. It is responsible for creating
 * and managing the layers that absorb and radiate heat, thus modeling the capture of heat energy in Earth's atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import Cloud from './Cloud.js';
import EMEnergyPacket, { EMEnergyPacketStateObject } from './EMEnergyPacket.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import FluxMeter, { FluxMeterOptions } from './FluxMeter.js';
import GreenhouseEffectModel, { GreenhouseEffectModelOptions } from './GreenhouseEffectModel.js';
import GroundLayer from './GroundLayer.js';
import SpaceEnergySink from './SpaceEnergySink.js';
import SunEnergySource from './SunEnergySource.js';
import TemperatureUnits from './TemperatureUnits.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 50000; // in meters
const DEFAULT_NUMBER_OF_ATMOSPHERE_LAYERS = 12; // empirically determined to give us good behavior for temperature and energy flux
const SUNLIGHT_SPAN = GreenhouseEffectConstants.SUNLIGHT_SPAN;
const MODEL_TIME_STEP = 1 / 60; // in seconds, originally derived from the most common animation frame rate
const RADIATIVE_BALANCE_THRESHOLD = 5; // in watts per square meter, empirically determined

// map used to set the default temperature units based on the value of a query parameter
const mapLetterToTemperatureUnits = new Map<string, TemperatureUnits>( [
  [ 'K', TemperatureUnits.KELVIN ],
  [ 'C', TemperatureUnits.CELSIUS ],
  [ 'F', TemperatureUnits.FAHRENHEIT ]
] );
const DEFAULT_TEMPERATURE_UNITS = mapLetterToTemperatureUnits.get( GreenhouseEffectQueryParameters.defaultTemperatureUnits! );

type SelfOptions = {

  // min temperature that the ground is allowed to reach, in Kelvin
  minimumGroundTemperature?: number;

  // the number of energy absorbing and emitting layers in the atmosphere
  numberOfAtmosphereLayers?: number;

  // indicates whether the layers in the atmosphere are initially active or inactive
  atmosphereLayersInitiallyActive?: boolean;

  // proportion of energy that crosses an atmosphere layer that is absorbed, 0 for none, 1 for 100%
  initialAtmosphereLayerAbsorptionProportion?: number;

  // whether a flux meter should be present in this model
  fluxMeterPresent?: boolean;

  // options that are pass through to the flux meter if present
  fluxMeterOptions?: FluxMeterOptions;
};
export type LayersModelOptions = SelfOptions & GreenhouseEffectModelOptions;

class LayersModel extends GreenhouseEffectModel {

  // whether the amount of energy coming in from the sun matches that going back out to space, within a threshold
  public readonly inRadiativeBalanceProperty: BooleanProperty;

  // Net inflow of energy into the Earth at the top of the atmosphere.  When this is positive, more energy is coming
  // into the Earth than is leaving, so it should be heating up.  When negative, the Earth is releasing energy and
  // thus cooling down.
  public readonly netInflowOfEnergyProperty: NumberProperty;

  // packets of electromagnetic energy that are moving up and down in the model
  private readonly emEnergyPackets: EMEnergyPacket[];

  // main energy source coming into the system
  public readonly sunEnergySource: SunEnergySource;

  // the energy-absorbing-and-emitting layers for the atmosphere
  public readonly atmosphereLayers: AtmosphereLayer[];

  // a cloud that may or may not be present, and that reflects sunlight if it is
  public cloud: Cloud | null = null;

  // model of the ground that absorbs energy, heats up, and radiates infrared energy
  public readonly groundLayer: GroundLayer;

  // the endpoint where energy radiating from the top of the atmosphere goes
  public readonly outerSpace: SpaceEnergySink;

  // used to track how much stepping of the model needs to occur
  private modelSteppingTime: number;

  // model of a meter that can measure the energy flux moving through the atmosphere
  public readonly fluxMeter: FluxMeter | null;

  // whether the thermometer measuring surface temperature is visible
  public readonly surfaceThermometerVisibleProperty: BooleanProperty;

  // whether the "Energy Balance" display is visible
  public readonly energyBalanceVisibleProperty: BooleanProperty;

  // whether the glowing representation of surface temperature is visible
  public readonly surfaceTemperatureVisibleProperty: BooleanProperty;

  // fields with self-explanatory names
  public readonly surfaceTemperatureKelvinProperty: NumberProperty;
  public readonly surfaceTemperatureCelsiusProperty: TReadOnlyProperty<number>;
  public readonly surfaceTemperatureFahrenheitProperty: TReadOnlyProperty<number>;
  public readonly temperatureUnitsProperty: EnumerationProperty<TemperatureUnits>;
  public readonly fluxMeterVisibleProperty: BooleanProperty;

  /**
   * @param [tandem]
   * @param [providedOptions]
   */
  public constructor( tandem: Tandem, providedOptions?: LayersModelOptions ) {

    const options = optionize<LayersModelOptions, SelfOptions, GreenhouseEffectModelOptions>()( {
      numberOfAtmosphereLayers: DEFAULT_NUMBER_OF_ATMOSPHERE_LAYERS,
      minimumGroundTemperature: GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE,
      initialAtmosphereLayerAbsorptionProportion: 0,
      atmosphereLayersInitiallyActive: true,
      fluxMeterPresent: false,
      fluxMeterOptions: {}
    }, providedOptions );

    super( tandem, options );

    this.surfaceTemperatureKelvinProperty = new NumberProperty( 0, {
      range: new Range( 0, 520 ),
      units: 'K',
      tandem: tandem.createTandem( 'surfaceTemperatureKelvinProperty' ),
      phetioReadOnly: true,
      phetioHighFrequency: true
    } );

    this.surfaceTemperatureCelsiusProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      GreenhouseEffectUtils.kelvinToCelsius
    );

    this.surfaceTemperatureFahrenheitProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      GreenhouseEffectUtils.kelvinToFahrenheit
    );

    this.netInflowOfEnergyProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'netInflowOfEnergyProperty' ),
      phetioReadOnly: true
    } );

    this.inRadiativeBalanceProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'inRadiativeBalanceProperty' ),
      phetioReadOnly: true
    } );

    assert && assert( DEFAULT_TEMPERATURE_UNITS, 'something is wrong with the default temperature units' );
    this.temperatureUnitsProperty = new EnumerationProperty( DEFAULT_TEMPERATURE_UNITS!, {
      tandem: tandem.createTandem( 'temperatureUnitsProperty' )
    } );

    this.surfaceThermometerVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'surfaceThermometerVisibleProperty' )
    } );

    this.energyBalanceVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'energyBalanceVisibleProperty' )
    } );

    this.surfaceTemperatureVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'surfaceTemperatureVisibleProperty' )
    } );

    this.fluxMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fluxMeterVisibleProperty' )
    } );

    this.emEnergyPackets = [];

    this.sunEnergySource = new SunEnergySource(
      EnergyAbsorbingEmittingLayer.SURFACE_AREA,
      this.emEnergyPackets,
      tandem.createTandem( 'sunEnergySource' )
    );

    this.groundLayer = new GroundLayer( tandem.createTandem( 'groundLayer' ), {
      minimumTemperature: options.minimumGroundTemperature
    } );

    this.atmosphereLayers = [];

    const atmosphereLayersTandem = tandem.createTandem( 'atmosphereLayers' );

    // The atmosphere layers are evenly spaced between the ground and the top of the atmosphere.
    const distanceBetweenAtmosphereLayers = HEIGHT_OF_ATMOSPHERE / ( options.numberOfAtmosphereLayers + 1 );

    // Add the atmosphere layers.  These MUST be added in order of increasing altitude, since other code assumes that
    // this is the case.
    _.times( options.numberOfAtmosphereLayers, index => {
      const atmosphereLayer = new AtmosphereLayer(
        distanceBetweenAtmosphereLayers * ( index + 1 ),
        atmosphereLayersTandem.createTandem( `layer${index}` ),
        {
          initiallyActive: options.atmosphereLayersInitiallyActive,
          initialEnergyAbsorptionProportion: options.initialAtmosphereLayerAbsorptionProportion
        }
      );
      this.atmosphereLayers.push( atmosphereLayer );
    } );

    this.outerSpace = new SpaceEnergySink( HEIGHT_OF_ATMOSPHERE, tandem.createTandem( 'outerSpace' ) );

    //  Create the model component for the FluxMeter if the options indicate that it should be present.
    if ( options.fluxMeterPresent ) {

      const fluxMeterOptions = combineOptions<FluxMeterOptions>( {
        tandem: tandem.createTandem( 'fluxMeter' )
      }, options.fluxMeterOptions );

      this.fluxMeter = new FluxMeter( this.atmosphereLayers, fluxMeterOptions );
    }
    else {
      this.fluxMeter = null;
    }

    this.modelSteppingTime = 0;

    // Connect up the surface temperature property to that of the ground layer model element.
    this.groundLayer.temperatureProperty.link( groundTemperature => {
      this.surfaceTemperatureKelvinProperty.set( groundTemperature );
    } );
  }

  public override stepModel( dt: number ): void {

    // Step the model components by a consistent dt in order to avoid instabilities in the layer interactions.  See
    // https://github.com/phetsims/greenhouse-effect/issues/48 for information on why this is necessary.
    this.modelSteppingTime += dt;

    while ( this.modelSteppingTime >= MODEL_TIME_STEP ) {

      // Add the energy produced by the sun to the system.
      this.sunEnergySource.produceEnergy( MODEL_TIME_STEP );

      // Step the energy packets, which causes them to move.
      this.emEnergyPackets.forEach( emEnergyPacket => { emEnergyPacket.step( MODEL_TIME_STEP ); } );

      // Check for interaction between the energy packets and ground, the atmosphere, clouds, and space.
      this.groundLayer.interactWithEnergy( this.emEnergyPackets, MODEL_TIME_STEP );
      this.atmosphereLayers.forEach( atmosphereLayer => {
        atmosphereLayer.interactWithEnergy( this.emEnergyPackets, MODEL_TIME_STEP );
      } );
      if ( this.cloud ) {
        this.cloud.interactWithEnergy( this.emEnergyPackets, MODEL_TIME_STEP );
      }
      this.outerSpace.interactWithEnergy( this.emEnergyPackets, MODEL_TIME_STEP );

      // If the flux meter is present, have it measure the flux.
      if ( this.fluxMeter ) {
        this.fluxMeter.measureEnergyPacketFlux( this.emEnergyPackets, MODEL_TIME_STEP );
      }

      // Adjust remaining time for stepping the model.
      this.modelSteppingTime -= MODEL_TIME_STEP;
    }

    // Update the Property that tracks whether the system as a whole is in radiative balance.
    const energyGoingIntoSpace = this.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty.value /
                                 EnergyAbsorbingEmittingLayer.SURFACE_AREA;
    const energyComingFromSun = this.sunEnergySource.getOutputEnergyRate();
    this.netInflowOfEnergyProperty.set( energyComingFromSun - energyGoingIntoSpace );
    this.inRadiativeBalanceProperty.set(
      Math.abs( energyComingFromSun - energyGoingIntoSpace ) < RADIATIVE_BALANCE_THRESHOLD
    );

    super.stepModel( dt );
  }

  /**
   * Find a layer, if there is one, that would be crossed by an object traveling from the start altitude to the end
   * altitude.  If there are none, null is returned.  If there are several, the first one that would be crossed is
   * returned.
   *
   * Comparisons are exclusive for the first altitude, inclusive for the second.  See the code for details.
   *
   * This is intended to be pretty efficient, hence the use of regular 'for' loops and 'break' statements.
   */
  protected findCrossedAtmosphereLayer( startAltitude: number, endAltitude: number ): AtmosphereLayer | null {
    let crossedLayer = null;
    if ( startAltitude < endAltitude ) {
      for ( let i = 0; i < this.atmosphereLayers.length; i++ ) {
        const atmosphereLayer = this.atmosphereLayers[ i ];
        if ( atmosphereLayer.isActiveProperty.value &&
             startAltitude < atmosphereLayer.altitude &&
             endAltitude >= atmosphereLayer.altitude ) {

          crossedLayer = atmosphereLayer;
          break;
        }
      }
    }
    else if ( startAltitude > endAltitude ) {
      for ( let i = this.atmosphereLayers.length - 1; i >= 0; i-- ) {
        const atmosphereLayer = this.atmosphereLayers[ i ];
        if ( atmosphereLayer.isActiveProperty.value &&
             startAltitude > atmosphereLayer.altitude &&
             endAltitude <= atmosphereLayer.altitude ) {

          crossedLayer = atmosphereLayer;
          break;
        }
      }
    }
    return crossedLayer;
  }

  /**
   * Getter method that is true when infrared radiation is present.
   * TODO: Should this actually be implemented in subclasses and actually test for the presence of IR?
   */
  public isInfraredPresent(): boolean {
    return this.groundLayer.temperatureProperty.value > this.groundLayer.minimumTemperature;
  }

  /**
   * Resets all aspects of the model.
   */
  public override reset(): void {
    super.reset();

    this.netInflowOfEnergyProperty.reset();
    this.fluxMeterVisibleProperty.reset();
    this.energyBalanceVisibleProperty.reset();
    this.surfaceThermometerVisibleProperty.reset();
    this.temperatureUnitsProperty.reset();
    this.sunEnergySource.reset();
    this.groundLayer.reset();
    this.atmosphereLayers.forEach( atmosphereLayer => { atmosphereLayer.reset(); } );
    this.emEnergyPackets.length = 0;
    if ( this.fluxMeter ) {
      this.fluxMeter.reset();
    }
  }

  /**
   * for phet-io
   */
  public toStateObject(): LayersModelStateObject {
    return {
      emEnergyPackets: ArrayIO( EMEnergyPacket.EMEnergyPacketIO ).toStateObject( this.emEnergyPackets )
    };
  }

  /**
   * for phet-io
   */
  public applyState( stateObject: LayersModelStateObject ): void {

    // Other objects have a reference to the energy packets, so we don't want to overwrite it.  Instead, clear it, then
    // copy in the contents of the state object.
    this.emEnergyPackets.length = 0;
    this.emEnergyPackets.push(
      ...ArrayIO( EMEnergyPacket.EMEnergyPacketIO ).fromStateObject( stateObject.emEnergyPackets )
    );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static STATE_SCHEMA: Record<string, IOType> = {
    emEnergyPackets: ArrayIO( EMEnergyPacket.EMEnergyPacketIO )
  };

  // statics
  public static readonly HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
  public static readonly SUNLIGHT_SPAN = SUNLIGHT_SPAN;
  public static readonly RADIATIVE_BALANCE_THRESHOLD = RADIATIVE_BALANCE_THRESHOLD;

  /**
   * LayersModelIO handles PhET-iO serialization of the LayersModel. Because serialization involves accessing private
   * members, it delegates to LayersModel. The methods that LayersModelIO overrides are typical of 'Dynamic element
   * serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly LayersModelIO: IOType = new IOType( 'LayersModelIO', {
    valueType: LayersModel,
    stateSchema: LayersModel.STATE_SCHEMA,
    toStateObject: ( a: LayersModel ) => a.toStateObject(),
    applyState: ( a: LayersModel, b: LayersModelStateObject ) => a.applyState( b )
  } );
}

type LayersModelStateObject = {
  emEnergyPackets: EMEnergyPacketStateObject[];
};

export type { LayersModelStateObject };

greenhouseEffect.register( 'LayersModel', LayersModel );
export default LayersModel;