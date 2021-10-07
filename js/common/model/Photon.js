// Copyright 2021, University of Colorado Boulder

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

// constants
const PHOTON_SPEED = GreenhouseEffectConstants.SPEED_OF_LIGHT;

// TODO - These should be consolidated with the molecules-and-light code, see https://github.com/phetsims/greenhouse-effect/issues/19
const IR_WAVELENGTH = GreenhouseEffectConstants.INFRARED_WAVELENGTH;
const VISIBLE_WAVELENGTH = GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
const SUPPORTED_WAVELENGTHS = [ IR_WAVELENGTH, VISIBLE_WAVELENGTH ];

class Photon {

  constructor( initialPosition, wavelength, tandem, options ) {

    options = merge( {

      // {Vector2|null} - will be created if not supplied
      initialVelocity: null
    }, options );

    assert && assert( SUPPORTED_WAVELENGTHS.includes( wavelength ), 'unsupported wavelength' );

    // @public (read-only) - position in model space
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    // @public {Vector2} - velocity vector, in meters/s
    this.velocity = options.initialVelocity || new Vector2( 0, PHOTON_SPEED );

    // @public (read-only) {number}
    this.wavelength = wavelength;
  }

  /**
   * @param {number} dt - time, in seconds
   * @public
   */
  step( dt ) {
    this.positionProperty.set( this.positionProperty.value.plus( this.velocity.timesScalar( dt ) ) );
  }
}

// statics
Photon.IR_WAVELENGTH = IR_WAVELENGTH;
Photon.VISIBLE_WAVELENGTH = VISIBLE_WAVELENGTH;
Photon.SPEED = PHOTON_SPEED;

greenhouseEffect.register( 'Photon', Photon );
export default Photon;
