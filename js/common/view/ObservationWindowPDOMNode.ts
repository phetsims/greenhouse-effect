// Copyright 2021-2023, University of Colorado Boulder

/**
 * A Node that supports Interactive Description for the observation window, with PDOM structure and descriptions for the
 * state of the simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

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