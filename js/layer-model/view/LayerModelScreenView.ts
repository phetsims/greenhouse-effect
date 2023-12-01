// Copyright 2020-2023, University of Colorado Boulder

/**
 * ScreenView (root view class) for the Layer Model screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayerModelObservationWindow from './LayerModelObservationWindow.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import MorePhotonsCheckbox from '../../common/view/MorePhotonsCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import InfraredPanel from './InfraredPanel.js';
import SunlightPanel from './SunlightPanel.js';
import TemperatureUnitsControl from './TemperatureUnitsControl.js';
import LayerModelScreenSummaryContentNode from './LayerModelScreenSummaryContentNode.js';

class LayerModelScreenView extends GreenhouseEffectScreenView {

  public constructor( model: LayerModelModel, tandem: Tandem ) {

    // Create the observation window that will depict the layers and photons.
    const observationWindow = new LayerModelObservationWindow( model, tandem.createTandem( 'observationWindow' ) );

    const timeControlNode = new LayersModelTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {

      // Frame the observation window so that the photons appear to stay within it.
      useClippingFrame: true,

      // phet-io
      tandem: tandem,

      // pdom
      screenSummaryContent: new LayerModelScreenSummaryContentNode( model )
    } );

    const temperatureUnitsControl = new TemperatureUnitsControl(
      model.temperatureUnitsProperty,
      tandem.createTandem( 'temperatureUnitsControl' )
    );
    this.addChild( temperatureUnitsControl );

    const morePhotonsCheckbox = new MorePhotonsCheckbox(
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      tandem.createTandem( 'morePhotonsCheckbox' )
    );
    this.addChild( morePhotonsCheckbox );

    // layout
    temperatureUnitsControl.left = this.observationWindow.left;
    temperatureUnitsControl.top = this.observationWindow.bottom + 3;
    morePhotonsCheckbox.left = this.observationWindow.left;
    morePhotonsCheckbox.top = temperatureUnitsControl.bottom + 12;

    // controls on the side
    const sunlightPanel = new SunlightPanel(
      this.energyLegend.width,
      model,
      tandem.createTandem( 'sunlightPanel' )
    );
    this.legendAndControlsVBox.addChild( sunlightPanel );

    const infraredPanel = new InfraredPanel(
      this.energyLegend.width,
      model,
      tandem.createTandem( 'infraredPanel' )
    );
    this.legendAndControlsVBox.addChild( infraredPanel );

    // pdom - override the pdomOrders for the supertype to insert subtype components
    this.pdomPlayAreaNode.pdomOrder = [
      this.observationWindow,
      this.energyLegend,
      sunlightPanel,
      infraredPanel,
      observationWindow.showThermometerCheckbox,
      ...observationWindow.atmosphereLayerNodes,
      observationWindow.instrumentVisibilityPanel
    ];
    this.pdomControlAreaNode.pdomOrder = [
      temperatureUnitsControl,
      morePhotonsCheckbox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }
}

greenhouseEffect.register( 'LayerModelScreenView', LayerModelScreenView );
export default LayerModelScreenView;