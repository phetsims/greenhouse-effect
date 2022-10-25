// Copyright 2021-2022, University of Colorado Boulder

/**
 * Photon is a model of a simple photon with the attributes needed by the Greenhouse Effect simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// constants
const PHOTON_SPEED = GreenhouseEffectConstants.SPEED_OF_LIGHT;

// TODO - These should be consolidated with the molecules-and-light code, see https://github.com/phetsims/greenhouse-effect/issues/19
const IR_WAVELENGTH = GreenhouseEffectConstants.INFRARED_WAVELENGTH;
const VISIBLE_WAVELENGTH = GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
const SUPPORTED_WAVELENGTHS = [ IR_WAVELENGTH, VISIBLE_WAVELENGTH ];

// types and enumerations
class ShowState extends EnumerationValue {
  public static ALWAYS = new ShowState();
  public static ONLY_IN_MORE_PHOTONS_MODE = new ShowState();

  public static enumeration = new Enumeration( ShowState );
}

export type PhotonOptions = {

  // initial velocity of the photon, will be created if not supplied
  initialVelocity?: Vector2 | null;

  // whether this photon should always be shown in the view or only in "more photons" mode
  showState?: ShowState;
};

// TODO: Consider just having a direction instead of a velocity, which is what is done elsewhere in the sim, since
//       photons should always be moving at the speed of light.

class Photon {

  // position in model space in meters
  public readonly positionProperty: Vector2Property;

  // previous position, used for checking when the photon has crossed some threshold
  public readonly previousPosition: Vector2;

  // velocity vector in m/s
  public readonly velocity: Vector2;

  // wavelength in meters
  public readonly wavelength: number;

  // This flag determines whether this photon should always be shown in the view or only shown when the "more photons"
  // mode has been set.
  public readonly showState: ShowState;

  public constructor( initialPosition: Vector2, wavelength: number, providedOptions?: PhotonOptions ) {

    const options = optionize<PhotonOptions>()( {
      initialVelocity: null,
      showState: ShowState.ALWAYS
    }, providedOptions );

    assert && assert( SUPPORTED_WAVELENGTHS.includes( wavelength ), 'unsupported wavelength' );

    this.wavelength = wavelength;
    this.positionProperty = new Vector2Property( initialPosition );
    this.previousPosition = new Vector2( initialPosition.x, initialPosition.y );
    this.velocity = options.initialVelocity || new Vector2( 0, PHOTON_SPEED );
    this.showState = options.showState;
  }

  /**
   * Step the model in time.
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {

    // Keep track of the previous position, meaning the position just prior to the most recent update.  This is used to
    // detect whether a photon has crossed a boundary.
    this.previousPosition.set( this.positionProperty.value );

    // Update the position.
    this.positionProperty.set( this.positionProperty.value.plus( this.velocity.timesScalar( dt ) ) );
  }

  /**
   * convenience method for determining whether this is a visible photon
   */
  public get isVisible(): boolean {
    return this.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
  }

  /**
   * convenience method for determining whether this is an infrared photon
   */
  public get isInfrared(): boolean {
    return this.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH;
  }

  /**
   * Reset the previous position by making it match the current position.  This is generally used when a photon is
   * being released from something, and we don't want to detect false layer crossing after the release.
   */
  public resetPreviousPosition(): void {
    this.previousPosition.set( this.positionProperty.value );
  }

  public toStateObject(): PhotonStateObject {
    return {
      position: this.positionProperty.value.toStateObject(),
      previousPosition: this.previousPosition.toStateObject(),
      wavelength: this.wavelength,
      velocity: this.velocity.toStateObject(),
      showState: EnumerationIO( ShowState ).toStateObject( this.showState )
    };
  }

  // static values
  public static readonly IR_WAVELENGTH = IR_WAVELENGTH;
  public static readonly VISIBLE_WAVELENGTH = VISIBLE_WAVELENGTH;
  public static readonly SPEED = PHOTON_SPEED;
  public static readonly ShowState = ShowState;

  // phet-io
  public static readonly PhotonIO = new IOType<Photon, PhotonStateObject>( 'PhotonIO', {
    valueType: Photon,
    stateSchema: {
      position: Vector2.Vector2IO,
      previousPosition: Vector2.Vector2IO,
      wavelength: NumberIO,
      velocity: Vector2.Vector2IO,
      showState: StringIO
    },
    toStateObject: ( photon: Photon ) => photon.toStateObject(),
    fromStateObject: ( stateObject: PhotonStateObject ) => new Photon(
      Vector2.fromStateObject( stateObject.position ),
      stateObject.wavelength, {
        initialVelocity: Vector2.fromStateObject( stateObject.velocity ),
        showState: EnumerationIO( ShowState ).fromStateObject( stateObject.showState )
      }
    )
  } );
}

export type PhotonStateObject = {
  position: Vector2StateObject;
  previousPosition: Vector2StateObject;
  wavelength: number;
  velocity: Vector2StateObject;
  showState: string;
};

greenhouseEffect.register( 'Photon', Photon );
export { ShowState };
export default Photon;
