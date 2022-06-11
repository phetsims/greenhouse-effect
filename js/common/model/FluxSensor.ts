// Copyright 2022, University of Colorado Boulder

/**
 * FluxSensor is a two-dimensional sensor which is modeled as a rectangle that is parallel to the ground and measures
 * the amount of electromagnetic energy that passes through it.
 *
 * Because of the nature of the Greenhouse Effect model, the X position of the sensor doesn't really matter in terms of
 * how much energy is sensed.
 *
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import LayersModel from './LayersModel.js';

// types
type SelfOptions = {
  initialPosition?: Vector2;
}
export type FluxSensorOptions = SelfOptions & PhetioObjectOptions;

// TODO: How do I require a tandem nowadays?

// constants
const DEFAULT_INITIAL_POSITION = Vector2.ZERO;

class FluxSensor extends PhetioObject {

  // sensor width, in meters
  public readonly size: Dimension2;

  // The position in the atmosphere where this sensor exists.
  public readonly positionProperty: Property<Vector2>;

  // energy rate trackers for the various directions and light frequencies
  public readonly sunlightDownEnergyRateTracker: EnergyRateTracker;


  // The proportion of the energy to be absorbed from the energy packets.  This is based on the size of the flux sensor
  // relative to the total simulated area in the model.
  private readonly proportionOfEnergyToAbsorb: number;

  /**
   * @param size - The 2D size of this sensor, in meters.  The width dimension is the same as the X direction in the
   *               model.  The height dimension is in the Z direction in model space, and the sensor as a whole is
   *               modeled as being parallel to the ground.
   * @param [providedOptions]
   */
  public constructor( size: Dimension2, providedOptions: FluxSensorOptions ) {

    // parameter checking
    assert && assert( size.width <= LayersModel.SUNLIGHT_SPAN.width, 'width to too large' );
    assert && assert( size.height <= LayersModel.SUNLIGHT_SPAN.height, 'height to too large' );

    const options = optionize<FluxSensorOptions, SelfOptions, PhetioObjectOptions>()( {
      initialPosition: DEFAULT_INITIAL_POSITION,

      // temporarily marking phet-io state to be false until serialization is added
      phetioState: false

    }, providedOptions );

    super( options );

    this.size = size;

    this.positionProperty = new Vector2Property( options.initialPosition, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      units: 'm',
      phetioDocumentation: 'The 2D position of the flux sensor within the atmosphere.'
    } );

    this.sunlightDownEnergyRateTracker = new EnergyRateTracker( {
      tandem: options.tandem?.createTandem( 'sunlightDownEnergyRateTracker' )
    } );

    // Calculate the proportion of energy to absorb based on the sensor size.
    this.proportionOfEnergyToAbsorb = ( size.width * size.height ) /
                                      ( LayersModel.SUNLIGHT_SPAN.width * LayersModel.SUNLIGHT_SPAN.height );
  }

  /**
   * Measure the amount of energy passing through the sensor and accumulate it.  This method should be stepped
   * regularly with the model, even if there are no energy packets present, so that the measurement can average out.
   */
  public measureEnergyPacketFlux( energyPackets: EMEnergyPacket[], dt: number ): void {

    let totalSunEnergyCrossingDownward = 0;

    // Go through each energy packet and determine if it has moved through the sensor and, if so, measure it.
    energyPackets.forEach( energyPacket => {
      if ( this.energyPacketCrossedAltitude( energyPacket ) ) {
        if ( energyPacket.direction === EnergyDirection.DOWN && energyPacket.isVisible ) {
          totalSunEnergyCrossingDownward += energyPacket.energy;
        }
      }
    } );

    // In the code below, the amount of energy that has crossed the flux sensor is scaled by a multiplier that was
    // calculated during construction.  This multiplier represents the proportion of the 2D model size that is taken up
    // by this sensor.  This is necessary because in the Greenhouse Effect model, all energy is modelled with altitude
    // only, and no X position, so the multiplier is used to determine how much of that total energy is considered to
    // have passed through the sensor.
    this.sunlightDownEnergyRateTracker.addEnergyInfo(
      totalSunEnergyCrossingDownward * this.proportionOfEnergyToAbsorb, dt
    );
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.sunlightDownEnergyRateTracker.reset();
    this.positionProperty.reset();
  }

  /**
   * Returns true if the provided energy packet passed through the altitude at which this sensor resides.
   */
  private energyPacketCrossedAltitude( energyPacket: EMEnergyPacket ): boolean {
    const altitude = this.positionProperty.value.y;
    return ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ||
           ( energyPacket.previousAltitude < altitude && energyPacket.altitude >= altitude );
  }
}

greenhouseEffect.register( 'FluxSensor', FluxSensor );
export default FluxSensor;