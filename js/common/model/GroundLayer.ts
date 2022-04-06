// Copyright 2021-2022, University of Colorado Boulder

/**
 * GroundLayer is a subclass of EnergyAbsorbingEmittingLayer and adds the behavior that is specific to the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer, { EnergyAbsorbingEmittingLayerOptions } from './EnergyAbsorbingEmittingLayer.js';
import EnergyDirection from './EnergyDirection.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import merge from '../../../../phet-core/js/merge.js';

// constants

// The minimum temperature that the ground reaches at night (i.e. when no sunlight is present) when modeling the Earth.
const MINIMUM_EARTH_AT_NIGHT_TEMPERATURE = 245;

// Albedo values, see https://github.com/phetsims/greenhouse-effect/issues/124 for information on where these values
// came from.
const GROUND_ALBEDO = 0.2;
const PARTIALLY_GLACIATED_LAND_ALBEDO = 0.225;

type GroundLayerOptions = {
  initialAlbedo?: number;
} & EnergyAbsorbingEmittingLayerOptions;

class GroundLayer extends EnergyAbsorbingEmittingLayer {
  readonly albedoProperty: NumberProperty;

  constructor( tandem: Tandem, providedOptions?: GroundLayerOptions ) {

    const options = merge( {

      initialAlbedo: GROUND_ALBEDO,

      // @ts-ignore
      substance: EnergyAbsorbingEmittingLayer.Substance.EARTH,
      initialEnergyAbsorptionProportion: 1,

      // Set the minimum temperature to a value that is reasonable for surface of the Earth.
      minimumTemperature: MINIMUM_EARTH_AT_NIGHT_TEMPERATURE,

      // phet-io
      tandem: tandem,
      phetioReadOnly: true,
      phetioState: false
    }, providedOptions ) as Required<GroundLayerOptions>;

    super( 0, options );

    // albedo of the ground, meaning how much of the incoming light will be reflected
    this.albedoProperty = new NumberProperty( options.initialAlbedo, {
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
   * @protected
   */
  override interactWithEnergyPackets( emEnergyPackets: EMEnergyPacket[] ) {
    let absorbedEnergy = 0;
    emEnergyPackets.forEach( energyPacket => {
      // @ts-ignore
      if ( this.energyPacketCrossedThisLayer( energyPacket ) && energyPacket.direction === EnergyDirection.DOWN ) {

        // Only visible light is reflected, IR is fully absorbed.
        const albedo = energyPacket.isVisible ? this.albedoProperty.value : 0;

        absorbedEnergy += energyPacket.energy * ( 1 - albedo );
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

  public override reset() {
    this.albedoProperty.reset();
    super.reset();
  }

  static MINIMUM_EARTH_AT_NIGHT_TEMPERATURE = MINIMUM_EARTH_AT_NIGHT_TEMPERATURE;
  static GREEN_MEADOW_ALBEDO = GROUND_ALBEDO;
  static PARTIALLY_GLACIATED_LAND_ALBEDO = PARTIALLY_GLACIATED_LAND_ALBEDO;
}

greenhouseEffect.register( 'GroundLayer', GroundLayer );
export default GroundLayer;