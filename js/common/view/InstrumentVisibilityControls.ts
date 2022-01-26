// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visibility controls for components in the observation window of this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node, PathOptions, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';
import LayersModel from '../model/LayersModel.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import Property from '../../../../axon/js/Property.js';

type InstrumentVisibilityControlsOptions = {
  vBoxOptions?: { align: string, spacing: number, children?: Node[] },
  includeFluxMeterCheckbox?: boolean
} & PathOptions;

class InstrumentVisibilityControls extends Rectangle {

  /**
   * @param {LayersModel} model
   * @param {InstrumentVisibilityControlsOptions} [providedOptions]
   */
  constructor( model: LayersModel, providedOptions?: InstrumentVisibilityControlsOptions ) {

    const options = merge( {

      // fill for the rectangle surrounding controls, so controls are easier to see against
      // background artwork of the ObservationWindow
      fill: 'rgba(255,255,255,0.5)',

      // {Object} - Options passed along to the VBox containing the controls
      vBoxOptions: {
        align: 'left',
        spacing: 5
      },

      // If true, a checkbox for the flux meter will be included in the controls
      includeFluxMeterCheckbox: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions ) as Required<InstrumentVisibilityControlsOptions>;

    assert && assert(
      options.vBoxOptions.children === undefined,
      'InstrumentVisibilityControls sets children through options'
    );

    const checkedUtterance = new Utterance();
    Property.multilink( [ model.netInflowOfEnergyProperty, model.inRadiativeBalanceProperty ], ( netInflowOfEnergy: number, inRadiativeBalance: boolean ) => {
      checkedUtterance.alert = StringUtils.fillIn( greenhouseEffectStrings.a11y.energyBalanceCheckedPattern, {
        checkedResponse: greenhouseEffectStrings.a11y.energyBalanceCheckedAlert,
        outgoingEnergyDescription: EnergyDescriber.getNetEnergyAtAtmosphereDescription( netInflowOfEnergy, inRadiativeBalance )
      } );
    } );

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
          helpText: greenhouseEffectStrings.a11y.energyBalance.helpText,

          checkedContextResponse: checkedUtterance,
          uncheckedContextResponse: new Utterance( { alert: greenhouseEffectStrings.a11y.energyBalanceUncheckedAlert } )
        }
      ) );
    }
    if ( options.includeFluxMeterCheckbox ) {
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

export type { InstrumentVisibilityControlsOptions };
export default InstrumentVisibilityControls;
