// Copyright 2021, University of Colorado Boulder

/**
 * AtmosphereLayer is a subclass of EnergyAbsorbingEmittingLayer and adds the behavior that is specific to the
 * atmospheric layers.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EMEnergyPacket from './EMEnergyPacket.js';

class AtmosphereLayer extends EnergyAbsorbingEmittingLayer {

  /**
   * @param {number} altitude
   * @param {Tandem} tandem
   */
  constructor( altitude: number, tandem: Tandem ) {

    const options = {
      // @ts-ignore
      substance: EnergyAbsorbingEmittingLayer.Substance.GLASS,

      // phet-io
      tandem: tandem,
      phetioReadOnly: true,
      phetioState: false,
      phetioDocumentation: 'Layer in the atmosphere that absorbs and emits energy. Layers are numbered low-to-high according to altitude.'
    };

    super( altitude, options );
  }

  /**
   * Interact with the provided energy packets in a way that is specific to the atmospheric layers.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @returns {number}
   * @override
   * @protected
   */
  interactWithEnergyPackets( emEnergyPackets: EMEnergyPacket[] ) {
    let absorbedEnergy = 0;
    emEnergyPackets.forEach( energyPacket => {
      if ( this.energyPacketCrossedThisLayer( energyPacket ) ) {

        // Atmospheric layers partially absorb IR and ignore visible light.
        if ( energyPacket.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {
          const energyToAbsorb = energyPacket.energy * this.energyAbsorptionProportionProperty.value;
          absorbedEnergy += energyToAbsorb;
          energyPacket.energy -= energyToAbsorb;
        }
      }
    } );
    return absorbedEnergy;
  }
}

greenhouseEffect.register( 'AtmosphereLayer', AtmosphereLayer );
export default AtmosphereLayer;