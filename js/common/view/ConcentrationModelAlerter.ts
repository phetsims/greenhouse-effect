// Copyright 2023-2024, University of Colorado Boulder

/**
 * ConcentrationModelAlerter is responsible for generating and timing alerts related to the ConcentrationModel
 * subclasses in this sim. Some alerts are generated immediately when the model changes while others are based on a
 * periodic polling approach so that the alerts can be produced at a reasonable frequency (such as those related to
 * temperature changes) and so that the order of alerts can be better controlled.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { AlerterOptions } from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import EnergyRepresentation from './EnergyRepresentation.js';
import LayersModelAlerter from './LayersModelAlerter.js';
import RadiationDescriber from './describers/RadiationDescriber.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

type SelfOptions = {

  // Controls whether the descriptions for energy are for waves or photons.
  energyRepresentation: EnergyRepresentation;
};
export type GasConcentrationAlerterOptions = SelfOptions & AlerterOptions;

// In seconds, how long to wait before the next alert after changing the concentration value.  This only applies when
// model is playing, not when stepping.
const ALERT_DELAY_AFTER_CHANGING_CONCENTRATION = 2;

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

// The parts of the concentration model that are periodically described as they change over time.
type ConcentrationModelState = {
  concentration: number;
  date: ConcentrationDate;
  cloudEnabled: boolean;

  // This is in both periodic and immediate state - when this changes we need to describe some information immediately
  // and some information at the next alert interval.
  concentrationControlMode: ConcentrationControlMode;
};

class ConcentrationModelAlerter extends LayersModelAlerter {

  private readonly concentrationModel: ConcentrationModel;

  // Elements of the model state that are specific to the concentration-based model and which can cause alerts to
  // be announced immediately when they change.
  private previousImmediateNotificationConcentrationModelState: ConcentrationModelState;

  // Elements of the model state that are specific to the concentration-based model and which can cause alerts to
  // be announced periodically when they change.
  private previousPeriodicNotificationConcentrationModelState: ConcentrationModelState;

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

    super( model, options );

    assert && assert( model.cloud, 'cloud must be present for this alerter' );

    this.concentrationModel = model;
    this.energyRepresentation = options.energyRepresentation;
    this.previousImmediateNotificationConcentrationModelState = this.saveImmediateNotificationModelState();
    this.previousPeriodicNotificationConcentrationModelState = this.saveConcentrationModelPeriodicNotificationState();

    // Whenever the concentration changes, use the most verbose form of the temperature change alert.
    model.concentrationProperty.link( () => {

      this.useCompleteTemperatureAtNextAlert();

      if ( model.isPlayingProperty.value ) {

        // After changing concentration, we should quickly hear content instead of waiting the full alert interval.
        this.setUpQuickAlert();
      }
    } );

    model.concentrationControlModeProperty.lazyLink( () => {

      // After changing the concentration control mode, reset the `timeSinceLastAlert` so we have a full delay
      // before describing the new scene.
      this.resetAlertTime();

      // After a change in concentration control mode, temperature changes are described as 'stabilizing', see
      // declaration for more information.
      this.useStabilizingTemperatureAtNextAlert();
    } );
  }

  /**
   * Save the model state that is used for descriptions that occur periodically.
   */
  private saveConcentrationModelPeriodicNotificationState(): ConcentrationModelState {
    this.previousPeriodicNotificationConcentrationModelState = this.previousPeriodicNotificationConcentrationModelState || {
      concentration: 0,
      concentrationControlMode: this.concentrationModel.concentrationControlModeProperty.value,
      date: this.concentrationModel.dateProperty.value
    };

    this.previousPeriodicNotificationConcentrationModelState.concentration = this.concentrationModel.concentrationProperty.value;
    this.previousPeriodicNotificationConcentrationModelState.concentrationControlMode = this.concentrationModel.concentrationControlModeProperty.value;
    this.previousPeriodicNotificationConcentrationModelState.date = this.concentrationModel.dateProperty.value;

    return this.previousPeriodicNotificationConcentrationModelState;
  }

  private saveImmediateNotificationModelState(): ConcentrationModelState {
    this.previousImmediateNotificationConcentrationModelState = this.previousImmediateNotificationConcentrationModelState || {
      cloudEnabled: !!this.concentrationModel.cloud?.enabledProperty.value,
      concentrationControlMode: this.concentrationModel.concentrationControlModeProperty.value,
      concentrationDate: this.concentrationModel.dateProperty.value
    };

    this.previousImmediateNotificationConcentrationModelState.cloudEnabled = !!this.concentrationModel.cloud?.enabledProperty.value;
    this.previousImmediateNotificationConcentrationModelState.concentrationControlMode = this.concentrationModel.concentrationControlModeProperty.value;
    this.previousImmediateNotificationConcentrationModelState.date = this.concentrationModel.dateProperty.value;

    return this.previousImmediateNotificationConcentrationModelState;
  }

  /**
   * Check the model state for changes that should motivate immediate alerts and make any that are necessary.  This
   * function is called at the view step rate by the base class.
   */
  protected override checkAndPerformImmediateAlerts(): void {

    const currentControlMode = this.concentrationModel.concentrationControlModeProperty.value;
    if ( this.previousImmediateNotificationConcentrationModelState.concentrationControlMode !== currentControlMode ) {

      if ( currentControlMode === ConcentrationControlMode.BY_DATE ) {

        // Make an alert about the change to the UI that just occurred.
        this.alert( StringUtils.fillIn( GreenhouseEffectStrings.a11y.concentrationControlReplacedPatternStringProperty, {
          visibleControl: GreenhouseEffectStrings.a11y.timePeriodRadioButtonGroupStringProperty,
          replacedControl: GreenhouseEffectStrings.a11y.greenhouseGasConcentrationSliderStringProperty
        } ) );

        // Since the concentration is now being controlled by date, include a description of the selected date.
        this.alert( ConcentrationDescriber.getTimePeriodChangeDescription( this.concentrationModel.dateProperty.value ) );
      }
      else {

        // Make an alert about the change to the UI that just occurred.
        this.alert( StringUtils.fillIn( GreenhouseEffectStrings.a11y.concentrationControlReplacedPatternStringProperty, {
          visibleControl: GreenhouseEffectStrings.a11y.greenhouseGasConcentrationSliderStringProperty,
          replacedControl: GreenhouseEffectStrings.a11y.timePeriodRadioButtonGroupStringProperty
        } ) );

        // In manual mode, describe the relative level of concentration.
        this.alert( ConcentrationDescriber.getCurrentConcentrationLevelsDescription( this.concentrationModel.concentrationProperty.value ) );
      }
    }

    const currentDate = this.concentrationModel.dateProperty.value;
    const previousDate = this.previousImmediateNotificationConcentrationModelState.date;
    if ( previousDate !== currentDate ) {
      this.observationWindowSceneUtterance.alert = ConcentrationDescriber.getObservationWindowNowTimePeriodDescription( currentDate );
      this.concentrationChangeUtterance.alert = ConcentrationDescriber.getQualitativeConcentrationChangeDescription(
        ConcentrationModel.getConcentrationForDate( previousDate ),
        previousDate, ConcentrationModel.getConcentrationForDate( currentDate )
      );
      this.alert( this.observationWindowSceneUtterance );
      this.alert( this.concentrationChangeUtterance );
    }

    const cloudEnabled = this.concentrationModel.cloud!.enabledProperty.value;
    if ( this.previousImmediateNotificationConcentrationModelState.cloudEnabled !== cloudEnabled ) {
      this.alert( ConcentrationDescriber.getSkyCloudChangeDescription(
        cloudEnabled,
        this.concentrationModel.sunEnergySource.isShiningProperty.value
      ) );
    }

    // Save state for the next round.
    this.saveImmediateNotificationModelState();
  }

  /**
   * Check the model state for changes that should motivate periodic alerts and make any that are necessary.  This
   * function is called at the view step rate by the base class.
   */
  protected override checkAndPerformPeriodicAlerts(): void {
    super.checkAndPerformPeriodicAlerts();
    const previousControlModeFromPeriodicState = this.previousPeriodicNotificationConcentrationModelState.concentrationControlMode;
    const currentConcentration = this.concentrationModel.concentrationProperty.value;
    const currentControlMode = this.concentrationModel.concentrationControlModeProperty.value;

    if ( !this.concentrationModel.groundLayer.atEquilibriumProperty.value ) {

      // Infrared radiation alerts are only done if concentration changed while the concentration control mode stayed
      // the same.
      if ( previousControlModeFromPeriodicState === currentControlMode ) {

        if ( this.concentrationModel.isInfraredPresent() ) {

          // First, a description of the changing radiation redirecting back to the surface - this should only happen if
          // there was some change to the concentration.
          if ( currentConcentration !== this.previousPeriodicNotificationConcentrationModelState.concentration ) {

            const radiationRedirectingAlert = RadiationDescriber.getRadiationRedirectionDescription(
              currentConcentration,
              this.previousPeriodicNotificationConcentrationModelState.concentration,
              this.energyRepresentation
            );
            radiationRedirectingAlert && this.alert( radiationRedirectingAlert );
          }

          // Then, description of the changing surface temperature - again, only if there is some change in the
          // concentration.
          if ( currentConcentration !== this.previousPeriodicNotificationConcentrationModelState.concentration ) {
            const surfaceRadiationAlertString = RadiationDescriber.getRadiationFromSurfaceChangeDescription(
              this.concentrationModel.concentrationProperty.value,
              this.previousPeriodicNotificationConcentrationModelState.concentration,
              this.energyRepresentation
            );
            surfaceRadiationAlertString && this.alert( surfaceRadiationAlertString );
          }
        }
      }
    }

    // Save state for the next round.
    this.saveConcentrationModelPeriodicNotificationState();
  }

  /**
   * Reset this to its initial state.  For this to work properly the model must be reset prior to calling this method.
   */
  public override reset(): void {
    this.saveImmediateNotificationModelState();
    super.reset();
  }
}

greenhouseEffect.register( 'ConcentrationModelAlerter', ConcentrationModelAlerter );
export default ConcentrationModelAlerter;