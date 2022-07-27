// Copyright 2021-2022, University of Colorado Boulder

/**
 * A model component for the FluxMeter in this simulation. Contains Properties for the position
 * of the sensor. All Property values are in model coordinates.
 *
 * @author Jesse Greenberg
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import AtmosphereLayer from './AtmosphereLayer.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import FluxSensor, { FluxSensorOptions } from './FluxSensor.js';
import LayersModel from './LayersModel.js';

// constants
const MIN_LAYER_TO_SENSOR_DISTANCE = 2200; // in meters, empirically determined

// types
type SelfOptions = {

  // A boolean flag that controls whether the flux sensor should be moved off of a layer when it is released on or very
  // near one.
  moveSensorOffLayers?: boolean;

  // options passed through to the flux sensor
  fluxSensorOptions?: StrictOmit<FluxSensorOptions, 'tandem'>;
};
export type FluxMeterOptions = SelfOptions & PhetioObjectOptions;

// The size of the flux sensor.  Note that this is parallel to the ground, so "height" is actually the Z dimension.
const FLUX_SENSOR_SIZE = new Dimension2(
  GreenhouseEffectConstants.SUNLIGHT_SPAN.width * 0.75,
  GreenhouseEffectConstants.SUNLIGHT_SPAN.height
);

// TODO: Questions: How do I require a tandem these days?  How to I prevent a tandem for a model element that is
//       included via composition?  How do I then create that tandem and pass it through to the sub-element?  I have
//       something working, but I'm not sure it is what we currently consider to be idiomatic?

class FluxMeter extends PhetioObject {

  private readonly atmosphereLayers: AtmosphereLayer[];

  // the model element that senses the flux, must have energy added to it by the model
  public readonly fluxSensor: FluxSensor;

  // variables that indicate where the wire should be that attaches the flux sensor to the body of the meter
  public readonly wireMeterAttachmentPositionProperty: Vector2Property;
  public readonly wireSensorAttachmentPositionProperty: IReadOnlyProperty<Vector2>;

  public constructor( atmosphereLayers: AtmosphereLayer[], providedOptions?: FluxMeterOptions ) {

    const options = optionize<FluxMeterOptions, SelfOptions, PhetioObjectOptions>()( {
      moveSensorOffLayers: false,
      fluxSensorOptions: {

        // The initial position for the flux sensor, empirically determined to be near the horizon in the observation
        // window and not initially overlapping with anything important.
        initialPosition: new Vector2( -LayersModel.SUNLIGHT_SPAN.width * 0.105, LayersModel.HEIGHT_OF_ATMOSPHERE * 0.15 )
      },

      // temporarily marking phet-io state to be false until serialization is added
      phetioState: false

    }, providedOptions );

    super( options );

    this.atmosphereLayers = atmosphereLayers;

    // Create the flux sensor, which is the portion that actually senses and measures the flux.
    const fluxSensorOptions = options.fluxSensorOptions as FluxSensorOptions;
    fluxSensorOptions.tandem = options.tandem?.createTandem( 'fluxSensor' );
    this.fluxSensor = new FluxSensor( FLUX_SENSOR_SIZE, fluxSensorOptions );

    // the position in model coordinates where the flux meter wire connects to the sensor, in meters
    this.wireSensorAttachmentPositionProperty = new DerivedProperty(
      [ this.fluxSensor.altitudeProperty ],
      altitude => {
        return new Vector2( this.fluxSensor.xPosition + this.fluxSensor.size.width / 2, altitude );
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

    const checkAndUpdateSensorPosition = () => {
      if ( options.moveSensorOffLayers ) {
        this.checkAndUpdateSensorPosition();
      }
    };

    this.fluxSensor.isDraggingProperty.lazyLink( isDragging => {
      if ( !isDragging ) {
        checkAndUpdateSensorPosition();
      }
    } );

    this.atmosphereLayers.forEach( atmosphereLayer => {
      atmosphereLayer.isActiveProperty.lazyLink( checkAndUpdateSensorPosition );
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

  /**
   * Check the sensor position and, if it is too close to any layers, move it away.
   */
  private checkAndUpdateSensorPosition(): void {
    const activeAtmosphereLayers = this.atmosphereLayers.filter( layer => layer.isActiveProperty.value );
    activeAtmosphereLayers.forEach( atmosphereLayer => {
      const sensorToLayerYDistance = Math.abs( atmosphereLayer.altitude - this.fluxSensor.altitudeProperty.value );
      if ( sensorToLayerYDistance < MIN_LAYER_TO_SENSOR_DISTANCE ) {

        // Jump to the other side of the layer rather than the same side.  This works better for keyboard nav.
        if ( this.fluxSensor.altitudeProperty.value < atmosphereLayer.altitude ) {
          this.fluxSensor.altitudeProperty.set( atmosphereLayer.altitude + MIN_LAYER_TO_SENSOR_DISTANCE );
        }
        else {
          this.fluxSensor.altitudeProperty.set( atmosphereLayer.altitude - MIN_LAYER_TO_SENSOR_DISTANCE );
        }
      }
    } );
  }
}

greenhouseEffect.register( 'FluxMeter', FluxMeter );
export default FluxMeter;