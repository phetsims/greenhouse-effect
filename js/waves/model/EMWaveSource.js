// Copyright 2021, University of Colorado Boulder

/**
 * EMWaveSource produces simulated waves of electromagnetic energy.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MapIO from '../../../../tandem/js/types/MapIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave from './Wave.js';

class EMWaveSource extends PhetioObject {

  /**
   * @param {PhetioGroup.<Wave>} waveGroup
   * @param {Property.<boolean>} waveProductionEnabledProperty
   * @param {number} wavelength - wavelength of waves to produce, in meters
   * @param {number} waveStartAltitude - altitude from which waves will originate, it meters
   * @param {number} waveEndAltitude - altitude at which the waves will terminate, it meters
   * @param {WaveSourceSpec[]} waveSourceSpecs - specifications that define where the waves will be created
   * @param {Object} [options]
   */
  constructor(
    waveGroup,
    waveProductionEnabledProperty,
    wavelength,
    waveStartAltitude,
    waveEndAltitude,
    waveSourceSpecs,
    options ) {

    options = merge( {

      // {Property.<number> - A property that indicates what the produced wave intensity should be, will be created if
      // not provided.
      waveIntensityProperty: null,

      // {number} - time between waves, in seconds
      interWaveTime: 0.75,

      // {Range.<number>} - range of lifetimes for this wave, in seconds
      waveLifetimeRange: new Range( 10, 15 ),

      tandem: Tandem.REQUIRED,
      phetioType: EMWaveSource.EMWaveSourceIO

    }, options );

    super( options );

    // @public (read-only) {number} - altitude from which waves originate
    this.waveStartAltitude = waveStartAltitude;

    // @private {Property.<number>} - Controls whether waves should be produced.  If no wave intensity Property was
    // provided, create one, and assume max intensity.
    this.waveIntensityProperty = options.waveIntensityProperty || new NumberProperty( 1 );

    // @private - information necessary for the methods to do their thing
    this.waveProductionEnabledProperty = waveProductionEnabledProperty;
    this.waveGroup = waveGroup;
    this.wavelength = wavelength;
    this.waveEndAltitude = waveEndAltitude;
    this.waveSourceSpecs = waveSourceSpecs;
    this.interWaveTime = options.interWaveTime;
    this.waveLifetimeRange = options.waveLifetimeRange;

    // @private {Map.<Wave,number>} - map of waves produced by this wave source to their lifetimes
    this.wavesToLifetimesMap = new Map();

    // @private {WaveCreationSpec[]} - queue of waves that are queued for creation
    this.waveCreationQueue = [];
  }

  /**
   * @public
   */
  step( dt ) {

    const waveIntensity = this.waveIntensityProperty.value;

    this.waveSourceSpecs.forEach( waveSourceSpec => {

      // Look for a wave that matches these parameters in the set of all waves in the model.
      const matchingWave = this.waveGroup.find( wave =>
        wave.wavelength === this.wavelength &&
        wave.isSourced &&
        ( waveSourceSpec.minXPosition === wave.origin.x || waveSourceSpec.maxXPosition === wave.origin.x ) &&
        wave.origin.y === this.waveStartAltitude
      );

      // See whether there is a wave that is queued for creation that matches these parameters.
      const waveIsQueued = this.waveCreationQueue.reduce( ( previousValue, queuedWaveSpec ) =>
        previousValue || queuedWaveSpec.directionOfTravel.equals( waveSourceSpec.directionOfTravel ) &&
        ( queuedWaveSpec.originX === waveSourceSpec.minXPosition ||
        queuedWaveSpec.originX === waveSourceSpec.maxXPosition ),
        false
      );

      // If the wave doesn't exist yet and isn't queued for creation, but SHOULD exist, create it.
      if ( !matchingWave && !waveIsQueued && this.waveProductionEnabledProperty.value ) {
        const xPosition = dotRandom.nextBoolean() ? waveSourceSpec.minXPosition : waveSourceSpec.maxXPosition;
        this.addWaveToModel( xPosition, waveSourceSpec.directionOfTravel, waveIntensity );
      }

      // If the wave already exists, update it.
      else if ( matchingWave ) {

        if ( !this.waveProductionEnabledProperty.value ||
             matchingWave.existenceTime > this.wavesToLifetimesMap.get( matchingWave ) ) {

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
              waveSourceSpec.directionOfTravel,
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
        this.addWaveToModel( waveCreationSpec.originX, waveCreationSpec.directionOfTravel, waveIntensity );
      }
    } );

    // Remove any expired wave creation specs.
    this.waveCreationQueue = this.waveCreationQueue.filter( waveSpec => waveSpec.countdown > 0 );
  }

  /**
   * @private
   */
  addWaveToModel( originX, directionOfTravel, intensity ) {
    const newIRWave = this.waveGroup.createNextElement(
      this.wavelength,
      new Vector2( originX, this.waveStartAltitude ),
      directionOfTravel,
      this.waveEndAltitude,
      { intensityAtStart: this.waveIntensityProperty.value }
    );

    this.wavesToLifetimesMap.set( newIRWave, dotRandom.nextDoubleBetween(
      this.waveLifetimeRange.min,
      this.waveLifetimeRange.max
    ) );
  }

  /**
   * @public
   */
  reset() {
    this.wavesToLifetimesMap.clear();
    this.waveCreationQueue.length = 0;
  }

  // @public
  toStateObject() {
    return {
      wavesToLifetimesMap: MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ).toStateObject( this.wavesToLifetimesMap ),
      waveCreationQueue: ArrayIO( WaveCreationSpec.WaveCreationSpecIO ).toStateObject( this.waveCreationQueue )
    };
  }

  // @public
  applyState( stateObject ) {
    this.wavesToLifetimesMap = MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ).fromStateObject( stateObject.wavesToLifetimesMap );
    this.waveCreationQueue = ArrayIO( WaveCreationSpec.WaveCreationSpecIO ).fromStateObject( stateObject.waveCreationQueue );
  }

  // public
  static get STATE_SCHEMA() {
    return {
      wavesToLifetimesMap: MapIO( ReferenceIO( Wave.WaveIO ), NumberIO ),
      waveCreationQueue: ArrayIO( WaveCreationSpec.WaveCreationSpecIO )
    };
  }
}

/**
 * simple inner class for amalgamating the information needed to space out the waves
 */
class WaveCreationSpec {

  constructor( originX, directionOfTravel, timeToCreation ) {
    this.countdown = timeToCreation;
    this.directionOfTravel = directionOfTravel;
    this.originX = originX;
  }

  // @public
  toStateObject() {
    return {
      countdown: NumberIO.toStateObject( this.countdown ),
      directionOfTravel: Vector2.Vector2IO.toStateObject( this.directionOfTravel ),
      originX: NumberIO.toStateObject( this.originX )
    };
  }

  // @public
  static fromStateObject( stateObject ) {
    return new WaveCreationSpec(
      NumberIO.fromStateObject( stateObject.originX ),
      Vector2.Vector2IO.fromStateObject( stateObject.directionOfTravel ),
      NumberIO.fromStateObject( stateObject.countdown )
    );
  }

  // @public
  static get STATE_SCHEMA() {
    return {
      countdown: NumberIO,
      directionOfTravel: Vector2.Vector2IO,
      originX: NumberIO
    };
  }
}

WaveCreationSpec.WaveCreationSpecIO = IOType.fromCoreType( 'WaveCreationSpecIO', WaveCreationSpec );

/**
 * A simple class that specifies a minimum and maximum X value for where waves will be produced and a direction of
 * travel.  This exists because the wave production occurs in pairs of X value locations, and the source shifts back
 * and forth between them in order to create some variation.
 */
class WaveSourceSpec {

  constructor( minXPosition, maxXPosition, directionOfTravel ) {
    this.minXPosition = minXPosition;
    this.maxXPosition = maxXPosition;
    this.directionOfTravel = directionOfTravel;
  }
}

/**
 * @public
 * EMWaveSourceIO handles PhET-iO serialization of the EMWaveSource. Because serialization involves accessing private
 * members, it delegates to EMWaveSource. The methods that EMWaveSourceIO overrides are typical of 'Dynamic element
 * serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
EMWaveSource.EMWaveSourceIO = IOType.fromCoreType( 'EMWaveSourceIO', EMWaveSource );

// statics
EMWaveSource.WaveSourceSpec = WaveSourceSpec;

greenhouseEffect.register( 'EMWaveSource', EMWaveSource );
export default EMWaveSource;