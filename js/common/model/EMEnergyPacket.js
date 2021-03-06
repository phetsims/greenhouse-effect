// Copyright 2021, University of Colorado Boulder

/**
 * EMEnergyPacket models a packet or bundle of electromagnetic energy.  It's kind of like a really big photon.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyDirection from './EnergyDirection.js';

class EMEnergyPacket {

  /**
   * @param {number} wavelength - in meters
   * @param {number} energy - in joules
   * @param {number} initialAltitude - in meters
   * @param {EnergyDirection} initialTravelDirection
   */
  constructor( wavelength, energy, initialAltitude, initialTravelDirection ) {

    // @public (read-only)
    this.wavelength = wavelength;

    // @public
    this.energy = energy;

    // @public (read-only) - altitude in model space
    this.altitude = initialAltitude;

    // @public (read-only) - the altitude at the previous step
    this.previousAltitude = initialAltitude;

    // @public - the direction in which this energy packet is moving
    this.directionOfTravel = initialTravelDirection;
  }

  /**
   * @param {number} dt - time, in seconds
   * @public
   */
  step( dt ) {
    this.previousAltitude = this.altitude;
    if ( this.directionOfTravel === EnergyDirection.UP ) {
      this.altitude += dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
    else if ( this.directionOfTravel === EnergyDirection.DOWN ) {
      this.altitude -= dt * GreenhouseEffectConstants.SPEED_OF_LIGHT;
    }
  }
}

greenhouseEffect.register( 'EMEnergyPacket', EMEnergyPacket );
export default EMEnergyPacket;
