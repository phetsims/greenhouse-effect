// Copyright 2021-2023, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TModel from '../../../../joist/js/TModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
export type GreenhouseEffectModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

class GreenhouseEffectModel extends PhetioObject implements TModel {
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly isPlayingProperty: BooleanProperty;

  protected constructor( providedOptions?: GreenhouseEffectModelOptions ) {

    const options = optionize<GreenhouseEffectModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // By default, this is not stateful, but note that some subtypes such as WavesModel override this and specify a
      // phetioType.
      phetioState: false,

      // To date there hasn't been a need to dispose instances of this class, so disposal is currently unsupported.
      isDisposable: false

    }, providedOptions );

    super( options );

    // playing speed for the model
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: options.tandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true
    } );

    // controls whether the model is stepping through time or paused
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );
  }

  /**
   * Step the model forward by the provided time.  This is intended to be overridden in descendent classes.  Using a
   * separate method versus the `step` function allows there to be some common functionality for stepping in the base
   * class.
   * @param dt - delta time, in seconds
   */
  public stepModel( dt: number ): void {

    // does nothing in base class
  }

  /**
   * Step the simulation, called by the PhET framework.  Descendent classes should generally leave this method as is
   * (i.e. don't override it) and override stepModel to implement their time-based behaviors.
   * @param dt - delta time, in seconds
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