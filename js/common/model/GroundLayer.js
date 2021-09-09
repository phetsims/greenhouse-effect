// Copyright 2021, University of Colorado Boulder

/**
 * GroundLayer is a subclass of EnergyAbsorbingEmittingLayer and adds the behavior that is specific to the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';

// constants
const MINIMUM_TEMPERATURE = 245;

class GroundLayer extends EnergyAbsorbingEmittingLayer {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH,
      initialEnergyAbsorptionProportion: 1,
      minimumTemperature: MINIMUM_TEMPERATURE,

      // phet-io
      tandem: tandem,
      phetioReadOnly: true,
      phetioState: false
    };

    super( 0, options );
  }

  /**
   * Interact with the provided energy packets in a way that is specific to the ground.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @returns {number}
   * @override
   * @protected
   */
  interactWithEnergyPackets( emEnergyPackets ) {
    let absorbedEnergy = 0;
    emEnergyPackets.forEach( energyPacket => {
      if ( this.energyPacketCrossedThisLayer( energyPacket ) ) {

        // The ground fully absorbs all energy that comes into it.
        absorbedEnergy += energyPacket.energy;
        energyPacket.energy = 0; // Reduce energy to zero, which will cause this packet to be removed from the list.
      }
    } );
    return absorbedEnergy;
  }
}

// statics
GroundLayer.MINIMUM_TEMPERATURE = MINIMUM_TEMPERATURE;

greenhouseEffect.register( 'GroundLayer', GroundLayer );
export default GroundLayer;