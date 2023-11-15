// Copyright 2022-2023, University of Colorado Boulder

/**
 * A describer that is responsible for generating description strings related to energy in
 * this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';

const inflowToEarthStringProperty = GreenhouseEffectStrings.a11y.inflowToEarthStringProperty;
const outflowToSpaceStringProperty = GreenhouseEffectStrings.a11y.outflowToSpaceStringProperty;
const greaterThanStringProperty = GreenhouseEffectStrings.a11y.greaterThanStringProperty;
const lessThanStringProperty = GreenhouseEffectStrings.a11y.lessThanStringProperty;
const outgoingEnergyAtAtmospherePatternStringProperty = GreenhouseEffectStrings.a11y.outgoingEnergyAtAtmospherePatternStringProperty;
const outgoingEnergyAtAtmosphereEqualStringProperty = GreenhouseEffectStrings.a11y.outgoingEnergyAtAtmosphereEqualStringProperty;

class EnergyDescriber {

  /**
   * Get a description of the energy flow at the top of the atmosphere. Will return something like
   * "Outgoing energy is less than incoming energy at top of atmosphere, net energy inflow to Earth." OR
   * "Outgoing energy is equal to incoming energy at top of atmosphere."
   */
  public static getNetEnergyAtAtmosphereDescription( netInflowOfEnergy: number, inRadiativeBalance: boolean ): string | null {
    let descriptionString;
    if ( inRadiativeBalance ) {

      // The model may be in radiative balance but net energy is not quite zero. In this case it is small enough that
      // it is effectively zero.
      descriptionString = outgoingEnergyAtAtmosphereEqualStringProperty.value;
    }
    else {
      const changeString = netInflowOfEnergy > 0 ?
                           lessThanStringProperty.value :
                           greaterThanStringProperty.value;
      const flowString = netInflowOfEnergy > 0 ?
                         inflowToEarthStringProperty.value :
                         outflowToSpaceStringProperty.value;

      descriptionString = StringUtils.fillIn( outgoingEnergyAtAtmospherePatternStringProperty, {
        greaterThanOrLessThan: changeString,
        inflowOrOutflow: flowString
      } );
    }

    return descriptionString;
  }
}

greenhouseEffect.register( 'EnergyDescriber', EnergyDescriber );
export default EnergyDescriber;
