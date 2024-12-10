// Copyright 2023-2024, University of Colorado Boulder

/**
 * EnergyFluxAlerter is responsible for generating alerts related to energy flux measured by the flux meter. A
 * combination of timed polling and monitoring of model state is used to decide when to generate the alerts.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TEmitter from '../../../../axon/js/TEmitter.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Alerter, { AlerterOptions } from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import { FluxMeterReadings } from '../model/FluxMeter.js';
import FluxSensor from '../model/FluxSensor.js';
import LayersModel from '../model/LayersModel.js';
import FluxMeterDescriptionProperty from './describers/FluxMeterDescriptionProperty.js';

type SelfOptions = {

  // an Emitter that can be used to essentially force a new alert for the energy flux state
  motivateEnergyFluxAlertEmitter?: null | TEmitter<[ boolean ]>;
};
export type EnergyFluxAlerterOptions = SelfOptions & AlerterOptions;

// The periods for checking whether new alerts should be made.  Different values are used when playing versus stepping.
const ALERT_INTERVAL_WHILE_PLAYING = 4;
const ALERT_INTERVAL_WHILE_STEPPING = 1;

// The change in energy flux measured by the flux meter that will trigger a new alert in the absences of a change to
// the flux sensor altitude. In watts, empirically determined.
const ENERGY_FLUX_THRESHOLD_FOR_INDEPENDENT_ALERTS = 4000000;

// The amount of change in energy flux necessary to announce the full description after the sensor is moved.  Below this
// value the alerter will say that either a negligible or no change occurred.  In watts, empirically determined.
const NON_NEGLIGIBLE_FLUX_CHANGE = 300000;

// The change of energy flux measured by the flux meter that must occur for it to be considered any change at all.  A
// change below this threshold is described as no change.  In watts, empirically determined.
const APPRECIABLE_ENERGY_FLUX_CHANGE_THRESHOLD = 30000;

class EnergyFluxAlerter extends Alerter {

  // reference to the model, used in the methods
  private readonly model: LayersModel;

  // Time that has passed since last alert, in seconds.  When the difference between this and the current time gets big
  // enough a new alert is announced.
  private alertCountdownTimer: number;

  // The elapsed time from the model during the previous step of this alerter.
  private previousElapsedModelTime = 0;

  // a flag that can be used to force an alert at the next timeout regardless of the state change
  private performFullAlertNextCycle = false;

  // Snapshot of the previous flux meter state, used to decide when to make alerts about the flux meter.
  private previousFluxMeterReadings: FluxMeterReadings;

  // description string property for the energy flux sensed by the flux meter
  private readonly energyFluxDescriptionProperty: TReadOnlyProperty<string>;

  // Previous alert string - used to decide if a change has occurred since the last alert.
  private previousEnergyFluxDescriptionAlert = '';

  // boolean flag that tracks whether the flux sensor has moved since the last alert was announced
  private sensorMovedSinceLastAlert = false;

  public constructor( model: LayersModel, providedOptions: EnergyFluxAlerterOptions ) {

    assert && assert( model.fluxMeter, 'This alerter should not be used when flux meter isn\'t present.' );

    const options = optionize<EnergyFluxAlerterOptions, SelfOptions, AlerterOptions>()( {

      motivateEnergyFluxAlertEmitter: null,

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( options );

    this.model = model;
    this.alertCountdownTimer = ALERT_INTERVAL_WHILE_PLAYING;
    this.energyFluxDescriptionProperty = new FluxMeterDescriptionProperty( model.fluxMeter! );
    this.previousFluxMeterReadings = model.fluxMeter!.readMeter();

    // Update the flux meter readings at the start of a drag of the sensor.  This is done because the user is probably
    // trying to measure the variations in flux at different altitudes and is likely NOT interested in any flux changes
    // that have accumulated while the flux meter was parked at a single altitude.
    model.fluxMeter!.fluxSensor.isDraggingProperty.lazyLink( isDragging => {
      if ( isDragging ) {

        // Get a fresh set of flux meter readings at the start of a drag for comparison shortly after the drag completes.
        this.previousFluxMeterReadings = model.fluxMeter!.readMeter();
      }
      else {

        // The user just dropped the flux sensor, so set the time interval such that an alert will occur soon.  We set
        // the time to the minimum amount needed for the flux measurement to stabilize.
        this.alertCountdownTimer = FluxSensor.MEASUREMENT_ACCUMULATION_TIME;
        this.sensorMovedSinceLastAlert = true;
      }
    } );

    // Monitor the zoom property and trigger an alert when changes occur.
    model.fluxMeter!.zoomFactorProperty.lazyLink( ( zoomFactor, oldZoomFactor ) => {
      const zoomOutString = StringUtils.fillIn(
        GreenhouseEffectStrings.a11y.fluxMeter.visualScaleZoomedPatternStringProperty,
        {
          inOrOut: zoomFactor > oldZoomFactor ?
                   GreenhouseEffectStrings.a11y.fluxMeter.inStringProperty :
                   GreenhouseEffectStrings.a11y.fluxMeter.outStringProperty
        }
      );

      // Perform the alert.
      this.alert( `${zoomOutString} ${GreenhouseEffectStrings.a11y.fluxMeter.noChangeStringProperty.value}` );
    } );

    if ( options.motivateEnergyFluxAlertEmitter ) {

      // Monitor the provided emitter and force a new alert on the next cycle when it fires.
      options.motivateEnergyFluxAlertEmitter.addListener( ( resetCountdown: boolean ) => {
        this.forceAlertNextCycle( model.isPlayingProperty.value, resetCountdown );
      } );
    }

    // Monitor the "playing" state and reset the countdown timer when changes occur to half of the full alert time.
    model.isPlayingProperty.link( isPlaying => {
      this.alertCountdownTimer = isPlaying ? ALERT_INTERVAL_WHILE_PLAYING / 2 : ALERT_INTERVAL_WHILE_STEPPING / 2;
    } );
  }

  /**
   * Force an alert to occur on the next timeout cycle regardless of the changes in flux.
   * @param isModelPlaying - whether the model is playing
   * @param resetCountdown - whether to reset the countdown timer, which can be useful for letting the model stabilize
   *                         before performing the alert
   */
  private forceAlertNextCycle( isModelPlaying: boolean, resetCountdown: boolean ): void {

    // Set the flag to perform an alert on the next timeout.
    this.performFullAlertNextCycle = true;

    // If the flag is set, reset the countdown timer.  This can be useful for allowing the model to stabilize before
    // making the alert.
    if ( resetCountdown ) {
      this.alertCountdownTimer = isModelPlaying ? ALERT_INTERVAL_WHILE_PLAYING : ALERT_INTERVAL_WHILE_STEPPING;
    }
  }

  /**
   * Create new alerts if the state of the energy flux has changed and timing variables indicate it is time. This step
   * function should be called every view step - regardless of whether the model is playing - because certain alerts
   * describe updates that are unrelated to the changing concentration model.
   */
  public step(): void {

    // Calculate the time since the last alert based on the time experienced by the model.  There is no need to do
    // alerts about energy flux changes if the model hasn't changed.
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

        let alerted = false;

        // Did one or more of the flux values change enough to warrant an alert?  Or did something else happen to
        // trigger a full alert?
        if ( ( largestFluxChange > ENERGY_FLUX_THRESHOLD_FOR_INDEPENDENT_ALERTS &&
               this.energyFluxDescriptionProperty.value !== this.previousEnergyFluxDescriptionAlert ) ||
             this.performFullAlertNextCycle ) {

          // Do a full alert.
          this.alert( this.energyFluxDescriptionProperty.value );
          this.previousEnergyFluxDescriptionAlert = this.energyFluxDescriptionProperty.value;
          alerted = true;
        }

        // If the flux sensor was moved, an alert will be made, but it can potentially be shorter than the full one.
        else if ( this.sensorMovedSinceLastAlert ) {

          // Was the change in flux large enough to announce the full description even though it wasn't enough to
          // trigger a new alert on its own?
          if ( largestFluxChange > NON_NEGLIGIBLE_FLUX_CHANGE ) {
            this.alert( this.energyFluxDescriptionProperty.value );
            this.previousEnergyFluxDescriptionAlert = this.energyFluxDescriptionProperty.value;
          }
          else {

            // The flux change is under the minimum threshold for announcing the full description, but an alert needs
            // to be made.  Create one about there being little or no change in the energy flux.
            const littleOrNoChangeString = StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.fluxMeterSmallChangePatternStringProperty,
              {
                negligibleOrNo: largestFluxChange < APPRECIABLE_ENERGY_FLUX_CHANGE_THRESHOLD ?
                                GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.noStringProperty :
                                GreenhouseEffectStrings.a11y.negligibleStringProperty
              }
            );
            this.alert( littleOrNoChangeString );
          }
          alerted = true;
        }

        // If an alert was performed, record the state for future comparison.
        if ( alerted ) {
          this.previousFluxMeterReadings = fluxMeterReadings;
          this.sensorMovedSinceLastAlert = false;
          this.performFullAlertNextCycle = false;
        }
      }

      // Reset the countdown timer.  Use a different value for the time between alerts when stepping.
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
    this.performFullAlertNextCycle = false;
    this.previousFluxMeterReadings = this.model.fluxMeter!.readMeter();
  }
}

greenhouseEffect.register( 'EnergyFluxAlerter', EnergyFluxAlerter );
export default EnergyFluxAlerter;