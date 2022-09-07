// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visibility controls for components in the observation window of this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { PathOptions, Rectangle, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayersModel from '../model/LayersModel.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';

type SelfOptions = {

  // options passed along to the VBox containing the controls
  vBoxOptions?: VBoxOptions;

  // If true, a checkbox for the flux meter will be included in the controls.
  includeFluxMeterCheckbox?: boolean;
};
export type InstrumentVisibilityControlsOptions = SelfOptions & PathOptions;

class InstrumentVisibilityControls extends Rectangle {

  /**
   * @param model
   * @param [providedOptions]
   */
  public constructor( model: LayersModel, providedOptions?: InstrumentVisibilityControlsOptions ) {

    const options = optionize<InstrumentVisibilityControlsOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      vBoxOptions: {
        align: 'left',
        spacing: 5
      },
      includeFluxMeterCheckbox: true,

      // fill for the rectangle surrounding controls, so controls are easier to see against
      // background artwork of the ObservationWindow
      fill: 'rgba(255,255,255,0.5)',

      // phet-io
      tandem: Tandem.REQUIRED

    }, providedOptions );

    assert && assert(
      options.vBoxOptions.children === undefined,
      'InstrumentVisibilityControls sets children through options'
    );

    const checkedUtterance = new Utterance();
    Multilink.multilink(
      [
        model.netInflowOfEnergyProperty,
        model.inRadiativeBalanceProperty,
        model.sunEnergySource.isShiningProperty
      ],
      ( netInflowOfEnergy, inRadiativeBalance, sunIsShining ) => {

        if ( sunIsShining ) {
          checkedUtterance.alert = StringUtils.fillIn( GreenhouseEffectStrings.a11y.energyBalanceCheckedPattern, {
            checkedResponse: GreenhouseEffectStrings.a11y.energyBalanceCheckedAlert,
            outgoingEnergyDescription: EnergyDescriber.getNetEnergyAtAtmosphereDescription( netInflowOfEnergy, inRadiativeBalance )
          } );
        }
        else {

          // If the sun isn't shining, don't include a description of the energy balance.  See
          // https://github.com/phetsims/greenhouse-effect/issues/176 for justification.
          checkedUtterance.alert = GreenhouseEffectStrings.a11y.energyBalanceCheckedAlert;
        }
      }
    );

    // add controls to children
    const children = [];
    if ( model.energyBalanceVisibleProperty ) {
      children.push( new GreenhouseEffectCheckbox( model.energyBalanceVisibleProperty, GreenhouseEffectStrings.energyBalance, {
        // phet-io
        tandem: options.tandem.createTandem( 'energyBalanceCheckbox' ),

        // pdom
        helpText: GreenhouseEffectStrings.a11y.energyBalance.helpText,
        checkedContextResponse: checkedUtterance,
        uncheckedContextResponse: GreenhouseEffectStrings.a11y.energyBalanceUncheckedAlert
      } ) );
    }
    if ( options.includeFluxMeterCheckbox ) {
      children.push( new GreenhouseEffectCheckbox( model.fluxMeterVisibleProperty, GreenhouseEffectStrings.fluxMeter.title, {
        // phet-io
        tandem: options.tandem.createTandem( 'fluxMeterCheckbox' )
      } ) );
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
