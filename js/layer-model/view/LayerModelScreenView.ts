// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import layerModelScreenMockup from '../../../images/model-screen-mockup_png.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayerModelObservationWindow from '../../common/view/LayerModelObservationWindow.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class LayerModelScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {LayerModelModel} model
   * @param {Tandem} tandem
   */
  constructor( model: LayerModelModel, tandem: Tandem ) {

    // Create the observation window that will depict the layers and photons.
    const observationWindow = new LayerModelObservationWindow( model, tandem.createTandem( 'observationWindow' ) );

    super( model, observationWindow, {

      // phet-io
      tandem: tandem
    } );

    const mockup = new Image( layerModelScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: phet.greenhouseEffect.mockupOpacityProperty.value
    } );
    // @ts-ignore
    this.addChild( mockup );
    phet.greenhouseEffect.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );
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
  step( dt: number ) {
    //TODO
  }
}

greenhouseEffect.register( 'LayerModelScreenView', LayerModelScreenView );
export default LayerModelScreenView;