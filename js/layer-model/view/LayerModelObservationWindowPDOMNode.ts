// Copyright 2022-2023, University of Colorado Boulder

import ObservationWindowPDOMNode from '../../common/view/ObservationWindowPDOMNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class LayerModelObservationWindowPDOMNode extends ObservationWindowPDOMNode {

  public constructor( model: LayerModelModel ) {
    super( model.sunEnergySource.isShiningProperty );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindowPDOMNode', LayerModelObservationWindowPDOMNode );
export default LayerModelObservationWindowPDOMNode;