// Copyright 2021-2022, University of Colorado Boulder

/**
 * EMWaveSource produces simulated waves of electromagnetic energy.
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO, { MapStateObject } from '../../../../tandem/js/types/MapIO.js';
import NumberIO, { NumberStateObject } from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import GreenhouseEffectQueryParameters from '../../common/GreenhouseEffectQueryParameters.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave, { WaveOptions } from './Wave.js';
import WaveSourceSpec from './WaveSourceSpec.js';

// constants
const WAVE_GAPS_ENABLED = GreenhouseEffectQueryParameters.waveGapsEnabled;

/**
 * simple inner class for amalgamating the information needed to space out the waves
 */
class WaveCreationSpec {
  public countdown: number;
  public readonly propagationDirection: Vector2;
  public readonly originX: number;

  public constructor( originX: number, propagationDirection: Vector2, timeToCreation: number ) {
    this.countdown = timeToCreation;
    this.propagationDirection = propagationDirection;
    this.originX = originX;
  }

  public toStateObject(): WaveCreationSpecStateObject {
    return {
      countdown: NumberIO.toStateObject( this.countdown ),
      propagationDirection: Vector2.Vector2IO.toStateObject( this.propagationDirection ),
      originX: NumberIO.toStateObject( this.originX )
    };
  }

  public static fromStateObject( stateObject: WaveCreationSpecStateObject ): WaveCreationSpec {
    return new WaveCreationSpec(
      NumberIO.fromStateObject( stateObject.originX ),
      Vector2.Vector2IO.fromStateObject( stateObject.propagationDirection ),
      NumberIO.fromStateObject( stateObject.countdown )
    );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static get STATE_SCHEMA(): Record<string, IOType> {
    return {
      countdown: NumberIO,
      propagationDirection: Vector2.Vector2IO,
      originX: NumberIO
    };
  }

  public static WaveCreationSpecIO = IOType.fromCoreType( 'WaveCreationSpecIO', WaveCreationSpec );
}

type WaveCreationSpecStateObject = {
  countdown: NumberStateObject;
  propagationDirection: Vector2StateObject;
  originX: NumberStateObject;
};

type SelfOptions = {

  // A property that indicates what the produced wave intensity should be.  A Property for this will be created if none
  // is provided.
  waveIntensityProperty?: null | IReadOnlyProperty<number>;

  // time between waves, in seconds
  interWaveTime?: number;

  // range of lifetimes for this wave, in seconds
  waveLifetimeRange?: Range;
};
export type EMWaveSourceOptions = SelfOptions & PhetioObjectOptions;

class EMWaveSource extends PhetioObject {
  public readonly waveStartAltitude: number;
  private readonly waveIntensityProperty: IReadOnlyProperty<number>;
  private readonly waveProductionEnabledProperty: IReadOnlyProperty<boolean>;
  private readonly waveGroup: PhetioGroup<Wave, [ number, Vector2, Vector2, number, WaveOptions ]>;
  private readonly wavelength: number;
  private readonly waveEndAltitude: number;
  private readonly waveSourceSpecs: WaveSourceSpec[];
  private readonly interWaveTime: number;
  private readonly waveLifetimeRange: Range;
  private wavesToLifetimesMap: Map<Wave, number>;
  private waveCreationQueue: WaveCreationSpec[];

  /**
   * @param waveGroup
   * @param waveProductionEnabledProperty
   * @param wavelength - wavelength of waves to produce, in meters
   * @param waveStartAltitude - altitude from which waves will originate, it meters
   * @param waveEndAltitude - altitude at which the waves will terminate, it meters
   * @param waveSourceSpecs - specifications that define where the waves will be created
   * @param [providedOptions]
   */
  public constructor( waveGroup: PhetioGroup<Wave, [ number, Vector2, Vector2, number, WaveOptions ]>,
                      waveProductionEnabledProperty: IReadOnlyProperty<boolean>,
                      wavelength: number,
                      waveStartAltitude: number,
                      waveEndAltitude: number,
                      waveSourceSpecs: WaveSourceSpec[],
                      providedOptions?: EMWaveSourceOptions ) {

    const options = optionize<EMWaveSourceOptions, SelfOptions, PhetioObjectOptions>()( {
      waveIntensityProperty: null,
      interWaveTime: 0.75,
      waveLifetimeRange: new Range( 10, 15 ),
      tandem: Tandem.REQUIRED,
      phetioType: EMWaveSource.EMWaveSourceIO
    }, providedOptions );

    super( options );

    // (read-only) {number} - altitude from which waves originate
    this.waveStartAltitude = waveStartAltitude;

    // Controls whether waves should be produced.  If no wave intensity Property was provided,
    // create one, and assume max intensity.
    this.waveIntensityProperty = options.waveIntensityProperty || new NumberProperty( 1 );

    // information necessary for the methods to do their thing
    this.waveProductionEnabledProperty = waveProductionEnabledProperty;
    this.waveGroup = waveGroup;
    this.wavelength = wavelength;
    this.waveEndAltitude = waveEndAltitude;
    this.waveSourceSpecs = waveSourceSpecs;
    this.interWaveTime = options.interWaveTime!;
    this.waveLifetimeRange = options.waveLifetimeRange!;

    // map of waves produced by this wave source to their lifetimes
    this.wavesToLifetimesMap = new Map();

    // queue of waves that are queued for creation
    this.waveCreationQueue = [];
  }

  /**
   * Step forward in time.
   */
  public step( dt: number ): void {

    const waveIntensity = this.waveIntensityProperty.value;

    this.waveSourceSpecs.forEach( waveSourceSpec => {

      // Look for a wave that matches these parameters in the set of all waves in the model.
      const matchingWave = this.waveGroup.find( ( wave: Wave ) =>
        wave.wavelength === this.wavelength &&
        wave.isSourced &&
        ( waveSourceSpec.minXPosition === wave.origin.x || waveSourceSpec.maxXPosition === wave.origin.x ) &&
        wave.origin.y === this.waveStartAltitude
      );

      // See whether there is a wave that is queued for creation that matches these parameters.
      const waveIsQueued = this.waveCreationQueue.reduce( ( previousValue, queuedWaveSpec ) =>
          previousValue || queuedWaveSpec.propagationDirection.equals( waveSourceSpec.propagationDirection ) &&
          ( queuedWaveSpec.originX === waveSourceSpec.minXPosition ||
          queuedWaveSpec.originX === waveSourceSpec.maxXPosition ),
        false
      );

      // If the wave doesn't exist yet and isn't queued for creation, but SHOULD exist, create it.
      if ( !matchingWave && !waveIsQueued && this.waveProductionEnabledProperty.value ) {
        const xPosition = dotRandom.nextBoolean() ? waveSourceSpec.minXPosition : waveSourceSpec.maxXPosition;
        this.addWaveToModel( xPosition, waveSourceSpec.propagationDirection );
      }

      // If the wave already exists, update it.
      else if ( matchingWave ) {

        if ( !this.waveProductionEnabledProperty.value ||
             matchingWave.existenceTime > this.wavesToLifetimesMap.get( matchingWave )! ) {

          // This wave is done being produced.  Set it to propagate on its own.
          matchingWave.isSourced = false;
          this.wavesToLifetimesMap.delete( matchingWave );

          // If wave production is enabled, queue up a new wave to replace the one that just ended.
          if ( this.waveProductionEnabledProperty.value ) {

            // Which wave source spec was the wave that just ended associated with?
            const waveSourceSpecs = this.waveSourceSpecs.filter( waveSourceSpec =>
              waveSourceSpec.minXPosition === matchingWave.origin.x ||
              waveSourceSpec.maxXPosition === matchingWave.origin.x
            );

            // Make sure only one spec matches this.  Otherwise, it means that the specifications had overlap, which this
            // class isn't designed to deal with.
            assert && assert( waveSourceSpecs.length === 1, 'there is a problem with the provided wave source specs' );
            const waveSourceSpec = waveSourceSpecs[ 0 ];

            const nextWaveOrigin = matchingWave.origin.x === waveSourceSpec.minXPosition ?
                                   waveSourceSpec.maxXPosition :
                                   waveSourceSpec.minXPosition;

            // Queue up a wave for creation after the spacing time.
            this.waveCreationQueue.push( new WaveCreationSpec(
              nextWaveOrigin,
              waveSourceSpec.propagationDirection,
              this.interWaveTime
            ) );
          }
        }

        if ( matchingWave.getIntensityAt( 0 ) !== waveIntensity ) {

          // Update the intensity.
          matchingWave.setIntensityAtStart( waveIntensity );
        }
      }
    } );

    // See if it's time to create any of the queued up waves.
    this.waveCreationQueue.forEach( waveCreationSpec => {
      waveCreationSpec.countdown -= dt;
      if ( waveCreationSpec.countdown <= 0 ) {

        // Create the wave.
        this.addWaveToModel( waveCreationSpec.originX, waveCreationSpec.propagationDirection );
      }
    } );

    // Remove any expired wave creation specs.
    this.waveCreationQueue = this.waveCreationQueue.filter( waveSpec => waveSpec.countdown > 0 );
  }

  private addWaveToModel( originX: number, propagationDirection: Vector2 ): void {
    const newIRWave = this.waveGroup.createNextElement(
      this.wavelength,
      new Vector2( originX, this.waveStartAltitude ),
      propagationDirection,
      this.waveEndAltitude,
      { intensityAtStart: this.waveIntensityProperty.value }
    );

    // If wave gaps are enabled, the newly created wave should have a limited lifetime, after which a new wave with the
    // same parameters will be created nearby.  If gaps aren't enabled, the lifetime is set to infinity, and the wave
    // will only go away when the source stops producing it.
    let waveLifetime;
    if ( WAVE_GAPS_ENABLED ) {
      waveLifetime = dotRandom.nextDoubleBetween( this.waveLifetimeRange.min, this.waveLifetimeRange.max );
    }
    else {
      waveLifetime = Number.POSITIVE_INFINITY;
    }
    this.wavesToLifetimesMap.set( newIRWave, waveLifetime );
  }

  /**
   * Reset the wave source.
   */
  public reset(): void {
    this.wavesToLifetimesMap.clear();
    this.waveCreationQueue.length = 0;
  }

  public toStateObject(): EMWaveSourceStateObject {
    return {
      wavesToLifetimesMap: MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ).toStateObject( this.wavesToLifetimesMap ),
      waveCreationQueue: ArrayIO( WaveCreationSpec.WaveCreationSpecIO ).toStateObject( this.waveCreationQueue )
    };
  }

  public applyState( stateObject: EMWaveSourceStateObject ): void {
    this.wavesToLifetimesMap = MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ).fromStateObject( stateObject.wavesToLifetimesMap );
    this.waveCreationQueue = ArrayIO( WaveCreationSpec.WaveCreationSpecIO ).fromStateObject( stateObject.waveCreationQueue );
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   */
  public static get STATE_SCHEMA(): Record<string, IOType> {
    return {
      wavesToLifetimesMap: MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ),
      waveCreationQueue: ArrayIO( WaveCreationSpec.WaveCreationSpecIO )
    };
  }

  /**
   * EMWaveSourceIO handles PhET-iO serialization of the EMWaveSource. Because serialization involves accessing private
   * members, it delegates to EMWaveSource. The methods that EMWaveSourceIO overrides are typical of 'Dynamic element
   * serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static EMWaveSourceIO = IOType.fromCoreType<EMWaveSource, EMWaveSourceStateObject>( 'EMWaveSourceIO', EMWaveSource );
}

export type EMWaveSourceStateObject = {
  wavesToLifetimesMap: MapStateObject<ReferenceIOState, number>;
  waveCreationQueue: WaveCreationSpecStateObject[];
};

greenhouseEffect.register( 'EMWaveSource', EMWaveSource );
export default EMWaveSource;