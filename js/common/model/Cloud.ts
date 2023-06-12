// Copyright 2021-2023, University of Colorado Boulder

/**
 * The Cloud class is a simple model of a cloud in the atmosphere.  Clouds can interact with light, generally reflecting
 * it in both the up and down directions.  For the purposes of reflecting light, the cloud is modeled as a horizontal
 * line that occupies some proportion of the modeled section of the Earth, and the amount of light that it reflects is
 * based on the proportion of the total horizontal space occupied by the cloud and its reflectivity in the up and down
 * directions for each frequency of light.
 *
 * For the purposes of the view, the shape of the cloud is modelled as an ellipse that is created from the provided
 * width, height and center position.  This shape is used when doing things like reflecting waves or bouncing photons,
 * but that sort of behavior is generally handled by the model that contains the cloud, and not the Cloud instances.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import LayersModel from './LayersModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';

type ReflectivityValues = {

  // proportion of the visible light that hits this cloud from above and is subsequently reflected back up
  topVisibleLightReflectivity: number;

  // proportion of the visible light that hits this cloud from below and is subsequently reflected back down
  bottomVisibleLightReflectivity: number;

  // proportion of the infrared light that hits this cloud from above and is subsequently reflected back up
  topInfraredLightReflectivity: number;

  // proportion of the infrared light that hits this cloud from below and is subsequently reflected back down
  bottomInfraredLightReflectivity: number;
};

type SelfOptions = Partial<ReflectivityValues>;
export type CloudOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

class Cloud extends PhetioObject {
  public readonly position: Vector2;
  public readonly width: number;
  public readonly height: number;
  public readonly enabledProperty: TReadOnlyProperty<boolean>;
  public readonly modelShape: Shape;
  private readonly reflectivityValues: ReflectivityValues;

  public constructor( position: Vector2,
                      width: number,
                      height: number,
                      enabledProperty: ReadOnlyProperty<boolean>,
                      providedOptions: CloudOptions ) {

    const options = optionize<CloudOptions, SelfOptions, PhetioObjectOptions>()( {
      topVisibleLightReflectivity: 0.08,
      bottomVisibleLightReflectivity: 0,
      topInfraredLightReflectivity: 0,
      bottomInfraredLightReflectivity: 0,

      // phet-io
      phetioState: false
    }, providedOptions );

    super( options );

    // Make the reflectivity values available to the methods.
    this.reflectivityValues = {
      topVisibleLightReflectivity: options.topVisibleLightReflectivity,
      bottomVisibleLightReflectivity: options.bottomVisibleLightReflectivity,
      topInfraredLightReflectivity: options.topInfraredLightReflectivity,
      bottomInfraredLightReflectivity: options.bottomInfraredLightReflectivity
    };

    // parameter checking
    assert && assert( width <= LayersModel.SUNLIGHT_SPAN.width, 'cloud can\'t exceed the sunlight span' );

    // position in model space of the center of this cloud
    this.position = position;

    // size of the cloud
    this.width = width;
    this.height = height;

    // controls whether the cloud is interacting with light
    this.enabledProperty = enabledProperty;

    // elliptical shape that defines the space which the cloud occupies
    this.modelShape = Shape.ellipse( position.x, position.y, width / 2, height / 2, 0 );
  }

  /**
   * Interact with the provided energy.  Energy may be partially reflected.
   * @param emEnergyPackets - energy packets that are moving withing the system
   */
  public interactWithEnergy( emEnergyPackets: EMEnergyPacket[] ): void {

    if ( this.enabledProperty.value ) {

      const sunlightSpanWidthProportion = this.width / LayersModel.SUNLIGHT_SPAN.width;

      emEnergyPackets.forEach( emEnergyPacket => {

        // convenience variable
        const altitude = this.position.y;

        let reflectedEnergy = 0;

        // Check whether this energy packet has interacted with the cloud and, if so, calculate the reflection.
        if ( emEnergyPacket.previousAltitude > altitude && emEnergyPacket.altitude <= altitude ) {
          const reflectivity = emEnergyPacket.isVisible ?
                               this.reflectivityValues.topVisibleLightReflectivity :
                               this.reflectivityValues.topInfraredLightReflectivity;
          reflectedEnergy = emEnergyPacket.energy * reflectivity * sunlightSpanWidthProportion;
        }
        else if ( emEnergyPacket.previousAltitude < altitude && emEnergyPacket.altitude >= altitude ) {
          const reflectivity = emEnergyPacket.isVisible ?
                               this.reflectivityValues.bottomVisibleLightReflectivity :
                               this.reflectivityValues.bottomInfraredLightReflectivity;
          reflectedEnergy = emEnergyPacket.energy * reflectivity * sunlightSpanWidthProportion;
        }

        if ( reflectedEnergy > 0 ) {

          // Attenuate the amount of energy in the non-reflected packet by the amount the was reflected.
          emEnergyPacket.energy = emEnergyPacket.energy - reflectedEnergy;

          // Create a new packet of the same type with the reflected energy, heading in the opposite direction.
          emEnergyPackets.push( new EMEnergyPacket(
            emEnergyPacket.wavelength,
            reflectedEnergy,
            altitude,
            EnergyDirection.getOpposite( emEnergyPacket.direction )
          ) );
        }
      } );
    }
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;