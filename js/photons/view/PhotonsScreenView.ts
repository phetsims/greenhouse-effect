// Copyright 2020-2025, University of Colorado Boulder

/**
 * Main screen view for the "Photons" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import CloudCheckbox from '../../common/view/CloudCheckbox.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import GreenhouseGasConcentrationPanel from '../../common/view/GreenhouseGasConcentrationPanel.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import MorePhotonsCheckbox from '../../common/view/MorePhotonsCheckbox.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonsModel from '../model/PhotonsModel.js';
import PhotonLandscapeObservationWindow from './PhotonLandscapeObservationWindow.js';
import PhotonsScreenSummaryContentNode from './PhotonsScreenSummaryContentNode.js';

class PhotonsScreenView extends GreenhouseEffectScreenView {

  public constructor( model: PhotonsModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, photons, etc.
    const observationWindow = new PhotonLandscapeObservationWindow( model, {
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    // Create the node that will allow the user to play and pause the simulation.
    const timeControlNode = new LayersModelTimeControlNode( model, {
      timeSpeedProperty: model.timeSpeedProperty,
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {

      // Frame the observation window so that the photons appear to stay within it.
      useClippingFrame: true,

      // phet-io
      tandem: tandem,

      // pdom
      screenSummaryContent: new PhotonsScreenSummaryContentNode( model )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox(
      model.groundLayer.showTemperatureProperty,
      model.surfaceTemperatureKelvinProperty,
      model.temperatureUnitsProperty,
      tandem.createTandem( 'surfaceThermometerCheckbox' )
    );

    const morePhotonsCheckbox = new MorePhotonsCheckbox(
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      tandem.createTandem( 'morePhotonsCheckbox' )
    );

    const greenhouseGasConcentrationPanel = new GreenhouseGasConcentrationPanel(
      this.energyLegend.width,
      model,
      {
        includeCompositionData: true,

        // phet-io
        tandem: tandem.createTandem( 'greenhouseGasConcentrationPanel' )
      }
    );

    // Add the concentration controls.  It goes into a VBox to support dynamic layout.
    this.legendAndControlsVBox.addChild( greenhouseGasConcentrationPanel );

    // Create the cloud-control checkbox.
    const cloudCheckbox = new CloudCheckbox(
      model.cloudEnabledInManualConcentrationModeProperty,
      model.sunEnergySource.isShiningProperty,
      model.concentrationControlModeProperty,
      tandem.createTandem( 'cloudCheckbox' ) );

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

    greenhouseGasConcentrationPanel.leftTop = this.energyLegend.leftBottom.plusXY( 0, 10 );

    // pdom - override the pdomOrders for the supertype to insert subtype components in the desired order
    this.pdomPlayAreaNode.pdomOrder = [
      this.observationWindow,
      this.energyLegend,
      greenhouseGasConcentrationPanel,
      observationWindow.instrumentVisibilityPanel,
      observationWindow.fluxMeterNode!.fluxSensorNode,
      cloudCheckbox
    ];
    this.pdomControlAreaNode.pdomOrder = [
      observationWindow.surfaceThermometer,
      visibilityBox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }
}

greenhouseEffect.register( 'PhotonsScreenView', PhotonsScreenView );
export default PhotonsScreenView;