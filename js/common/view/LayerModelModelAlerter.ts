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
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

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
  // changes that determine if alerts are needed.
  private previousImmediateNotificationState: LayerModelModelState;

  // A reusable utterances prevents the content of this alert to be spoken every time a change is detected.
  private infraredChangeUtterance = new Utterance( {

    // A longer delay is used so that the alert about infrared changes comes after the context response from the
    // change from a UI component.
    alertStableDelay: 1500
  } );

  public constructor( model: LayerModelModel, providedOptions: LayerModelModelAlerterOptions ) {

    const options = optionize<LayerModelModelAlerterOptions, SelfOptions, LayersModelAlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( model, options );

    this.layerModelModel = model;
    this.previousImmediateNotificationState = this.saveLayerModelImmediateNotificationState();
  }

  private saveLayerModelImmediateNotificationState(): LayerModelModelState {
    this.previousImmediateNotificationState = this.previousImmediateNotificationState || {
      solarIntensity: 0,
      surfaceAlbedo: 0,
      numberOfAbsorbingLayers: 0,
      infraredAbsorbance: 0
    };

    this.previousImmediateNotificationState.solarIntensity = this.layerModelModel.sunEnergySource.proportionateOutputRateProperty.value;
    this.previousImmediateNotificationState.surfaceAlbedo = this.layerModelModel.groundLayer.albedoProperty.value;
    this.previousImmediateNotificationState.numberOfAbsorbingLayers = this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value;
    this.previousImmediateNotificationState.infraredAbsorbance = this.layerModelModel.layersInfraredAbsorbanceProperty.value;

    return this.previousImmediateNotificationState;
  }

  /**
   * Check if anything has changed in this model that deserves an alert that isn't handled by the base class.
   */
  protected override checkAndPerformImmediateAlerts(): void {
    const solarIntensityChange = this.layerModelModel.sunEnergySource.proportionateOutputRateProperty.value -
                                 this.previousImmediateNotificationState.solarIntensity;
    const surfaceAlbedoChange = this.layerModelModel.groundLayer.albedoProperty.value -
                                this.previousImmediateNotificationState.surfaceAlbedo;
    const numberOfAbsorbingLayersChange = this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value -
                                          this.previousImmediateNotificationState.numberOfAbsorbingLayers;
    const infraredAbsorbanceChange = this.layerModelModel.layersInfraredAbsorbanceProperty.value -
                                     this.previousImmediateNotificationState.infraredAbsorbance;

    const doIrAlert = solarIntensityChange !== 0 ||
                      surfaceAlbedoChange !== 0 ||
                      numberOfAbsorbingLayersChange !== 0 ||
                      infraredAbsorbanceChange !== 0;


    if ( doIrAlert && this.layerModelModel.isInfraredPresent() ) {

      let moreOrFewerString = '';
      let alertFromSurfaceStringFirst = true;

      const moreString = GreenhouseEffectStrings.a11y.moreStringProperty.value;
      const fewerString = GreenhouseEffectStrings.a11y.fewerStringProperty.value;

      // Decide what the alert should be. The ordering here will determine precedence if two things change within the
      // same interval.
      if ( solarIntensityChange !== 0 ) {
        moreOrFewerString = solarIntensityChange > 0 ? moreString : fewerString;
      }
      else if ( surfaceAlbedoChange !== 0 ) {
        moreOrFewerString = surfaceAlbedoChange < 0 ? moreString : fewerString;
      }
      else if ( numberOfAbsorbingLayersChange !== 0 ) {
        alertFromSurfaceStringFirst = false;
        moreOrFewerString = numberOfAbsorbingLayersChange > 0 ? moreString : fewerString;
      }
      else if ( infraredAbsorbanceChange !== 0 ) {
        alertFromSurfaceStringFirst = false;
        moreOrFewerString = infraredAbsorbanceChange > 0 ? moreString : fewerString;
      }

      const fromSurfaceAlert = StringUtils.fillIn( GreenhouseEffectStrings.a11y.infraredEnergyEmittedFromSurfacePatternStringProperty, {
        changeDescription: moreOrFewerString,
        energyRepresentation: GreenhouseEffectStrings.a11y.energyRepresentation.photonsStringProperty
      } );
      const backToSurfaceAlert = StringUtils.fillIn( GreenhouseEffectStrings.a11y.infraredEnergyRedirectingPatternStringProperty, {
        changeDescription: moreOrFewerString,
        energyRepresentation: GreenhouseEffectStrings.a11y.energyRepresentation.photonsStringProperty
      } );

      this.infraredChangeUtterance.alert = alertFromSurfaceStringFirst ? `${fromSurfaceAlert}  ${backToSurfaceAlert}` :
                                           `${backToSurfaceAlert} ${fromSurfaceAlert}`;
      this.alert( this.infraredChangeUtterance );
    }

    // Save state for the next round.
    this.saveLayerModelImmediateNotificationState();
  }
}

greenhouseEffect.register( 'LayerModelModelAlerter', LayerModelModelAlerter );
export default LayerModelModelAlerter;
