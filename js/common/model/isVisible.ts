// Copyright 2023, University of Colorado Boulder

import Wave from '../../waves/model/Wave.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import Photon from './Photon.js';

/**
 * A utility function for testing whether the provided object's wavelength indicates that it is in the visible EM band.
 * This should not be confused with the concept of 'visible' in the scene graph.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const isVisible = ( emThing: EMEnergyPacket | Wave | Photon ): boolean => {
  return emThing.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
};

export default isVisible;