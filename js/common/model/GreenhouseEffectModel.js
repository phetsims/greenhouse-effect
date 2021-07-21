// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import FluxMeter from './FluxMeter.js';

class GreenhouseEffectModel {

  /**
   * @param {Tandem} tandem
   * @param options
   */
  constructor( tandem, options ) {

    // @public {NumberProperty} - playing speed for the model
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    // @public {BooleanProperty} - controls whether the model is stepping through time or paused
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public {BooleanProperty} - whether or not the flux meter is visible
    this.fluxMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'fluxMeterVisibleProperty' )
    } );

    // @public {BooleanProperty} - whether or not the "Energy Balance" display is visible
    this.energyBalanceVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'energyBalanceVisibleProperty' )
    } );

    // @private - model component for the FluxMeter
    this.fluxMeter = new FluxMeter( tandem.createTandem( 'fluxMeter' ) );
  }

  /**
   * Step the model forward by the provided time.
   * @protected
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt ) {
    throw new Error( 'Implement stepModel in subclass of GreenhouseEffectModel' );
  }

  /**
   * Step the simulation, called by Joist framework.
   *
   * @public
   * @param {number} dt - in seconds
   */
  step( dt ) {
    if ( this.isPlayingProperty.value ) {
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
    this.allPhotonsVisibleProperty.reset();
    this.fluxMeterVisibleProperty.reset();
    this.energyBalanceVisibleProperty.reset();
  }
}

greenhouseEffect.register( 'GreenhouseEffectModel', GreenhouseEffectModel );
export default GreenhouseEffectModel;