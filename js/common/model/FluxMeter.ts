// Copyright 2021-2022, University of Colorado Boulder

/**
 * A model component for the FluxMeter in this simulation. Contains Properties for the position
 * of the sensor. All Property values are in model coordinates.
 *
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import FluxSensor, { FluxSensorOptions } from './FluxSensor.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from './EnergyAbsorbingEmittingLayer.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../../phet-core/js/optionize.js';
import LayersModel from './LayersModel.js';
import EMEnergyPacket from './EMEnergyPacket.js';

// types
type SelfOptions = {
  fluxSensorOptions?: StrictOmit<FluxSensorOptions, 'tandem'>;
};
type FluxMeterOptions = SelfOptions & PhetioObjectOptions;

// constants
const FLUX_SENSOR_SIZE = new Dimension2(
  GreenhouseEffectConstants.SUNLIGHT_SPAN * 0.2,
  EnergyAbsorbingEmittingLayer.WIDTH
);

// TODO: Questions: How do I require a tandem these days?  How to I prevent a tandem for a model element that is
//       included via composition?  How do I then create that tandem and pass it through to the sub-element?  I have
//       something working, but I'm not sure it is what we currently consider to be idiomatic?

class FluxMeter extends PhetioObject {
  public readonly sunlightOutProperty: NumberProperty;
  public readonly infraredInProperty: NumberProperty;
  public readonly infraredOutProperty: NumberProperty;
  public readonly wireMeterAttachmentPositionProperty: Vector2Property;
  public readonly wireSensorAttachmentPositionProperty: IReadOnlyProperty<Vector2>;

  // the model element that senses the flux, must have energy added to it by the model
  public readonly fluxSensor: FluxSensor;

  public constructor( providedOptions?: FluxMeterOptions ) {

    const options = optionize<FluxMeterOptions, SelfOptions, PhetioObjectOptions>()( {
      fluxSensorOptions: {

        // The initial position for the flux sensor, empirically determined to be near the center of the simulated
        // atmosphere and to not initially overlap with anything important in the view.
        initialPosition: new Vector2( 0, LayersModel.HEIGHT_OF_ATMOSPHERE * 0.3 )
      }
    }, providedOptions );

    super( options );

    // These are dummy Properties for now. I am guessing that the real way to do this will be to have a Model for the
    // sensor that will include its position, bounds, and calculate the flux of Photons in the model through the bounds
    // of the sensor to count values for these Properties per unit time.
    this.sunlightOutProperty = new NumberProperty( -20 );
    this.infraredInProperty = new NumberProperty( 40 );
    this.infraredOutProperty = new NumberProperty( -60 );

    // Create the flux sensor, which is the portion that actually senses and measures the flux.
    const fluxSensorOptions = options.fluxSensorOptions as FluxSensorOptions;
    fluxSensorOptions.tandem = options.tandem?.createTandem( 'fluxSensor' );
    this.fluxSensor = new FluxSensor( FLUX_SENSOR_SIZE, fluxSensorOptions );

    // the position in model coordinates where the flux meter wire connects to the sensor, in meters
    this.wireSensorAttachmentPositionProperty = new DerivedProperty(
      [ this.fluxSensor.positionProperty ],
      sensorPosition => {
        return sensorPosition.plusXY( this.fluxSensor.width / 2, 0 );
      },
      {
        tandem: options.tandem.createTandem( 'wireSensorAttachmentPositionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      }
    );

    // {Vector2Property} - The position in model coordinates where the wire connects to the display - the
    // display for the meter is just a panel set in view coordinates to align with other components, so this should
    // be set in the view after the meter component has been positioned
    this.wireMeterAttachmentPositionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: options.tandem.createTandem( 'wireMeterAttachmentPositionProperty' )
    } );
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.fluxSensor.reset();
  }

  /**
   * This method is a pass-through to the sensor, see the documentation there for details.
   */
  public measureEnergyPacketFlux( energyPackets: EMEnergyPacket[], dt: number ): void {
    this.fluxSensor.measureEnergyPacketFlux( energyPackets, dt );
  }
}

greenhouseEffect.register( 'FluxMeter', FluxMeter );
export default FluxMeter;