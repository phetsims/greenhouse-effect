// Copyright 2022-2023, University of Colorado Boulder

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../model/WavesModel.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import Multilink from '../../../../axon/js/Multilink.js';
import LandscapeObservationWindowPDOMNode from '../../common/view/LandscapeObservationWindowPDOMNode.js';
import EnergyRepresentation from '../../common/view/EnergyRepresentation.js';

class WaveLandscapeObservationWindowPDOMNode extends LandscapeObservationWindowPDOMNode {

  public constructor( model: WavesModel ) {

    super( model, model.sunEnergySource.isShiningProperty );

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
          this.sunlightItemNode.innerContent = RadiationDescriber.getSunlightTravelDescription(
            cloudEnabled,
            isGlacierPresent,
            EnergyRepresentation.WAVE
          );

          // If the sun isn't shining yet, hide this portion of the content.
          this.sunlightItemNode.pdomVisible = isShining;
        }
      );
    }

    Multilink.multilink(
      [
        model.concentrationControlModeProperty,
        model.concentrationProperty,
        model.dateProperty
      ],
      ( controlMode, concentration, date ) => {
        this.concentrationItemNode.innerContent = LandscapeObservationWindowPDOMNode.getConcentrationDescription( controlMode, concentration, date );
      }
    );

    Multilink.multilink(
      [ model.surfaceTemperatureKelvinProperty, model.concentrationProperty ],
      ( surfaceTemperature, concentration ) => {
        const description = RadiationDescriber.getInfraredRadiationIntensityDescription(
          surfaceTemperature,
          model.concentrationControlModeProperty.value === ConcentrationControlMode.BY_DATE,
          model.dateProperty.value,
          concentration,
          EnergyRepresentation.WAVE
        );
        if ( description ) {
          this.infraredItemNode.pdomVisible = true;
          this.infraredItemNode.innerContent = description;
        }
        else {
          this.infraredItemNode.pdomVisible = false;
        }
      } );
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindowPDOMNode', WaveLandscapeObservationWindowPDOMNode );
export default WaveLandscapeObservationWindowPDOMNode;
