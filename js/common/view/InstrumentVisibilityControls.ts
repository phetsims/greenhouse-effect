// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visibility controls for components in the observation window of this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
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
export type InstrumentVisibilityControlsOptions = SelfOptions & PanelOptions;

class InstrumentVisibilityControls extends Panel {

  /**
   * @param model
   * @param [providedOptions]
   */
  public constructor( model: LayersModel, providedOptions?: InstrumentVisibilityControlsOptions ) {

    const options = optionize<InstrumentVisibilityControlsOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      vBoxOptions: {
        align: 'left',
        spacing: 5
      },
      includeFluxMeterCheckbox: true,

      // panel options
      fill: 'rgba(255,255,255,0.5)',
      cornerRadius: 5,
      stroke: null,

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
          checkedUtterance.alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.energyBalanceCheckedPatternStringProperty,
            {
              checkedResponse: GreenhouseEffectStrings.a11y.energyBalanceCheckedAlertStringProperty.value,
              outgoingEnergyDescription: EnergyDescriber.getNetEnergyAtAtmosphereDescription(
                netInflowOfEnergy,
                inRadiativeBalance
              )
            }
          );
        }
        else {

          // If the sun isn't shining, don't include a description of the energy balance.  See
          // https://github.com/phetsims/greenhouse-effect/issues/176 for justification.
          checkedUtterance.alert = GreenhouseEffectStrings.a11y.energyBalanceCheckedAlertStringProperty.value;
        }
      }
    );

    // add controls to children
    const children = [];
    if ( model.energyBalanceVisibleProperty ) {
      children.push( new GreenhouseEffectCheckbox( model.energyBalanceVisibleProperty, GreenhouseEffectStrings.energyBalanceStringProperty, {
          // phet-io
          tandem: options.tandem.createTandem( 'energyBalanceCheckbox' ),

          // pdom
          helpText: GreenhouseEffectStrings.a11y.energyBalance.helpTextStringProperty.value,
          checkedContextResponse: checkedUtterance,
          uncheckedContextResponse: GreenhouseEffectStrings.a11y.energyBalanceUncheckedAlertStringProperty.value
        }
      ) );
    }
    if ( options.includeFluxMeterCheckbox ) {
      children.push(
        new GreenhouseEffectCheckbox(
          model.fluxMeterVisibleProperty,
          GreenhouseEffectStrings.fluxMeter.titleStringProperty,
          {
            // phet-io
            tandem: options.tandem.createTandem( 'fluxMeterCheckbox' )
          }
        )
      );
    }

    // layout
    options.vBoxOptions.children = children;
    const vBox = new VBox( options.vBoxOptions );

    super( vBox, options );
  }
}

greenhouseEffect.register( 'InstrumentVisibilityControls', InstrumentVisibilityControls );

export default InstrumentVisibilityControls;
