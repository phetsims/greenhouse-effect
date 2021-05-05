// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import EnergyDelayLine from './EnergyDelayLine.js';
import EnergyDirection from './EnergyDirection.js';
import Photon from './Photon.js';
import SpaceEnergySink from './SpaceEnergySink.js';
import SunEnergySource from './SunEnergySource.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 50000; // in m
const SUNLIGHT_SPAN = GreenhouseEffectConstants.SUNLIGHT_SPAN;

// units of temperature used by Greenhouse Effect
const TEMPERATURE_UNITS = Enumeration.byKeys( [ 'KELVIN', 'CELSIUS', 'FAHRENHEIT' ] );

// We want things to heat up faster than they would in real life, so this is the amount by which this process is sped up
// versus real live.
const TIME_ACCELERATION_FACTOR = 1;

class GreenhouseEffectModel {
  constructor() {

    // @public {BooleanProperty} - controls whether the model has been started
    this.isStartedProperty = new BooleanProperty( false );

    // @public {NumberProperty} - playing speed for the model
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL );

    // @public {BooleanProperty} - controls whether the model is stepping through time or paused
    this.isPlayingProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - if true, a larger number of photons are shown
    this.allPhotonsVisibleProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - whether or not the flux meter is visible
    this.fluxMeterVisibleProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - whether or not the thermometer measuring surface temperature is visible
    this.surfaceThermometerVisibleProperty = new BooleanProperty( true );

    // @public {EnumerationProperty} - displayed units of temperature
    this.temperatureUnitsProperty = new EnumerationProperty( TEMPERATURE_UNITS, TEMPERATURE_UNITS.KELVIN );

    // Create the energy sources, energy absorbing/emitting layers (including the ground), and the delays that simulate
    // the propagation time.
    this.sun = new SunEnergySource( EnergyAbsorbingEmittingLayer.SURFACE_AREA );
    this.sunToGroundEnergyDelayLine = new EnergyDelayLine( HEIGHT_OF_ATMOSPHERE / Photon.SPEED );
    this.groundLayer = new EnergyAbsorbingEmittingLayer( 0, {
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH
    } );
    this.groundLayer.jbId = 'ground';
    const altitudeOfLowerAtmosphereLayer = HEIGHT_OF_ATMOSPHERE / 3;
    this.groundToLowerAtmosphereLayerDelayLine = new EnergyDelayLine( altitudeOfLowerAtmosphereLayer / Photon.SPEED );
    // this.lowerAtmosphereLayer = new EnergyAbsorbingEmittingLayer( altitudeOfLowerAtmosphereLayer );
    this.lowerAtmosphereLayer = new EnergyAbsorbingEmittingLayer( altitudeOfLowerAtmosphereLayer, { initialEnergyAbsorptionProportion: 0.5 } );
    this.lowerAtmosphereLayer.jbId = 'lowerAtmosphere';
    this.outerSpace = new SpaceEnergySink();
    // const altitudeOfUpperAtmosphereLayer = 2 * HEIGHT_OF_ATMOSPHERE / 3;
    // this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine = new EnergyDelayLine(
    //   ( altitudeOfUpperAtmosphereLayer - altitudeOfLowerAtmosphereLayer ) / Photon.SPEED
    // );
    // this.upperAtmosphereLayer = new EnergyAbsorbingEmittingLayer( altitudeOfUpperAtmosphereLayer );
    // this.upperAtmosphereLayer.jbId = 'upperAtmosphere';

    // Interconnect the energy sources, layers, and delays.
    this.sun.connectOutput( EnergyDirection.DOWN, this.groundLayer.incomingDownwardMovingEnergyProperty );
    this.groundLayer.connectOutput( EnergyDirection.UP, this.lowerAtmosphereLayer.incomingUpwardMovingEnergyProperty );
    this.lowerAtmosphereLayer.connectOutput( EnergyDirection.DOWN, this.groundLayer.incomingDownwardMovingEnergyProperty );
    this.lowerAtmosphereLayer.connectOutput( EnergyDirection.UP, this.outerSpace.incomingUpwardMovingEnergyProperty );
    // this.sunToGroundEnergyDelayLine.setSourceOfDownwardMovingEnergy( this.sunEnergy );
    // this.groundLayer.addSourceOfDownwardMovingEnergy( this.sunToGroundEnergyDelayLine.energyOutput );
    // this.groundLayer.addSourceOfDownwardMovingEnergy( this.groundToLowerAtmosphereLayerDelayLine.energyOutput );
    // this.groundToLowerAtmosphereLayerDelayLine.setSourceOfUpwardMovingEnergy( this.groundLayer.energyOutput );
    // this.groundToLowerAtmosphereLayerDelayLine.setSourceOfDownwardMovingEnergy( this.lowerAtmosphereLayer.energyOutput );
    // this.lowerAtmosphereLayer.addSourceOfUpwardMovingEnergy( this.groundToLowerAtmosphereLayerDelayLine.energyOutput );
    // this.lowerAtmosphereLayer.addSourceOfDownwardMovingEnergy( this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine.energyOutput );
    // this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine.setSourceOfUpwardMovingEnergy( this.lowerAtmosphereLayer.energyOutput );
    // this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine.setSourceOfDownwardMovingEnergy( this.upperAtmosphereLayer.energyOutput );
    // this.upperAtmosphereLayer.addSourceOfUpwardMovingEnergy( this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine.energyOutput );
  }

  /**
   * TODO: This is a temporary method used for debugging.
   * @param message
   * @param energy
   * @param dt
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
    this.groundToLowerAtmosphereLayerDelayLine.step( dt );
    // this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine.step( dt );
    // this.lowerAtmosphereLayerToUpperAtmosphereLayerDelayLine.step( dt );

    // Step the energy absorbing/emitting layers.  These use accelerated time so that they heat and cool at a rate that
    // is faster than real life.
    this.groundLayer.step( acceleratedDt );
    this.lowerAtmosphereLayer.step( acceleratedDt );
    // this.upperAtmosphereLayer.step( acceleratedDt );
    this.outerSpace.step( dt );

    // Log debug information to console if flag is set.
    if ( phet.jbDebug ) {
      console.log( '------------------------------------' );
      this.logScaledEnergy( 'sun output energy:', this.sun.outputEnergyRateTracker.energyRate );
      this.logScaledEnergy( 'ground incoming downward-moving energy:', this.groundLayer.incomingDownwardMovingEnergyRateTracker.energyRate );
      this.logScaledEnergy( 'ground incoming upward-moving energy:', this.groundLayer.incomingUpwardMovingEnergyRateTracker.energyRate );
      this.logScaledEnergy( 'layer 1 incoming upward-moving energy:', this.lowerAtmosphereLayer.incomingUpwardMovingEnergyRateTracker.energyRate );

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
    this.allPhotonsVisibleProperty.reset();
    this.fluxMeterVisibleProperty.reset();
    this.surfaceThermometerVisibleProperty.reset();
    this.temperatureUnitsProperty.reset();
    this.sunToGroundEnergyDelayLine.reset();
    this.groundToLowerAtmosphereLayerDelayLine.reset();
    this.groundLayer.reset();
    this.lowerAtmosphereLayer.reset();
    // this.upperAtmosphereLayer.reset();
  }
}

// statics
GreenhouseEffectModel.TEMPERATURE_UNITS = TEMPERATURE_UNITS;
GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
GreenhouseEffectModel.SUNLIGHT_SPAN = SUNLIGHT_SPAN;

greenhouseEffect.register( 'GreenhouseEffectModel', GreenhouseEffectModel );
export default GreenhouseEffectModel;
