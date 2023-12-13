// Copyright 2023, University of Colorado Boulder

/**
 * LayerModelModelAlerter is responsible for generating alerts for changes in the Layer Model screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../../layer-model/model/LayerModelModel.js';
import LayersModelAlerter, { LayersModelAlerterOptions } from './LayersModelAlerter.js';

type SelfOptions = EmptySelfOptions;
export type LayerModelModelAlerterOptions = SelfOptions & LayersModelAlerterOptions;

// The parts of the Layer Model model that are monitored for changes over time and that can motivate alerts.
type LayerModelModelState = {
  solarIntensity: number;
  surfaceAlbedo: number;
  numberOfAbsorbingLayers: number;
  infraredAbsorbance: number;
};

class LayerModelModelAlerter extends LayersModelAlerter {

  // reference to the model, used in the methods
  private readonly layerModelModel: LayerModelModel;

  // Elements of the model state that are specific to the model from the Layer Model screen that are monitored for
  // changes over time to determine if alerts are needed.
  private previousPeriodicNotificationState: LayerModelModelState;

  public constructor( model: LayerModelModel, providedOptions: LayerModelModelAlerterOptions ) {

    const options = optionize<LayerModelModelAlerterOptions, SelfOptions, LayersModelAlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( model, options );

    this.layerModelModel = model;
    this.previousPeriodicNotificationState = this.saveLayerModelPeriodicNotificationState();
  }

  private saveLayerModelPeriodicNotificationState(): LayerModelModelState {
    this.previousPeriodicNotificationState = this.previousPeriodicNotificationState || {
      solarIntensity: 0,
      surfaceAlbedo: 0,
      numberOfAbsorbingLayers: 0,
      infraredAbsorbance: 0
    };

    this.previousPeriodicNotificationState.solarIntensity = this.layerModelModel.sunEnergySource.proportionateOutputRateProperty.value;
    this.previousPeriodicNotificationState.surfaceAlbedo = this.layerModelModel.groundLayer.albedoProperty.value;
    this.previousPeriodicNotificationState.numberOfAbsorbingLayers = this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value;
    this.previousPeriodicNotificationState.infraredAbsorbance = this.layerModelModel.layersInfraredAbsorbanceProperty.value;

    return this.previousPeriodicNotificationState;
  }

  /**
   * Check if anything has changed in this model that deserves an alert that isn't handled by the base class.
   */
  protected override checkAndPerformPeriodicAlerts(): void {
    super.checkAndPerformPeriodicAlerts();

    const doIrAlert = this.previousPeriodicNotificationState.solarIntensity !== this.layerModelModel.sunEnergySource.proportionateOutputRateProperty.value ||
                      this.previousPeriodicNotificationState.surfaceAlbedo !== this.layerModelModel.groundLayer.albedoProperty.value ||
                      this.previousPeriodicNotificationState.numberOfAbsorbingLayers !== this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value ||
                      this.previousPeriodicNotificationState.infraredAbsorbance !== this.layerModelModel.layersInfraredAbsorbanceProperty.value;

    if ( doIrAlert && this.layerModelModel.isInfraredPresent() ) {
      this.alert( 'Some sort of IR thing changed.' );
    }

    // Save state for the next round.
    this.saveLayerModelPeriodicNotificationState();
  }
}

greenhouseEffect.register( 'LayerModelModelAlerter', LayerModelModelAlerter );
export default LayerModelModelAlerter;
