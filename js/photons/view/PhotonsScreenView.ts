// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author John Blanco
 */

import { Image, VBox } from '../../../../scenery/js/imports.js';
import photonsScreenMockup_png from '../../../images/photonsScreenMockup_png.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonsModel from '../model/PhotonsModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonLandscapeObservationWindow from './PhotonLandscapeObservationWindow.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import MorePhotonsCheckbox from '../../common/view/MorePhotonsCheckbox.js';

class PhotonsScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {PhotonsModel} model
   * @param {Tandem} tandem
   */
  constructor( model: PhotonsModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, photons, etc.
    const observationWindow = new PhotonLandscapeObservationWindow( model, {
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    const timeControlNode = new LayersModelTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {

      // phet-io
      tandem: tandem
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox(
      model.surfaceThermometerVisibleProperty,
      model.surfaceTemperatureKelvinProperty,
      model.temperatureUnitsProperty,
      tandem.createTandem( 'surfaceThermometerCheckbox' )
    );

    const morePhotonsCheckbox = new MorePhotonsCheckbox(
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      tandem.createTandem( 'morePhotonsCheckbox' )
    );

    // Responsible for generating descriptions about the changing radiation.
    const radiationDescriber = new RadiationDescriber( model );

    const concentrationControlPanel = new ConcentrationControlPanel(
      this.energyLegend.width,
      model,
      radiationDescriber, {
        includeCompositionData: true,

        // phet-io
        tandem: tandem.createTandem( 'concentrationControlPanel' )
      }
    );

    // Add the concentration controls.  It goes into a VBox to support dynamic layout.
    this.legendAndControlsVBox.addChild( concentrationControlPanel );

    const mockup = new Image( photonsScreenMockup_png, {
      center: this.layoutBounds.center,
      // @ts-ignore TODO: Image doesn't have minWidth
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: phet.greenhouseEffect.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    phet.greenhouseEffect.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // layout code
    const visibilityBox = new VBox( {
      children: [ surfaceThermometerCheckbox, morePhotonsCheckbox ],
      spacing: 5,
      align: 'left'
    } );
    visibilityBox.left = this.observationWindow.left + 5;
    visibilityBox.centerY = this.timeControlNode.centerY;
    this.addChild( visibilityBox );

    concentrationControlPanel.leftTop = this.energyLegend.leftBottom.plusXY( 0, 10 );
  }
}

greenhouseEffect.register( 'PhotonsScreenView', PhotonsScreenView );
export default PhotonsScreenView;