// Copyright 2023, University of Colorado Boulder

/**
 * EnergyFluxAlerter is responsible for generating and timing alerts related to energy flux measured by the flux meter.
 * A polling method is used to time the alerts and determine how model variables have changed to create an accurate
 * description.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Alerter, { AlerterOptions } from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import FluxMeterDescriptionProperty from './describers/FluxMeterDescriptionProperty.js';
import { FluxMeterReadings } from '../model/FluxMeter.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FluxSensor from '../model/FluxSensor.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;
export type EnergyFluxAlerterOptions = SelfOptions & AlerterOptions;

// in seconds, how frequently to send an alert to the UtteranceQueue describing changing concentrations
const ALERT_INTERVAL_WHILE_PLAYING = 4;
const ALERT_INTERVAL_WHILE_STEPPING = 1;

// The change in energy flux measured by the flux meter that will trigger a new alert in the absences of a change to
// the flux sensor altitude. In watts, empirically determined.
const ENERGY_FLUX_THRESHOLD_FOR_INDEPENDENT_ALERTS = 4000000;

// The amount of change in energy flux necessary to announce the full description after the sensor is moved.  Below this
// value the alerter will say that either a negligible or no change occurred.
const NON_NEGLIGIBLE_FLUX_CHANGE = 300000;

// The change of energy flux measured by the flux meter that must occur for it to be considered any change at all.  A
// change below this threshold is described as no change.
const APPRECIABLE_ENERGY_FLUX_CHANGE_THRESHOLD = 10000;

type PartialMomentaryModelState = {
  date: ConcentrationDate;
  concentrationControlMode: ConcentrationControlMode;
};

class EnergyFluxAlerter extends Alerter {

  // reference to the model, used in the methods
  private readonly model: ConcentrationModel;

  // Time that has passed since last alert, in seconds.  When the difference between this and the current time gets big
  // enough a new alert is announced.
  private alertCountdownTimer: number;

  // The elapsed time from the model during the previous step of this alerter.
  private previousElapsedModelTime = 0;

  // A snapshot of the model state information that is used to decide when to do alerts.  Note that this does NOT
  // represent the complete model state, just the bits that are needed for this alerter.
  private previousModelState: PartialMomentaryModelState;

  // Snapshot of the previous flux meter state, used to decide when to make alerts about the flux meter.
  private previousFluxMeterReadings: FluxMeterReadings;

  // description string property for the energy flux sensed by the flux meter
  private readonly energyFluxDescriptionProperty: TReadOnlyProperty<string>;

  // boolean flag that tracks whether the flux sensor has moved since the last alert was announced
  private sensorMovedSinceLastAlert = false;

  public constructor( model: ConcentrationModel, providedOptions: EnergyFluxAlerterOptions ) {

    assert && assert( model.fluxMeter, 'This alerter should not be used when flux meter isn\'t present.' );

    const options = optionize<EnergyFluxAlerterOptions, SelfOptions, AlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( options );

    this.model = model;
    this.alertCountdownTimer = ALERT_INTERVAL_WHILE_PLAYING;
    this.previousModelState = this.getModelState();
    this.energyFluxDescriptionProperty = new FluxMeterDescriptionProperty( model.fluxMeter! );
    this.previousFluxMeterReadings = model.fluxMeter!.readMeter();

    // Update the flux meter readings at the start of a drag of the sensor.  This is done because the user is probably
    // trying to measure the variations in flux at different altitudes and is likely NOT interested in any flux changes
    // that have accumulated while the flux meter was parked at a single altitude.
    model.fluxMeter!.fluxSensor.isDraggingProperty.lazyLink( isDragging => {
      if ( isDragging ) {
        this.previousFluxMeterReadings = model.fluxMeter!.readMeter();
      }
      else {

        // The user just dropped the flux sensor, so set the time interval such that an alert will occur soon.  We set
        // the time to the minimum amount needed for the flux measurement to stabilize.
        this.alertCountdownTimer = FluxSensor.MEASUREMENT_ACCUMULATION_TIME;
        this.sensorMovedSinceLastAlert = true;
      }
    } );

    // When certain aspects of the model state changes we want to reset the alert interval to give the flux meter some
    // time for new measurements to settle in.
    Multilink.multilink(
      [ model.concentrationControlModeProperty, model.dateProperty ],
      () => {

        // After changing the concentration control mode, reset the alert timer so that we have a full delay before
        // describing the new scene.
        this.alertCountdownTimer = model.isPlayingProperty ?
                                   ALERT_INTERVAL_WHILE_PLAYING :
                                   ALERT_INTERVAL_WHILE_STEPPING;
      }
    );

    // Monitor the "playing" state and reset the countdown timer when changes occur to half of the full alert time.
    model.isPlayingProperty.link( isPlaying => {
      this.alertCountdownTimer = isPlaying ? ALERT_INTERVAL_WHILE_PLAYING / 2 : ALERT_INTERVAL_WHILE_STEPPING / 2;
    } );
  }

  /**
   * Get the current state values for portions of the model state that are used by this alerter.
   */
  private getModelState(): PartialMomentaryModelState {
    return {
      concentrationControlMode: this.model.concentrationControlModeProperty.value,
      date: this.model.dateProperty.value
    };
  }

  /**
   * Create new alerts if the state of the energy flux has changed and timing variables indicate it is time. This step
   * function should be called every view step - regardless of whether the model is playing - because certain alerts
   * describe updates that are unrelated to the changing concentration model.
   */
  public step(): void {

    // Calculate the time since the last alert based on the time experienced by the model.  There is no need to do
    // alerts if the model hasn't changed.
    const elapsedModelTime = Math.max( this.model.totalElapsedTime - this.previousElapsedModelTime, 0 );

    // Update the countdown timer for alerts.
    this.alertCountdownTimer = Math.max( this.alertCountdownTimer - elapsedModelTime, 0 );

    // See if it's time to consider doing an alert.
    if ( this.alertCountdownTimer === 0 ) {


      if ( this.model.fluxMeter &&
           this.model.fluxMeterVisibleProperty.value &&
           !this.model.fluxMeter.fluxSensor.isDraggingProperty.value ) {

        assert && assert(
          this.energyFluxDescriptionProperty,
          'there should be a flux description whenever the flux meter is present in the model'
        );

        // Read the flux meter.
        const fluxMeterReadings = this.model.fluxMeter.readMeter();

        // Calculate the differences between the current flux meter readings and the ones from the previous alert.
        const fluxChanges = {
          visibleDown: Math.abs(
            this.previousFluxMeterReadings.visibleLightDownFlux - fluxMeterReadings.visibleLightDownFlux
          ),
          visibleUp: Math.abs(
            this.previousFluxMeterReadings.visibleLightUpFlux - fluxMeterReadings.visibleLightUpFlux
          ),
          irDown: Math.abs(
            this.previousFluxMeterReadings.infraredLightDownFlux - fluxMeterReadings.infraredLightDownFlux
          ),
          irUp: Math.abs(
            this.previousFluxMeterReadings.infraredLightUpFlux - fluxMeterReadings.infraredLightUpFlux
          )
        };

        const fluxChangeValues = Object.values( fluxChanges );

        // Get the largest flux change.
        const largestFluxChange = fluxChangeValues.reduce(
          ( biggestSoFar, currentValue ) => currentValue > biggestSoFar ? currentValue : biggestSoFar,
          0
        );

        // Total up all the flux changes.
        const fluxChangeTotal = fluxChangeValues.reduce( ( totalSoFar, change ) => totalSoFar + change, 0 );

        const dateChanged = this.model.dateProperty.value !== this.previousModelState.date;
        const concentrationModeChanged = this.model.concentrationControlModeProperty.value !==
                                         this.previousModelState.concentrationControlMode;

        // Did one or more of the flux values change enough to warrant an alert?
        if ( largestFluxChange > ENERGY_FLUX_THRESHOLD_FOR_INDEPENDENT_ALERTS ) {

          // The flux change is over the threshold, so do an alert of the current energy flux description.
          this.alert( this.energyFluxDescriptionProperty.value );

          // Update internal state for the next timeout.
          this.previousFluxMeterReadings = fluxMeterReadings;
          this.sensorMovedSinceLastAlert = false;
        }

        // Did anything else change that would warrant a new alert?
        else if ( dateChanged || concentrationModeChanged || this.sensorMovedSinceLastAlert ) {

          // Was the change in flux large enough to announce the full description even though it wasn't enough to
          // trigger a new alert on its own?
          if ( largestFluxChange > NON_NEGLIGIBLE_FLUX_CHANGE ) {
            this.alert( this.energyFluxDescriptionProperty.value );
          }
          else {

            // The flux change is under the minimum threshold for announcing the full description, but an alert needs
            // to be made.  Create one about there being little or no change in the energy flux.
            const littleOrNoChangeString = StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.fluxMeterSmallChangePatternStringProperty,
              {
                negligibleOrNo: fluxChangeTotal < APPRECIABLE_ENERGY_FLUX_CHANGE_THRESHOLD ?
                                GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.noStringProperty :
                                GreenhouseEffectStrings.a11y.negligibleStringProperty
              }
            );
            this.alert( littleOrNoChangeString );
          }

          // Update internal state for the next timeout.
          this.previousFluxMeterReadings = this.model.fluxMeter.readMeter();
          this.sensorMovedSinceLastAlert = false;
        }
      }

      this.previousModelState = this.getModelState();

      // Use a different value for the time between alerts when stepping.
      this.alertCountdownTimer = this.model.isPlayingProperty.value ?
                                 ALERT_INTERVAL_WHILE_PLAYING :
                                 ALERT_INTERVAL_WHILE_STEPPING;
    }

    this.previousElapsedModelTime = this.model.totalElapsedTime;
  }

  /**
   * Reset this to its initial state.  For this to work properly the model must be reset prior to calling this method.
   */
  public reset(): void {
    this.alertCountdownTimer = ALERT_INTERVAL_WHILE_PLAYING;
    this.previousModelState = this.getModelState();
    this.previousFluxMeterReadings = this.model.fluxMeter!.readMeter();
  }
}

greenhouseEffect.register( 'EnergyFluxAlerter', EnergyFluxAlerter );
export default EnergyFluxAlerter;
