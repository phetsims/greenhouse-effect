// Copyright 2023, University of Colorado Boulder

/**
 * GreenhouseEffectPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences
 * dialog. These preferences are global, and thus may affect all screens.
 *
 * The Preferences dialog is created on demand by joist using a PhetioCapsule, so GreenhouseEffectPreferencesNode and
 * its subcomponents must implement dispose.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import GreenhouseEffectPreferences from '../model/GreenhouseEffectPreferences.js';
import DefaultTemperatureUnitsSelector from './DefaultTemperatureUnitsSelector.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type GreenhouseEffectPreferencesNodeOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class GreenhouseEffectPreferencesNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeGreenhouseEffectPreferencesNode: () => void;

  public constructor( providedOptions: GreenhouseEffectPreferencesNodeOptions ) {

    const options = optionize<GreenhouseEffectPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 20,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    const temperatureUnitsSelector = new DefaultTemperatureUnitsSelector(
      GreenhouseEffectPreferences.defaultTemperatureUnitsProperty,
      {
        tandem: options.tandem.createTandem( 'DefaultTemperatureUnitsSelector' )
      }
    );

    this.children = [ temperatureUnitsSelector ];

    this.disposeGreenhouseEffectPreferencesNode = (): void => {
      temperatureUnitsSelector.dispose();
    };
  }

  public override dispose(): void {
    this.disposeGreenhouseEffectPreferencesNode();
    super.dispose();
  }
}

greenhouseEffect.register( 'GreenhouseEffectPreferencesNode', GreenhouseEffectPreferencesNode );