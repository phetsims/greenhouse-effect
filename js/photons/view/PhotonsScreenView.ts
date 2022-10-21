// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main screen view for the "Photons" screen.
 *
 * @author John Blanco
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import { ConcentrationControlMode } from '../../common/model/ConcentrationModel.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import MorePhotonsCheckbox from '../../common/view/MorePhotonsCheckbox.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import CloudCheckbox from '../../waves/view/CloudCheckbox.js';
import PhotonsModel from '../model/PhotonsModel.js';
import PhotonLandscapeObservationWindow from './PhotonLandscapeObservationWindow.js';

class PhotonsScreenView extends GreenhouseEffectScreenView {

  public constructor( model: PhotonsModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, photons, etc.
    const observationWindow = new PhotonLandscapeObservationWindow( model, {
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    // Create the node that will allow the user to play and pause the simulation.
    const timeControlNode = new LayersModelTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {

      // Frame the observation window so that the photons appear to stay within it.
      useClippingFrame: true,

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

    // Create the cloud-control checkbox.  This is only shown in manually-controlled-concentration mode.
    const cloudCheckbox = new CloudCheckbox(
      model.cloudEnabledProperty,
      model.sunEnergySource.isShiningProperty,
      {
        visibleProperty: new DerivedProperty(
          [ model.concentrationControlModeProperty ],
          mode => mode === ConcentrationControlMode.BY_VALUE
        ),
        tandem: tandem.createTandem( 'cloudCheckbox' )
      }
    );

    // layout code
    const visibilityBox = new VBox( {
      children: [ surfaceThermometerCheckbox, morePhotonsCheckbox ],
      spacing: 5,
      align: 'left'
    } );
    visibilityBox.left = this.observationWindow.left + 5;
    visibilityBox.centerY = this.timeControlNode.centerY;
    this.addChild( visibilityBox );

    cloudCheckbox.leftBottom = this.observationWindow.rightBottom.plusXY(
      GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING,
      0
    );
    this.addChild( cloudCheckbox );

    concentrationControlPanel.leftTop = this.energyLegend.leftBottom.plusXY( 0, 10 );
  }
}

greenhouseEffect.register( 'PhotonsScreenView', PhotonsScreenView );
export default PhotonsScreenView;