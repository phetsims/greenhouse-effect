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
import LayersModel from '../model/LayersModel.js';
import RadiationDescriber from './describers/RadiationDescriber.js';

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

  // Value for concentration the last time a description was generated
  private previousConcentration: number;

  // Number of times each date has been described as an alert response. There is a limit to the number of times
  // these should be spoken. But these values should be reset with the simulation.
  private descriptionsOfTwentyTwentyCount: number;
  private descriptionsOfNineteenFifty: number;
  private descriptionsOfSeventeenFifty: number;
  private descriptionsOfIceAge: number;

  private readonly outgoingEnergyProperty: NumberProperty;
  private readonly incomingEnergyProperty: NumberProperty;
  private netEnergyProperty: DerivedProperty<number, number[]>;
  private previousNetInflowOfEnergy: number;

  private model: ConcentrationModel;

  constructor( model: ConcentrationModel, options?: AlerterOptions ) {
    super( options );

    this.outgoingEnergyProperty = model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty;
    this.incomingEnergyProperty = model.sunEnergySource.outputEnergyRateTracker.energyRateProperty;
    this.previousNetInflowOfEnergy = model.netInflowOfEnergyProperty.value;
    this.previousConcentration = model.concentrationProperty.value;

    this.descriptionsOfTwentyTwentyCount = 0;
    this.descriptionsOfNineteenFifty = 0;
    this.descriptionsOfSeventeenFifty = 0;
    this.descriptionsOfIceAge = 0;

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
        // is no change in concentration.
        const temperatureAlertString = TemperatureDescriber.getSurfaceTemperatureChangeString(
          this.previousTemperature,
          currentTemperature,
          this.model.surfaceThermometerVisibleProperty.value,
          this.model.temperatureUnitsProperty.value
        );
        temperatureAlertString && this.alert( temperatureAlertString );

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
