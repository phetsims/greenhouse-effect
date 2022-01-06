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
 *                  should consider a new name, perhaps LayerModelStateAlerter or something along those lines.
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';

// number of decimal places to pay attention to in the temperature values
const TEMPERATURE_DECIMAL_PLACES = 1;

// in seconds, how frequently to send an alert to the UtteranceQueue describing changing concentrations
const ALERT_INTERVAL = 2;

class GasConcentrationAlerter extends Alerter {

  // Time that has passed since last alert, when this equals ALERT_INTERVAL, a new alert is sent the UtteranceQueue.
  private timeSinceLastAlert: number = 0;

  // Temperature for the last description, saved so that we know how temperature changes from alert to alert.
  private previousTemperature: number;

  // Outgoing energy value for the last description, saved so we know how energy changes from alert to alert.
  private previousOutgoingEnergy: number;

  private readonly outgoingEnergyProperty: NumberProperty;
  private readonly incomingEnergyProperty: NumberProperty;
  private netEnergyProperty: DerivedProperty<number, number[]>;

  private model: ConcentrationModel;

  constructor( model: ConcentrationModel, options?: AlerterOptions ) {
    super( options );

    this.outgoingEnergyProperty = model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty;
    this.incomingEnergyProperty = model.sunEnergySource.outputEnergyRateTracker.energyRateProperty;

    this.netEnergyProperty = new DerivedProperty( [ this.incomingEnergyProperty, this.outgoingEnergyProperty ],
      ( inEnergy: number, outEnergy: number ) => {
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
          model.temperatureUnitsProperty.value
        ) );
      }
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

    if ( this.timeSinceLastAlert > ALERT_INTERVAL ) {

      if ( !this.model.groundLayer.atEquilibriumProperty.value ) {
        const temperatureAlertString = TemperatureDescriber.getSurfaceTemperatureChangeString(
          this.previousTemperature,
          currentTemperature,
          this.model.surfaceThermometerVisibleProperty.value,
          this.model.temperatureUnitsProperty.value
        );
        temperatureAlertString && this.alert( temperatureAlertString );
      }

      if ( this.model.energyBalanceVisibleProperty.value && !this.model.inRadiativeBalanceProperty.value ) {
        const outgoingEnergyAlertString = EnergyDescriber.getOutgoingEnergyChangeDescription(
          this.outgoingEnergyProperty.value,
          this.previousOutgoingEnergy,
          this.netEnergyProperty.value
        );
        outgoingEnergyAlertString && this.alert( outgoingEnergyAlertString );
      }

      this.previousTemperature = currentTemperature;
      this.previousOutgoingEnergy = this.outgoingEnergyProperty.value;
      this.timeSinceLastAlert = 0;
    }
  }
}

greenhouseEffect.register( 'GasConcentrationAlerter', GasConcentrationAlerter );
export default GasConcentrationAlerter;
