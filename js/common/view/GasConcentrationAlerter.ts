// Copyright 2021-2023, University of Colorado Boulder

/**
 * Responsible for generating and timing alerts related to gas concentration in this sim. A polling method is used
 * to time the alerts and determine how model variables have changed to create an accurate description.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 *
 * TODO: (see https://github.com/phetsims/greenhouse-effect/issues/129) This is named GasConcentrationAlerter, but it's
 *       doing more than just talking about the state.  We should consider a new name, perhaps LayerModelStateAlerter or
 *       something along those lines.
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Alerter, { AlerterOptions } from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import LayersModel from '../model/LayersModel.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import RadiationDescriber from './describers/RadiationDescriber.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import EnergyRepresentation from './EnergyRepresentation.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

type SelfOptions = {

  // Controls whether the descriptions for energy are for waves or photons.
  energyRepresentation: EnergyRepresentation;
};
export type GasConcentrationAlerterOptions = SelfOptions & AlerterOptions;

// number of decimal places to pay attention to in the temperature values
const TEMPERATURE_DECIMAL_PLACES = 1;

// in seconds, how frequently to send an alert to the UtteranceQueue describing changing concentrations
const ALERT_INTERVAL_WHILE_PLAYING = 4;
const ALERT_INTERVAL_WHILE_STEPPING = 1;

// In seconds, how long to wait before the next alert after changing the concentration value.  This only applies when
// model is playing, not when stepping.
const ALERT_DELAY_AFTER_CHANGING_CONCENTRATION = 2;

// How many times a terse temperature alert should be spoken before a verbose temperature alert is used. Note this
// is a counting variable, not in units of time.
const NUMBER_OF_TERSE_TEMPERATURE_ALERTS = 2;

// A higher delay before waiting for the Utterance to stabilize so that we don't hear information about the new
// scene in the observation window when rapidly changing dates. This value is longer than the default press and
// hold delay for most operating systems so that we don't get an initial change response when you first press down and
// hold. This delay needs to be shorter than ALERT_DELAY_AFTER_CHANGING_CONCENTRATION or else the alerts could come
// through in the wrong order.
const ALERT_DELAY_AFTER_CHANGING_DATE = 1.5; // in seconds
assert && assert(
  ALERT_DELAY_AFTER_CHANGING_DATE < ALERT_DELAY_AFTER_CHANGING_CONCENTRATION,
  'delay will cause alerts to be out of order'
);
const DATE_CHANGE_UTTERANCE_OPTIONS = {
  alertStableDelay: ALERT_DELAY_AFTER_CHANGING_DATE * 1000 // UtteranceQueue uses ms
};

// The parts of the model that are periodically described as they change over time.
type PreviousPeriodicNotificationModelState = {
  temperature: number;
  concentration: number;
  outgoingEnergy: number;
  netInflowOfEnergy: number;
  date: ConcentrationDate;

  // This is in both periodic and immediate state - when this changes we need to describe some information immediately
  // and some information at the next alert interval.
  concentrationControlMode: ConcentrationControlMode;
};

// The model state that should be described as soon as possible every time it changes.
type PreviousImmediateNotificationModelState = {
  concentrationControlMode: ConcentrationControlMode;
  cloudEnabled: boolean;
  concentrationDate: ConcentrationDate;
};

class GasConcentrationAlerter extends Alerter {

  // reference to the model, used in the methods
  private readonly model: ConcentrationModel;

  // Time that has passed since last alert.  When the difference between this and the current time gets big enough, a
  // new alert is dispatched.
  private timeSinceLastAlert: number;

  // The elapsed time from the model during the previous step of this alerter.
  private previousElapsedModelTime = 0;

  // The number of times that the temperature change alert has been announced. Whenever the concentration value changes
  // this count is reset. Every time this counter is an interval of NUMBER_OF_TERSE_TEMPERATURE_ALERTS, a more
  // verbose temperature description is used. Otherwise, a very terse alert is used. This is an attempt to reduce how
  // much is spoken every ALERT_INTERVAL_WHILE_PLAYING
  private temperatureChangeAlertCount: number;

  // When true, an extra verbose fragment about the surface temperature will be included. This will be true whenever
  // the concentration changes.
  private useVerboseSurfaceTemperatureAlert: boolean;

  // After a change in concentration control mode we are going to describe temperatures as 'stabilizing' to give a more
  // generic description of changes and prevent overwhelming the user with too much information. See
  // https://github.com/phetsims/greenhouse-effect/issues/199#issuecomment-1211220790
  private describeTemperatureAsStabilizing = false;

  private readonly outgoingEnergyProperty: NumberProperty;
  private readonly incomingEnergyProperty: NumberProperty;
  private netEnergyProperty: TReadOnlyProperty<number>;

  // Snapshot of the important described model Properties that are used every time we generate a description. Actual
  // initial values are populated on construction.
  private previousPeriodicNotificationModelState: PreviousPeriodicNotificationModelState;

  private previousImmediateNotificationModelState: PreviousImmediateNotificationModelState;

  // Utterances that describe the changing scene and concentration when controlling by date. Using
  // reusable Utterances allows this information to "collapse" in the queue and only the most
  // recent change is heard when rapid updates happen.
  private readonly observationWindowSceneUtterance = new Utterance( DATE_CHANGE_UTTERANCE_OPTIONS );
  private readonly concentrationChangeUtterance = new Utterance( DATE_CHANGE_UTTERANCE_OPTIONS );

  private readonly energyRepresentation: EnergyRepresentation;

  public constructor( model: ConcentrationModel, providedOptions: GasConcentrationAlerterOptions ) {

    const options = optionize<GasConcentrationAlerterOptions, SelfOptions, AlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( options );

    this.model = model;
    this.useVerboseSurfaceTemperatureAlert = true;
    this.temperatureChangeAlertCount = 0;
    this.timeSinceLastAlert = 0;
    this.energyRepresentation = options.energyRepresentation;

    this.outgoingEnergyProperty = model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty;
    this.incomingEnergyProperty = model.sunEnergySource.outputEnergyRateTracker.energyRateProperty;

    this.netEnergyProperty = new DerivedProperty( [ this.incomingEnergyProperty, this.outgoingEnergyProperty ],
      ( inEnergy, outEnergy ) => {
        return inEnergy - outEnergy;
      } );

    this.previousPeriodicNotificationModelState = this.savePeriodicNotificationModelState();
    this.previousImmediateNotificationModelState = this.saveImmediateNotificationModelState();

    // When we reach equilibrium at the ground layer, announce that state immediately. This doesn't need to be
    // ordered in with the other alerts, so it doesn't need to be in the polling solution. But it could be moved
    // to "immediate" state model if that is more clear in the future.
    model.groundLayer.atEquilibriumProperty.lazyLink( atEquilibrium => {
      if ( atEquilibrium ) {
        this.alert( TemperatureDescriber.getSurfaceTemperatureStableString(
          model.surfaceTemperatureKelvinProperty.value,
          model.surfaceThermometerVisibleProperty.value,
          model.surfaceTemperatureVisibleProperty.value,
          model.temperatureUnitsProperty.value,
          model.concentrationControlModeProperty.value,
          model.dateProperty.value
        ) );
      }
    } );

    // Announce the temperature when the user changes the units. This is unrelated to the concentration and temperature
    // change alerts that happen in the polling implementation, so it can stay in a linked listener. But this could
    // move to "immediate" state model someday if that is more clear.
    model.temperatureUnitsProperty.lazyLink( temperatureUnits => {
      this.alert( TemperatureDescriber.getQuantitativeTemperatureDescription(
        model.surfaceTemperatureKelvinProperty.value,
        temperatureUnits
      ) );
    } );

    // Whenever the concentration changes, use the most verbose form of the temperature change alert.
    model.concentrationProperty.link( () => {
      this.useVerboseSurfaceTemperatureAlert = true;
      this.temperatureChangeAlertCount = 0;

      if ( model.isPlayingProperty.value ) {

        // After changing concentration, we should quickly hear content instead of waiting the full alert interval.
        this.timeSinceLastAlert = ALERT_INTERVAL_WHILE_PLAYING - ALERT_DELAY_AFTER_CHANGING_CONCENTRATION;
        assert && assert(
          this.timeSinceLastAlert >= 0,
          'setting timing variable to a negative value, your interval values need adjusting'
        );
      }
    } );

    model.concentrationControlModeProperty.lazyLink( () => {

      // After changing the concentration control mode, reset the `timeSinceLastAlert` so we have a full delay
      // before describing the new scene
      this.timeSinceLastAlert = 0;

      // After a change in concentration control mode, temperature changes are described as 'stabilizing', see
      // declaration for more information.
      this.describeTemperatureAsStabilizing = true;
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
   * Save the model state that is used for descriptions that occur periodically at every ALERT_INTERVAL_WHILE_PLAYING.
   */
  private savePeriodicNotificationModelState(): PreviousPeriodicNotificationModelState {
    this.previousPeriodicNotificationModelState = this.previousPeriodicNotificationModelState || {
      temperature: 0,
      concentration: 0,
      outgoingEnergy: 0,
      netInflowOfEnergy: 0,
      concentrationControlMode: this.model.concentrationControlModeProperty.value,
      date: this.model.dateProperty.value
    };

    this.previousPeriodicNotificationModelState.temperature = this.getCurrentTemperature();
    this.previousPeriodicNotificationModelState.concentration = this.model.concentrationProperty.value;
    this.previousPeriodicNotificationModelState.outgoingEnergy = this.outgoingEnergyProperty.value;
    this.previousPeriodicNotificationModelState.netInflowOfEnergy = this.model.netInflowOfEnergyProperty.value;
    this.previousPeriodicNotificationModelState.concentrationControlMode = this.model.concentrationControlModeProperty.value;
    this.previousPeriodicNotificationModelState.date = this.model.dateProperty.value;

    return this.previousPeriodicNotificationModelState;
  }

  private saveImmediateNotificationModelState(): PreviousImmediateNotificationModelState {
    this.previousImmediateNotificationModelState = this.previousImmediateNotificationModelState || {
      cloudEnabled: !!this.model.cloud?.enabledProperty.value,
      concentrationControlMode: this.model.concentrationControlModeProperty.value,
      concentrationDate: this.model.dateProperty.value
    };

    this.previousImmediateNotificationModelState.cloudEnabled = !!this.model.cloud?.enabledProperty.value;
    this.previousImmediateNotificationModelState.concentrationControlMode = this.model.concentrationControlModeProperty.value;
    this.previousImmediateNotificationModelState.concentrationDate = this.model.dateProperty.value;

    return this.previousImmediateNotificationModelState;
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
   * Create new alerts if the state of the simulation has changed and timing variables indicate it is time. This step
   * function should be called every view step, regardless of whether the model is playing because certain alerts
   * describe updates that are unrelated to the changing concentration model (see
   * "previousImmediateNotificationModelState").
   */
  public step(): void {

    // Start by alerting "immediate" model changes. These are updates that need to be described as soon as they change.
    const currentControlMode = this.model.concentrationControlModeProperty.value;
    if ( this.previousImmediateNotificationModelState.concentrationControlMode !== currentControlMode ) {
      if ( currentControlMode === ConcentrationControlMode.BY_DATE ) {

        // If controlling by date, include a description of the selected date.
        this.alert( ConcentrationDescriber.getTimePeriodChangeDescription( this.model.dateProperty.value ) );
      }
      else {

        // In manual mode, describe the relative level of concentration.
        this.alert( ConcentrationDescriber.getCurrentConcentrationLevelsDescription( this.model.concentrationProperty.value ) );
      }
    }

    const currentDate = this.model.dateProperty.value;
    const previousDate = this.previousImmediateNotificationModelState.concentrationDate;
    if ( previousDate !== currentDate ) {
      this.observationWindowSceneUtterance.alert = ConcentrationDescriber.getObservationWindowNowTimePeriodDescription( currentDate );
      this.concentrationChangeUtterance.alert = ConcentrationDescriber.getQualitativeConcentrationChangeDescription(
        ConcentrationModel.getConcentrationForDate( previousDate ),
        previousDate, ConcentrationModel.getConcentrationForDate( currentDate )
      );
      this.alert( this.observationWindowSceneUtterance );
      this.alert( this.concentrationChangeUtterance );
    }

    const cloudEnabled = !!this.model.cloud?.enabledProperty.value;
    if ( this.previousImmediateNotificationModelState.cloudEnabled !== cloudEnabled ) {
      this.alert( ConcentrationDescriber.getSkyCloudChangeDescription(
        cloudEnabled,
        this.model.sunEnergySource.isShiningProperty.value
      ) );
    }

    // Calculate the time since the last alert based on the time experienced by the model.  Some alerts don't need to be
    // announced if the model hasn't changed.
    this.timeSinceLastAlert += Math.max( this.model.totalElapsedTime - this.previousElapsedModelTime, 0 );

    // Use a different threshold for the time between alerts when stepping.
    const alertInterval = this.model.isPlayingProperty.value ?
                          ALERT_INTERVAL_WHILE_PLAYING :
                          ALERT_INTERVAL_WHILE_STEPPING;

    // If it's time, speak the periodic alerts.
    if ( this.timeSinceLastAlert > alertInterval ) {
      const previousControlModeFromPeriodState = this.previousPeriodicNotificationModelState.concentrationControlMode;
      const currentTemperature = this.getCurrentTemperature();
      const currentConcentration = this.model.concentrationProperty.value;

      if ( !this.model.groundLayer.atEquilibriumProperty.value ) {

        // Infrared radiation descriptions are only present if concentration changed while the concentration control
        // mode stayed the same
        if ( previousControlModeFromPeriodState === currentControlMode ) {

          // First, a description of the changing radiation redirecting back to the surface - this should only happen if
          // there was some change to the concentration.
          if ( this.model.isInfraredPresent() && currentConcentration !== this.previousPeriodicNotificationModelState.concentration ) {
            const radiationRedirectingAlert = RadiationDescriber.getRadiationRedirectionDescription(
              currentConcentration,
              this.previousPeriodicNotificationModelState.concentration,
              this.energyRepresentation
            );
            radiationRedirectingAlert && this.alert( radiationRedirectingAlert );
          }

          // Then, description of the changing surface temperature - again, only if there is some change in the
          // concentration.
          if ( this.model.isInfraredPresent() && currentConcentration !== this.previousPeriodicNotificationModelState.concentration ) {
            const surfaceRadiationAlertString = RadiationDescriber.getRadiationFromSurfaceChangeDescription(
              this.model.concentrationProperty.value,
              this.previousPeriodicNotificationModelState.concentration,
              this.energyRepresentation
            );
            surfaceRadiationAlertString && this.alert( surfaceRadiationAlertString );
          }
        }

        // Then, a description of the changing temperature - this should get described at interval even if there
        // is no change in concentration. There is a delay after concentration changes to avoid spamming the user with
        // too much information after concentration changes. Depending on how many times it has been spoken a terse
        // form of it may be used (handled in getSurfaceTemperatureChangeString).

        // To reduce verbosity the temperature value is included only every NUMBER_OF_TERSE_TEMPERATURE_ALERTS that
        // this response is created. Temperature must also be visible in the view.
        const includeTemperatureValue = this.model.surfaceThermometerVisibleProperty.value && this.temperatureChangeAlertCount === 0;

        const temperatureAlertString = TemperatureDescriber.getSurfaceTemperatureChangeString(
          this.previousPeriodicNotificationModelState.temperature,
          currentTemperature,
          includeTemperatureValue,
          this.model.temperatureUnitsProperty.value,
          this.useVerboseSurfaceTemperatureAlert,

          // when the control mode changes, it was requested that the temperature be described as 'stabilizing'
          // instead of 'warming' or 'cooling',
          // see https://github.com/phetsims/greenhouse-effect/issues/199#issuecomment-1211220790
          this.describeTemperatureAsStabilizing
        );
        temperatureAlertString && this.alert( temperatureAlertString );

        // reset counter if we have spoken the terse form of the temperature change alert enough times
        this.temperatureChangeAlertCount = this.temperatureChangeAlertCount >= NUMBER_OF_TERSE_TEMPERATURE_ALERTS ? 0 : this.temperatureChangeAlertCount + 1;

        // not verbose until concentration changes again
        this.useVerboseSurfaceTemperatureAlert = false;

        // Accurately describe temperature alerts next iteration.
        this.describeTemperatureAsStabilizing = false;
      }

      if ( previousControlModeFromPeriodState === currentControlMode ) {
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

      this.savePeriodicNotificationModelState();
      this.timeSinceLastAlert = 0;
    }

    this.previousElapsedModelTime = this.model.totalElapsedTime;
    this.saveImmediateNotificationModelState();
  }

  /**
   * Reset this to its initial state.  For this to work properly the model must be reset prior to calling this method.
   */
  public reset(): void {
    this.temperatureChangeAlertCount = 0;
    this.timeSinceLastAlert = 0;
    this.describeTemperatureAsStabilizing = false;
    this.savePeriodicNotificationModelState();
    this.saveImmediateNotificationModelState();
  }
}

greenhouseEffect.register( 'GasConcentrationAlerter', GasConcentrationAlerter );
export default GasConcentrationAlerter;
