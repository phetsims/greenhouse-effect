// Copyright 2021, University of Colorado Boulder

/**
 * A Node that supports Interactive Description for the observation window, with PDOM structure and
 * descriptions for the state of the simulation.
 *
 * NOTE: This is in active development, it is a work in progress.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayersModel from '../../common/model/LayersModel.js';

// constants
const ITEM_NODE_OPTIONS = { tagName: 'li' };

class ObservationWindowPDOMNode extends Node {

  /**
   * @param {LayersModel} model
   */
  constructor( model: LayersModel ) {
    super( {

      // pdom
      tagName: 'ul'
    } );

    const sunlightItemNode = new Node( ITEM_NODE_OPTIONS );
    const concentrationItemNode = new Node( ITEM_NODE_OPTIONS );
    const skyItemNode = new Node( ITEM_NODE_OPTIONS );
    const sunlightWavesItemNode = new Node( ITEM_NODE_OPTIONS );
    const infraredWavesItemNode = new Node( ITEM_NODE_OPTIONS );
    const surfaceTemperatureItemNode = new Node( ITEM_NODE_OPTIONS );

    this.children = [
      sunlightItemNode,
      concentrationItemNode,
      skyItemNode,
      sunlightWavesItemNode,
      infraredWavesItemNode,
      surfaceTemperatureItemNode
    ];

    model.sunEnergySource.isShiningProperty.link( ( isShining: boolean ) => {
      const descriptionString = isShining ? 'on' : 'off';
      // @ts-ignore
      sunlightItemNode.innerContent = StringUtils.fillIn( 'The sunlight is {{sunDescription}}.', {
        sunDescription: descriptionString
      } );
    } );
  }
}

greenhouseEffect.register( 'ObservationWindowPDOMNode', ObservationWindowPDOMNode );
export default ObservationWindowPDOMNode;
