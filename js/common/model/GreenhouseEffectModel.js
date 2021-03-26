// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const HEIGHT_OF_ATMOSPHERE = 10; // in km
const SUNLIGHT_SPAN = 17; // in km, horizontal distance over which sunlight is simulated

// units of temperature used by Greenhouse Effect
const TEMPERATURE_UNITS = Enumeration.byKeys( [ 'KELVIN', 'CELSIUS', 'FAHRENHEIT' ] );

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
  }

  /**
   * Step the model forward by the provided time.
   * @protected
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt ) {}

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
  }
}

// statics
GreenhouseEffectModel.TEMPERATURE_UNITS = TEMPERATURE_UNITS;
GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE = HEIGHT_OF_ATMOSPHERE;
GreenhouseEffectModel.SUNLIGHT_SPAN = SUNLIGHT_SPAN;

greenhouseEffect.register( 'GreenhouseEffectModel', GreenhouseEffectModel );
export default GreenhouseEffectModel;
