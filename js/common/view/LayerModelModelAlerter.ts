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
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';

type SelfOptions = EmptySelfOptions;
export type LayerModelModelAlerterOptions = SelfOptions & LayersModelAlerterOptions;

// The parts of the Layer Model model that are monitored for changes over time and that can motivate alerts.
type LayerModelModelState = {
  solarIntensity: number;
  surfaceAlbedo: number;
  numberOfActiveLayers: number;
  infraredAbsorbance: number;
  layerAtEquilibrium: boolean[];
};

// constants
const UTTERANCE_OPTIONS = {

  // Delay the utterances a bit to give the utterance queue an opportunity to consolidate them if there are several
  // that are close in time.  This helps prevent large batches of duplicated alerts.  Value empirically determined.
  alertStableDelay: 1500
};

class LayerModelModelAlerter extends LayersModelAlerter {

  // reference to the model, used in the methods
  private readonly layerModelModel: LayerModelModel;

  // Elements of the model state that are specific to the model from the Layer Model screen that are monitored for
  // changes that determine if alerts are needed.
  private previousImmediateNotificationState: LayerModelModelState;

  // Reusable utterances that are used to prevent the alerts from being spoken every time a change is detected.
  private infraredChangeUtterance = new Utterance( UTTERANCE_OPTIONS );
  private solarIntensityChangeUtterance = new Utterance( UTTERANCE_OPTIONS );
  private surfaceAlbedoChangeUtterance = new Utterance( UTTERANCE_OPTIONS );
  private numberOfLayersChangeUtterance = new Utterance( UTTERANCE_OPTIONS );
  private infraredAbsorbanceChangeUtterance = new Utterance( UTTERANCE_OPTIONS );

  public constructor( model: LayerModelModel, providedOptions: LayerModelModelAlerterOptions ) {

    const options = optionize<LayerModelModelAlerterOptions, SelfOptions, LayersModelAlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( model, options );

    this.layerModelModel = model;
    this.previousImmediateNotificationState = this.saveLayerModelImmediateNotificationState();

    Multilink.multilink(
      [
        model.numberOfActiveAtmosphereLayersProperty,
        model.layersInfraredAbsorbanceProperty,
        model.groundLayer.albedoProperty
      ],
      () => {

        // A model parameter has changed in a way that is likely to affect the temperature, so use the more verbose
        // alert at the next alert interval.
        this.useCompleteTemperatureAtNextAlert();

        if ( model.isPlayingProperty.value ) {

          // Reset the alert time so that the effects of the parameter change can potentially take effect before the
          // alert is made.
          this.resetAlertTime();
        }
      }
    );

    model.atmosphereLayers[ 0 ].atEquilibriumProperty.link( atEquilibrium => {
      console.log( `layer 1 atEquilibrium = ${atEquilibrium}` );
    } );
  }

  private saveLayerModelImmediateNotificationState(): LayerModelModelState {
    this.previousImmediateNotificationState = this.previousImmediateNotificationState || {
      solarIntensity: 0,
      surfaceAlbedo: 0,
      numberOfActiveLayers: 0,
      infraredAbsorbance: 0,
      layerAtEquilibrium: []
    };

    this.previousImmediateNotificationState.solarIntensity = this.layerModelModel.sunEnergySource.proportionateOutputRateProperty.value;
    this.previousImmediateNotificationState.surfaceAlbedo = this.layerModelModel.groundLayer.albedoProperty.value;
    this.previousImmediateNotificationState.numberOfActiveLayers = this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value;
    this.previousImmediateNotificationState.infraredAbsorbance = this.layerModelModel.layersInfraredAbsorbanceProperty.value;
    this.layerModelModel.atmosphereLayers.forEach( ( layer, index ) => {
      this.previousImmediateNotificationState.layerAtEquilibrium[ index ] = layer.atEquilibriumProperty.value;
    } );

    return this.previousImmediateNotificationState;
  }

  /**
   * Check if anything has changed in this model that deserves an alert that isn't handled by the base class.
   */
  protected override checkAndPerformImmediateAlerts(): void {

    // Determine the changes that have occurred since the last time this method was called.
    const solarIntensityChange = this.layerModelModel.sunEnergySource.proportionateOutputRateProperty.value -
                                 this.previousImmediateNotificationState.solarIntensity;
    const surfaceAlbedoChange = this.layerModelModel.groundLayer.albedoProperty.value -
                                this.previousImmediateNotificationState.surfaceAlbedo;
    const numberOfAbsorbingLayersChange = this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value -
                                          this.previousImmediateNotificationState.numberOfActiveLayers;
    const infraredAbsorbanceChange = this.layerModelModel.layersInfraredAbsorbanceProperty.value -
                                     this.previousImmediateNotificationState.infraredAbsorbance;
    const layerReachedEquilibrium: boolean[] = [];
    this.layerModelModel.atmosphereLayers.forEach( ( layer, index ) => {
      layerReachedEquilibrium[ index ] = layer.atEquilibriumProperty.value &&
                                         !this.previousImmediateNotificationState.layerAtEquilibrium[ index ];
    } );

    // Alert if the number of absorbing layers has changed.
    if ( numberOfAbsorbingLayersChange !== 0 ) {
      const numberOfActiveLayers = this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value;
      if ( numberOfAbsorbingLayersChange > 0 ) {
        if ( numberOfAbsorbingLayersChange > 1 ) {
          this.numberOfLayersChangeUtterance.alert =
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.multipleLayersAddedStringProperty.value;
        }
        else if ( numberOfActiveLayers === 1 ) {

          // The first layer was added, describe relative to ground layer.
          this.numberOfLayersChangeUtterance.alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerAddedAboveSurfacePatternStringProperty,
            { number: numberOfActiveLayers }
          );
        }
        else {
          this.numberOfLayersChangeUtterance.alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerAddedContextResponsePatternStringProperty,
            {
              aboveNumber: numberOfActiveLayers,
              belowNumber: numberOfActiveLayers - 1
            }
          );
        }
      }
      else {
        if ( numberOfAbsorbingLayersChange < -1 ) {
          this.numberOfLayersChangeUtterance.alert =
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.multipleLayersRemovedStringProperty.value;
        }
        else {
          this.numberOfLayersChangeUtterance.alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerRemovedContextResponsePatternStringProperty,
            { number: numberOfActiveLayers + 1 }
          );
        }
      }

      this.alert( this.numberOfLayersChangeUtterance );
    }

    // Some of the alerts are only performed if the sun is shining.
    if ( this.layerModelModel.sunEnergySource.isShiningProperty.value ) {

      // Alert if the solar intensity has changed.
      if ( solarIntensityChange !== 0 ) {
        const moreOrFewerProperty = solarIntensityChange > 0 ?
                                    GreenhouseEffectStrings.a11y.moreStringProperty :
                                    GreenhouseEffectStrings.a11y.fewerStringProperty;
        this.solarIntensityChangeUtterance.alert = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.sunlightPhotonsPatternStringProperty,
          { moreFewer: moreOrFewerProperty }
        );
        this.alert( this.solarIntensityChangeUtterance );
      }

      // Alert if the surface albedo has changed.
      if ( surfaceAlbedoChange !== 0 ) {
        const albedo = this.layerModelModel.groundLayer.albedoProperty.value;
        if ( albedo === 0 ) {
          this.surfaceAlbedoChangeUtterance.alert =
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceReflectsNoSunlightStringProperty.value;
        }
        else {
          this.surfaceAlbedoChangeUtterance.alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceReflectsSunlightPercentagePatternStringProperty,
            { percentage: Utils.roundToInterval( albedo * 100, 1 ) }
          );
        }
        this.alert( this.surfaceAlbedoChangeUtterance );
      }

      // Alert if the IR absorbance setting for the layers has changed, but only if there are active layers in the
      // atmosphere.
      if ( infraredAbsorbanceChange !== 0 && this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value > 0 ) {
        const currentIRAbsorbance = this.layerModelModel.layersInfraredAbsorbanceProperty.value;
        if ( currentIRAbsorbance === 1 ) {
          this.infraredAbsorbanceChangeUtterance.alert =
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.fullAbsorptionContextResponseStringProperty.value;
        }
        else {
          const absorbedPercentage = currentIRAbsorbance * 100;
          const passThroughPercentage = Utils.roundToInterval( 1 - currentIRAbsorbance, 0.01 ) * 100;
          this.infraredAbsorbanceChangeUtterance.alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.absorptionChangeContextResponsePatternStringProperty,
            {
              absorbedPercentage: absorbedPercentage,
              passThroughPercentage: passThroughPercentage
            }
          );
        }
        this.alert( this.infraredAbsorbanceChangeUtterance );
      }

      // For each active layer, alert if the layer has reached equilibrium.
      this.layerModelModel.atmosphereLayers.forEach( ( layer, index ) => {
        if ( layer.isActiveProperty.value && layer.showTemperatureProperty.value && layerReachedEquilibrium[ index ] ) {
          const alert = StringUtils.fillIn(
            GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerTemperatureStablePatternStringProperty,
            {
              number: index + 1,
              temperature: TemperatureDescriber.getQuantitativeTemperatureDescription(
                this.layerModelModel.surfaceTemperatureKelvinProperty.value,
                this.layerModelModel.temperatureUnitsProperty.value
              )
            }
          );
          this.alert( alert );
        }
      } );
    }

    // If IR is present and any of the parameters changed, so an announcement describing how the change will likely
    // affect the behavior of the IR photons.
    const doIrAlert = this.layerModelModel.isInfraredPresent() &&
                      ( solarIntensityChange !== 0 ||
                        surfaceAlbedoChange !== 0 ||
                        numberOfAbsorbingLayersChange !== 0 ||
                        ( infraredAbsorbanceChange !== 0 &&
                          this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value > 0
                        )
                      );

    if ( doIrAlert ) {
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

      // The alert that describes IR photons coming back to the surface is only used if there are some active layers
      // in the atmosphere, since otherwise there won't be any IR photons coming back.
      let backToSurfaceAlert = '';
      if ( this.layerModelModel.numberOfActiveAtmosphereLayersProperty.value > 0 ) {
        backToSurfaceAlert = StringUtils.fillIn( GreenhouseEffectStrings.a11y.infraredEnergyRedirectingPatternStringProperty, {
          changeDescription: moreOrFewerString,
          energyRepresentation: GreenhouseEffectStrings.a11y.energyRepresentation.photonsStringProperty
        } );
      }

      if ( backToSurfaceAlert ) {

        // Put the two sentences together into one alert.  The order varies a bit based on what parameter was changed
        // since it may make the causal relationship more clear.
        this.infraredChangeUtterance.alert = alertFromSurfaceStringFirst ?
                                             `${fromSurfaceAlert}  ${backToSurfaceAlert}` :
                                             `${backToSurfaceAlert} ${fromSurfaceAlert}`;
      }
      else {
        this.infraredChangeUtterance.alert = fromSurfaceAlert;
      }

      this.alert( this.infraredChangeUtterance );
    }

    // Save state for the next round.
    this.saveLayerModelImmediateNotificationState();
  }
}

greenhouseEffect.register( 'LayerModelModelAlerter', LayerModelModelAlerter );
export default LayerModelModelAlerter;
