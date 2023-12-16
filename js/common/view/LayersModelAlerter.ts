// Copyright 2023, University of Colorado Boulder

/**
 * LayersModelAlerter is the base class for the "alerters" (objects that provided responsive description for
 * accessibility) used for the screens that model the greenhouse effect in this simulation.  It provides the
 * infrastructure for all alerts that are made and generates alerts common to all models that represent heat being
 * captured in an atmosphere.  A combination of immediate notification and polling is used to make sure the alerts are
 * timed and ordered as needed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Alerter, { AlerterOptions } from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayersModel from '../model/LayersModel.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnergyDescriber from './describers/EnergyDescriber.js';

type SelfOptions = {

  // a boolean Property that controls whether historical alerts should be used instead of quantitative ones for temperature
  useHistoricalAlertsProperty?: TReadOnlyProperty<boolean>;
};
export type LayersModelAlerterOptions = SelfOptions & AlerterOptions;

// The parts of the model that are periodically described as they change over time.
type PreviousPeriodicNotificationModelState = {
  temperature: number;
  outgoingEnergy: number;
  netInflowOfEnergy: number;
};

// number of decimal places to pay attention to in the temperature values
const TEMPERATURE_DECIMAL_PLACES = 1;

// The time period at which alerts are sent to the UtteranceQueue describing model changes, in seconds.  Different
// values are used when playing versus stepping.
const ALERT_INTERVAL_WHILE_PLAYING = 4;
const ALERT_INTERVAL_WHILE_STEPPING = 1;

// How many times a terse temperature alert should be spoken before a verbose temperature alert is used. Note this
// is a counting variable, not in units of time.
const NUMBER_OF_TERSE_TEMPERATURE_ALERTS = 2;

class LayersModelAlerter extends Alerter {

  // reference to the model, used in the methods
  private readonly model: LayersModel;

  // Time that has passed since last alert.  When the difference between this and the current time gets big enough, a
  // new alert is dispatched.
  private timeSinceLastAlert: number;

  // The elapsed time from the model during the previous step of this alerter.
  private previousElapsedModelTime = 0;

  // Snapshot of the important described model Properties that are used every time we generate a description. Actual
  // initial values are populated on construction.
  private previousPeriodicNotificationModelState: PreviousPeriodicNotificationModelState;

  // When true, an extra verbose fragment about the surface temperature will be included. This will be true whenever
  // the concentration changes.
  private useVerboseSurfaceTemperatureAlert = true;

  // A flag that is used to override the usual "warming" or "cooling" terminology for temperature.  This can be set to
  // true to use the word "stabilizing" instead, for more information about why this is needed see
  // https://github.com/phetsims/greenhouse-effect/issues/199#issuecomment-1211220790.
  private describeTemperatureAsStabilizing = false;

  // The number of times that the temperature change alert has been announced. Every time this counter is an interval of
  // NUMBER_OF_TERSE_TEMPERATURE_ALERTS, a more verbose temperature description is used. Otherwise, a very terse alert
  // is used. This is an attempt to reduce how much is spoken every ALERT_INTERVAL_WHILE_PLAYING.  This value can be
  // reset to force a more verbose alert.
  private temperatureChangeAlertCount: number;

  private readonly outgoingEnergyProperty: NumberProperty;
  private readonly incomingEnergyProperty: NumberProperty;
  private netEnergyProperty: TReadOnlyProperty<number>;

  public constructor( model: LayersModel, providedOptions: LayersModelAlerterOptions ) {

    const options = optionize<LayersModelAlerterOptions, SelfOptions, AlerterOptions>()( {

      useHistoricalAlertsProperty: new BooleanProperty( false ),

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( options );

    this.model = model;
    this.outgoingEnergyProperty = model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty;
    this.incomingEnergyProperty = model.sunEnergySource.outputEnergyRateTracker.energyRateProperty;
    this.temperatureChangeAlertCount = 0;
    this.timeSinceLastAlert = 0;
    this.previousPeriodicNotificationModelState = this.savePeriodicNotificationModelState();

    this.netEnergyProperty = new DerivedProperty( [ this.incomingEnergyProperty, this.outgoingEnergyProperty ],
      ( inEnergy, outEnergy ) => {
        return inEnergy - outEnergy;
      } );

    // When we reach equilibrium at the ground layer, announce that state immediately. This doesn't need to be ordered
    // in with the other alerts, so the alert can be performed right away.
    model.groundLayer.atEquilibriumProperty.lazyLink( atEquilibrium => {
      if ( atEquilibrium ) {
        this.alert( TemperatureDescriber.getSurfaceTemperatureStableString(
          model.surfaceTemperatureKelvinProperty.value,
          model.surfaceThermometerVisibleProperty.value,
          model.surfaceTemperatureVisibleProperty.value,
          model.temperatureUnitsProperty.value,
          options.useHistoricalAlertsProperty.value
        ) );
      }
    } );

    // Announce the temperature immediately when the temperature units change. This is unrelated to the temperature
    // change alerts that happen in the polling implementation and doesn't need to be in a specific order with them, so
    // it doesn't need to be in the 'step' function.
    model.temperatureUnitsProperty.lazyLink( temperatureUnits => {
      this.alert( TemperatureDescriber.getQuantitativeTemperatureDescription(
        model.surfaceTemperatureKelvinProperty.value,
        temperatureUnits
      ) );
    } );

    // Alert when the sun starts shining. This alert is unrelated to concentration and temperature alerts that happen
    // in the polling, so it can stay in a linked listener.
    model.sunEnergySource.isShiningProperty.lazyLink( () => {
      this.alert( GreenhouseEffectStrings.a11y.sunlightStartedStringProperty );
    } );

    // Monitor the "playing" state and reset the accumulated time since the last alert when changes occur.  This keeps
    // the amount of time between alerts consistent when switching modes.
    model.isPlayingProperty.link( isPlaying => {
      this.timeSinceLastAlert = isPlaying ? ALERT_INTERVAL_WHILE_PLAYING / 2 : ALERT_INTERVAL_WHILE_STEPPING / 2;
    } );
  }

  /**
   * Do some rounding on the current temperature so that we don't alert when the changes are too small.
   */
  private getCurrentTemperature(): number {
    return Utils.toFixedNumber(
      this.model.surfaceTemperatureKelvinProperty.value,
      TEMPERATURE_DECIMAL_PLACES
    );
  }

  /**
   * Use a more complete temperature alert instead of a terse one the next time a temperature alert is made, including
   * the temperature value with units and "Surface temperature" as a full sentence.
   */
  protected useCompleteTemperatureAtNextAlert(): void {
    this.useVerboseSurfaceTemperatureAlert = true;
    this.temperatureChangeAlertCount = 0;
  }

  /**
   * Use the term 'stabilizing' instead of the usual 'warming' or 'cooling' for the next temperature alert.  See
   * https://github.com/phetsims/greenhouse-effect/issues/199#issuecomment-1211220790.
   */
  protected useStabilizingTemperatureAtNextAlert(): void {
    this.describeTemperatureAsStabilizing = true;
  }

  /**
   * Set the internal state such that a new alert will occur relatively soon.
   */
  protected setUpQuickAlert(): void {
    const proportion = 0.75;
    this.timeSinceLastAlert = this.model.isPlayingProperty.value ?
                              ALERT_INTERVAL_WHILE_PLAYING * proportion :
                              ALERT_INTERVAL_WHILE_STEPPING * proportion;
  }

  /**
   * Reset the alert time.  This will cause there to be a full interval before the next check for timed alerts.
   */
  protected resetAlertTime(): void {
    this.timeSinceLastAlert = 0;
  }

  /**
   * Check whether the energy balance has changed in such a way that an alert should be performed and, if so, do it.
   * This is in a separate function so that subclasses can control when it is done.
   */
  protected checkAndPerformEnergyBalanceAlerts(): void {

    if ( this.model.energyBalanceVisibleProperty.value ) {

      // Did the energy balance change in such a way that we need to describe it?
      const currentNetInflowOfEnergy = this.model.netInflowOfEnergyProperty.value;
      const previousNetInflowOfEnergy = this.previousPeriodicNotificationModelState.netInflowOfEnergy;
      if ( ( previousNetInflowOfEnergy < -LayersModel.RADIATIVE_BALANCE_THRESHOLD &&
             currentNetInflowOfEnergy > -LayersModel.RADIATIVE_BALANCE_THRESHOLD ) ||
           ( previousNetInflowOfEnergy > LayersModel.RADIATIVE_BALANCE_THRESHOLD &&
             currentNetInflowOfEnergy < LayersModel.RADIATIVE_BALANCE_THRESHOLD ) ||
           ( Math.abs( previousNetInflowOfEnergy ) < LayersModel.RADIATIVE_BALANCE_THRESHOLD &&
             Math.abs( currentNetInflowOfEnergy ) > LayersModel.RADIATIVE_BALANCE_THRESHOLD ) ) {

        // Yep.
        const outgoingEnergyAlertString = EnergyDescriber.getNetEnergyAtAtmosphereDescription(
          currentNetInflowOfEnergy,
          this.model.inRadiativeBalanceProperty.value
        );
        outgoingEnergyAlertString && this.alert( outgoingEnergyAlertString );
      }
    }
  }

  /**
   * Check if the model state has changed in such a way since the last step that any new announcements are needed and,
   * if so, make them.  This function is called from the step function and is intended to be overridden in descendent
   * classes.
   */
  protected checkAndPerformImmediateAlerts(): void {
    // This does nothing in the base class.
  }

  /**
   * Check if the model state has changed in such a way since the last periodic alert that any new announcements are
   * needed and, if so, make them.  This function is called based on the periodic alert interval.
   */
  protected checkAndPerformPeriodicAlerts(): void {

    // To reduce verbosity the temperature value is included only every NUMBER_OF_TERSE_TEMPERATURE_ALERTS that
    // this response is created. Temperature must also be visible in the view.
    const includeTemperatureValue = this.model.surfaceThermometerVisibleProperty.value &&
                                    this.temperatureChangeAlertCount === 0;

    const currentTemperature = this.getCurrentTemperature();

    if ( currentTemperature !== this.previousPeriodicNotificationModelState.temperature ) {
      const temperatureAlertString = TemperatureDescriber.getSurfaceTemperatureChangeString(
        this.previousPeriodicNotificationModelState.temperature,
        currentTemperature,
        includeTemperatureValue,
        this.model.temperatureUnitsProperty.value,
        this.useVerboseSurfaceTemperatureAlert,

        // When the control mode changes, it was requested that the temperature be described as 'stabilizing'
        // instead of 'warming' or 'cooling'.  See
        // https://github.com/phetsims/greenhouse-effect/issues/199#issuecomment-1211220790
        this.describeTemperatureAsStabilizing
      );
      temperatureAlertString && this.alert( temperatureAlertString );

      // Reset the change alert counter if we have spoken the terse form of the temperature change alert enough times.
      this.temperatureChangeAlertCount = this.temperatureChangeAlertCount >= NUMBER_OF_TERSE_TEMPERATURE_ALERTS ?
                                         0 :
                                         this.temperatureChangeAlertCount + 1;

      // Reset the flags that may have been set to affect the temperature alert.
      this.useVerboseSurfaceTemperatureAlert = false;
      this.describeTemperatureAsStabilizing = false;
    }

    this.checkAndPerformEnergyBalanceAlerts();

    // Save state information needed for next periodic alert.
    this.savePeriodicNotificationModelState();
  }

  /**
   * Save the model state that is used for descriptions that occur periodically.
   */
  private savePeriodicNotificationModelState(): PreviousPeriodicNotificationModelState {
    this.previousPeriodicNotificationModelState = this.previousPeriodicNotificationModelState || {
      temperature: 0,
      outgoingEnergy: 0,
      netInflowOfEnergy: 0
    };

    this.previousPeriodicNotificationModelState.temperature = this.getCurrentTemperature();
    this.previousPeriodicNotificationModelState.outgoingEnergy = this.outgoingEnergyProperty.value;
    this.previousPeriodicNotificationModelState.netInflowOfEnergy = this.model.netInflowOfEnergyProperty.value;

    return this.previousPeriodicNotificationModelState;
  }

  /**
   * Create new alerts if the state of the simulation has changed and timing variables indicate it is time. This step
   * function should be called every view step, regardless of whether the model is playing because certain alerts
   * describe updates that can change when the model is paused.
   */
  public step(): void {

    // Start by alerting "immediate" model changes. These are updates that need to be described as soon as they change.
    this.checkAndPerformImmediateAlerts();

    // Calculate the time experienced by the model since the last alert.  This is needed because some alerts don't need
    // to be announced if the model hasn't changed.
    this.timeSinceLastAlert += Math.max( this.model.totalElapsedTime - this.previousElapsedModelTime, 0 );

    // Use a different threshold for the time between alerts when stepping.
    const alertInterval = this.model.isPlayingProperty.value ?
                          ALERT_INTERVAL_WHILE_PLAYING :
                          ALERT_INTERVAL_WHILE_STEPPING;

    // If it's time, speak the periodic alerts.
    if ( this.timeSinceLastAlert > alertInterval ) {
      this.checkAndPerformPeriodicAlerts();
      this.resetAlertTime();
    }

    this.previousElapsedModelTime = this.model.totalElapsedTime;
  }

  /**
   * Reset this to its initial state.  For this to work properly the model must be reset prior to calling this method.
   */
  public reset(): void {
    this.temperatureChangeAlertCount = 0;
    this.timeSinceLastAlert = 0;
    this.useVerboseSurfaceTemperatureAlert = true;
    this.savePeriodicNotificationModelState();
  }
}

greenhouseEffect.register( 'LayersModelAlerter', LayersModelAlerter );
export default LayersModelAlerter;
