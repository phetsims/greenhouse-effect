// Copyright 2021, University of Colorado Boulder

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
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type GreenhouseEffectModelOptions = Partial<PhetioObjectOptions>;

class GreenhouseEffectModel extends PhetioObject {
  readonly timeSpeedProperty: EnumerationProperty;
  readonly isPlayingProperty: BooleanProperty;

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

    // @public {NumberProperty} - playing speed for the model
    // @ts-ignore
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL, {
      // @ts-ignore
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    // @public {BooleanProperty} - controls whether the model is stepping through time or paused
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' )
    } );
  }

  /**
   * Step the model forward by the provided time.
   * @protected
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt: number ) {
    throw new Error( 'Implement stepModel in subclass of GreenhouseEffectModel' );
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