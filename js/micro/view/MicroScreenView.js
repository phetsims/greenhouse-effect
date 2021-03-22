// Copyright 2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class MicroScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {LayersModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, tandem );

    const mockup = new Text( 'No mockup available (yet).', {
      font: new PhetFont( 50 ),
      center: this.layoutBounds.center,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

greenhouseEffect.register( 'MicroScreenView', MicroScreenView );
export default MicroScreenView;