// Copyright 2021, University of Colorado Boulder

/**
 * SunEnergySource is used to produce energy at a constant rate.  The amount of energy produced is based on what the
 * real sun would be delivering to the Earth for the provide surface area.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
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

    // @public - controls whether the sun is shining
    this.isShiningProperty = new BooleanProperty( GreenhouseEffectQueryParameters.initiallyStarted, {
      tandem: tandem.createTandem( 'isShiningProperty' )
    } );

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
   * @returns {EMEnergyPacket|null}
   * @public
   */
  produceEnergy( dt ) {
    let energyPacket = null;
    if ( this.isShiningProperty.value ) {
      const energyToProduce = OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight * dt;
      this.outputEnergyRateTracker.addEnergyInfo( energyToProduce, dt );
      energyPacket = new EMEnergyPacket(
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        energyToProduce,
        GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE,
        EnergyDirection.DOWN
      );
    }
    return energyPacket;
  }

  /**
   * @public
   */
  reset() {
    this.outputEnergyRateTracker.reset();
    this.isShiningProperty.reset();
  }
}

// statics
SunEnergySource.OUTPUT_ENERGY_RATE = OUTPUT_ENERGY_RATE;

greenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;
