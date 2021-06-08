// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import EnergyDelayLine from './EnergyDelayLine.js';
import EnergyDirection from './EnergyDirection.js';
import FluxMeter from './FluxMeter.js';
import Photon from './Photon.js';
import SpaceEnergySink from './SpaceEnergySink.js';
import SunEnergySource from './SunEnergySource.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 50000; // in meters
const SUNLIGHT_SPAN = GreenhouseEffectConstants.SUNLIGHT_SPAN;
const NUMBER_OF_ATMOSPHERE_LAYERS = 16; // empirically determined to give us good behavior for temperature and energy flux

// units of temperature used by Greenhouse Effect
const TemperatureUnits = Enumeration.byKeys( [ 'KELVIN', 'CELSIUS', 'FAHRENHEIT' ] );

// We want things to heat up faster than they would in real life, so this is the amount by which this process is sped up
// versus real live.
const TIME_ACCELERATION_FACTOR = 1;

class GreenhouseEffectModel {
  constructor() {

    // @public {BooleanProperty} - controls whether the model has been started
    this.isStartedProperty = new BooleanProperty( GreenhouseEffectQueryParameters.initiallyStarted );

    // @public {NumberProperty} - playing speed for the model
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL );

    // @public {BooleanProperty} - controls whether the model is stepping through time or paused
    this.isPlayingProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - if true, a larger number of photons are shown
    this.allPhotonsVisibleProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - whether or not the flux meter is visible
    this.fluxMeterVisibleProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - whether or not the "Energy Balance" display is visible
    this.energyBalanceVisibleProperty = new BooleanProperty( false );

    // @public {NumberProperty} - the temperature of the surface in degrees Kelvin
    this.surfaceTemperatureKelvinProperty = new NumberProperty( 0, {
      range: new Range( 0, 500 )
    } );

    // @public {DerivedProperty.<number> - the temperature, but in Celsius used in multiple views
    this.surfaceTemperatureCelsiusProperty = new DerivedProperty( [ this.surfaceTemperatureKelvinProperty ], GreenhouseEffectUtils.kelvinToCelsius );

    // @public {DerivedProperty.<number> - the temperature, but in
    this.surfaceTemperatureFahrenheitProperty = new DerivedProperty( [ this.surfaceTemperatureKelvinProperty ], GreenhouseEffectUtils.kelvinToFahrenheit );

    // @public {BooleanProperty} - whether or not the thermometer measuring surface temperature is visible
    this.surfaceThermometerVisibleProperty = new BooleanProperty( true );

    // @public {EnumerationProperty} - displayed units of temperature
    this.temperatureUnitsProperty = new EnumerationProperty( TemperatureUnits, TemperatureUnits.KELVIN );

    // @private - main energy source coming into the system
    this.sun = new SunEnergySource( EnergyAbsorbingEmittingLayer.SURFACE_AREA );

    // @public (read-only) - model of the ground that absorbs energy, heats up, and radiates
    this.groundLayer = new EnergyAbsorbingEmittingLayer( 0, {
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH,
      minimumTemperature: 245
    } );
    this.groundLayer.jbId = 'ground'; // TODO: for debug, remove before publication

    // @public {ObservableArray.<Cloud>} - observable list of Clouds in the simulation that may interact with photons
    this.clouds = createObservableArray();

    // Put the delay between the sun and the ground.  This one is a bit different from the delay lines that interconnect
    // the energy absorbing and emitting layers, so we keep track of it separately.
    this.sunToGroundEnergyDelayLine = new EnergyDelayLine( HEIGHT_OF_ATMOSPHERE / Photon.SPEED, EnergyDirection.DOWN );
    this.sunToGroundEnergyDelayLine.jbId = 'sunToGroundEnergyDelayLine';

    // Connect the sun to the ground.
    this.sun.connectOutput( EnergyDirection.DOWN, this.sunToGroundEnergyDelayLine.incomingEnergyProperty );
    this.sunToGroundEnergyDelayLine.connectOutput( EnergyDirection.DOWN, this.groundLayer.incomingDownwardMovingEnergyProperty );

    // @public (read-only) {EnergyAbsorbingEmittingLayer[]} - the energy absorbing and emitting layers for the atmosphere
    this.atmospherLayers = [];

    // @private {EnergyDelayLine[]} - Delay lines that are used to delay the transfer of energy, thus simulating
    // the propagation of electromagnetic radiation over a distance.
    this.energyDelayLines = [];

    // Create the energy absorbing and emitting layers that model the atmosphere and interconnect them with delay lines.
    const distanceBetweenLayers = HEIGHT_OF_ATMOSPHERE / ( NUMBER_OF_ATMOSPHERE_LAYERS + 1 );
    _.times( NUMBER_OF_ATMOSPHERE_LAYERS, index => {

      // Create the energy absorbing/emitting layer in the atmosphere.
      const atmosphereLayer = new EnergyAbsorbingEmittingLayer( distanceBetweenLayers * ( index + 1 ), {
        minimumTemperature: 0
      } );
      this.atmospherLayers.push( atmosphereLayer );

      // Create the delay lines that will connect the just-created layer to the layer below.
      const upwardEnergyDelayLine = new EnergyDelayLine( distanceBetweenLayers / Photon.SPEED, EnergyDirection.UP );
      this.energyDelayLines.push( upwardEnergyDelayLine );
      const downwardEnergyDelayLine = new EnergyDelayLine( distanceBetweenLayers / Photon.SPEED, EnergyDirection.DOWN );
      this.energyDelayLines.push( downwardEnergyDelayLine );

      // Interconnect the layers via the delay lines.
      const lowerLayer = index === 0 ? this.groundLayer : this.atmospherLayers[ index - 1 ];
      lowerLayer.connectOutput( EnergyDirection.UP, upwardEnergyDelayLine.incomingEnergyProperty );
      upwardEnergyDelayLine.connectOutput( EnergyDirection.UP, atmosphereLayer.incomingUpwardMovingEnergyProperty );
      atmosphereLayer.connectOutput( EnergyDirection.DOWN, downwardEnergyDelayLine.incomingEnergyProperty );
      downwardEnergyDelayLine.connectOutput( EnergyDirection.DOWN, lowerLayer.incomingDownwardMovingEnergyProperty );
    } );

    // @public (read-only) - the endpoint where energy radiating from the top layer goes
    this.outerSpace = new SpaceEnergySink();

    // Connect the topmost atmosphere layer to outer space.
    this.atmospherLayers[ this.atmospherLayers.length - 1 ].connectOutput(
      EnergyDirection.UP,
      this.outerSpace.incomingUpwardMovingEnergyProperty
    );

    // Connect up the surface temperature property to that of the ground layer model element.
    this.groundLayer.temperatureProperty.link( groundTemperature => {
      this.surfaceTemperatureKelvinProperty.set( groundTemperature );
    } );

    // @private - model component for the FluxMeter
    this.fluxMeter = new FluxMeter();
  }

  /**
   * TODO: This is a temporary method used for debugging.
   * @param {string} message
   * @param {number} energy
   * @private
   */
  logScaledEnergy( message, energy ) {
    console.log( `${message} ${Utils.toFixed( energy / EnergyAbsorbingEmittingLayer.SURFACE_AREA, 0 )}` );
  }

  /**
   * Step the model forward by the provided time.
   * @protected
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt ) {

    // The speed of energy transfer and related processes is sped up versus "real life" so as not to tax our users'
    // patience.
    const acceleratedDt = dt * TIME_ACCELERATION_FACTOR;

    // Calculate the amount of solar energy that is coming into the system in this step.
    this.sun.step( acceleratedDt );

    // Step the energy delay lines.  These use normal, non-accelerated time because the delay values are calculated
    // assuming real values.
    this.sunToGroundEnergyDelayLine.step( dt );
    this.energyDelayLines.forEach( energyDelayLine => { energyDelayLine.step( dt ); } );

    // Step the energy absorbing/emitting layers.  These use accelerated time so that they heat and cool at a rate that
    // is faster than real life.
    this.groundLayer.step( acceleratedDt );
    this.atmospherLayers.forEach( atmosphereLayer => { atmosphereLayer.step( dt ); } );
    this.outerSpace.step( dt );

    // Log debug information to console if flag is set.
    if ( phet.jbDebug ) {
      console.log( '------------------------------------' );
      this.logScaledEnergy( 'sun output energy:', this.sun.outputEnergyRateTracker.energyRate );
      this.logScaledEnergy( 'ground incoming energy from above:', this.groundLayer.incomingDownwardMovingEnergyRateTracker.energyRate );
      this.atmospherLayers.forEach( ( atmosphereLayer, index ) => {
        this.logScaledEnergy( `layer ${index} incoming energy from below:`, atmosphereLayer.incomingUpwardMovingEnergyRateTracker.energyRate );
        this.logScaledEnergy( `layer ${index} incoming energy from above:`, atmosphereLayer.incomingDownwardMovingEnergyRateTracker.energyRate );
      } );
      this.logScaledEnergy( 'space incoming upward-moving energy:', this.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRate );

      phet.jbDebug = false;
    }
  }

  /**
   * Step the simulation, called by Joist framework.
   *
   * @public
   * @param {number} dt - in seconds
   */
  step( dt ) {
    if ( this.isStartedProperty.value && this.isPlayingProperty.value ) {
      const timeStep = this.timeSpeedProperty.value === TimeSpeed.NORMAL ? dt : dt / 2;
      this.stepModel( timeStep );
    }
  }

  /**
   * Resets all aspects of the model.
   *
   * @public
   */
  reset() {
    this.isStartedProperty.reset();
    this.timeSpeedProperty.reset();
    this.isPlayingProperty.reset();
    this.surfaceThermometerVisibleProperty.reset();
    this.allPhotonsVisibleProperty.reset();
    this.fluxMeterVisibleProperty.reset();
    this.energyBalanceVisibleProperty.reset();
    this.temperatureUnitsProperty.reset();
    this.clouds.reset();
    this.groundLayer.reset();
    this.atmospherLayers.forEach( atmosphereLayer => {atmosphereLayer.reset(); } );
    this.sunToGroundEnergyDelayLine.reset();
    this.energyDelayLines.forEach( energyDelayLine => {energyDelayLine.reset(); } );
  }
}

// statics
GreenhouseEffectModel.TemperatureUnits = TemperatureUnits;
GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
GreenhouseEffectModel.SUNLIGHT_SPAN = SUNLIGHT_SPAN;

greenhouseEffect.register( 'GreenhouseEffectModel', GreenhouseEffectModel );
export default GreenhouseEffectModel;
