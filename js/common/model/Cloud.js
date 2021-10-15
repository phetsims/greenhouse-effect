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

// constants
const CLOUD_SUBSTANCE_REFLECTIVITY = new Map( [
  [ GreenhouseEffectConstants.VISIBLE_WAVELENGTH, 0.08 ],
  [ GreenhouseEffectConstants.INFRARED_WAVELENGTH, 0 ]
] );

class Cloud extends PhetioObject {

  /**
   * @param {Vector2} position
   * @param {number} width - in meters
   * @param {number} height - in meters
   * @param {Object} [options]
   */
  constructor( position, width, height, options ) {

    options = merge( {

      // phet-io
      phetioState: false,
      tandem: Tandem.REQUIRED // tandem is required because Cloud is used in a Map that is serialized
    }, options );

    super( options );

    // parameter checking
    assert && assert( width <= GreenhouseEffectConstants.SUNLIGHT_SPAN, 'cloud can\'t exceed the sunlight span' );

    // @public (read-only) {Vector2}
    this.position = position;

    // @public (read-only) {number}
    this.width = width;
    this.height = height;

    // @public - controls whether the cloud is interacting with light
    this.enabledProperty = new BooleanProperty( false );

    // @public (read-only) {Shape} - elliptical shape that defines the space which the cloud occupies
    this.modelShape = Shape.ellipse( position.x, position.y, width / 2, height / 2 );

    // @private - Map of EM wavelengths to total reflectivity proportion for this cloud.  The reflectivity for a given
    // wavelength is the proportion of light that this cloud will reflect within the simulated space, and is based on
    // the reflectivity characteristics of the cloud and its width relative to the span of the incoming sunlight.
    this.totalReflectivityTable = new Map( [
      [
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        width / GreenhouseEffectConstants.SUNLIGHT_SPAN *
        CLOUD_SUBSTANCE_REFLECTIVITY.get( GreenhouseEffectConstants.VISIBLE_WAVELENGTH )
      ],
      [
        GreenhouseEffectConstants.INFRARED_WAVELENGTH,
        width / GreenhouseEffectConstants.SUNLIGHT_SPAN *
        CLOUD_SUBSTANCE_REFLECTIVITY.get( GreenhouseEffectConstants.INFRARED_WAVELENGTH )
      ]
    ] );
  }

  /**
   * Interact with the provided energy.  Energy may be partially reflected.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt - delta time, in seconds
   * @public
   */
  interactWithEnergy( emEnergyPackets, dt ) {

    emEnergyPackets.forEach( energyPacket => {

      // convenience variable
      const altitude = this.position.y;

      // Check for energy that may be interacting with this cloud.
      if ( this.enabledProperty.value &&
           ( ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ||
             ( energyPacket.previousAltitude > altitude && energyPacket.altitude <= altitude ) ) ) {

        assert && assert( this.totalReflectivityTable.has( energyPacket.wavelength ) );

        // Calculate the amount of energy reflected by the cloud.
        const reflectedEnergy = energyPacket.energy * this.totalReflectivityTable.get( energyPacket.wavelength );

        if ( reflectedEnergy > 0 ) {

          // Attenuate the amount of energy in the non-reflected packet by the amount the was reflected.
          energyPacket.energy = energyPacket.energy - reflectedEnergy;

          // Create a new packet of the same type with the reflected energy, heading in the opposite direction.
          emEnergyPackets.push( new EMEnergyPacket(
            energyPacket.wavelength,
            reflectedEnergy,
            altitude,
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
  getReflectivity( wavelength ) {
    assert && assert(
      CLOUD_SUBSTANCE_REFLECTIVITY.has( wavelength ),
      'no reflectivity available for provided wavelength'
    );
    return CLOUD_SUBSTANCE_REFLECTIVITY.get( wavelength );
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;