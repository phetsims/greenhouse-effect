// Copyright 2022, University of Colorado Boulder

/**
 * A describer that is responsible for generating description strings related to energy in
 * this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../../greenhouseEffectStrings.js';

const increasesString = greenhouseEffectStrings.a11y.increases;
const decreasesString = greenhouseEffectStrings.a11y.decreases;
const inflowToEarthString = greenhouseEffectStrings.a11y.inflowToEarth;
const outflowToSpaceString = greenhouseEffectStrings.a11y.outflowToSpace;
const outgoingEnergyPatternString = greenhouseEffectStrings.a11y.outgoingEnergyPattern;

class EnergyDescriber {
  constructor() {}

  /**
   * Returns a string that describes the change in outgoing energy in the system. Will return
   * something like
   * "Outgoing energy decreases; net energy outflow to space." or
   * "Outgoing energy increases; net energy inflow to earth."
   *
   * @param outgoingEnergy - Amount of energy leaving the system (going out to space)
   * @param previousOutgoingEnergy - Amount of outgoing energy the last time change was described.
   * @param netEnergy - Net energy for the system.
   */
  public static getOutgoingEnergyChangeDescription( outgoingEnergy: number, previousOutgoingEnergy: number, netEnergy: number ): string | null {
    let descriptionString = null;

    if ( outgoingEnergy !== previousOutgoingEnergy && netEnergy !== 0 ) {
      const outgoingEnergyChangeString = outgoingEnergy > previousOutgoingEnergy ? increasesString : decreasesString;
      const flowChangeString = netEnergy > 0 ? inflowToEarthString : outflowToSpaceString;

      descriptionString = StringUtils.fillIn( outgoingEnergyPatternString, {
        increasesOrDecreases: outgoingEnergyChangeString,
        inflowOrOutflow: flowChangeString
      } );
    }

    return descriptionString;
  }
}

greenhouseEffect.register( 'EnergyDescriber', EnergyDescriber );
export default EnergyDescriber;
