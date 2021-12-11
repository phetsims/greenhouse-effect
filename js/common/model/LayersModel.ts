// Copyright 2021, University of Colorado Boulder

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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import GreenhouseEffectModel from './GreenhouseEffectModel.js';
import GroundLayer from './GroundLayer.js';
import SpaceEnergySink from './SpaceEnergySink.js';
import SunEnergySource from './SunEnergySource.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Cloud from './Cloud.js';
import merge from '../../../../phet-core/js/merge.js';
import FluxMeter from './FluxMeter.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 50000; // in meters
const DEFAULT_NUMBER_OF_ATMOSPHERE_LAYERS = 12; // empirically determined to give us good behavior for temperature and energy flux
const SUNLIGHT_SPAN = GreenhouseEffectConstants.SUNLIGHT_SPAN;
const MODEL_TIME_STEP = 1 / 60; // in seconds, originally derived from the most common animation frame rate

// units of temperature used by Greenhouse Effect
const TemperatureUnits = Enumeration.byKeys( [ 'KELVIN', 'CELSIUS', 'FAHRENHEIT' ] );

type LayersModelOptions = {
  numberOfAtmosphereLayers?: number,
  atmosphereLayersInitiallyActive?: boolean,
  initialAtmosphereLayerAbsorptionProportion?: number
} & PhetioObjectOptions;

class LayersModel extends GreenhouseEffectModel {

  readonly surfaceTemperatureKelvinProperty: NumberProperty;
  readonly surfaceTemperatureCelsiusProperty: IReadOnlyProperty<number>;
  readonly surfaceTemperatureFahrenheitProperty: IReadOnlyProperty<number>;
  readonly temperatureUnitsProperty: EnumerationProperty;
  readonly surfaceThermometerVisibleProperty: BooleanProperty;
  readonly energyBalanceVisibleProperty: BooleanProperty;
  readonly surfaceTemperatureVisibleProperty: BooleanProperty;
  readonly fluxMeterVisibleProperty: BooleanProperty;
  private readonly emEnergyPackets: EMEnergyPacket[];
  readonly sunEnergySource: SunEnergySource;
  readonly atmosphereLayers: AtmosphereLayer[];
  readonly groundLayer: GroundLayer;
  readonly clouds: Cloud[];
  readonly outerSpace: SpaceEnergySink;
  private modelSteppingTime: number;
  readonly fluxMeter: FluxMeter;

  /**
   * @param {Tandem} [tandem]
   * @param {Object} [providedOptions]
   */
  constructor( tandem: Tandem, providedOptions?: LayersModelOptions ) {

    const options = merge( {
      numberOfAtmosphereLayers: DEFAULT_NUMBER_OF_ATMOSPHERE_LAYERS,
      initialAtmosphereLayerAbsorptionProportion: 0,
      atmosphereLayersInitiallyActive: true
    }, providedOptions ) as Required<LayersModelOptions>;

    super( tandem, options );

    // temperature of the ground in Kelvin
    this.surfaceTemperatureKelvinProperty = new NumberProperty( 0, {
      range: new Range( 0, 500 ),
      units: 'K',
      tandem: tandem.createTandem( 'surfaceTemperatureKelvinProperty' ),
      phetioReadOnly: true,
      phetioHighFrequency: true
    } );

    // temperature of the ground in Celsius
    this.surfaceTemperatureCelsiusProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      GreenhouseEffectUtils.kelvinToCelsius
    );

    // temperature of the ground in Fahrenheit
    this.surfaceTemperatureFahrenheitProperty = new DerivedProperty(
      [ this.surfaceTemperatureKelvinProperty ],
      GreenhouseEffectUtils.kelvinToFahrenheit
    );

    // displayed units of temperature
    // @ts-ignore
    this.temperatureUnitsProperty = new EnumerationProperty( TemperatureUnits, TemperatureUnits.KELVIN, {
      tandem: tandem.createTandem( 'temperatureUnitsProperty' )
    } );

    // whether or not the thermometer measuring surface temperature is visible
    this.surfaceThermometerVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'surfaceThermometerVisibleProperty' )
    } );

    // whether or not the "Energy Balance" display is visible
    this.energyBalanceVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'energyBalanceVisibleProperty' )
    } );

    // whether or not the glowing representation of surface temperature is visible
    this.surfaceTemperatureVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'surfaceTemperatureVisibleProperty' )
    } );

    // whether or not the flux meter is visible
    this.fluxMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fluxMeterVisibleProperty' )
    } );

    //  model component for the FluxMeter
    // TODO: This isn't used in all screens, so we may want to make its creation optional.
    this.fluxMeter = new FluxMeter( tandem.createTandem( 'fluxMeter' ) );

    // packets of electromagnetic energy that are moving around in the model
    this.emEnergyPackets = [];

    // main energy source coming into the system
    this.sunEnergySource = new SunEnergySource(
      EnergyAbsorbingEmittingLayer.SURFACE_AREA,
      this.emEnergyPackets,
      tandem.createTandem( 'sunEnergySource' )
    );

    // model of the ground that absorbs energy, heats up, and radiates
    this.groundLayer = new GroundLayer( tandem.createTandem( 'groundLayer' ) );

    // the energy-absorbing-and-emitting layers for the atmosphere
    this.atmosphereLayers = [];

    const atmosphereLayersTandem = tandem.createTandem( 'atmosphereLayers' );

    // The atmosphere layers are evenly spaced between the ground and the top of the atmosphere.
    const distanceBetweenAtmosphereLayers = HEIGHT_OF_ATMOSPHERE / ( options.numberOfAtmosphereLayers + 1 );

    // Add the atmosphere layers.  These MUST be added in order of increasing altitude, since some of the other code
    // assumes that this is the case.
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

    // @public {Cloud[]} - array of clouds that can be individually turned on or off
    this.clouds = [];

    // @public (read-only) - the endpoint where energy radiating from the top of the atmosphere goes
    this.outerSpace = new SpaceEnergySink( HEIGHT_OF_ATMOSPHERE, tandem.createTandem( 'outerSpace' ) );

    // @private - used to track how much stepping of the model needs to occur
    this.modelSteppingTime = 0;

    // Connect up the surface temperature property to that of the ground layer model element.
    this.groundLayer.temperatureProperty.link( groundTemperature => {
      this.surfaceTemperatureKelvinProperty.set( groundTemperature );
    } );
  }

  /**
   * @public
   * @override
   * @param {number} dt
   */
  stepModel( dt: number ) {

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
      this.clouds.forEach( cloud => {
        cloud.interactWithEnergy( this.emEnergyPackets, MODEL_TIME_STEP );
      } );
      this.outerSpace.interactWithEnergy( this.emEnergyPackets, MODEL_TIME_STEP );

      // Adjust remaining time for stepping the model.
      this.modelSteppingTime -= MODEL_TIME_STEP;
    }
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
   * Resets all aspects of the model.
   * @override
   * @public
   */
  reset() {
    super.reset();

    this.energyBalanceVisibleProperty.reset();
    this.surfaceThermometerVisibleProperty.reset();
    this.temperatureUnitsProperty.reset();
    this.sunEnergySource.reset();
    this.groundLayer.reset();
    this.atmosphereLayers.forEach( atmosphereLayer => { atmosphereLayer.reset(); } );
    this.emEnergyPackets.length = 0;
  }

  /**
   * for phet-io
   * @public
   */
  toStateObject(): LayersModelStateObject {
    return {
      emEnergyPackets: ArrayIO( EMEnergyPacket.EMEnergyPacketIO ).toStateObject( this.emEnergyPackets )
    };
  }

  /**
   * for phet-io
   * @public
   */
  applyState( stateObject: LayersModelStateObject ) {

    // Other objects have a reference to the energy packets, so we don't want to overwrite it.  Instead, clear it, then
    // copy in the contents of the state object.
    this.emEnergyPackets.length = 0;
    this.emEnergyPackets.push(
      ...ArrayIO( EMEnergyPacket.EMEnergyPacketIO ).fromStateObject( stateObject.emEnergyPackets )
    );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  protected static get STATE_SCHEMA() {
    return {
      emEnergyPackets: ArrayIO( EMEnergyPacket.EMEnergyPacketIO )
    };
  }

  // statics
  public static readonly HEIGHT_OF_ATMOSPHERE: number = HEIGHT_OF_ATMOSPHERE;
  public static readonly SUNLIGHT_SPAN: number = SUNLIGHT_SPAN;
  public static readonly TemperatureUnits: Enumeration = TemperatureUnits;

  /**
   * @public
   * LayersModelIO handles PhET-iO serialization of the LayersModel. Because serialization involves accessing private
   * members, it delegates to LayersModel. The methods that LayersModelIO overrides are typical of 'Dynamic element
   * serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly LayersModelIO: IOType = IOType.fromCoreType( 'LayersModelIO', LayersModel );
}

type LayersModelStateObject = {
  // TODO: I (jbphet) will need some help sorting out how this should work with phet-io.
  emEnergyPackets: Array<any>
}

export type { LayersModelStateObject };
export type { LayersModelOptions };

greenhouseEffect.register( 'LayersModel', LayersModel );
export default LayersModel;