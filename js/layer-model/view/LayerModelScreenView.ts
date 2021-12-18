// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import { Image } from '../../../../scenery/js/imports.js';
import modelScreenMockup_png from '../../../images/modelScreenMockup_png.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayerModelObservationWindow from '../../common/view/LayerModelObservationWindow.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LayersControl from './LayersControl.js';
import SunAndReflectionControl from './SunAndReflectionControl.js';

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

    const mockup = new Image( modelScreenMockup_png, {
      center: this.layoutBounds.center,
      // @ts-ignore TODO: Image doesn't have minWidth
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: phet.greenhouseEffect.mockupOpacityProperty.value
    } );
    // @ts-ignore
    this.addChild( mockup );
    phet.greenhouseEffect.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    const sunAndReflectionControl = new SunAndReflectionControl(
      this.energyLegend.width,
      model,
      tandem.createTandem( 'sunAndReflectionControl' )
    );
    this.legendAndControlsVBox.addChild( sunAndReflectionControl );

    const layersControl = new LayersControl(
      this.energyLegend.width,
      model,
      tandem.createTandem( 'layersControl' )
    );
    this.legendAndControlsVBox.addChild( layersControl );
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