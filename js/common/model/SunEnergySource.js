// Copyright 2021, University of Colorado Boulder

/**
 * SunEnergySource is used to provide energy to the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import GreenhouseEffectModel from './GreenhouseEffectModel.js';

// constants

// Energy produced the sun in Watts per square meter.  This value is pretty realistic, and was adjusted so that it is
// the value that gets to the desired blackbody temperature of the Earth when using the Stefan-Boltzmann equation.
const OUTPUT_ENERGY_RATE = 240;

class SunEnergySource {

  /**
   * @param {number} surfaceAreaOfIncidentLight - surface area onto which the sun is shining
   * @param {Tandem} tandem
   */
  constructor( surfaceAreaOfIncidentLight, tandem ) {

    // @public - tracks the average energy output
    this.outputEnergyRateTracker = new EnergyRateTracker( {
      tandem: tandem.createTandem( 'outputEnergyRateTracker' )
    } );

    // @private {number}
    this.surfaceAreaOfIncidentLight = surfaceAreaOfIncidentLight;
  }

  /**
   * Produce an energy packet that represents the sun shining towards the earth for the specified amount of time.
   * @param {number} dt
   * @returns {EMEnergyPacket}
   * @public
   */
  produceEnergy( dt ) {
    const energyToProduce = OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight * dt;
    this.outputEnergyRateTracker.addEnergyInfo( energyToProduce, dt );
    return new EMEnergyPacket(
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      energyToProduce,
      GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE,
      EnergyDirection.DOWN
    );
  }

  /**
   * @public
   */
  reset() {
    this.outputEnergyRateTracker.reset();
  }
}

// statics
SunEnergySource.OUTPUT_ENERGY_RATE = OUTPUT_ENERGY_RATE;

greenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;
