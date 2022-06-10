// Copyright 2022, University of Colorado Boulder

/**
 * TODO - Add documentation if we end up keeping this.
 *
 * @author John Blanco
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import Range from '../../../../dot/js/Range.js';
import LayersModel from './LayersModel.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import EnergyDirection from './EnergyDirection.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';

class FluxSensor {

  // altitude in the atmosphere where this sensor is positioned
  public readonly altitudeProperty: NumberProperty;

  // energy rate trackers for the various directions and light frequencies
  public readonly sunlightDownEnergyRateTracker = new EnergyRateTracker();

  // The proportion of the energy to be absorbed from the energy packets.  This is based on the size of the flux sensor
  // relative to the total simulated area in the model.
  private readonly proportionOfEnergyToAbsorb: number;

  /**
   * @param size - the 2D size of this sensor, in meters
   * @param tandem
   */
  public constructor( size: Dimension2, tandem: Tandem ) {

    // parameter checking
    assert && assert( size.width <= GreenhouseEffectConstants.SUNLIGHT_SPAN, 'width to too large' );
    assert && assert( size.height <= EnergyAbsorbingEmittingLayer.WIDTH, 'height to too large' );

    this.altitudeProperty = new NumberProperty( LayersModel.HEIGHT_OF_ATMOSPHERE / 2, {
      range: new Range( 0, LayersModel.HEIGHT_OF_ATMOSPHERE ),
      tandem: tandem.createTandem( 'altitudeProperty' ),
      phetioDocumentation: 'The height of the flux sensor within the simulated atmosphere.'
    } );

    // Calculate the proportion of energy to absorb.
    this.proportionOfEnergyToAbsorb = ( size.width * size.height ) /
                                      ( GreenhouseEffectConstants.SUNLIGHT_SPAN * EnergyAbsorbingEmittingLayer.WIDTH );

    let timeAccumulator = 0;
    stepTimer.addListener( dt => {
      timeAccumulator += dt;
      if ( timeAccumulator > 1 ) {
        console.log( `sunlightDownEnergyRateTracker.energyRateProperty.value = ${this.sunlightDownEnergyRateTracker.energyRateProperty.value}` );
        timeAccumulator = 0;
      }
    } );
  }

  /**
   * Measure the amount of energy passing through the sensor and accumulate it.  This method should be stepped
   * regularly with the model, even if there are no energy packets present, so that the measurement can average out.
   */
  public measureEnergyPacketFlux( energyPackets: EMEnergyPacket[], dt: number ): void {
    energyPackets.forEach( energyPacket => {
      if ( this.energyPacketCrossedAltitude( energyPacket ) ) {
        if ( energyPacket.direction === EnergyDirection.DOWN && energyPacket.isVisible ) {
          this.sunlightDownEnergyRateTracker.addEnergyInfo(
            energyPacket.energy * this.proportionOfEnergyToAbsorb,
            dt
          );
        }
      }
    } );
  }

  /**
   * Returns true if the provided energy packet passed through the altitude at which this sensor resides.
   */
  private energyPacketCrossedAltitude( energyPacket: EMEnergyPacket ): boolean {
    const altitude = this.altitudeProperty.value;
    return ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ||
           ( energyPacket.previousAltitude < altitude && energyPacket.altitude >= altitude );
  }
}

greenhouseEffect.register( 'FluxSensor', FluxSensor );
export default FluxSensor;