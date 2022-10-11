// Copyright 2020-2022, University of Colorado Boulder

/**
 * The Wave class represents a wave of light in the model.  Light waves are modeled as single lines with a start point
 * and information about the direction of travel.  They propagate through model space over time.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO, { MapStateObject } from '../../../../tandem/js/types/MapIO.js';
import NumberIO, { NumberStateObject } from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WaveAttenuator, { WaveAttenuatorStateObject } from './WaveAttenuator.js';
import WaveIntensityChange, { WaveIntensityChangeStateObject } from './WaveIntensityChange.js';
import WavesModel from './WavesModel.js';

// constants
const TWO_PI = 2 * Math.PI;
const PHASE_RATE = -Math.PI; // in radians per second

// The minimum distance between two intensity changes on the wave.  This is used to prevent having too many too close
// together, which was found to cause rendering issues.  The value was determined through trial and error.
const MINIMUM_INTER_INTENSITY_CHANGE_DISTANCE = 500;

// The minimum change necessary to warrant adding an intensity change to the wave at its source or at an attenuator.
const MINIMUM_INTENSITY_CHANGE = 0.05;

// This value is used when creating or updating intensity changes in a way that could cause them to end up on top of one
// another.  We generally don't want that to happen, so we "bump" one of them down the wave.  This value is in meters
// and is intended to be small enough to be unnoticeable when rendering.
const INTENSITY_CHANGE_DISTANCE_BUMP = 2;

type SelfOptions = {

  // the intensity of this wave from its start point, range is 0 (no intensity) to 1 (max intensity)
  intensityAtStart?: number;

  // initial phase offset, in radians
  initialPhaseOffset?: number;

  // a string that can be stuck on the object, useful for debugging, see usage
  debugTag?: string | null;
};
export type WaveOptions = SelfOptions & PhetioObjectOptions;

class Wave extends PhetioObject {

  // wavelength of this wave, in meters
  public readonly wavelength: number;

  // The point from which this wave originates.  This is immutable over the lifetime of a wave, and is distinct from the
  // start point, since the start point can move as the wave propagates.
  public readonly origin: Vector2;

  // a normalized vector the defines the direction in which this wave is traveling
  public readonly propagationDirection: Vector2;

  // The starting point where the wave currently exists in model space.  This will be the same as the origin if the wave
  // is being sourced, or will move if the wave is propagating without being sourced.
  public startPoint: Vector2;

  // the altitude past which this wave should not propagate
  private readonly propagationLimit: number;

  // the length of this wave from the start point to where it ends
  public length: number;

  // the length of time that this wave has existed, in seconds
  public existenceTime: number;

  // Angle of phase offset, in radians.  This is here primarily in support of the view, but it has to be available in
  // the model in order to coordinate the appearance of reflected and stimulated waves.
  public phaseOffsetAtOrigin: number;

  // The intensity value for this wave at its starting point.  This is a normalized value which goes from anything just
  // above 0 (and intensity of 0 is meaningless, so is not allowed by the code) to a max value of 1.
  public intensityAtStart: number;

  // Changes in this wave's intensity that can exist at various locations along its length.  This list must remain
  // sorted in order of increasing distance from the start of the wave that it can be correctly rendered by the view.
  public intensityChanges: WaveIntensityChange[];

  // indicates whether this wave is coming from a sourced point (e.g. the ground) or just propagating on its own
  public isSourced: boolean;

  // the wavelength used when rendering the view for this wave
  private readonly renderingWavelength: number;

  // A Map that maps model objects to the attenuation that they are currently causing on this wave.  The model objects
  // can be essentially anything, hence the vague "PhetioObject" type spec. Examples of model objects that can cause an
  // attenuation are clouds and atmosphere layers.
  private modelObjectToAttenuatorMap: Map<PhetioObject, WaveAttenuator>;

  // a string that can be attached to this wave and is used for debugging
  private readonly debugTag: string | null;

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
                      providedOptions?: WaveOptions ) {

    const options = optionize<WaveOptions, SelfOptions, PhetioObjectOptions>()( {
      intensityAtStart: 1,
      initialPhaseOffset: 0,
      debugTag: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: Wave.WaveIO,
      phetioDynamicElement: true
    }, providedOptions );

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

    // set initial state
    this.wavelength = wavelength;
    this.origin = origin;
    this.propagationDirection = propagationDirection;
    this.propagationLimit = propagationLimit;
    this.startPoint = origin.copy();
    this.length = 0;
    this.isSourced = true;
    this.existenceTime = 0;
    this.phaseOffsetAtOrigin = options.initialPhaseOffset;
    this.intensityAtStart = options.intensityAtStart;
    this.intensityChanges = [];
    this.modelObjectToAttenuatorMap = new Map<PhetioObject, WaveAttenuator>();
    this.renderingWavelength = WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP.get( wavelength )!;
  }

  /**
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {

    const propagationDistance = GreenhouseEffectConstants.SPEED_OF_LIGHT * dt;

    // Update the length, while checking if the current change causes this wave to extend beyond its propagation
    // limit.  If so, limit the length of the wave.  Note that the propagation limit is not itself a length - it is an
    // altitude, i.e. a Y value, beyond which a wave should not travel.  This works for waves moving up or down.
    this.length = Math.min(
      this.length + propagationDistance,
      ( this.propagationLimit - this.startPoint.y ) / this.propagationDirection.y
    );

    // If there is a source producing this wave it will continue to emanate from the same origin and will get longer
    // until it reaches an endpoint. If it is not sourced, it will travel through space until it reaches an endpoint,
    // where it will shorten until it disappears.
    if ( this.isSourced ) {

      // Move the un-anchored intensity changes with the wave.
      this.intensityChanges.forEach( intensityChange => {
        if ( !intensityChange.anchoredTo ) {
          intensityChange.distanceFromStart += propagationDistance;
        }
      } );
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

      // If there are attenuators and anchored intensity changes on this wave, decrease their distance from the start
      // point, since the wave's start point has moved forward and the attenuators don't move with it.
      this.modelObjectToAttenuatorMap.forEach( attenuator => {
        attenuator.distanceFromStart -= propagationDistance;
      } );
      this.intensityChanges.forEach( intensityChange => {
        if ( intensityChange.anchoredTo ) {
          intensityChange.distanceFromStart -= propagationDistance;
        }
      } );
    }

    // Remove attenuators and associated intensity changes that are no longer on the wave because the wave has passed
    // entirely through them.
    this.modelObjectToAttenuatorMap.forEach( ( attenuator, modelElement ) => {

        if ( attenuator.distanceFromStart <= 0 ) {

          // Remove the attenuator.
          this.removeAttenuator( modelElement );

          // Set the intensity at the start to be the attenuated value.
          this.intensityAtStart = this.intensityAtStart * ( 1 - attenuator.attenuation );
        }
      }
    );

    // Adjust the intensity changes based on their relationships with the attenuators.
    this.intensityChanges.forEach( intensityChange => {

      if ( intensityChange.anchoredTo ) {
        const attenuator = this.modelObjectToAttenuatorMap.get( intensityChange.anchoredTo );

        // state checking
        assert && assert( attenuator, 'There should always be an attenuator for an anchored intensity change.' );

        const intensityAtInputToAttenuator = this.getIntensityAt( attenuator!.distanceFromStart );
        intensityChange.postChangeIntensity = intensityAtInputToAttenuator * ( 1 - attenuator!.attenuation );
      }
      else {

        // If this intensity change crossed an attenuator, its output intensity needs to be adjusted.
        const crossedAttenuator = Array.from( this.modelObjectToAttenuatorMap.values() ).find( attenuator =>
          intensityChange.distanceFromStart > attenuator.distanceFromStart &&
          intensityChange.distanceFromStart - propagationDistance < attenuator.distanceFromStart
        );

        if ( crossedAttenuator ) {
          intensityChange.postChangeIntensity = intensityChange.postChangeIntensity *
                                                ( 1 - crossedAttenuator.attenuation );
        }
      }

    } );

    // Adjust each of the intensity changes that is associated with an attenuator based on the attenuation value and
    // the intensity of the incoming wave, which could have changed since the last step.
    this.intensityChanges.filter( intensityChange => intensityChange.anchoredTo ).forEach( anchoredIntensityChange => {
      const attenuator = this.modelObjectToAttenuatorMap.get( anchoredIntensityChange.anchoredTo! );

      // state checking
      assert && assert( attenuator, 'There should always be an attenuator for an anchored intensity change.' );

      const intensityAtInputToAttenuator = this.getIntensityAt( attenuator!.distanceFromStart );
      anchoredIntensityChange.postChangeIntensity = intensityAtInputToAttenuator * ( 1 - attenuator!.attenuation );
    } );

    // Remove any intensity changes that are now off of the wave.
    this.intensityChanges = this.intensityChanges.filter(
      intensityChange => intensityChange.distanceFromStart < this.length
    );

    // Sort the intensity changes.  This is necessary for correct rendering in the view.
    this.sortIntensityChanges();

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

    // Move through the intensity changes and find the last one before the specified distance.  This will provide the
    // intensity value needed.  This is set up to NOT include any intensity changes at the exact provided distance.
    // In other words, intensity changes only take effect AFTER their position, not exactly AT their position.  Also
    // note that this algorithm assumes the intensity changes are ordered by their distance from the waves starting
    // point.
    for ( let i = 0; i < this.intensityChanges.length; i++ ) {
      const intensityChange = this.intensityChanges[ i ];
      if ( intensityChange.distanceFromStart < distanceFromStart ) {
        intensity = intensityChange.postChangeIntensity;
      }
      else {

        // We're done.
        break;
      }
    }
    return intensity;
  }

  /**
   * Set the intensity at the start of the wave.
   * @param intensity - a normalized intensity value
   */
  public setIntensityAtStart( intensity: number ): void {

    // parameter checking
    assert && assert( intensity > 0 && intensity <= 1, 'illegal intensity value' );

    // Only pay attention to this request to set the intensity if it is a significant enough change.  This helps to
    // prevent having an excess of intensity changes on the wave, which was found to cause rendering problems, both in
    // appearance and performance.  Small changes are quietly ignored.
    if ( Math.abs( this.intensityAtStart - intensity ) >= MINIMUM_INTENSITY_CHANGE ) {

      // See if there is an intensity change within the max distance for consolidation.
      const firstIntensityChange = this.intensityChanges[ 0 ];
      if ( firstIntensityChange && firstIntensityChange.distanceFromStart < MINIMUM_INTER_INTENSITY_CHANGE_DISTANCE ) {

        // Use this intensity change instead of creating a new one.  This helps to prevent there from being too many
        // intensity changes on the wave, which can cause rendering issues.
        firstIntensityChange.postChangeIntensity = this.intensityAtStart;
      }
      else {

        // Create a new intensity wave to depict the change in intensity traveling with the wave.
        this.intensityChanges.push( new WaveIntensityChange( this.intensityAtStart, INTENSITY_CHANGE_DISTANCE_BUMP ) );
      }

      // Set the new intensity value at the start.
      this.intensityAtStart = intensity;
    }
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
      'this wave already has this attenuator'
    );

    // Create and add the new attenuator.
    this.modelObjectToAttenuatorMap.set(
      causalModelElement,
      new WaveAttenuator( attenuationAmount, distanceFromStart )
    );

    // Create the intensity change on the wave that is caused by this new attenuator.  This will be anchored to the
    // model object that is causing the attenuation and will not propagate with the wave.
    this.intensityChanges.push( new WaveIntensityChange(
      this.getIntensityAt( distanceFromStart ) * ( 1 - attenuationAmount ),
      distanceFromStart,
      causalModelElement
    ) );

    // Create and add the intensity change that represents this wave's intensity beyond the new attenuator.  This one
    // will propagate with the wave.  We don't want this to be at the exact same distance as the intensity change that
    // will be caused by the attenuator, so put it a few meters beyond this current distance.
    this.intensityChanges.push( new WaveIntensityChange(
      this.getIntensityAt( distanceFromStart ),
      distanceFromStart + INTENSITY_CHANGE_DISTANCE_BUMP
    ) );

    // Sort the intensity changes.  This is necessary for correct rendering in the view.
    this.sortIntensityChanges();
  }

  /**
   * Remove the attenuator associated with the provided model element.
   */
  public removeAttenuator( causalModelElement: PhetioObject ): void {

    assert && assert(
      this.modelObjectToAttenuatorMap.has( causalModelElement ),
      'no attenuator exists for the provided model element'
    );

    const attenuator = this.modelObjectToAttenuatorMap.get( causalModelElement );

    // Remove the attenuator from the map.
    this.modelObjectToAttenuatorMap.delete( causalModelElement );

    // Get the intensity change object associated with this attenuator.
    const associatedIntensityChange = this.intensityChanges.find(
      intensityChange => intensityChange.anchoredTo === causalModelElement
    );
    assert && assert( associatedIntensityChange, 'no intensity change found for this model element' );

    // If the intensity change is still on the wave, free it to propagate along the wave.  If not, simply remove it.
    if ( associatedIntensityChange!.distanceFromStart > 0 && associatedIntensityChange!.distanceFromStart < this.length ) {

      // Before freeing this intensity change, make sure it is at the right value.
      associatedIntensityChange!.postChangeIntensity = this.getIntensityAt( attenuator!.distanceFromStart ) *
                                                       ( 1 - attenuator!.attenuation );

      // Fly! Be free!
      associatedIntensityChange!.anchoredTo = null;
    }
    else {

      // Remove this intensity change.
      const index = this.intensityChanges.indexOf( associatedIntensityChange! );
      if ( index > -1 ) {
        this.intensityChanges.splice( index, 1 );
      }
    }
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

    // Get the attenuator.
    const attenuator = this.modelObjectToAttenuatorMap.get( modelElement );

    // Only make changes to the wave if the attenuation value is above a threshold.  This helps to prevent too many
    // intensity changes from being on the wave, which can cause issues with the rendering, both in terms of appearance
    // and performance.
    if ( attenuator && Math.abs( attenuator.attenuation - attenuation ) >= MINIMUM_INTENSITY_CHANGE ) {

      // Update the attenuation value.
      attenuator.attenuation = attenuation;

      // Get the intensity change currently associated with this attenuator.
      const associatedIntensityChange = this.intensityChanges.find(
        intensityChange => intensityChange.anchoredTo === modelElement
      );
      assert && assert( associatedIntensityChange, 'no intensity change found for this model element' );

      // Find the first intensity change that is on the wave after this attenuator.
      const nextIntensityChange = this.intensityChanges.find(
        intensityChange => intensityChange.distanceFromStart > attenuator.distanceFromStart
      );

      // If the next intensity change is close enough, don't bother adding another one.  This will help to prevent there
      // from being too many on the wave, since having too many can cause rendering challenges.
      if ( !nextIntensityChange ||
           nextIntensityChange.distanceFromStart - associatedIntensityChange!.distanceFromStart > MINIMUM_INTER_INTENSITY_CHANGE_DISTANCE ) {

        // A new intensity change will be need to represent this change to the attenuation. Free the intensity change
        // currently associated with this attenuator to propagate with the wave, since it already has the correct
        // intensity at its output.
        associatedIntensityChange!.anchoredTo = null;

        // Bump this intensity change down the wave a bit so that it won't be on top of the one that is about to be created.
        associatedIntensityChange!.distanceFromStart += INTENSITY_CHANGE_DISTANCE_BUMP;

        // Add a new intensity change that is anchored to the model element and is based on the new attenuation value.
        this.intensityChanges.push( new WaveIntensityChange(
          this.getIntensityAt( attenuator.distanceFromStart ) * ( 1 - attenuator.attenuation ),
          attenuator.distanceFromStart,
          modelElement
        ) );
      }
      else {

        // Update the existing intensity change based on the new attenuation value.
        associatedIntensityChange!.postChangeIntensity = this.getIntensityAt( attenuator.distanceFromStart ) *
                                                         ( 1 - attenuator.attenuation );
      }

      // Make sure the intensity changes are in the required order.
      this.sortIntensityChanges();
    }
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
  public toStateObject(): WaveStateObject {
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
      intensityChanges: ArrayIO( WaveIntensityChange.WaveIntensityChangeIO ).toStateObject( this.intensityChanges ),
      modelObjectToAttenuatorMap: MapIO(
        ReferenceIO( IOType.ObjectIO ),
        WaveAttenuator.WaveAttenuatorIO ).toStateObject( this.modelObjectToAttenuatorMap
      ),
      renderingWavelength: NumberIO.toStateObject( this.renderingWavelength )
    };
  }

  /**
   * Apply the dynamic (non-immutable) portion of the wave state to this instance.
   */
  public applyState( stateObject: WaveStateObject ): void {
    this.length = NumberIO.fromStateObject( stateObject.length );
    this.isSourced = BooleanIO.fromStateObject( stateObject.isSourced );
    this.startPoint = Vector2.Vector2IO.fromStateObject( stateObject.startPoint );
    this.existenceTime = NumberIO.fromStateObject( stateObject.existenceTime );
    this.phaseOffsetAtOrigin = NumberIO.fromStateObject( stateObject.phaseOffsetAtOrigin );
    this.intensityAtStart = NumberIO.fromStateObject( stateObject.intensityAtStart );
    this.intensityChanges = ArrayIO( WaveIntensityChange.WaveIntensityChangeIO ).fromStateObject(
      stateObject.intensityChanges
    );
    this.modelObjectToAttenuatorMap = MapIO(
      ReferenceIO( IOType.ObjectIO ),
      WaveAttenuator.WaveAttenuatorIO
    ).fromStateObject( stateObject.modelObjectToAttenuatorMap );
  }

  /**
   * Make sure the intensity changes are ordered from closest to furthest from the start point of the wave.
   */
  private sortIntensityChanges(): void {
    if ( this.intensityChanges.length > 1 ) {
      this.intensityChanges.sort( ( a, b ) => a.distanceFromStart - b.distanceFromStart );
    }
  }

  /**
   * WaveIO handles PhET-iO serialization of Wave. Because serialization involves accessing private members,
   * it delegates to Wave. The methods that WaveIO overrides are typical of 'Dynamic element serialization',
   * as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static WaveIO = new IOType<Wave, WaveStateObject>( 'WaveIO', {
    valueType: Wave,
    stateSchema: {
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
      intensityChanges: ArrayIO( WaveIntensityChange.WaveIntensityChangeIO ),
      renderingWavelength: NumberIO,
      modelObjectToAttenuatorMap: MapIO( ReferenceIO( IOType.ObjectIO ), WaveAttenuator.WaveAttenuatorIO )
    },
    toStateObject: ( wave: Wave ) => wave.toStateObject(),
    applyState: ( wave: Wave, stateObject: WaveStateObject ) => wave.applyState( stateObject ),
    stateToArgsForConstructor: ( state: WaveStateObject ) => [
      NumberIO.fromStateObject( state.wavelength ),
      Vector2.Vector2IO.fromStateObject( state.origin ),
      Vector2.Vector2IO.fromStateObject( state.propagationDirection ),
      NumberIO.fromStateObject( state.propagationLimit ),
      {
        intensityAtStart: NumberIO.fromStateObject( state.intensityAtStart ),
        initialPhaseOffset: NumberIO.fromStateObject( state.phaseOffsetAtOrigin )
      }
    ]
  } );
}

type WaveStateObject = {
  wavelength: NumberStateObject;
  origin: Vector2StateObject;
  propagationDirection: Vector2StateObject;
  propagationLimit: NumberStateObject;
  startPoint: Vector2StateObject;
  length: NumberStateObject;
  isSourced: boolean;
  existenceTime: NumberStateObject;
  phaseOffsetAtOrigin: NumberStateObject;
  intensityAtStart: NumberStateObject;
  intensityChanges: WaveIntensityChangeStateObject[];
  modelObjectToAttenuatorMap: MapStateObject<ReferenceIOState, WaveAttenuatorStateObject>;
  renderingWavelength: NumberStateObject;
};

greenhouseEffect.register( 'Wave', Wave );
export default Wave;