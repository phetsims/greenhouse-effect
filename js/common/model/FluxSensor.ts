// Copyright 2022-2023, University of Colorado Boulder

/**
 * FluxSensor is a two-dimensional sensor which is modeled as a rectangle that is parallel to the ground and measures
 * the amount of electromagnetic energy that passes through it.
 *
 * Because of the nature of the Greenhouse Effect model, the X position of the sensor doesn't really matter in terms of
 * how much energy is sensed.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
};
export type FluxSensorOptions = SelfOptions & PhetioObjectOptions;

// TODO: How do I require a tandem nowadays?

// constants
const DEFAULT_INITIAL_POSITION = Vector2.ZERO;

class FluxSensor extends PhetioObject {

  // sensor width, in meters
  public readonly size: Dimension2;

  // The altitude of the sensor in the atmosphere, in meters.
  public readonly altitudeProperty: NumberProperty;

  // The X position of the sensor, which never changes.
  public readonly xPosition: number;

  // energy rate trackers for the various directions and light frequencies
  public readonly visibleLightDownEnergyRateTracker: EnergyRateTracker;
  public readonly visibleLightUpEnergyRateTracker: EnergyRateTracker;
  public readonly infraredLightDownEnergyRateTracker: EnergyRateTracker;
  public readonly infraredLightUpEnergyRateTracker: EnergyRateTracker;

  // The proportion of the energy to be absorbed from the energy packets.  This is based on the size of the flux sensor
  // relative to the total simulated area in the model.
  private readonly proportionOfEnergyToAbsorb: number;

  // tracks whether this sensor is being dragged in the view
  public readonly isDraggingProperty: BooleanProperty = new BooleanProperty( false );

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

    this.xPosition = options.initialPosition.x;
    this.altitudeProperty = new NumberProperty( options.initialPosition.y, {
      units: 'm',

      // The altitude (in meters) over which the flux sensor is allowed to move. The lower end allows the sensor to get
      // close to the ground but not overlap with UI elements. The upper end makes sure that the sensor stays fully
      // within the observation window. See https://github.com/phetsims/greenhouse-effect/issues/248
      range: new Range( 750, LayersModel.HEIGHT_OF_ATMOSPHERE - 700 ),
      rangePropertyOptions: { units: 'm' },
      tandem: options.tandem.createTandem( 'altitudeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The altitude of the flux sensor in the atmosphere.'
    } );

    // Create the energy rate trackers.
    this.visibleLightDownEnergyRateTracker = new EnergyRateTracker( {
      tandem: options.tandem?.createTandem( 'visibleLightDownEnergyRateTracker' )
    } );
    this.visibleLightUpEnergyRateTracker = new EnergyRateTracker( {
      tandem: options.tandem?.createTandem( 'visibleLightUpEnergyRateTracker' )
    } );
    this.infraredLightDownEnergyRateTracker = new EnergyRateTracker( {
      tandem: options.tandem?.createTandem( 'infraredLightDownEnergyRateTracker' )
    } );
    this.infraredLightUpEnergyRateTracker = new EnergyRateTracker( {
      tandem: options.tandem?.createTandem( 'infraredLightUpEnergyRateTracker' )
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

    let totalVisibleLightEnergyCrossingDownward = 0;
    let totalVisibleLightEnergyCrossingUpward = 0;
    let totalInfraredLightEnergyCrossingDownward = 0;
    let totalInfraredLightEnergyCrossingUpward = 0;

    // Go through each energy packet and determine if it has moved through the sensor and, if so, measure it.
    energyPackets.forEach( energyPacket => {
      if ( this.energyPacketCrossedAltitude( energyPacket ) ) {
        if ( energyPacket.direction === EnergyDirection.DOWN ) {
          assert && assert( energyPacket.isVisible || energyPacket.isInfrared, 'energy packet must be visible or IR' );
          if ( energyPacket.isVisible ) {
            totalVisibleLightEnergyCrossingDownward += energyPacket.energy;
          }
          else {
            totalInfraredLightEnergyCrossingDownward += energyPacket.energy;
          }
        }
        else {
          assert && assert( energyPacket.direction === EnergyDirection.UP, 'unexpected energy direction' );
          if ( energyPacket.isVisible ) {
            totalVisibleLightEnergyCrossingUpward += energyPacket.energy;
          }
          else {
            totalInfraredLightEnergyCrossingUpward += energyPacket.energy;
          }
        }
      }
    } );

    // In the code below, the amount of energy that has crossed the flux sensor is scaled by a multiplier that was
    // calculated during construction.  This multiplier represents the proportion of the 2D model size that is taken up
    // by this sensor.  This is necessary because in the Greenhouse Effect model, all energy is modelled with altitude
    // only, and no X position, so the multiplier is used to determine how much of that total energy is considered to
    // have passed through the sensor.
    this.visibleLightDownEnergyRateTracker.addEnergyInfo(
      totalVisibleLightEnergyCrossingDownward * this.proportionOfEnergyToAbsorb, dt
    );
    this.visibleLightUpEnergyRateTracker.addEnergyInfo(
      totalVisibleLightEnergyCrossingUpward * this.proportionOfEnergyToAbsorb, dt
    );
    this.infraredLightDownEnergyRateTracker.addEnergyInfo(
      totalInfraredLightEnergyCrossingDownward * this.proportionOfEnergyToAbsorb, dt
    );
    this.infraredLightUpEnergyRateTracker.addEnergyInfo(
      totalInfraredLightEnergyCrossingUpward * this.proportionOfEnergyToAbsorb, dt
    );
  }

  /**
   * Clear the values in all energy trackers.
   */
  public clearEnergyTrackers(): void {
    this.visibleLightDownEnergyRateTracker.reset();
    this.visibleLightUpEnergyRateTracker.reset();
    this.infraredLightDownEnergyRateTracker.reset();
    this.infraredLightUpEnergyRateTracker.reset();
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.clearEnergyTrackers();
    this.altitudeProperty.reset();
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