// Copyright 2023, University of Colorado Boulder

import EMEnergyPacket from './EMEnergyPacket.js';
import Photon from './Photon.js';
import Wave from '../../waves/model/Wave.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

/**
 * A utility function for testing whether the provided object's wavelength indicates that it is in the infrared band.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const isInfrared = ( emThing: EMEnergyPacket | Wave | Photon ): boolean => {
  return emThing.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH;
};

export default isInfrared;