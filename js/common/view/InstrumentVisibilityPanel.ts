// Copyright 2021-2024, University of Colorado Boulder

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
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FluxMeterDescriptionProperty from './describers/FluxMeterDescriptionProperty.js';

const LABEL_FONT = new PhetFont( {
  size: 14
} );

type SelfOptions = {

  // options passed along to the VerticalCheckboxGroup containing the checkboxes
  verticalCheckboxGroupOptions?: VerticalCheckboxGroupOptions;

  // If true, a checkbox for the flux meter will be included in the controls.
  includeFluxMeterCheckbox?: boolean;
};
export type InstrumentVisibilityPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

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
      stroke: null,

      // phet-io
      visiblePropertyOptions: { phetioFeatured: true }
    }, providedOptions );

    // Create the utterance (for screen readers) that will be used by the energy balance checkbox.
    const energyBalanceCheckedUtterance = new Utterance();
    Multilink.multilink(
      [
        model.netInflowOfEnergyProperty,
        model.inRadiativeBalanceProperty,
        model.sunEnergySource.isShiningProperty
      ],
      ( netInflowOfEnergy, inRadiativeBalance, sunIsShining ) => {

        if ( sunIsShining ) {
          energyBalanceCheckedUtterance.alert = StringUtils.fillIn(
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
          energyBalanceCheckedUtterance.alert = GreenhouseEffectStrings.a11y.energyBalanceCheckedAlertStringProperty;
        }
      }
    );

    const textOptions = {
      font: LABEL_FONT,
      maxWidth: 300
    };

    // Define the items for the checkboxes.
    const checkboxGroupItems: VerticalCheckboxGroupItem[] = [

      // checkbox item for controlling the energy balance indicator
      {
        createNode: () => new Text( GreenhouseEffectStrings.energyBalanceStringProperty, textOptions ),
        property: model.energyBalanceVisibleProperty,
        options: {

          // pdom
          accessibleName: GreenhouseEffectStrings.energyBalanceStringProperty,
          helpText: GreenhouseEffectStrings.a11y.energyBalance.helpTextStringProperty,
          checkedContextResponse: energyBalanceCheckedUtterance,
          uncheckedContextResponse: GreenhouseEffectStrings.a11y.energyBalanceUncheckedAlertStringProperty
        },
        tandemName: 'energyBalanceCheckbox'
      }
    ];

    // If the flux meter is present, add a checkbox to control its visibility.
    if ( options.includeFluxMeterCheckbox ) {

      assert && assert( model.fluxMeter, 'Flux meter checkbox should not be present without flux meter.' );

      // Create a describer for the energy flux.
      const energyFluxDescriptionProperty = new FluxMeterDescriptionProperty( model.fluxMeter! );

      // Create the utterance (for screen readers) that will be used by the flux meter checkbox.
      const fluxMeterCheckedUtterance = new Utterance();
      Multilink.multilink(
        [
          model.sunEnergySource.isShiningProperty,
          energyFluxDescriptionProperty
        ],
        ( sunIsShining, energyFluxDescription ) => {

          if ( sunIsShining && model.fluxMeter!.isSensingFlux() ) {
            fluxMeterCheckedUtterance.alert = StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.fluxMeterCheckedPatternStringProperty,
              {
                checkedResponse: GreenhouseEffectStrings.a11y.fluxMeterCheckedAlertStringProperty,
                energyFluxDescription: energyFluxDescription
              }
            );
          }
          else {

            // If the sun isn't shining, don't include a description of the energy flux.  See
            // https://github.com/phetsims/greenhouse-effect/issues/176 for justification.
            fluxMeterCheckedUtterance.alert = GreenhouseEffectStrings.a11y.fluxMeterCheckedAlertStringProperty;
          }
        }
      );

      checkboxGroupItems.push( {
        createNode: () => new Text( GreenhouseEffectStrings.fluxMeter.titleStringProperty, textOptions ),
        property: model.fluxMeterVisibleProperty,
        options: {

          // pdom
          accessibleName: GreenhouseEffectStrings.fluxMeter.titleStringProperty,
          helpText: GreenhouseEffectStrings.a11y.fluxMeter.helpTextStringProperty,
          checkedContextResponse: fluxMeterCheckedUtterance,
          uncheckedContextResponse: GreenhouseEffectStrings.a11y.fluxMeterUncheckedAlertStringProperty
        },
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