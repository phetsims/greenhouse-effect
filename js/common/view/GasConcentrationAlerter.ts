// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating and timing alerts related to gas concentration in this sim. A polling method is used
 * to time the alerts and determine how model variables have changed to create an accurate description.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 *
 *
 * TODO: 1/5/2022 - This is named GasConcentrationAlerter, but it's doing more than just talking about the state.  We
 *                  should consider a new name, perhaps LayerModelStateAlerter or something along those lines.  See
 *                  https://github.com/phetsims/greenhouse-effect/issues/129.
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import ConcentrationModel, { ConcentrationControlMode } from '../model/ConcentrationModel.js';
import Alerter, { AlerterOptions } from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import LayersModel from '../model/LayersModel.js';
import RadiationDescriber from './describers/RadiationDescriber.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// number of decimal places to pay attention to in the temperature values
const TEMPERATURE_DECIMAL_PLACES = 1;

// in seconds, how frequently to send an alert to the UtteranceQueue describing changing concentrations
const ALERT_INTERVAL = 4;

// in seconds, how long to wait before the next alert after changing the concentration value
const ALERT_DELAY_AFTER_CHANGING_CONCENTRATION = 2;

// How many times a terse temperature alert should be spoken before a verbose temperature alert is used. Note this
// is a counting variable, not in units of time.
const NUMBER_OF_TERSE_TEMPERATURE_ALERTS = 2;

// A higher delay before waiting for the Utterance to stabilize so that we don't hear information about the new
// scene in the observation window when rapidly changing dates.
const DATE_CHANGE_UTTERANCE_OPTIONS = {
  alertStableDelay: 500
};

class GasConcentrationAlerter extends Alerter {

  // Time that has passed since last alert, when this equals ALERT_INTERVAL, a new alert is sent the UtteranceQueue.
  private timeSinceLastAlert: number;

  // Temperature for the last description, saved so that we know how temperature changes from alert to alert.
  private previousTemperature: number;

  // Outgoing energy value for the last description, saved so we know how energy changes from alert to alert.
  private previousOutgoingEnergy: number;

  // Value for concentration the last time a description was generated
  private previousConcentration: number;

  // The number of times that the temperature change alert has been announced. Whenever the concentration value changes
  // this count is reset. Every time this counter is an interval of NUMBER_OF_TERSE_TEMPERATURE_ALERTS, a more
  // verbose temperature description is used. Otherwise a very terse alert is used. This is an attempt to reduce the
  // how much is spoken every ALERT_INTERVAL
  private temperatureChangeAlertCount: number;

  // When true, an extra verbose fragment about the surface temperature will be included. This will be true whenever
  // the concentration changes.
  private useVerboseSurfaceTemperatureAlert: boolean;

  private readonly outgoingEnergyProperty: NumberProperty;
  private readonly incomingEnergyProperty: NumberProperty;
  private netEnergyProperty: IReadOnlyProperty<number>;
  private previousNetInflowOfEnergy: number;

  private model: ConcentrationModel;

  constructor( model: ConcentrationModel, providedOptions?: AlerterOptions ) {

    const options = optionize<AlerterOptions, {}, AlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( options );

    this.useVerboseSurfaceTemperatureAlert = true;
    this.temperatureChangeAlertCount = 0;
    this.timeSinceLastAlert = 0;

    this.outgoingEnergyProperty = model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty;
    this.incomingEnergyProperty = model.sunEnergySource.outputEnergyRateTracker.energyRateProperty;
    this.previousNetInflowOfEnergy = model.netInflowOfEnergyProperty.value;
    this.previousConcentration = model.concentrationProperty.value;

    this.netEnergyProperty = new DerivedProperty( [ this.incomingEnergyProperty, this.outgoingEnergyProperty ],
      ( inEnergy, outEnergy ) => {
        return inEnergy - outEnergy;
      } );

    this.previousTemperature = Utils.toFixedNumber(
      model.surfaceTemperatureKelvinProperty.value,
      TEMPERATURE_DECIMAL_PLACES
    );
    this.previousOutgoingEnergy = this.outgoingEnergyProperty.value;
    this.model = model;

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

    // Announce the temperature when the user changes the units.
    model.temperatureUnitsProperty.lazyLink( temperatureUnits => {
      this.alert( TemperatureDescriber.getQuantitativeTemperatureDescription(
        model.surfaceTemperatureKelvinProperty.value,
        temperatureUnits
      ) );
    } );

    // Whenever the concentration changes, use the most verbose form of the temperature change alert.
    model.concentrationProperty.link( concentration => {
      this.useVerboseSurfaceTemperatureAlert = true;
      this.temperatureChangeAlertCount = 0;

      // after changing concentration, we should quickly hear content instead of waiting the full ALERT_INTERVAL
      this.timeSinceLastAlert = ALERT_INTERVAL - ALERT_DELAY_AFTER_CHANGING_CONCENTRATION;
      assert && assert( this.timeSinceLastAlert >= 0, 'setting timing variable to a negative value, your interval values need adjusting' );
    } );

    // When the date changes, describe the new scene in the observation window and how the concentration levels
    // have changed
    const observationWindowSceneUtterance = new Utterance( DATE_CHANGE_UTTERANCE_OPTIONS );
    const concentrationChangeUtterance = new Utterance( DATE_CHANGE_UTTERANCE_OPTIONS );
    model.dateProperty.lazyLink( ( date, previousDate ) => {
      observationWindowSceneUtterance.alert = ConcentrationDescriber.getObservationWindowNowTimePeriodDescription( date );
      concentrationChangeUtterance.alert = ConcentrationDescriber.getQualitativeConcentrationChangeDescription(
        ConcentrationModel.getConcentrationForDate( previousDate ),
        previousDate, ConcentrationModel.getConcentrationForDate( date )
      );
      this.alert( observationWindowSceneUtterance );
      this.alert( concentrationChangeUtterance );
    } );

    // When the control mode changes, include a description of the new concentration levels and that
    // the system is stabilizing (indicating that it left equilibrium and concentration changed). If
    // controlling by date, describe the scene in the observation window.
    model.concentrationControlModeProperty.lazyLink( controlMode => {

      // if controlling by date, include a description of the selected date
      if ( controlMode === ConcentrationControlMode.BY_DATE ) {
        this.alert( ConcentrationDescriber.getTimePeriodCurrentlyDescription( model.dateProperty.value ) );
      }

      this.alert( ConcentrationDescriber.getCurrentConcentrationLevelsDescription( model.concentrationProperty.value ) );
    } );
  }

  /**
   * Create new alerts, if it has been long enough since the last alert and the temperature is changing.
   */
  public step( dt: number ): void {

    this.timeSinceLastAlert += dt;

    // Do some rounding on the current temperature so that we don't alert when the changes are too small.
    const currentTemperature = Utils.toFixedNumber(
      this.model.surfaceTemperatureKelvinProperty.value,
      TEMPERATURE_DECIMAL_PLACES
    );

    const currentConcentration = this.model.concentrationProperty.value;

    if ( this.timeSinceLastAlert > ALERT_INTERVAL ) {

      if ( !this.model.groundLayer.atEquilibriumProperty.value ) {

        // First, a description of the changing radiation redirecting back to the surface - this should only
        // happen if there was some change to the concentration
        if ( this.model.isInfraredPresent() && currentConcentration !== this.previousConcentration ) {
          const radiationRedirectingAlert = RadiationDescriber.getRadiationRedirectionDescription( currentConcentration, this.previousConcentration );
          radiationRedirectingAlert && this.alert( radiationRedirectingAlert );
        }

        // Then, a description of the changing temperature - this should get described at interval even if there
        // is no change in concentration, though depending on how many times it has been spoken a terse form of it
        // may be used.

        // To reduce verbosity the temperature value is included only every NUMBER_OF_TERSE_TEMPERATURE_ALERTS
        // that this response is created. Temperature must also be visible in the view.
        const includeTemperatureValue = this.model.surfaceThermometerVisibleProperty.value && this.temperatureChangeAlertCount === 0;

        const temperatureAlertString = TemperatureDescriber.getSurfaceTemperatureChangeString(
          this.previousTemperature,
          currentTemperature,
          includeTemperatureValue,
          this.model.temperatureUnitsProperty.value,
          this.useVerboseSurfaceTemperatureAlert
        );
        temperatureAlertString && this.alert( temperatureAlertString );

        // reset counter if we have spoken the terse form of the temperature change alert enough times
        this.temperatureChangeAlertCount = this.temperatureChangeAlertCount >= NUMBER_OF_TERSE_TEMPERATURE_ALERTS ? 0 : this.temperatureChangeAlertCount + 1;

        // not verbose until concentration changes again
        this.useVerboseSurfaceTemperatureAlert = false;

        // Finally, a description of the changing surface temperature - again, only if there is some change in the
        // concentration
        if ( this.model.isInfraredPresent() && currentConcentration !== this.previousConcentration ) {
          const surfaceRadiationAlertString = RadiationDescriber.getRadiationFromSurfaceChangeDescription( this.model.concentrationProperty.value, this.previousConcentration );
          surfaceRadiationAlertString && this.alert( surfaceRadiationAlertString );
        }
      }

      if ( this.model.energyBalanceVisibleProperty.value ) {

        // Did the energy balance change in such a way that we need to describe it?
        const currentNetInflowOfEnergy = this.model.netInflowOfEnergyProperty.value;
        if ( ( this.previousNetInflowOfEnergy < -LayersModel.RADIATIVE_BALANCE_THRESHOLD &&
               currentNetInflowOfEnergy > -LayersModel.RADIATIVE_BALANCE_THRESHOLD ) ||
             ( this.previousNetInflowOfEnergy > LayersModel.RADIATIVE_BALANCE_THRESHOLD &&
               currentNetInflowOfEnergy < LayersModel.RADIATIVE_BALANCE_THRESHOLD ) ||
             ( Math.abs( this.previousNetInflowOfEnergy ) < LayersModel.RADIATIVE_BALANCE_THRESHOLD &&
               Math.abs( currentNetInflowOfEnergy ) > LayersModel.RADIATIVE_BALANCE_THRESHOLD ) ) {

          // Yep.
          const outgoingEnergyAlertString = EnergyDescriber.getNetEnergyAtAtmosphereDescription(
            currentNetInflowOfEnergy,
            this.model.inRadiativeBalanceProperty.value
          );
          outgoingEnergyAlertString && this.alert( outgoingEnergyAlertString );
        }
      }

      this.previousTemperature = currentTemperature;
      this.previousConcentration = currentConcentration;
      this.previousOutgoingEnergy = this.outgoingEnergyProperty.value;
      this.previousNetInflowOfEnergy = this.model.netInflowOfEnergyProperty.value;
      this.timeSinceLastAlert = 0;
    }
  }
}

greenhouseEffect.register( 'GasConcentrationAlerter', GasConcentrationAlerter );
export default GasConcentrationAlerter;
