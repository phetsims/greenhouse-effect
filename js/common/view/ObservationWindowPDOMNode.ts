// Copyright 2021-2025, University of Colorado Boulder

/**
 * A Node that supports Interactive Description for the observation window, with PDOM structure and descriptions for the
 * state of the simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class ObservationWindowPDOMNode extends Node {

  protected constructor( sunIsShiningProperty: TReadOnlyProperty<boolean> ) {
    super( {
      isDisposable: false,
      tagName: 'ul'
    } );

    const sunShiningItemNode = new Node( { tagName: 'li' } );
    this.addChild( sunShiningItemNode );

    sunIsShiningProperty.link( ( isShining: boolean ) => {
      const descriptionString = isShining ? 'on' : 'off';
      sunShiningItemNode.innerContent = StringUtils.fillIn( 'The sunlight is {{sunDescription}}.', {
        sunDescription: descriptionString
      } );
    } );
  }
}

greenhouseEffect.register( 'ObservationWindowPDOMNode', ObservationWindowPDOMNode );
export default ObservationWindowPDOMNode;