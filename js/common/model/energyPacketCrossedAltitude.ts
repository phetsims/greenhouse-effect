// Copyright 2023, University of Colorado Boulder

import EMEnergyPacket from './EMEnergyPacket.js';

/**
 * A utility function for testing whether an energy packet has crossed through the provided altitude in either the
 * upward or downward moving direction.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const energyPacketCrossedAltitude = ( energyPacket: EMEnergyPacket, altitude: number ): boolean => {
  return ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ||
         ( energyPacket.previousAltitude < altitude && energyPacket.altitude >= altitude );
};

export default energyPacketCrossedAltitude;