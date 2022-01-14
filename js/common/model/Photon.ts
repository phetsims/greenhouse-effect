// Copyright 2021-2022, University of Colorado Boulder

/**
 * Photon is a model of a simple photon with the attributes needed by the Greenhouse Effect simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const PHOTON_SPEED = GreenhouseEffectConstants.SPEED_OF_LIGHT;

// TODO - These should be consolidated with the molecules-and-light code, see https://github.com/phetsims/greenhouse-effect/issues/19
const IR_WAVELENGTH = GreenhouseEffectConstants.INFRARED_WAVELENGTH;
const VISIBLE_WAVELENGTH = GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
const SUPPORTED_WAVELENGTHS = [ IR_WAVELENGTH, VISIBLE_WAVELENGTH ];

type PhotonOptions = {
  initialVelocity: Vector2 | null
}

// TODO: Consider just having a direction instead of a velocity, which is what is done elsewhere in the sim, since
//       photons should always be moving at the speed of light.

class Photon {
  readonly positionProperty: Vector2Property;
  readonly previousPosition: Vector2;
  readonly wavelength: number;
  readonly velocity: Vector2;

  constructor( initialPosition: Vector2, wavelength: number, tandem: Tandem, providedOptions?: Partial<PhotonOptions> ) {

    const options = merge( {

      // {Vector2|null} - will be created if not supplied
      initialVelocity: null
    }, providedOptions );

    assert && assert( SUPPORTED_WAVELENGTHS.includes( wavelength ), 'unsupported wavelength' );

    this.wavelength = wavelength;

    // position in model space
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    // previous position, used for checking when the photon has crossed some threshold
    this.previousPosition = new Vector2( initialPosition.x, initialPosition.y );

    // velocity vector, in meters/s
    this.velocity = options.initialVelocity || new Vector2( 0, PHOTON_SPEED );
  }

  /**
   * @param {number} dt - time, in seconds
   * @public
   */
  step( dt: number ) {

    // Keep track of the previous position, meaning the position just prior to the most recent update.  This is used to
    // detect whether a photon has crossed a boundary.
    this.previousPosition.set( this.positionProperty.value );

    // Update the position.
    this.positionProperty.set( this.positionProperty.value.plus( this.velocity.timesScalar( dt ) ) );
  }

  /**
   * convenience method for determining whether this is a visible photon
   */
  get isVisible() {
    return this.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
  }

  /**
   * convenience method for determining whether this is an infrared photon
   */
  get isInfrared() {
    return this.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH;
  }

  /**
   * Reset the previous position by making it match the current position.  This is generally used when a photon is
   * being released from something and we don't want to detect false layer crossing after the release.
   */
  resetPreviousPosition() {
    this.previousPosition.set( this.positionProperty.value );
  }

  // static values
  static IR_WAVELENGTH = IR_WAVELENGTH;
  static VISIBLE_WAVELENGTH = VISIBLE_WAVELENGTH;
  static SPEED = PHOTON_SPEED;
}

greenhouseEffect.register( 'Photon', Photon );
export default Photon;
