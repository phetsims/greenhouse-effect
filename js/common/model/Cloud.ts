// Copyright 2021-2022, University of Colorado Boulder

/**
 * The Cloud class is a simple model of a cloud in the atmosphere.  Clouds can interact with light, generally reflecting
 * it in both the up and down directions.  For the purposes of reflecting light, the cloud is modeled as a horizontal
 * line that occupies some proportion of the modeled section of the Earth, and the amount of light that it reflects is
 * based on the proportion of the total horizontal space occupied by the cloud and its reflectivity in the up and down
 * directions for each frequency of light.
 *
 * For the purposes of the view, the shape of the cloud is modelled as an ellipse that is created from the provided
 * width, height and center position.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';

type ReflectivityValues = {
  topVisibleLightReflectivity: number;
  bottomVisibleLightReflectivity: number;
  topInfraredLightReflectivity: number;
  bottomInfraredLightReflectivity: number;
};

type CloudOptions = Partial<ReflectivityValues> & PhetioObjectOptions;

class Cloud extends PhetioObject {
  readonly position: Vector2;
  readonly width: number;
  readonly height: number;
  readonly enabledProperty: Property<boolean>;
  readonly modelShape: Shape;
  readonly reflectivityValues: ReflectivityValues;

  constructor( position: Vector2, width: number, height: number, providedOptions: CloudOptions ) {

    const options = merge( {

      // proportion of the visible light that hits this cloud from above and is subsequently reflected back up
      topVisibleLightReflectivity: 0.08,

      // proportion of the visible light that hits this cloud from below and is subsequently reflected back down
      bottomVisibleLightReflectivity: 0,

      // proportion of the infrared light that hits this cloud from above and is subsequently reflected back up
      topInfraredLightReflectivity: 0,

      // proportion of the infrared light that hits this cloud from below and is subsequently reflected back down
      bottomInfraredLightReflectivity: 0,

      // phet-io
      phetioState: false,
      tandem: Tandem.REQUIRED // tandem is required because Cloud is used in a Map that is serialized
    }, providedOptions ) as Required<CloudOptions>;

    super( options );

    // Make the reflectivity values available to the methods.
    this.reflectivityValues = {
      topVisibleLightReflectivity: options.topVisibleLightReflectivity,
      bottomVisibleLightReflectivity: options.bottomVisibleLightReflectivity,
      topInfraredLightReflectivity: options.topInfraredLightReflectivity,
      bottomInfraredLightReflectivity: options.bottomInfraredLightReflectivity
    };

    // parameter checking
    assert && assert( width <= GreenhouseEffectConstants.SUNLIGHT_SPAN, 'cloud can\'t exceed the sunlight span' );

    // position in model space of the center of this cloud
    this.position = position;

    // size of the cloud
    this.width = width;
    this.height = height;

    // controls whether the cloud is interacting with light
    this.enabledProperty = new BooleanProperty( false );

    // elliptical shape that defines the space which the cloud occupies
    this.modelShape = Shape.ellipse( position.x, position.y, width / 2, height / 2, 0 );
  }

  /**
   * Interact with the provided energy.  Energy may be partially reflected.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt - delta time, in seconds
   */
  interactWithEnergy( emEnergyPackets: EMEnergyPacket[], dt: number ) {

    if ( this.enabledProperty.value ) {

      const sunlightSpanProportion = this.width / GreenhouseEffectConstants.SUNLIGHT_SPAN;

      emEnergyPackets.forEach( emEnergyPacket => {

        // convenience variable
        const altitude = this.position.y;

        let reflectedEnergy = 0;

        // Check whether this energy packet has interacted with the cloud and, if so, calculate the reflection.
        if ( emEnergyPacket.previousAltitude > altitude && emEnergyPacket.altitude <= altitude ) {
          const reflectivity = emEnergyPacket.isVisible ?
                               this.reflectivityValues.topVisibleLightReflectivity :
                               this.reflectivityValues.topInfraredLightReflectivity;
          reflectedEnergy = emEnergyPacket.energy * reflectivity * sunlightSpanProportion;
        }
        else if ( emEnergyPacket.previousAltitude < altitude && emEnergyPacket.altitude >= altitude ) {
          const reflectivity = emEnergyPacket.isVisible ?
                               this.reflectivityValues.bottomVisibleLightReflectivity :
                               this.reflectivityValues.bottomInfraredLightReflectivity;
          reflectedEnergy = emEnergyPacket.energy * reflectivity * sunlightSpanProportion;
        }

        if ( reflectedEnergy > 0 ) {

          // Attenuate the amount of energy in the non-reflected packet by the amount the was reflected.
          emEnergyPacket.energy = emEnergyPacket.energy - reflectedEnergy;

          // Create a new packet of the same type with the reflected energy, heading in the opposite direction.
          emEnergyPackets.push( new EMEnergyPacket(
            emEnergyPacket.wavelength,
            reflectedEnergy,
            altitude,
            // @ts-ignore - once enums are figured out and serializable, this should be replaced
            EnergyDirection.getOpposite( emEnergyPacket.direction )
          ) );
        }
      } );
    }
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;