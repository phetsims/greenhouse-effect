// Copyright 2021, University of Colorado Boulder

/**
 * The Cloud class is a simple model of a cloud in the atmosphere.  Clouds can interact with light, generally reflecting
 * it in both the up and down directions.  The shape of the cloud is modelled as an elliptical shape that is created from the provided width, height
 * and center position.
 *
 * @author Jesse Greenberg
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';

// constants
const CLOUD_SUBSTANCE_REFLECTIVITY: Map<number, number> = new Map( [
  [ GreenhouseEffectConstants.VISIBLE_WAVELENGTH, 0.08 ],
  [ GreenhouseEffectConstants.INFRARED_WAVELENGTH, 0 ]
] );

class Cloud extends PhetioObject {
  readonly position: Vector2;
  readonly width: number;
  readonly height: number;
  readonly enabledProperty: Property<boolean>;
  readonly modelShape: Shape;
  readonly totalReflectivityTable: Map<number, number>;

  /**
   * @param {Vector2} position
   * @param {number} width - in meters
   * @param {number} height - in meters
   * @param {Object} [options]
   */
  constructor( position: Vector2, width: number, height: number, options: Object ) {

    options = merge( {

      // phet-io
      phetioState: false,
      tandem: Tandem.REQUIRED // tandem is required because Cloud is used in a Map that is serialized
    }, options );

    super( options );

    // parameter checking
    assert && assert( width <= GreenhouseEffectConstants.SUNLIGHT_SPAN, 'cloud can\'t exceed the sunlight span' );

    // position in model space of the center of this cloud
    this.position = position;

    // size of the cloud
    this.width = width;
    this.height = height;

    // controls whether or not the cloud is interacting with light
    this.enabledProperty = new BooleanProperty( false );

    // elliptical shape that defines the space which the cloud occupies
    this.modelShape = Shape.ellipse( position.x, position.y, width / 2, height / 2, 0 );

    // @private - Map of EM wavelengths to total reflectivity proportion for this cloud.  The reflectivity for a given
    // wavelength is the proportion of light that this cloud will reflect within the simulated space, and is based on
    // the reflectivity characteristics of the cloud and its width relative to the span of the incoming sunlight.
    this.totalReflectivityTable = new Map<number, number>( [
      [
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        width / GreenhouseEffectConstants.SUNLIGHT_SPAN *
        CLOUD_SUBSTANCE_REFLECTIVITY.get( GreenhouseEffectConstants.VISIBLE_WAVELENGTH )!
      ],
      [
        GreenhouseEffectConstants.INFRARED_WAVELENGTH,
        width / GreenhouseEffectConstants.SUNLIGHT_SPAN *
        CLOUD_SUBSTANCE_REFLECTIVITY.get( GreenhouseEffectConstants.INFRARED_WAVELENGTH )!
      ]
    ] );
  }

  /**
   * Interact with the provided energy.  Energy may be partially reflected.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt - delta time, in seconds
   * @public
   */
  interactWithEnergy( emEnergyPackets: EMEnergyPacket[], dt: number ) {

    emEnergyPackets.forEach( energyPacket => {

      // convenience variable
      const altitude = this.position.y;

      // Check for energy that may be interacting with this cloud.
      if ( this.enabledProperty.value &&
           ( ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ||
             ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ) ) {

        assert && assert( this.totalReflectivityTable.has( energyPacket.wavelength ) );

        // Calculate the amount of energy reflected by the cloud.
        const reflectedEnergy = energyPacket.energy * this.totalReflectivityTable.get( energyPacket.wavelength )!;

        if ( reflectedEnergy > 0 ) {

          // Attenuate the amount of energy in the non-reflected packet by the amount the was reflected.
          energyPacket.energy = energyPacket.energy - reflectedEnergy;

          // Create a new packet of the same type with the reflected energy, heading in the opposite direction.
          emEnergyPackets.push( new EMEnergyPacket(
            energyPacket.wavelength,
            reflectedEnergy,
            altitude,
            // @ts-ignore - once enums are figured out and serializable, this should be replaced
            EnergyDirection.getOpposite( energyPacket.direction )
          ) );
        }
      }
    } );
  }

  /**
   * Get the reflectivity of the cloud for the provided wavelength.  Note that this is different from the total
   * reflectivity, since the total takes into account how much space the cloud occupies and this does not.
   * @param {number} wavelength
   * @returns {number|null} - a normalized value between 0 and 1, which 1 is max reflectivity
   * @public
   */
  getReflectivity( wavelength: number ) {
    assert && assert(
      CLOUD_SUBSTANCE_REFLECTIVITY.has( wavelength ),
      'no reflectivity available for provided wavelength'
    );
    return CLOUD_SUBSTANCE_REFLECTIVITY.get( wavelength );
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;