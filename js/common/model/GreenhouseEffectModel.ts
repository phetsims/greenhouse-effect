// Copyright 2021-2022, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Emitter from '../../../../axon/js/Emitter.js';

type GreenhouseEffectModelOptions = PhetioObjectOptions;

class GreenhouseEffectModel extends PhetioObject {
  public readonly timeSpeedProperty: EnumerationDeprecatedProperty;
  public readonly isPlayingProperty: BooleanProperty;
  public readonly steppedEmitter: Emitter<[ number ]>;

  /**
   * @param {Tandem} tandem
   * @param options
   */
  constructor( tandem: Tandem, options?: GreenhouseEffectModelOptions ) {

    options = merge( {

      // By default this is not stateful, but note that some subtypes such as WavesModel override this and specify a
      // phetioType.
      phetioState: false

    }, options );

    assert && assert( !options.tandem, 'tandem should not be supplied via options' );
    options.tandem = tandem;

    super( options );

    // playing speed for the model
    // @ts-ignore
    this.timeSpeedProperty = new EnumerationDeprecatedProperty( TimeSpeed, TimeSpeed.NORMAL, {
      // @ts-ignore
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
   * Step the model forward by the provided time.
   * @protected
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt: number ) {
    this.steppedEmitter.emit( dt );
  }

  /**
   * Step the simulation, called by Joist framework.
   *
   * @public
   * @param {number} dt - in seconds
   */
  step( dt: number ) {
    if ( this.isPlayingProperty.value ) {
      // @ts-ignore
      const timeStep = this.timeSpeedProperty.value === TimeSpeed.NORMAL ? dt : dt / 2;
      this.stepModel( timeStep );
    }
  }

  /**
   * Resets all aspects of the model.
   *
   * @public
   */
  reset() {
    this.timeSpeedProperty.reset();
    this.isPlayingProperty.reset();
  }
}

greenhouseEffect.register( 'GreenhouseEffectModel', GreenhouseEffectModel );
export default GreenhouseEffectModel;