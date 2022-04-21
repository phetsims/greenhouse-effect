// Copyright 2022, University of Colorado Boulder

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import ObservationWindowPDOMNode from './ObservationWindowPDOMNode.js';
import WavesModel from '../../waves/model/WavesModel.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import Property from '../../../../axon/js/Property.js';
import { ConcentrationControlMode } from '../model/ConcentrationModel.js';
import RadiationDescriber from './describers/RadiationDescriber.js';

class WaveLandscapeObservationWindowPDOMNode extends ObservationWindowPDOMNode {
  constructor( model: WavesModel ) {
    super( model );

    Property.multilink( [
      model.concentrationControlModeProperty,
      model.concentrationProperty,
      model.dateProperty
    ], ( controlMode, concentration, date ) => {
      this.concentrationItemNode.innerContent = WaveLandscapeObservationWindowPDOMNode.getConcentrationDescription( controlMode, concentration, date );
    } );

    Property.multilink( [ model.sunEnergySource.isShiningProperty, model.cloudEnabledProperty ], ( isShining, cloudEnabled ) => {
      this.sunlightWavesItemNode.innerContent = RadiationDescriber.getSunlightTravelDescription( cloudEnabled );

      // if the sun isn't shining yet, hide this portion of the content
      this.sunlightWavesItemNode.pdomVisible = isShining;
    } );

    model.cloudEnabledProperty.link( cloudEnabled => {
      this.skyItemNode.innerContent = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );
    } );

    Property.multilink(
      [ model.surfaceTemperatureKelvinProperty, model.concentrationProperty ],
      ( surfaceTemperature, concentration ) => {
        const description = RadiationDescriber.getInfraredRadiationIntensityDescription( surfaceTemperature, concentration );
        if ( description ) {
          this.infraredWavesItemNode.pdomVisible = true;
          this.infraredWavesItemNode.innerContent = description;
        }
        else {
          this.infraredWavesItemNode.pdomVisible = false;
        }
      } );
  }

  /**
   * Get a description of the concentration for the observation window, depending on whether concentration
   * is controlled by value or by date.
   * TODO: Replace usages of `any` with proper types when we use new Enumeration pattern.
   */
  private static getConcentrationDescription( controlMode: any, concentration: number, date: any ): string {
    let concentrationDescription;

    if ( controlMode === ConcentrationControlMode.BY_VALUE ) {
      concentrationDescription = ConcentrationDescriber.getConcentrationDescriptionWithValue( concentration );
    }
    else {
      concentrationDescription = ConcentrationDescriber.getConcentrationDescriptionWithDate( date );
    }

    return concentrationDescription;
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindowPDOMNode', WaveLandscapeObservationWindowPDOMNode );
export default WaveLandscapeObservationWindowPDOMNode;
