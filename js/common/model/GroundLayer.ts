// Copyright 2021, University of Colorado Boulder

/**
 * GroundLayer is a subclass of EnergyAbsorbingEmittingLayer and adds the behavior that is specific to the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import EnergyDirection from './EnergyDirection.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EMEnergyPacket from './EMEnergyPacket.js';

// constants
const MINIMUM_TEMPERATURE = 245;

class GroundLayer extends EnergyAbsorbingEmittingLayer {
  readonly albedoProperty: NumberProperty;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {

    const options = {
      // @ts-ignore
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH,
      initialEnergyAbsorptionProportion: 1,
      minimumTemperature: MINIMUM_TEMPERATURE,

      // phet-io
      tandem: tandem,
      phetioReadOnly: true,
      phetioState: false
    };

    super( 0, options );

    // albedo of the ground, meaning how much of the incoming light will be reflected
    this.albedoProperty = new NumberProperty( 0, {
      range: new Range( 0, 1 ),
      tandem: tandem.createTandem( 'albedoProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Proportion of incident light reflected from the ground from 0 (no reflection) to 1 (all light is reflected).'
    } );
  }

  /**
   * Interact with the provided energy packets in a way that is specific to the ground.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @returns {number}
   * @override
   * @protected
   */
  interactWithEnergyPackets( emEnergyPackets: EMEnergyPacket[] ) {
    let absorbedEnergy = 0;
    emEnergyPackets.forEach( energyPacket => {
      // @ts-ignore
      if ( this.energyPacketCrossedThisLayer( energyPacket ) && energyPacket.direction === EnergyDirection.DOWN ) {

        absorbedEnergy += energyPacket.energy * ( 1 - this.albedoProperty.value );
        const reflectedEnergy = energyPacket.energy - absorbedEnergy;
        if ( reflectedEnergy > 0 ) {

          // Some of the energy in this packet has been reflected.  Reverse the direction of the packet and set its
          // energy accordingly.
          energyPacket.energy = reflectedEnergy;
          // @ts-ignore
          energyPacket.direction = EnergyDirection.UP;
        }
        else {

          // All energy was absorbed.  Reduce the energy in the packet to zero, which will cause it to be removed from
          // the list in the next step.
          energyPacket.energy = 0;
        }
      }
    } );
    return absorbedEnergy;
  }

  public reset(){
    this.albedoProperty.reset();
    super.reset();
  }

  static MINIMUM_TEMPERATURE: number = MINIMUM_TEMPERATURE
}

greenhouseEffect.register( 'GroundLayer', GroundLayer );
export default GroundLayer;