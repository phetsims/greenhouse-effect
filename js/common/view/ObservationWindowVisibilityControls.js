// Copyright 2021, University of Colorado Boulder

/**
 * Visibility controls for components in the ObservationWindow of this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';

class ObservationWindowVisibilityControls extends Rectangle {

  /**
   * @param {BooleanProperty} energyBalanceVisibleProperty
   * @param {BooleanProperty} fluxMeterVisibleProperty
   * @param {Object} [options]
   */
  constructor( energyBalanceVisibleProperty, fluxMeterVisibleProperty, options ) {

    options = merge( {

      // fill for the rectangle surrounding controls, so controls are easier to see against
      // background artwork of the ObservationWindow
      fill: 'rgba(255,255,255,0.5)',

      // {boolean} - Should the controls include the "Energy Balance" checkbox?
      includeEnergyBalance: true,

      // {boolean} - Should the controls include the "Flux Meter" checkbox?
      includeFluxMeter: true,

      // {Object} - Options passed along to the VBox containing the controls
      vBoxOptions: {
        align: 'left',
        spacing: 5
      }
    }, options );
    assert && assert( options.vBoxOptions.children === undefined, 'ObservationWindowVisibilityControls sets children through options' );

    // add controls to children
    const children = [];
    if ( options.includeEnergyBalance ) {
      children.push( new GreenhouseEffectCheckbox( greenhouseEffectStrings.energyBalance, energyBalanceVisibleProperty, {
        helpText: greenhouseEffectStrings.a11y.energyBalance.helpText
      } ) );
    }
    if ( options.includeFluxMeter ) {
      children.push( new GreenhouseEffectCheckbox( greenhouseEffectStrings.fluxMeter.title, fluxMeterVisibleProperty ) );
    }

    // layout
    options.vBoxOptions.children = children;
    const vBox = new VBox( options.vBoxOptions );

    // surrounding Rectangle adds color so it is easier to see controls against the background
    // artwork of the ObservationWindow
    super( vBox.bounds.dilated( 5 ), 5, 5, options );
    this.addChild( vBox );
  }
}

greenhouseEffect.register( 'ObservationWindowVisibilityControls', ObservationWindowVisibilityControls );
export default ObservationWindowVisibilityControls;
