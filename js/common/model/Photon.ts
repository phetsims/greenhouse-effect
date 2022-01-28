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
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';

// constants
const PHOTON_SPEED = GreenhouseEffectConstants.SPEED_OF_LIGHT;

// TODO - These should be consolidated with the molecules-and-light code, see https://github.com/phetsims/greenhouse-effect/issues/19
const IR_WAVELENGTH = GreenhouseEffectConstants.INFRARED_WAVELENGTH;
const VISIBLE_WAVELENGTH = GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
const SUPPORTED_WAVELENGTHS = [ IR_WAVELENGTH, VISIBLE_WAVELENGTH ];

// types and enumerations
class ShowState extends EnumerationValue {
  static ALWAYS = new ShowState();
  static ONLY_IN_MORE_PHOTONS_MODE = new ShowState();

  static enumeration = new Enumeration( ShowState );
}

type PhotonOptions = {
  initialVelocity?: Vector2 | null,
  showState?: ShowState
}

// TODO: Consider just having a direction instead of a velocity, which is what is done elsewhere in the sim, since
//       photons should always be moving at the speed of light.

class Photon {
  public readonly positionProperty: Vector2Property;
  public readonly previousPosition: Vector2;
  public readonly wavelength: number;
  public readonly velocity: Vector2;
  public readonly showState: ShowState;

  constructor( initialPosition: Vector2, wavelength: number, providedOptions?: Partial<PhotonOptions> ) {

    const options = merge( {

      // {Vector2|null} - will be created if not supplied
      initialVelocity: null,

      // {ShowState} - whether this photon should always be shown in the view or only in "more photons" mode
      showState: ShowState.ALWAYS

    }, providedOptions );

    assert && assert( SUPPORTED_WAVELENGTHS.includes( wavelength ), 'unsupported wavelength' );

    this.wavelength = wavelength;

    // position in model space
    this.positionProperty = new Vector2Property( initialPosition );

    // previous position, used for checking when the photon has crossed some threshold
    this.previousPosition = new Vector2( initialPosition.x, initialPosition.y );

    // velocity vector, in meters/s
    this.velocity = options.initialVelocity || new Vector2( 0, PHOTON_SPEED );

    // This flag determines whether this photon should always be shown in the view or only shown when the "more photons"
    // mode has been set.
    this.showState = options.showState;
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

  toStateObject(): PhotonStateObject {
    return {

      // TODO: Is there a predefined type for serialized Vector2 instances?  I'm not seeing anything obvious in the
      //  Vector2 code, and Vector2.toStateObject says its return value is duck-typed.
      position: this.positionProperty.value.toStateObject() as SerializedVector2,
      previousPosition: this.previousPosition.toStateObject() as SerializedVector2,
      wavelength: this.wavelength,
      velocity: this.velocity.toStateObject() as SerializedVector2,

      // TODO: How are we supposed to serialize enumerations using the new pattern?
      showState: this.showState.toString() as string
    };
  }

  static fromStateObject( stateObject: PhotonStateObject ) {
    return new Photon(
      Vector2.fromStateObject( stateObject.position ),
      stateObject.wavelength,
      {
        initialVelocity: Vector2.fromStateObject( stateObject.velocity ),
        showState: stateObject.showState === 'ALWAYS' ? ShowState.ALWAYS : ShowState.ONLY_IN_MORE_PHOTONS_MODE
      }
    );
  }

  static get STATE_SCHEMA() {
    return {
      position: Vector2.Vector2IO,
      previousPosition: Vector2.Vector2IO,
      wavelength: NumberIO,
      velocity: Vector2.Vector2IO,
      showState: StringIO
    };
  }

  // static values
  static IR_WAVELENGTH = IR_WAVELENGTH;
  static VISIBLE_WAVELENGTH = VISIBLE_WAVELENGTH;
  static SPEED = PHOTON_SPEED;
  static ShowState = ShowState;

  // phet-io
  static PhotonIO = IOType.fromCoreType( 'PhotonIO', Photon );
}

type SerializedVector2 = {
  x: number,
  y: number
}

type PhotonStateObject = {
  position: SerializedVector2,
  previousPosition: SerializedVector2,
  wavelength: number,
  velocity: SerializedVector2,
  showState: string
}

greenhouseEffect.register( 'Photon', Photon );
export default Photon;
