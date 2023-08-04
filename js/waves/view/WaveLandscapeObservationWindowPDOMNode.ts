// Copyright 2022-2023, University of Colorado Boulder

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import ObservationWindowPDOMNode from '../../common/view/ObservationWindowPDOMNode.js';
import WavesModel from '../model/WavesModel.js';
import ConcentrationDescriber from '../../common/view/describers/ConcentrationDescriber.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import Multilink from '../../../../axon/js/Multilink.js';

class WaveLandscapeObservationWindowPDOMNode extends ObservationWindowPDOMNode {

  public constructor( model: WavesModel ) {
    super( model.sunEnergySource.isShiningProperty );

    Multilink.multilink(
      [
        model.concentrationControlModeProperty,
        model.concentrationProperty,
        model.dateProperty
      ],
      ( controlMode, concentration, date ) => {
        this.concentrationItemNode.innerContent =
          WaveLandscapeObservationWindowPDOMNode.getConcentrationDescription( controlMode, concentration, date );
      }
    );

    if ( model.cloud ) {

      Multilink.multilink(
        [
          model.sunEnergySource.isShiningProperty,
          model.cloud.enabledProperty,
          model.concentrationControlModeProperty,
          model.dateProperty
        ],
        ( isShining, cloudEnabled, concentrationControlMode, date ) => {

          const isGlacierPresent = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                   date === ConcentrationDate.ICE_AGE;
          this.sunlightWavesItemNode.innerContent = RadiationDescriber.getSunlightTravelDescription(
            cloudEnabled,
            isGlacierPresent
          );

          // if the sun isn't shining yet, hide this portion of the content
          this.sunlightWavesItemNode.pdomVisible = isShining;
        }
      );

      model.cloud.enabledProperty.link( cloudEnabled => {
        this.skyItemNode.innerContent = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );
      } );
    }

    Multilink.multilink(
      [ model.surfaceTemperatureKelvinProperty, model.concentrationProperty ],
      ( surfaceTemperature, concentration ) => {
        const description = RadiationDescriber.getInfraredRadiationIntensityDescription(
          surfaceTemperature,
          model.concentrationControlModeProperty.value,
          model.dateProperty.value,
          concentration
        );
        if ( description ) {
          this.infraredWavesItemNode.pdomVisible = true;
          this.infraredWavesItemNode.innerContent = description;
        }
        else {
          this.infraredWavesItemNode.pdomVisible = false;
        }
      } );

    Multilink.multilink( [
      model.surfaceTemperatureKelvinProperty,
      model.surfaceThermometerVisibleProperty,
      model.surfaceTemperatureVisibleProperty,
      model.temperatureUnitsProperty,
      model.concentrationControlModeProperty,
      model.dateProperty
    ], ( temperature, thermometerVisible, surfaceTemperatureVisible, temperatureUnits, concentrationControlMode, date ) => {
      const temperatureDescription = TemperatureDescriber.getSurfaceTemperatureIsString(
        temperature, thermometerVisible, surfaceTemperatureVisible, temperatureUnits, concentrationControlMode, date
      );

      // There will not be a description at all if temperature displays are disabled
      this.surfaceTemperatureItemNode.pdomVisible = !!temperatureDescription;
      this.surfaceTemperatureItemNode.innerContent = temperatureDescription;
    } );
  }

  /**
   * Get a description of the concentration for the observation window, depending on whether concentration
   * is controlled by value or by date.
   */
  private static getConcentrationDescription( controlMode: ConcentrationControlMode,
                                              concentration: number,
                                              date: ConcentrationDate ): string {
    let concentrationDescription;

    if ( controlMode === ConcentrationControlMode.BY_VALUE ) {
      concentrationDescription = ConcentrationDescriber.getConcentrationDescriptionWithValue( concentration, true );
    }
    else {
      concentrationDescription = ConcentrationDescriber.getConcentrationDescriptionForDate( date );
    }

    return concentrationDescription;
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindowPDOMNode', WaveLandscapeObservationWindowPDOMNode );
export default WaveLandscapeObservationWindowPDOMNode;
