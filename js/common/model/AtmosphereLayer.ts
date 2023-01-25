// Copyright 2021-2022, University of Colorado Boulder

/**
 * AtmosphereLayer is a subclass of EnergyAbsorbingEmittingLayer and adds the behavior that is specific to the
 * atmospheric layers.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer, { EnergyAbsorbingEmittingLayerOptions } from './EnergyAbsorbingEmittingLayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  initiallyActive?: boolean;
};
export type AtmosphereLayerOptions = SelfOptions & EnergyAbsorbingEmittingLayerOptions;

class AtmosphereLayer extends EnergyAbsorbingEmittingLayer {
  public readonly isActiveProperty: BooleanProperty;

  public constructor( altitude: number, tandem: Tandem, providedOptions?: AtmosphereLayerOptions ) {

    const options = optionize<AtmosphereLayerOptions, SelfOptions, EnergyAbsorbingEmittingLayerOptions>()( {

      substance: EnergyAbsorbingEmittingLayer.Substance.GLASS,
      initiallyActive: true,

      // phet-io
      tandem: tandem,
      phetioReadOnly: true,
      phetioState: false,
      phetioDocumentation: 'Layer in the atmosphere that absorbs and emits energy. Layers are numbered low-to-high according to altitude.'
    }, providedOptions ) as Required<AtmosphereLayerOptions>;

    super( altitude, options );

    // The isActiveProperty determines whether or not this layer will interact with the energy that passes through it.
    this.isActiveProperty = new BooleanProperty( options.initiallyActive, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true
    } );

    // When this layer becomes inactive, it loses any energy that it contained.
    this.isActiveProperty.lazyLink( active => {
      if ( !active ) {
        this.temperatureProperty.reset();
      }
    } );
  }

  /**
   * Interact with the provided energy packets in a way that is specific to the atmospheric layers.
   */
  protected override interactWithEnergyPackets( emEnergyPackets: EMEnergyPacket[] ): number {
    let absorbedEnergy = 0;
    emEnergyPackets.forEach( energyPacket => {

      // Absorb energy from IR packets that cross this layer.
      if ( energyPacket.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
           this.energyPacketCrossedThisLayer( energyPacket ) ) {

        const energyToAbsorb = energyPacket.energy * this.energyAbsorptionProportionProperty.value;
        absorbedEnergy += energyToAbsorb;
        energyPacket.energy -= energyToAbsorb;
      }
    } );
    return absorbedEnergy;
  }

  /**
   * see base class for details
   */
  public override interactWithEnergy( emEnergyPackets: EMEnergyPacket[], dt: number ): void {
    if ( this.isActiveProperty.value ) {
      super.interactWithEnergy( emEnergyPackets, dt );
    }
  }
}

greenhouseEffect.register( 'AtmosphereLayer', AtmosphereLayer );
export default AtmosphereLayer;