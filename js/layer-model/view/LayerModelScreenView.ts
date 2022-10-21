// Copyright 2020-2022, University of Colorado Boulder

/**
 * ScreenView (root view class) for the Layer Model screen.
 *
 * @author John Blanco
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayerModelObservationWindow from '../../common/view/LayerModelObservationWindow.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import MorePhotonsCheckbox from '../../common/view/MorePhotonsCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import LayersControl from './LayersControl.js';
import SunAndReflectionControl from './SunAndReflectionControl.js';
import TemperatureUnitsSelector from './TemperatureUnitsSelector.js';

class LayerModelScreenView extends GreenhouseEffectScreenView {

  public constructor( model: LayerModelModel, tandem: Tandem ) {

    // Create the observation window that will depict the layers and photons.
    const observationWindow = new LayerModelObservationWindow( model, {
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    const timeControlNode = new LayersModelTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {

      // Frame the observation window so that the photons appear to stay within it.
      useClippingFrame: true,

      // phet-io
      tandem: tandem
    } );

    const temperatureUnitsSelector = new TemperatureUnitsSelector(
      model.temperatureUnitsProperty,
      tandem.createTandem( 'temperatureUnitsSelector' )
    );
    this.addChild( temperatureUnitsSelector );

    const morePhotonsCheckbox = new MorePhotonsCheckbox(
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      tandem.createTandem( 'morePhotonsCheckbox' )
    );
    this.addChild( morePhotonsCheckbox );

    // layout
    temperatureUnitsSelector.left = this.observationWindow.left;
    temperatureUnitsSelector.top = this.observationWindow.bottom + 3;
    morePhotonsCheckbox.left = this.observationWindow.left;
    morePhotonsCheckbox.top = temperatureUnitsSelector.bottom + 12;

    // controls on the side
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
}

greenhouseEffect.register( 'LayerModelScreenView', LayerModelScreenView );
export default LayerModelScreenView;