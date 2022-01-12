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
import ConcentrationModel from '../model/ConcentrationModel.js';

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

    model.cloudEnabledProperty.link( cloudEnabled => {
      this.skyItemNode.innerContent = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );
    } );
  }

  /**
   * Get a description of the concentration for the observation window, depending on whether concentration
   * is controlled by value or by date.
   * TODO: Replace anys with proper types when we use new Enumeration pattern.
   */
  private static getConcentrationDescription( controlMode: any, concentration: number, date: any ) {
    let concentrationDescription;

    // @ts-ignore
    if ( controlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_VALUE ) {
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
