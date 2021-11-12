// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import photonsScreenMockup from '../../../images/photons-screen-mockup_png.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonsModel from '../model/PhotonsModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonLandscapeObservationWindow from './PhotonLandscapeObservationWindow.js';

class PhotonsScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {PhotonsModel} model
   * @param {Tandem} tandem
   */
  constructor( model: PhotonsModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, photons, etc.
    const observationWindow = new PhotonLandscapeObservationWindow( model, tandem.createTandem( 'observationWindow' ) );

    super( model, observationWindow, {

      // phet-io
      tandem: tandem
    } );

    const concentrationControlPanel = new ConcentrationControlPanel(
      this.energyLegend.width,
      model, {
        includeCompositionData: true,

        // phet-io
        tandem: tandem.createTandem( 'concentrationControlPanel' )
      }
    );

    // Add the concentration controls.  It goes into a VBox to support dynamic layout.
    // @ts-ignore
    this.legendAndControlsVBox.addChild( concentrationControlPanel );

    const mockup = new Image( photonsScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: phet.greenhouseEffect.mockupOpacityProperty.value
    } );
    // @ts-ignore
    this.addChild( mockup );
    phet.greenhouseEffect.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    concentrationControlPanel.leftTop = this.energyLegend.leftBottom.plusXY( 0, 10 );
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

greenhouseEffect.register( 'PhotonsScreenView', PhotonsScreenView );
export default PhotonsScreenView;