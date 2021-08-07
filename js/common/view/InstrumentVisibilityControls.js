// Copyright 2021, University of Colorado Boulder

/**
 * Visibility controls for components in the ObservationWindow of this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';

class InstrumentVisibilityControls extends Rectangle {

  /**
   * @param {LayersModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {

      // fill for the rectangle surrounding controls, so controls are easier to see against
      // background artwork of the ObservationWindow
      fill: 'rgba(255,255,255,0.5)',

      // {Object} - Options passed along to the VBox containing the controls
      vBoxOptions: {
        align: 'left',
        spacing: 5
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );
    assert && assert( options.vBoxOptions.children === undefined, 'InstrumentVisibilityControls sets children through options' );

    // add controls to children
    const children = [];
    if ( model.energyBalanceVisibleProperty ) {
      children.push( new GreenhouseEffectCheckbox(
        greenhouseEffectStrings.energyBalance,
        model.energyBalanceVisibleProperty,
        {
          // phet-io
          tandem: options.tandem.createTandem( 'energyBalanceCheckbox' ),

          // pdom
          helpText: greenhouseEffectStrings.a11y.energyBalance.helpText
        }
      ) );
    }
    if ( model.fluxMeterVisibleProperty ) {
      children.push( new GreenhouseEffectCheckbox(
        greenhouseEffectStrings.fluxMeter.title,
        model.fluxMeterVisibleProperty,
        {
          // phet-io
          tandem: options.tandem.createTandem( 'fluxMeterCheckbox' )
        }
      ) );
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

greenhouseEffect.register( 'InstrumentVisibilityControls', InstrumentVisibilityControls );
export default InstrumentVisibilityControls;
