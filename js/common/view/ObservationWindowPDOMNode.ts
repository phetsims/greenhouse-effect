// Copyright 2021-2023, University of Colorado Boulder

/**
 * A Node that supports Interactive Description for the observation window, with PDOM structure and
 * descriptions for the state of the simulation.
 *
 * NOTE: This is in active development, it is a work in progress.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayersModel from '../../common/model/LayersModel.js';

// constants
const ITEM_NODE_OPTIONS = { tagName: 'li' };

class ObservationWindowPDOMNode extends Node {
  protected skyItemNode: Node;
  protected concentrationItemNode: Node;
  protected sunlightWavesItemNode: Node;
  protected infraredWavesItemNode: Node;
  protected surfaceTemperatureItemNode: Node;

  protected constructor( model: LayersModel ) {
    super( {

      // pdom
      tagName: 'ul'
    } );

    const sunlightItemNode = new Node( ITEM_NODE_OPTIONS );
    this.concentrationItemNode = new Node( ITEM_NODE_OPTIONS );
    this.skyItemNode = new Node( ITEM_NODE_OPTIONS );
    this.sunlightWavesItemNode = new Node( ITEM_NODE_OPTIONS );
    this.infraredWavesItemNode = new Node( ITEM_NODE_OPTIONS );
    this.surfaceTemperatureItemNode = new Node( ITEM_NODE_OPTIONS );

    this.children = [
      sunlightItemNode,
      this.concentrationItemNode,
      this.skyItemNode,
      this.sunlightWavesItemNode,
      this.infraredWavesItemNode,
      this.surfaceTemperatureItemNode
    ];

    model.sunEnergySource.isShiningProperty.link( ( isShining: boolean ) => {
      const descriptionString = isShining ? 'on' : 'off';
      sunlightItemNode.innerContent = StringUtils.fillIn( 'The sunlight is {{sunDescription}}.', {
        sunDescription: descriptionString
      } );
    } );
  }
}

greenhouseEffect.register( 'ObservationWindowPDOMNode', ObservationWindowPDOMNode );
export default ObservationWindowPDOMNode;
