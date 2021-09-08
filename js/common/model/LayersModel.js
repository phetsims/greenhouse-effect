// Copyright 2021, University of Colorado Boulder

/**
 * The LayersModel of GreenhouseEffect is a superclass for several of the sim screens. It is responsible for managing the
 * "layers" implmentation for modeling interactions between waves or photons and the atmosphere.
 *
 * @author John Blanco
 * @author Jesse Greenberg
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
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import GreenhouseEffectModel from './GreenhouseEffectModel.js';
import SpaceEnergySink from './SpaceEnergySink.js';
import SunEnergySource from './SunEnergySource.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 50000; // in meters
const NUMBER_OF_ATMOSPHERE_LAYERS = 12; // empirically determined to give us good behavior for temperature and energy flux
const MINIMUM_GROUND_TEMPERATURE = 245;
const SUNLIGHT_SPAN = GreenhouseEffectConstants.SUNLIGHT_SPAN;
const MODEL_TIME_STEP = 1 / 60; // in seconds, originally derived from the most common animation frame rate

// units of temperature used by Greenhouse Effect
const TemperatureUnits = Enumeration.byKeys( [ 'KELVIN', 'CELSIUS', 'FAHRENHEIT' ] );

class LayersModel extends GreenhouseEffectModel {

  /**
   * @param {Tandem} [tandem]
   * @param {Object} [options]
   */
  constructor( tandem, options ) {

    super( tandem, options );

    // @public {NumberProperty} - the temperature of the surface in degrees Kelvin
    this.surfaceTemperatureKelvinProperty = new NumberProperty( 0, {
      range: new Range( 0, 500 ),
      tandem: tandem.createTandem( 'surfaceTemperatureKelvinProperty' )
    } );

    // @public {DerivedProperty.<number> - the temperature, but in Celsius used in multiple views
    this.surfaceTemperatureCelsiusProperty = new DerivedProperty( [ this.surfaceTemperatureKelvinProperty ], GreenhouseEffectUtils.kelvinToCelsius );

    // @public {DerivedProperty.<number> - the temperature, but in
    this.surfaceTemperatureFahrenheitProperty = new DerivedProperty( [ this.surfaceTemperatureKelvinProperty ], GreenhouseEffectUtils.kelvinToFahrenheit );

    // @public {EnumerationProperty} - displayed units of temperature
    this.temperatureUnitsProperty = new EnumerationProperty( TemperatureUnits, TemperatureUnits.KELVIN, {
      tandem: tandem.createTandem( 'temperatureUnitsProperty' )
    } );

    // @public {BooleanProperty} - whether or not the thermometer measuring surface temperature is visible
    this.surfaceThermometerVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'surfaceThermometerVisibleProperty' )
    } );

    // @public {BooleanProperty} - whether or not the "Energy Balance" display is visible
    this.energyBalanceVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'energyBalanceVisibleProperty' )
    } );

    // @public (read-only) {EMEnergyPacket[]} - packets of electromagnetic energy that are moving around in
    // the model
    this.emEnergyPackets = [];

    // @private - main energy source coming into the system
    this.sunEnergySource = new SunEnergySource(
      EnergyAbsorbingEmittingLayer.SURFACE_AREA,
      this.emEnergyPackets,
      tandem.createTandem( 'sunEnergySource' )
    );

    // @public (read-only) {EnergyAbsorbingEmittingLayer[]} - the energy-absorbing-and-emitting layers for the atmosphere
    this.atmosphereLayers = [];

    // @public {Cloud[]} - array of clouds that can be individually turned on or off
    this.clouds = [];

    // Create the energy absorbing and emitting layers that model the atmosphere.
    const distanceBetweenLayers = HEIGHT_OF_ATMOSPHERE / NUMBER_OF_ATMOSPHERE_LAYERS;
    const atmosphereLayersTandem = tandem.createTandem( 'atmosphereLayers' );
    _.times( NUMBER_OF_ATMOSPHERE_LAYERS, index => {
      const atmosphereLayer = new EnergyAbsorbingEmittingLayer(
        distanceBetweenLayers * ( index + 1 ),
        {
          minimumTemperature: 0,
          tandem: atmosphereLayersTandem.createTandem( `layer${index}` ),
          phetioDocumentation: 'Layer in the atmosphere that absorbs and emits energy. Layers are numbered low-to-high according to altitude.'
        }
      );
      this.atmosphereLayers.push( atmosphereLayer );
    } );

    // @public (read-only) - model of the ground that absorbs energy, heats up, and radiates
    this.groundLayer = new EnergyAbsorbingEmittingLayer( 0, {
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH,
      minimumTemperature: MINIMUM_GROUND_TEMPERATURE,
      tandem: tandem.createTandem( 'groundLayer' )
    } );

    // @public (read-only) - the endpoint where energy radiating from the top of the atmosphere goes
    this.outerSpace = new SpaceEnergySink(
      HEIGHT_OF_ATMOSPHERE + distanceBetweenLayers,
      tandem.createTandem( 'outerSpace' )
    );

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
  stepModel( dt ) {

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
    this.atmosphereLayers.forEach( atmosphereLayer => {atmosphereLayer.reset(); } );
    this.emEnergyPackets.length = 0;
  }

  /**
   * for phet-io
   * @public
   */
  toStateObject() {
    return {
      emEnergyPackets: ArrayIO( EMEnergyPacket.EMEnergyPacketIO ).toStateObject( this.emEnergyPackets )
    };
  }

  /**
   * for phet-io
   * @public
   */
  applyState( stateObject ) {

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
  static get STATE_SCHEMA() {
    return {
      emEnergyPackets: ArrayIO( EMEnergyPacket.EMEnergyPacketIO )
    };
  }
}

/**
 * @public
 * LayersModelIO handles PhET-iO serialization of the LayersModel. Because serialization involves accessing private
 * members, it delegates to LayersModel. The methods that LayersModelIO overrides are typical of 'Dynamic element
 * serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
LayersModel.LayersModelIO = IOType.fromCoreType( 'LayersModelIO', LayersModel );

// statics
LayersModel.HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
LayersModel.SUNLIGHT_SPAN = SUNLIGHT_SPAN;
LayersModel.MINIMUM_GROUND_TEMPERATURE = MINIMUM_GROUND_TEMPERATURE;
LayersModel.NUMBER_OF_ATMOSPHERE_LAYERS = NUMBER_OF_ATMOSPHERE_LAYERS;
LayersModel.TemperatureUnits = TemperatureUnits;

greenhouseEffect.register( 'LayersModel', LayersModel );
export default LayersModel;