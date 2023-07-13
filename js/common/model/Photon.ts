// Copyright 2021-2023, University of Colorado Boulder

/**
 * Photon is a model of a simple photon with the attributes needed by the Greenhouse Effect simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';

// constants
const PHOTON_SPEED = GreenhouseEffectConstants.SPEED_OF_LIGHT;

// TODO - These should be consolidated with the molecules-and-light code, see https://github.com/phetsims/greenhouse-effect/issues/19
const IR_WAVELENGTH = GreenhouseEffectConstants.INFRARED_WAVELENGTH;
const VISIBLE_WAVELENGTH = GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
const SUPPORTED_WAVELENGTHS = [ IR_WAVELENGTH, VISIBLE_WAVELENGTH ];

// types and enumerations
class ShowState extends EnumerationValue {
  public static readonly ALWAYS = new ShowState();
  public static readonly ONLY_IN_MORE_PHOTONS_MODE = new ShowState();

  public static readonly enumeration = new Enumeration( ShowState );
}

export type PhotonOptions = {

  // initial velocity of the photon, will be created if not supplied
  initialVelocity?: Vector2 | null;

  // previous position of the photon, will be created if not supplied
  previousPosition?: Vector2 | null;

  // whether this photon should always be shown in the view or only in "more photons" mode
  showState?: ShowState;
};

class Photon {

  // position in model space in meters
  public readonly positionProperty: TProperty<Vector2>;

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
      showState: ShowState.ALWAYS,
      previousPosition: null
    }, providedOptions );

    assert && assert( SUPPORTED_WAVELENGTHS.includes( wavelength ), 'unsupported wavelength' );

    // Create the internal data.  There are no tandems set here because photon uses data-type serialization, so no
    // references are stored within phet-io.
    this.positionProperty = new TinyProperty<Vector2>( initialPosition );
    this.wavelength = wavelength;
    this.previousPosition = options.previousPosition || new Vector2( initialPosition.x, initialPosition.y );
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

  // Setters and getters needed for phet-io.
  public set position( position: Vector2 ) {
    this.positionProperty.set( position );
  }

  public get position(): Vector2 {
    return this.positionProperty.get();
  }

  // static values
  public static readonly IR_WAVELENGTH = IR_WAVELENGTH;
  public static readonly VISIBLE_WAVELENGTH = VISIBLE_WAVELENGTH;
  public static readonly SPEED = PHOTON_SPEED;
  public static readonly ShowState = ShowState;

  // IOType for data-type serialization.  This type of serialization is used because we don't need to provide
  // information on photons, or the ability to directly manipulate them individually, to phet-io users.  This also has
  // higher performance versus having every photon individually instrumented as a phet-io object.
  public static readonly PhotonIO = new IOType<Photon, PhotonStateObject>( 'PhotonIO', {
    valueType: Photon,
    stateSchema: {
      position: Vector2.Vector2IO,
      previousPosition: Vector2.Vector2IO,
      wavelength: NumberIO,
      velocity: Vector2.Vector2IO,
      showState: EnumerationIO( ShowState )
    },
    fromStateObject: ( stateObject: PhotonStateObject ) => new Photon(
      Vector2.fromStateObject( stateObject.position ),
      stateObject.wavelength, {
        previousPosition: Vector2.fromStateObject( stateObject.previousPosition ),
        initialVelocity: Vector2.fromStateObject( stateObject.velocity ),
        showState: EnumerationIO( ShowState ).fromStateObject( stateObject.showState )
      }
    )
  } );

  // Photons are lightweight and should not need to be disposed.
  public dispose(): void {
    Disposable.assertNotDisposable();
  }
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
