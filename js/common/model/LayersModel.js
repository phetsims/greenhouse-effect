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
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import Cloud from './Cloud.js';
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
    options = merge( {

      // {number} - the number of clouds that will be created during construction and can later be enabled
      numberOfClouds: 0
    }, options );

    super( tandem, options );

    // @private - main energy source coming into the system
    this.sunEnergySource = new SunEnergySource( EnergyAbsorbingEmittingLayer.SURFACE_AREA, tandem.createTandem( 'sun' ) );

    // @public (read-only) {EnergyAbsorbingEmittingLayer[]} - the energy-absorbing-and-emitting layers for the atmosphere
    this.atmosphereLayers = [];

    // @public {Cloud[]} - array of clouds that can be individually turned on or off
    this.clouds = [];

    // @private {EMEnergyPacket[]} - electromagnetic energy that is moving within the model
    this.emEnergyPackets = [];

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

    // Create the energy absorbing and emitting layers that model the atmosphere.
    const distanceBetweenLayers = HEIGHT_OF_ATMOSPHERE / NUMBER_OF_ATMOSPHERE_LAYERS;
    const atmosphereLayersTandem = tandem.createTandem( 'atmosphereLayers' );
    _.times( NUMBER_OF_ATMOSPHERE_LAYERS, index => {
      const atmosphereLayer = new EnergyAbsorbingEmittingLayer( distanceBetweenLayers * ( index + 1 ), {
        minimumTemperature: 0,
        tandem: atmosphereLayersTandem.createTandem( `layer${index}` )
      } );
      this.atmosphereLayers.push( atmosphereLayer );
    } );

    // @public (read-only) - model of the ground that absorbs energy, heats up, and radiates
    this.groundLayer = new EnergyAbsorbingEmittingLayer( 0, {
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH,
      minimumTemperature: MINIMUM_GROUND_TEMPERATURE,
      tandem: tandem.createTandem( 'groundLayer' )
    } );

    // @public {NumberProperty} - number of clouds that are active and thus reflecting light
    this.numberOfActiveCloudsProperty = new NumberProperty( 0, {
      range: new Range( 0, options.numberOfClouds ),
      tandem: tandem.createTandem( 'numberOfActiveCloudsProperty' )
    } );

    // @public {NumberProperty} - the temperature of the surface in degrees Kelvin
    this.surfaceTemperatureKelvinProperty = new NumberProperty( 0, {
      range: new Range( 0, 500 ),
      tandem: tandem.createTandem( 'surfaceTemperatureKelvinProperty' )
    } );

    // @public {DerivedProperty.<number> - the temperature, but in Celsius used in multiple views
    this.surfaceTemperatureCelsiusProperty = new DerivedProperty( [ this.surfaceTemperatureKelvinProperty ], GreenhouseEffectUtils.kelvinToCelsius );

    // @public {DerivedProperty.<number> - the temperature, but in
    this.surfaceTemperatureFahrenheitProperty = new DerivedProperty( [ this.surfaceTemperatureKelvinProperty ], GreenhouseEffectUtils.kelvinToFahrenheit );

    // @public (read-only) - the endpoint where energy radiating from the top of the atmosphere goes
    this.outerSpace = new SpaceEnergySink( HEIGHT_OF_ATMOSPHERE + distanceBetweenLayers, tandem.createTandem( 'outerSpace' ) );

    // @private - used to track how much stepping of the model needs to occur
    this.modelSteppingTime = 0;

    // Populate the array of clouds based on how many are specified.
    if ( options.numberOfClouds > 0 ) {

      assert && assert(
        options.numberOfClouds === 1 || options.numberOfClouds === 3,
        `no configuration exists for this number of clouds: ${options.numberOfClouds}`
      );

      if ( options.numberOfClouds === 1 ) {

        // The position and size of the cloud were chosen to look good in the view and can be adjusted as needed.
        this.clouds.push(
          new Cloud( new Vector2( -16000, 20000 ), 20000, 4000, { tandem: tandem.createTandem( 'cloud' ) } )
        );
      }
      else if ( options.numberOfClouds === 3 ) {

        // The positions and sizes of the clouds were chosen to look good in the view and can be adjusted as needed.
        this.clouds.push( new Cloud( new Vector2( -20000, 20000 ), 15000, 3500, {
          tandem: tandem.createTandem( 'cloud1' )
        } ) );
        this.clouds.push( new Cloud( new Vector2( 5000, 32000 ), 12000, 2500, {
          tandem: tandem.createTandem( 'cloud2' )
        } ) );
        this.clouds.push( new Cloud( new Vector2( 24000, 25000 ), 18000, 3000, {
          tandem: tandem.createTandem( 'cloud3' )
        } ) );
      }
    }

    // Connect up the surface temperature property to that of the ground layer model element.
    this.groundLayer.temperatureProperty.link( groundTemperature => {
      this.surfaceTemperatureKelvinProperty.set( groundTemperature );
    } );

    // Enable and disable clouds based on how many are currently active.
    this.numberOfActiveCloudsProperty.link( numberOfActiveCloudsProperty => {
      this.clouds.forEach( ( cloud, index ) => {
        cloud.enabledProperty.set( numberOfActiveCloudsProperty > index );
      } );
    } );
  }

  /**
   * @public
   * @override
   * @param {number} dt
   */
  stepModel( dt ) {

    if ( this.sunEnergySource.isShiningProperty.value ) {

      // Step the model components by a consistent dt in order to avoid instabilities in the layer interactions.  See
      // https://github.com/phetsims/greenhouse-effect/issues/48 for information on why this is necessary.
      this.modelSteppingTime += dt;

      while ( this.modelSteppingTime >= MODEL_TIME_STEP ) {

        // Add the energy produced by the sun to the system.
        const energyFromSun = this.sunEnergySource.produceEnergy( MODEL_TIME_STEP );
        if ( energyFromSun ) {
          this.emEnergyPackets.push( energyFromSun );
        }

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
    this.numberOfActiveCloudsProperty.reset();
    this.atmosphereLayers.forEach( atmosphereLayer => {atmosphereLayer.reset(); } );
    this.emEnergyPackets = [];
  }
}

// statics
LayersModel.HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
LayersModel.SUNLIGHT_SPAN = SUNLIGHT_SPAN;
LayersModel.MINIMUM_GROUND_TEMPERATURE = MINIMUM_GROUND_TEMPERATURE;
LayersModel.NUMBER_OF_ATMOSPHERE_LAYERS = NUMBER_OF_ATMOSPHERE_LAYERS;
LayersModel.TemperatureUnits = TemperatureUnits;

greenhouseEffect.register( 'LayersModel', LayersModel );
export default LayersModel;