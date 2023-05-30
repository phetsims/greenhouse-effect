// Copyright 2021-2023, University of Colorado Boulder

/**
 * EMWaveSource produces simulated waves of electromagnetic energy.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import InfiniteNumberIO from '../../../../tandem/js/types/InfiniteNumberIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO, { MapStateObject } from '../../../../tandem/js/types/MapIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import GreenhouseEffectQueryParameters from '../../common/GreenhouseEffectQueryParameters.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave, { WaveCreatorArguments } from './Wave.js';
import WaveSourceSpec from './WaveSourceSpec.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

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
      countdown: this.countdown,
      propagationDirection: Vector2.Vector2IO.toStateObject( this.propagationDirection ),
      originX: this.originX
    };
  }

  public static readonly WaveCreationSpecIO = new IOType<WaveCreationSpec, WaveCreationSpecStateObject>( 'WaveCreationSpecIO', {
    valueType: WaveCreationSpec,
    stateSchema: {
      countdown: NumberIO,
      propagationDirection: Vector2.Vector2IO,
      originX: NumberIO
    },
    toStateObject: ( waveCreationSpec: WaveCreationSpec ) => waveCreationSpec.toStateObject(),
    fromStateObject: ( stateObject: WaveCreationSpecStateObject ) => new WaveCreationSpec(
      stateObject.originX,
      Vector2.Vector2IO.fromStateObject( stateObject.propagationDirection ),
      stateObject.countdown
    )
  } );
}

type WaveCreationSpecStateObject = {
  countdown: number;
  propagationDirection: Vector2StateObject;
  originX: number;
};

type SelfOptions = {

  // A property that indicates what the produced wave intensity should be.  A Property for this will be created if none
  // is provided.
  waveIntensityProperty?: null | TReadOnlyProperty<number>;

  // time between waves, in seconds
  interWaveTime?: number;

  // range of lifetimes for this wave, in seconds
  waveLifetimeRange?: Range;
};
export type EMWaveSourceOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

class EMWaveSource extends PhetioObject {

  // altitude from which waves originate
  public readonly waveStartAltitude: number;

  // controls whether waves should be produced
  private readonly waveIntensityProperty: TReadOnlyProperty<number>;

  // map of waves produced by this wave source to their lifetimes
  private wavesToLifetimesMap: Map<Wave, number>;

  // queue of waves that are queued for creation
  private waveCreationQueue: WaveCreationSpec[];

  // other information necessary for the methods to do their thing
  private readonly waveProductionEnabledProperty: TReadOnlyProperty<boolean>;
  private readonly waveGroup: PhetioGroup<Wave, WaveCreatorArguments>;
  private readonly wavelength: number;
  private readonly waveEndAltitude: number;
  private readonly waveSourceSpecs: WaveSourceSpec[];
  private readonly interWaveTime: number;
  private readonly waveLifetimeRange: Range;

  /**
   * @param waveGroup
   * @param waveProductionEnabledProperty
   * @param wavelength - wavelength of waves to produce, in meters
   * @param waveStartAltitude - altitude from which waves will originate, it meters
   * @param waveEndAltitude - altitude at which the waves will terminate, it meters
   * @param waveSourceSpecs - specifications that define where the waves will be created
   * @param [providedOptions]
   */
  public constructor( waveGroup: PhetioGroup<Wave, WaveCreatorArguments>,
                      waveProductionEnabledProperty: TReadOnlyProperty<boolean>,
                      wavelength: number,
                      waveStartAltitude: number,
                      waveEndAltitude: number,
                      waveSourceSpecs: WaveSourceSpec[],
                      providedOptions?: EMWaveSourceOptions ) {

    const options = optionize<EMWaveSourceOptions, SelfOptions, PhetioObjectOptions>()( {
      waveIntensityProperty: null,
      interWaveTime: 0.75,
      waveLifetimeRange: new Range( 10, 15 ),
      phetioType: EMWaveSource.EMWaveSourceIO
    }, providedOptions );

    super( options );

    // If no wave intensity Property was provided, create one, and assume max intensity.
    this.waveIntensityProperty = options.waveIntensityProperty || new NumberProperty( 1 );

    // Initialize other attributes of this wave source.
    this.waveStartAltitude = waveStartAltitude;
    this.waveProductionEnabledProperty = waveProductionEnabledProperty;
    this.waveGroup = waveGroup;
    this.wavelength = wavelength;
    this.waveEndAltitude = waveEndAltitude;
    this.waveSourceSpecs = waveSourceSpecs;
    this.interWaveTime = options.interWaveTime!;
    this.waveLifetimeRange = options.waveLifetimeRange!;
    this.wavesToLifetimesMap = new Map();
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
        wave.isSourced && waveSourceSpec.xPosition === wave.origin.x &&
        wave.origin.y === this.waveStartAltitude
      );

      // See whether there is a wave that is queued for creation that matches these parameters.
      const waveIsQueued = this.waveCreationQueue.reduce( ( previousValue, queuedWaveSpec ) =>
          previousValue || queuedWaveSpec.propagationDirection.equals( waveSourceSpec.propagationDirection ) &&
          queuedWaveSpec.originX === waveSourceSpec.xPosition,
        false
      );

      // If the wave doesn't exist yet and isn't queued for creation, but SHOULD exist, create it.
      if ( !matchingWave && !waveIsQueued && this.waveProductionEnabledProperty.value ) {
        this.addWaveToModel( waveSourceSpec.xPosition, waveSourceSpec.propagationDirection );
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

            // Queue up a wave for creation after the spacing time.
            this.waveCreationQueue.push( new WaveCreationSpec(
              waveSourceSpec.xPosition,
              waveSourceSpec.propagationDirection,
              this.interWaveTime
            ) );
          }
        }

        if ( matchingWave.getIntensityAtDistance( 0 ) !== waveIntensity ) {

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
      {
        intensityAtStart: this.waveIntensityProperty.value
      }
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
      wavesToLifetimesMap: MapIO( ReferenceIO( Wave.WaveIO ), InfiniteNumberIO ).toStateObject( this.wavesToLifetimesMap ),
      waveCreationQueue: ArrayIO( WaveCreationSpec.WaveCreationSpecIO ).toStateObject( this.waveCreationQueue )
    };
  }

  public applyState( stateObject: EMWaveSourceStateObject ): void {
    this.wavesToLifetimesMap = MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ).fromStateObject(
      stateObject.wavesToLifetimesMap
    );
    this.waveCreationQueue = ArrayIO( WaveCreationSpec.WaveCreationSpecIO ).fromStateObject(
      stateObject.waveCreationQueue
    );
  }

  /**
   * EMWaveSourceIO handles PhET-iO serialization of the EMWaveSource. Because serialization involves accessing private
   * members, it delegates to EMWaveSource. The methods that EMWaveSourceIO overrides are typical of 'Dynamic element
   * serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly EMWaveSourceIO = new IOType<EMWaveSource, EMWaveSourceStateObject>( 'EMWaveSourceIO', {
    valueType: EMWaveSource,
    stateSchema: {
      wavesToLifetimesMap: MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ),
      waveCreationQueue: ArrayIO( WaveCreationSpec.WaveCreationSpecIO )
    },
    applyState: ( emWaveSource: EMWaveSource, stateObject: EMWaveSourceStateObject ) => emWaveSource.applyState( stateObject
    ),
    toStateObject: ( emWaveSource: EMWaveSource ) => emWaveSource.toStateObject(),
    defaultDeserializationMethod: 'applyState'
  } );
}

export type EMWaveSourceStateObject = {
  wavesToLifetimesMap: MapStateObject<ReferenceIOState, number>;
  waveCreationQueue: WaveCreationSpecStateObject[];
};

greenhouseEffect.register( 'EMWaveSource', EMWaveSource );
export default EMWaveSource;