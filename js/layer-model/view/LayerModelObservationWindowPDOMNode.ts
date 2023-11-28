// Copyright 2022-2023, University of Colorado Boulder

import ObservationWindowPDOMNode from '../../common/view/ObservationWindowPDOMNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import { Node } from '../../../../scenery/js/imports.js';
import InfraredAbsorbingLayersDescriptionProperty from './describers/InfraredAbsorbingLayersDescriptionProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class LayerModelObservationWindowPDOMNode extends ObservationWindowPDOMNode {

  public constructor( model: LayerModelModel ) {
    super( model.sunEnergySource.isShiningProperty );

    // Create a string Property that describes the number of infrared-absorbing layers in the atmosphere.
    const infraredAbsorbingLayersPhraseProperty = new InfraredAbsorbingLayersDescriptionProperty(
      model.numberOfActiveAtmosphereLayersProperty
    );

    // Create the node that will place the description of IR layers into the PDOM.
    const irLayersItemNode = new Node( { tagName: 'li' } );
    this.addChild( irLayersItemNode );

    // Update the PDOM item when the description string changes.
    infraredAbsorbingLayersPhraseProperty.link( infraredAbsorbingLayersPhrase => {
      irLayersItemNode.innerContent = StringUtils.capitalize( infraredAbsorbingLayersPhrase ) + '.';
    } );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindowPDOMNode', LayerModelObservationWindowPDOMNode );
export default LayerModelObservationWindowPDOMNode;