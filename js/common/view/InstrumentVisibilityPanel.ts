// Copyright 2021-2023, University of Colorado Boulder

/**
 * Visibility controls for components in the observation window of this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Text } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayersModel from '../model/LayersModel.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const LABEL_FONT = new PhetFont( {
  size: 14
} );

type SelfOptions = {

  // options passed along to the VerticalCheckboxGroup containing the checkboxes
  verticalCheckboxGroupOptions?: VerticalCheckboxGroupOptions;

  // If true, a checkbox for the flux meter will be included in the controls.
  includeFluxMeterCheckbox?: boolean;
};
export type InstrumentVisibilityPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

class InstrumentVisibilityPanel extends Panel {

  /**
   * @param model
   * @param [providedOptions]
   */
  public constructor( model: LayersModel, providedOptions?: InstrumentVisibilityPanelOptions ) {

    const options = optionize<InstrumentVisibilityPanelOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      verticalCheckboxGroupOptions: {},
      includeFluxMeterCheckbox: true,

      // panel options
      fill: 'rgba(255,255,255,0.5)',
      cornerRadius: 5,
      stroke: null

    }, providedOptions );

    // Create the utterance (for screen readers) that will be used by the energy balance checkbox.
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
              checkedResponse: GreenhouseEffectStrings.a11y.energyBalanceCheckedAlertStringProperty,
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
          checkedUtterance.alert = GreenhouseEffectStrings.a11y.energyBalanceCheckedAlertStringProperty;
        }
      }
    );

    // Define the items for the checkboxes.
    const checkboxGroupItems: VerticalCheckboxGroupItem[] = [

      // checkbox item for controlling the energy balance indicator
      {
        createNode: () => new Text(
          GreenhouseEffectStrings.energyBalanceStringProperty, { font: LABEL_FONT }
        ),
        property: model.energyBalanceVisibleProperty,
        options: {

          // pdom
          helpText: GreenhouseEffectStrings.a11y.energyBalance.helpTextStringProperty,
          checkedContextResponse: checkedUtterance,
          uncheckedContextResponse: GreenhouseEffectStrings.a11y.energyBalanceUncheckedAlertStringProperty
        },
        tandemName: 'energyBalanceCheckbox'
      }
    ];

    // If the flux meter is present, add a checkbox to control its visibility.
    if ( options.includeFluxMeterCheckbox ) {
      checkboxGroupItems.push( {
        createNode: () => new Text(
          GreenhouseEffectStrings.fluxMeter.titleStringProperty, { font: LABEL_FONT }
        ),
        property: model.fluxMeterVisibleProperty,
        tandemName: 'fluxMeterCheckbox'
      } );
    }

    const checkboxGroup = new VerticalCheckboxGroup( checkboxGroupItems, {
      spacing: 5,
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );

    super( checkboxGroup, options );
  }
}

greenhouseEffect.register( 'InstrumentVisibilityPanel', InstrumentVisibilityPanel );

export default InstrumentVisibilityPanel;