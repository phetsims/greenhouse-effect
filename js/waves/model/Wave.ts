// Copyright 2020-2022, University of Colorado Boulder

/**
 * The Wave class represents a wave of light in the model.
 *
 * TODO: The code is written to support multiple points along the wave where its intensity can be attenuated.  However,
 *       this code is basically untested, since it hasn't been needed yet.  It will need to be tested and debugged if
 *       and when it is ever needed. See https://github.com/phetsims/greenhouse-effect/issues/52 for more information.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO from '../../../../tandem/js/types/MapIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WaveAttenuator from './WaveAttenuator.js';
import WavesModel from './WavesModel.js';

// constants
const TWO_PI = 2 * Math.PI;
const PHASE_RATE = -Math.PI; // in radians per second

export type WaveOptions = {
  intensityAtStart?: number;
  initialPhaseOffset?: number;
  debugTag?: string | null;
} & PhetioObjectOptions;

class Wave extends PhetioObject {
  private readonly debugTag: string | null;
  public readonly wavelength: number;
  public readonly origin: Vector2;
  public readonly propagationDirection: Vector2;
  public readonly startPoint: Vector2;
  private readonly propagationLimit: number;
  public length: number;
  public existenceTime: number;
  public phaseOffsetAtOrigin: number;
  public intensityAtStart: number;
  private readonly renderingWavelength: number;
  private modelObjectToAttenuatorMap: Map<PhetioObject, WaveAttenuator>;
  public isSourced: boolean;

  /**
   * @param wavelength - wavelength of this light wave, in meters
   * @param origin - the point from which the wave will originate
   * @param propagationDirection - a normalized vector (i.e. length = 1) that indicates the direction in which
   *                                         this wave is propagating
   * @param propagationLimit - the altitude beyond which this wave should not extend or travel, works in either
   *                                    direction, in meters
   * @param [providedOptions]
   */
  public constructor( wavelength: number,
                      origin: Vector2,
                      propagationDirection: Vector2,
                      propagationLimit: number,
                      providedOptions: WaveOptions ) {

    const options = merge( {

      // {number} - the intensity of this wave from its start point, range is 0 (no intensity) to 1 (max intensity)
      intensityAtStart: 1,

      // {number} - initial phase offset, in radians
      initialPhaseOffset: 0,

      // {string} - a string that can be stuck on the object, useful for debugging
      debugTag: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Wave.WaveIO,
      phetioDynamicElement: true

    }, providedOptions ) as Required<WaveOptions>;

    // options checking
    assert && assert(
    options.initialPhaseOffset >= 0 && options.initialPhaseOffset <= TWO_PI,
      'unexpected initial phase offset'
    );

    super( options );

    this.debugTag = options.debugTag;

    // parameter checking
    assert && assert( Math.abs( propagationDirection.magnitude - 1 ) < 1E-6, 'propagation vector must be normalized' );
    assert && assert( propagationDirection.y !== 0, 'fully horizontal waves are not supported' );
    assert && assert(
      Math.sign( propagationDirection.y ) === Math.sign( propagationLimit - origin.y ),
      'propagation limit does not make sense for provided propagationDirection'
    );
    assert && assert( propagationLimit !== origin.x, 'this wave has no where to go' );

    // (read-only)
    this.wavelength = wavelength;

    // The point from which this wave originates.  This is immutable over the lifetime of a wave, and it distinct
    // from the start point, since the start point can move as the wave propagates.
    this.origin = origin;

    // (read-only) {Vector2}
    this.propagationDirection = propagationDirection;

    // the altitude past which this wave should not propagate
    this.propagationLimit = propagationLimit;

    // (read-only) {Vector2} - The starting point where the wave currently exists in model space.  This will be
    // the same as the origin if the wave is being sourced, or will move if the wave is propagating without being
    // sourced.
    this.startPoint = origin.copy();

    // (read-only) {number} - the length of this wave from the start point to where it ends
    this.length = 0;

    // (read-only) {boolean} - indicates whether this wave is coming from a sourced point or just moving through
    //                                 space
    this.isSourced = true;

    // (read-only) {number} - the length of time that this wave has existed
    this.existenceTime = 0;

    // (read-only) {number} - Angle of phase offset, in radians.  This is here primarily in support of the view,
    // but it has to be available in the model in order to coordinate the appearance of reflected and stimulated waves.
    this.phaseOffsetAtOrigin = options.initialPhaseOffset;

    // (read-only) {number} - The intensity value for this wave at its starting point.  This is a normalized
    // value which goes from anything just above 0 (and intensity of 0 is meaningless, so is not allowed by the code)
    // to a max value of 1.
    this.intensityAtStart = options.intensityAtStart;

    // A Map that maps model objects to the attenuation that they are currently causing on this wave.  The model
    // objects can be essentially anything, hence the vague "Object" type spec. Examples of model objects that can
    // cause an attenuation are clouds and atmosphere layers.
    this.modelObjectToAttenuatorMap = new Map<PhetioObject, WaveAttenuator>();

    // (read-only) {number} - the wavelength used when rendering the view for this wave
    this.renderingWavelength = WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP.get( wavelength )!;
  }

  /**
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {

    const propagationDistance = GreenhouseEffectConstants.SPEED_OF_LIGHT * dt;

    // If there is a source producing this wave it should get longer and will continue to emanate from the same point.
    // If not, it stays at the same length and propagates through space.
    if ( this.isSourced ) {
      this.length += propagationDistance;
    }
    else {

      // Move the wave forward, being careful not to move the start point beyond the propagation limit.
      let dy = this.propagationDirection.y * propagationDistance;
      if ( Math.abs( dy ) > Math.abs( this.propagationLimit - this.startPoint.y ) ) {
        dy = this.propagationLimit - this.startPoint.y;
      }
      this.startPoint.addXY(
        this.propagationDirection.x * propagationDistance,
        dy
      );

      // If there are attenuators on this wave, decrease their distance from the start point, since the wave's start
      // point has moved forward and the attenuators don't move with it.
      this.modelObjectToAttenuatorMap.forEach( attenuator => {
        attenuator.distanceFromStart -= propagationDistance;
      } );
    }

    // Check if the current change causes this wave to extend beyond it's propagation limit and, if so, limit the length.
    this.length = Math.min( this.length, ( this.propagationLimit - this.startPoint.y ) / this.propagationDirection.y );

    // Remove attenuators that are no longer on the wave.
    this.modelObjectToAttenuatorMap.forEach( ( attenuator, modelElement ) => {

        if ( attenuator.distanceFromStart <= 0 ) {

          // Remove the attenuator.
          this.removeAttenuator( modelElement );

          // Set the intensity at the start to be the attenuated value.
          this.intensityAtStart = this.intensityAtStart * ( 1 - attenuator.attenuation );
        }
      }
    );

    // Update other aspects of the wave that evolve over time.
    this.phaseOffsetAtOrigin = this.phaseOffsetAtOrigin + PHASE_RATE * dt;
    if ( this.phaseOffsetAtOrigin > TWO_PI ) {
      this.phaseOffsetAtOrigin -= TWO_PI;
    }
    else if ( this.phaseOffsetAtOrigin < 0 ) {
      this.phaseOffsetAtOrigin += TWO_PI;
    }
    this.existenceTime += dt;
  }

  /**
   * Get the altitude at which this wave ends.  This can be used instead of getEndPoint when only the end altitude is
   * needed, since it doesn't allocate a vector and may thus have better performance.  This treats the wave as a line
   * and does not account for any amplitude.
   */
  public getEndAltitude(): number {
    return this.startPoint.y + this.length * this.propagationDirection.y;
  }

  /**
   * Get a vector that represents the end point of this wave.  This does not account for any amplitude of the wave, and
   * just treats it as a line between two points.  If a vector is provided, none is allocated.  This can help to reduce
   * the number of memory allocations.
   */
  public getEndPoint( vectorToUse?: Vector2 ): Vector2 {
    const endPointVector = vectorToUse || new Vector2( 0, 0 );
    endPointVector.setXY(
      this.startPoint.x + this.propagationDirection.x * this.length,
      this.startPoint.y + this.propagationDirection.y * this.length
    );
    return endPointVector;
  }

  /**
   * Get the intensity of the wave at the specified distance from the starting point.
   * @param distanceFromStart - in meters
   */
  public getIntensityAt( distanceFromStart: number ): number {
    let intensity = this.intensityAtStart;
    this.getSortedAttenuators().forEach( attenuator => {
      if ( attenuator.distanceFromStart < distanceFromStart ) {
        intensity = intensity * ( 1 - attenuator.attenuation );
      }
    } );
    return intensity;
  }

  /**
   * Set the intensity at the start of the wave.
   * @param intensity - a normalized intensity value
   */
  public setIntensityAtStart( intensity: number ): void {
    assert && assert( intensity > 0 && intensity <= 1, 'illegal intensity value' );
    this.intensityAtStart = intensity;
  }

  /**
   * @param distanceFromStart
   * @param attenuationAmount
   * @param causalModelElement - the model element that is causing this attenuation to exist
   */
  public addAttenuator( distanceFromStart: number,
                        attenuationAmount: number,
                        causalModelElement: PhetioObject ): void {

    // parameter checking
    assert && assert(
    attenuationAmount >= 0 && attenuationAmount <= 1,
      'the attenuation amount must be between zero and one'
    );

    // state checking
    assert && assert(
      !this.modelObjectToAttenuatorMap.has( causalModelElement ),
      'this model object already has an attenuator'
    );

    // Create and add the new attenuator.
    this.modelObjectToAttenuatorMap.set(
      causalModelElement,
      new WaveAttenuator( attenuationAmount, distanceFromStart )
    );
  }

  /**
   * Remove the attenuator associated with the provided model element.
   */
  public removeAttenuator( causalModelElement: PhetioObject ): void {

    assert && assert(
      this.modelObjectToAttenuatorMap.has( causalModelElement ),
      'no attenuator exists for the provided model element'
    );

    // Remove the attenuator from the map.
    this.modelObjectToAttenuatorMap.delete( causalModelElement );
  }

  /**
   * Does the provided model element have an associated attenuator on this wave?
   */
  public hasAttenuator( modelElement: PhetioObject ): boolean {
    return this.modelObjectToAttenuatorMap.has( modelElement );
  }

  /**
   * Set the attenuation value in the attenuator associated with the provided model element.
   */
  public setAttenuation( modelElement: PhetioObject, attenuation: number ): void {

    // state and parameter checking
    assert && assert( this.hasAttenuator( modelElement ), 'no attenuator is on this wave for this model element' );
    assert && assert( attenuation >= 0 && attenuation <= 1, 'invalid attenuation value' );

    // Update the attenuation value and the corresponding intensity change.
    this.modelObjectToAttenuatorMap.get( modelElement )!.attenuation = attenuation;
  }

  /**
   * true if the wave has completely propagated and has nothing else to do
   */
  public get isCompletelyPropagated(): boolean {
    return this.startPoint.y === this.propagationLimit;
  }

  /**
   * convenience method for determining whether this is a visible photon
   */
  public get isVisible() {
    return this.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH;
  }

  /**
   * convenience method for determining whether this is an infrared photon
   */
  public get isInfrared() {
    return this.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH;
  }

  /**
   * Get the wave's phase at the specified distance from the origin.
   * @param distanceFromOrigin - in meters
   */
  public getPhaseAt( distanceFromOrigin: number ): number {
    return ( this.phaseOffsetAtOrigin + ( distanceFromOrigin / this.renderingWavelength ) * TWO_PI ) % TWO_PI;
  }

  /**
   * Get a list of the attenuators that are currently on this wave sorted from closest to the start point to furthest.
   */
  public getSortedAttenuators(): WaveAttenuator[] {
    return Array.from( this.modelObjectToAttenuatorMap.values() ).sort( ( attenuator1, attenuator2 ) =>
      attenuator1.distanceFromStart - attenuator2.distanceFromStart
    );
  }

  /**
   * Serializes this Wave instance.
   */
  public toStateObject(): { wavelength: any; origin: any; propagationDirection: any; propagationLimit: any; startPoint: any; length: any; isSourced: any; existenceTime: any; phaseOffsetAtOrigin: any; intensityAtStart: any; modelObjectToAttenuatorMap: any; renderingWavelength: any } {
    return {
      wavelength: NumberIO.toStateObject( this.wavelength ),
      origin: Vector2.Vector2IO.toStateObject( this.origin ),
      propagationDirection: Vector2.Vector2IO.toStateObject( this.propagationDirection ),
      propagationLimit: NumberIO.toStateObject( this.propagationLimit ),
      startPoint: Vector2.Vector2IO.toStateObject( this.startPoint ),
      length: NumberIO.toStateObject( this.length ),
      isSourced: BooleanIO.toStateObject( this.isSourced ),
      existenceTime: NumberIO.toStateObject( this.existenceTime ),
      phaseOffsetAtOrigin: NumberIO.toStateObject( this.phaseOffsetAtOrigin ),
      intensityAtStart: NumberIO.toStateObject( this.intensityAtStart ),
      modelObjectToAttenuatorMap: MapIO(
        ReferenceIO( IOType.ObjectIO ),
        WaveAttenuator.WaveAttenuatorIO ).toStateObject( this.modelObjectToAttenuatorMap
      ),
      renderingWavelength: NumberIO.toStateObject( this.renderingWavelength )
    };
  }

  public applyState( stateObject: WaveStateObject ): void {
    // @ts-ignore - should be readonly except for applyState
    this.wavelength = NumberIO.fromStateObject( stateObject.wavelength );
    // @ts-ignore - should be readonly except for applyState
    this.origin = Vector2.Vector2IO.fromStateObject( stateObject.origin );
    // @ts-ignore - should be readonly except for applyState
    this.propagationDirection = Vector2.Vector2IO.fromStateObject( stateObject.propagationDirection );
    // @ts-ignore - should be readonly except for applyState
    this.propagationLimit = NumberIO.fromStateObject( stateObject.propagationLimit );
    // @ts-ignore - should be readonly except for applyState
    this.startPoint = Vector2.Vector2IO.fromStateObject( stateObject.startPoint );
    this.length = NumberIO.fromStateObject( stateObject.length );
    this.isSourced = BooleanIO.fromStateObject( stateObject.isSourced );
    this.existenceTime = NumberIO.fromStateObject( stateObject.existenceTime );
    this.phaseOffsetAtOrigin = NumberIO.fromStateObject( stateObject.phaseOffsetAtOrigin );
    this.intensityAtStart = NumberIO.fromStateObject( stateObject.intensityAtStart );
    this.modelObjectToAttenuatorMap = MapIO(
      ReferenceIO( IOType.ObjectIO ),
      WaveAttenuator.WaveAttenuatorIO
    ).fromStateObject( stateObject.modelObjectToAttenuatorMap );

    // @ts-ignore - should be readonly except for applyState
    this.renderingWavelength = NumberIO.fromStateObject( stateObject.renderingWavelength );
  }

  /**
   * Creates the args that WaveGroup uses to instantiate a Wave.
   */
  public static stateToArgsForConstructor( state: WaveStateObject ): any[] {
    return [
      NumberIO.fromStateObject( state.wavelength ),
      Vector2.Vector2IO.fromStateObject( state.origin ),
      Vector2.Vector2IO.fromStateObject( state.propagationDirection ),
      NumberIO.fromStateObject( state.propagationLimit ),
      {
        intensityAtStart: NumberIO.fromStateObject( state.intensityAtStart ),
        initialPhaseOffset: NumberIO.fromStateObject( state.phaseOffsetAtOrigin )
      }
    ];
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static get STATE_SCHEMA(): Record<string, IOType> {
    return {
      wavelength: NumberIO,
      origin: Vector2.Vector2IO,
      propagationDirection: Vector2.Vector2IO,
      propagationLimit: NumberIO,
      startPoint: Vector2.Vector2IO,
      length: NumberIO,
      isSourced: BooleanIO,
      existenceTime: NumberIO,
      phaseOffsetAtOrigin: NumberIO,
      intensityAtStart: NumberIO,
      renderingWavelength: NumberIO,
      modelObjectToAttenuatorMap: MapIO( ReferenceIO( IOType.ObjectIO ), WaveAttenuator.WaveAttenuatorIO )
    };
  }

  /**
   * WaveIO handles PhET-iO serialization of Wave. Because serialization involves accessing private members,
   * it delegates to Wave. The methods that WaveIO overrides are typical of 'Dynamic element serialization',
   * as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static WaveIO = IOType.fromCoreType( 'WaveIO', Wave );
}

type WaveStateObject = {
  wavelength: number;
  origin: Vector2;
  propagationDirection: Vector2;
  propagationLimit: number;
  startPoint: Vector2;
  length: number;
  isSourced: boolean;
  existenceTime: number;
  phaseOffsetAtOrigin: number;
  intensityAtStart: number;
  modelObjectToAttenuatorMap: Map<PhetioObject, WaveAttenuator>;
  renderingWavelength: number;
};

greenhouseEffect.register( 'Wave', Wave );
export default Wave;