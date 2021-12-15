// Copyright 2021, University of Colorado Boulder

/**
 * Responsible for generating and timing alerts related to gas concentration in this sim. A polling method is used
 * to time the alerts and determine how model variables have changed to create an accurate description.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';

// in seconds, how frequently to send an alert to the UtteranceQueue describing changing concentrations
const ALERT_INTERVAL = 2;

class GasConcentrationAlerter extends Alerter {

  // Time that has passed since last alert, when this equals ALERT_INTERVAL, a new alert is sent the UtteranceQueue.
  private timeSinceLastAlert: number = 0;

  // Temperature for the last description, saved so that we know how temperature changes from alert to alert.
  private previousTemperature: number;

  private model: ConcentrationModel;

  constructor( model: ConcentrationModel, options?: AlerterOptions ) {
    super( options );

    this.previousTemperature = model.surfaceTemperatureKelvinProperty.value;
    this.model = model;
  }

  /**
   * Create new alerts, if it has been long enough since the last alert and the temperature is changing.
   */
  public step( dt: number ): void {

    this.timeSinceLastAlert += dt;

    if ( this.timeSinceLastAlert > ALERT_INTERVAL ) {

      if ( !this.model.groundLayer.atEquilibriumProperty.value ) {
        const temperatureAlertString = TemperatureDescriber.getSurfaceTemperatureChangeString(
          this.previousTemperature,
          this.model.surfaceTemperatureKelvinProperty.value,
          this.model.surfaceThermometerVisibleProperty.value,
          this.model.temperatureUnitsProperty.value
        );

        temperatureAlertString && this.alert( temperatureAlertString );
      }

      this.previousTemperature = this.model.surfaceTemperatureKelvinProperty.value;
      this.timeSinceLastAlert = 0;
    }
  }
}

greenhouseEffect.register( 'GasConcentrationAlerter', GasConcentrationAlerter );
export default GasConcentrationAlerter;
