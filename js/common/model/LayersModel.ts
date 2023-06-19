// Copyright 2021-2023, University of Colorado Boulder

/**
 * LayersModel is a superclass for several of the models used in the screens of the Greenhouse Effect sim. It is
 * responsible for creating and managing the layers that absorb and radiate heat, thus modeling the capture of heat
 * energy in Earth's atmosphere.
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
import IOType from '../../../../tandem/js/types/IOType.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
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
import GreenhouseEffectPreferences from './GreenhouseEffectPreferences.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 50000; // in meters
const DEFAULT_NUMBER_OF_ATMOSPHERE_LAYERS = 12; // empirically determined to give us good behavior for temperature and energy flux
const SUNLIGHT_SPAN = GreenhouseEffectConstants.SUNLIGHT_SPAN;
const MODEL_TIME_STEP = 1 / 60; // in seconds, originally derived from the most common animation frame rate
const RADIATIVE_BALANCE_THRESHOLD = 5; // in watts per square meter, empirically determined
const DEFAULT_TEMPERATURE_UNITS_PROPERTY = GreenhouseEffectPreferences.defaultTemperatureUnitsProperty;

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

  // options that are passed through to the flux meter if present
  fluxMeterOptions?: FluxMeterOptions;

  // Propagated to SunEnergySource.
  // Determines whether proportionateOutputRateProperty is instrumented. This Property is necessary for the Layer Model
  // screen, but it can create problematic situations on the Waves and Photons screens, which were not designed to
  // support variable solar intensity. See https://github.com/phetsims/greenhouse-effect/issues/283
  proportionateOutputRatePropertyIsInstrumented?: boolean;
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

  // a cloud that may or may not be present, and that can reflect sunlight if it is
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

  // For grouping model elements in the Studio tree
  protected readonly atmosphereLayersTandem: Tandem;

  public constructor( providedOptions: LayersModelOptions ) {

    const options = optionize<LayersModelOptions, SelfOptions, GreenhouseEffectModelOptions>()( {
      numberOfAtmosphereLayers: DEFAULT_NUMBER_OF_ATMOSPHERE_LAYERS,
      minimumGroundTemperature: GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE,
      initialAtmosphereLayerAbsorptionProportion: 0,
      atmosphereLayersInitiallyActive: true,
      fluxMeterPresent: false,
      fluxMeterOptions: {
        tandem: providedOptions.tandem.createTandem( 'fluxMeter' )
      },
      proportionateOutputRatePropertyIsInstrumented: false
    }, providedOptions );

    super( options );

    // For grouping model elements, see https://github.com/phetsims/greenhouse-effect/issues/281
    const surfaceTemperatureTandem = options.tandem.createTandem( 'surfaceTemperature' );

    this.temperatureUnitsProperty = new EnumerationProperty( DEFAULT_TEMPERATURE_UNITS_PROPERTY.value, {
      tandem: surfaceTemperatureTandem.createTandem( 'temperatureUnitsProperty' ),
      phetioFeatured: true
    } );

    // If the default temperature units change, change the current units setting to match.
    DEFAULT_TEMPERATURE_UNITS_PROPERTY.lazyLink( units => this.temperatureUnitsProperty.set( units ) );

    this.surfaceThermometerVisibleProperty = new BooleanProperty( true, {
      tandem: surfaceTemperatureTandem.createTandem( 'surfaceThermometerVisibleProperty' ),
      phetioFeatured: true
    } );

    this.surfaceTemperatureVisibleProperty = new BooleanProperty( false, {
      tandem: surfaceTemperatureTandem.createTandem( 'surfaceTemperatureVisibleProperty' ),
      phetioFeatured: true
    } );

    this.surfaceTemperatureKelvinProperty = new NumberProperty( 0, {
      range: new Range( 0, 520 ),
      units: 'K',
      tandem: surfaceTemperatureTandem.createTandem( 'surfaceTemperatureKelvinProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioHighFrequency: true
    } );

    this.surfaceTemperatureCelsiusProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      GreenhouseEffectUtils.kelvinToCelsius,
      {
        units: '\u00B0C',
        tandem: surfaceTemperatureTandem.createTandem( 'surfaceTemperatureCelsiusProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        phetioHighFrequency: true
      }
    );

    this.surfaceTemperatureFahrenheitProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      GreenhouseEffectUtils.kelvinToFahrenheit,
      {
        units: '\u00B0F',
        tandem: surfaceTemperatureTandem.createTandem( 'surfaceTemperatureFahrenheitProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        phetioHighFrequency: true
      }
    );

    // For grouping model elements, see https://github.com/phetsims/greenhouse-effect/issues/281
    // This is a PhET-iO object so that we can add linked elements to it.
    const energyBalance = new PhetioObject( {
      tandem: options.tandem.createTandem( 'energyBalance' ),
      phetioState: false
    } );

    this.netInflowOfEnergyProperty = new NumberProperty( 0, {
      tandem: energyBalance.tandem.createTandem( 'netInflowOfEnergyProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Total energy coming into Earth\'s atmosphere.'
    } );

    this.inRadiativeBalanceProperty = new BooleanProperty( true, {
      tandem: energyBalance.tandem.createTandem( 'inRadiativeBalanceProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Indicates whether the energy coming in from the sun is equal to that being radiated back ' +
                           'into space by the Earth.'
    } );

    this.energyBalanceVisibleProperty = new BooleanProperty( false, {
      tandem: energyBalance.tandem.createTandem( 'energyBalanceVisibleProperty' ),
      phetioFeatured: true
    } );

    const fluxMeterTandem = options.tandem.createTandem( 'fluxMeter' );

    this.fluxMeterVisibleProperty = new BooleanProperty( false, {

      // Only allow this to show up in the phet-io tree if the flux meter is present in this model.
      tandem: options.fluxMeterPresent ?
              fluxMeterTandem.createTandem( 'fluxMeterVisibleProperty' ) :
              Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.emEnergyPackets = [];

    this.sunEnergySource = new SunEnergySource(
      EnergyAbsorbingEmittingLayer.SURFACE_AREA,
      this.emEnergyPackets, {
        tandem: options.tandem.createTandem( 'sunEnergySource' ),
        proportionateOutputRatePropertyIsInstrumented: options.proportionateOutputRatePropertyIsInstrumented
      } );

    // Requeted in https://github.com/phetsims/greenhouse-effect/issues/281
    energyBalance.addLinkedElement( this.sunEnergySource.outputEnergyRateTracker.energyRateProperty, {
      tandemName: 'incomingEnergyRateProperty'
    } );

    this.groundLayer = new GroundLayer( {
      minimumTemperature: options.minimumGroundTemperature,
      tandem: options.tandem.createTandem( 'groundLayer' )
    } );

    this.atmosphereLayers = [];

    // For grouping model elements, see https://github.com/phetsims/greenhouse-effect/issues/281
    this.atmosphereLayersTandem = options.tandem.createTandem( 'atmosphereLayers' );

    // The atmosphere layers are evenly spaced between the ground and the top of the atmosphere.
    const distanceBetweenAtmosphereLayers = HEIGHT_OF_ATMOSPHERE / ( options.numberOfAtmosphereLayers + 1 );

    // Add the atmosphere layers.  These MUST be added in order of increasing altitude, since other code assumes that
    // this is the case.
    _.times( options.numberOfAtmosphereLayers, index => {
      const atmosphereLayer = new AtmosphereLayer(
        distanceBetweenAtmosphereLayers * ( index + 1 ),
        {
          tandem: this.atmosphereLayersTandem.createTandem( `layer${index}` ),
          initiallyActive: options.atmosphereLayersInitiallyActive,
          initialEnergyAbsorptionProportion: options.initialAtmosphereLayerAbsorptionProportion
        }
      );
      this.atmosphereLayers.push( atmosphereLayer );
    } );

    // the endpoint where energy radiating from the top of the atmosphere goes
    this.outerSpace = new SpaceEnergySink( HEIGHT_OF_ATMOSPHERE, options.tandem.createTandem( 'outerSpace' ) );

    // Requested in https://github.com/phetsims/greenhouse-effect/issues/281
    energyBalance.addLinkedElement( this.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty, {
      tandemName: 'outgoingEnergyRateProperty'
    } );

    //  Create the model component for the FluxMeter if the options indicate that it should be present.
    if ( options.fluxMeterPresent ) {

      const fluxMeterOptions = combineOptions<FluxMeterOptions>( {
        tandem: fluxMeterTandem
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
        this.cloud.interactWithEnergy( this.emEnergyPackets );
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
   * Getter method that is true when infrared radiation is present.
   * TODO: Should this be implemented in subclasses and actually test for the presence of IR?
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
    this.temperatureUnitsProperty.set( DEFAULT_TEMPERATURE_UNITS_PROPERTY.value );
    this.sunEnergySource.reset();
    this.groundLayer.reset();
    this.atmosphereLayers.forEach( atmosphereLayer => { atmosphereLayer.reset(); } );
    this.emEnergyPackets.length = 0;
    if ( this.fluxMeter ) {
      this.fluxMeter.reset();
    }
  }

  // statics
  public static readonly HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
  public static readonly SUNLIGHT_SPAN = SUNLIGHT_SPAN;
  public static readonly RADIATIVE_BALANCE_THRESHOLD = RADIATIVE_BALANCE_THRESHOLD;

  /**
   * LayersModelIO handles PhET-iO serialization of the LayersModel.
   */
  public static readonly LayersModelIO: IOType = new IOType<LayersModel, LayersModelStateObject>( 'LayersModelIO', {
    valueType: LayersModel,
    stateSchema: {

      // Other objects have a reference to the array of energy packets, so we don't want to overwrite it.  Instead of
      // ArrayIO, ReferenceArrayIO will clear the array and then copy in the contents of the state object.
      emEnergyPackets: ReferenceArrayIO( EMEnergyPacket.EMEnergyPacketIO )
    }
  } );
}

type LayersModelStateObject = {
  emEnergyPackets: EMEnergyPacketStateObject[];
};

export type { LayersModelStateObject };

greenhouseEffect.register( 'LayersModel', LayersModel );
export default LayersModel;