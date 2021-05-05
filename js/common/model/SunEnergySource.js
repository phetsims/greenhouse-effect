// Copyright 2021, University of Colorado Boulder

/**
 * SunEnergySource is used to provide energy to the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import EnergySource from './EnergySource.js';

// constants

// Energy produced the sun in Watts per square meter.  This value is pretty realistic, and was adjusted so that it is
// the value that gets to the desired blackbody temperature of the Earth when using the Stefan-Boltzmann equation.
const SUN_OUTPUT_ENERGY_RATE = 240;

class SunEnergySource extends EnergySource {

  /**
   * @param {number} surfaceAreaOfIncidentLight - surface area onto which the sun is shining
   */
  constructor( surfaceAreaOfIncidentLight ) {

    super();

    // @public - tracks the average energy output, used primarily for debugging
    this.outputEnergyRateTracker = new EnergyRateTracker();

    // @private {number}
    this.surfaceAreaOfIncidentLight = surfaceAreaOfIncidentLight;
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {
    const radiatedEnergyThisStep = SUN_OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight * dt;
    this.outputEnergyRateTracker.logEnergy( radiatedEnergyThisStep, dt );
    this.outputEnergy( EnergyDirection.DOWN, radiatedEnergyThisStep );
  }

  /**
   * @public
   */
  reset() {
    this.outputEnergyRateTracker.reset();
  }
}

greenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;
