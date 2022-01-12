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

class WaveLandscapeObservationWindowPDOMNode extends ObservationWindowPDOMNode {
  constructor( model: WavesModel ) {
    super( model );

    model.cloudEnabledProperty.link( cloudEnabled => {
      this.skyItemNode.innerContent = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );
    } );
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindowPDOMNode', WaveLandscapeObservationWindowPDOMNode );
export default WaveLandscapeObservationWindowPDOMNode;
