// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import layerModelScreenMockup from '../../../images/model-screen-mockup_png.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class LayerModelScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {LayerModelModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, {
      observationWindowOptions: {
        visibilityControlsOptions: {
          includeEnergyBalance: false
        }
      },

      // phet-io
      tandem: tandem
    } );

    const mockup = new Image( layerModelScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
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
    super.reset();
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

greenhouseEffect.register( 'LayerModelScreenView', LayerModelScreenView );
export default LayerModelScreenView;