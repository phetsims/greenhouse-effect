// Copyright 2021-2022, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Emitter from '../../../../axon/js/Emitter.js';

type GreenhouseEffectModelOptions = PhetioObjectOptions;

class GreenhouseEffectModel extends PhetioObject {
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly isPlayingProperty: BooleanProperty;
  public readonly steppedEmitter: Emitter<[ number ]>;

  public constructor( tandem: Tandem, options?: GreenhouseEffectModelOptions ) {

    options = merge( {

      // By default this is not stateful, but note that some subtypes such as WavesModel override this and specify a
      // phetioType.
      phetioState: false

    }, options );

    assert && assert( !options.tandem, 'tandem should not be supplied via options' );
    options.tandem = tandem;

    super( options );

    // playing speed for the model
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    // controls whether the model is stepping through time or paused
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' )
    } );

    // emitter that is fired on each step, used to signal the view that an update of sprites or canvases may be needed
    this.steppedEmitter = new Emitter( { parameters: [ { valueType: 'number' } ] } );
  }

  /**
   * Step the model forward by the provided time.  Generally, external clients should call the step function instead of
   * stepModel, but there are some cases where calling this directly makes sense.
   *
   * @param dt - in seconds
   */
  public stepModel( dt: number ): void {
    this.steppedEmitter.emit( dt );
  }

  /**
   * Step the simulation, called by PhET framework.
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      const timeStep = this.timeSpeedProperty.value === TimeSpeed.NORMAL ? dt : dt / 2;
      this.stepModel( timeStep );
    }
  }

  /**
   * Reset the model to its initial state.
   */
  public reset(): void {
    this.timeSpeedProperty.reset();
    this.isPlayingProperty.reset();
  }
}

greenhouseEffect.register( 'GreenhouseEffectModel', GreenhouseEffectModel );
export default GreenhouseEffectModel;