// Copyright 2020-2024, University of Colorado Boulder

/**
 * Main view class for the Waves screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { VBox } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import GreenhouseGasConcentrationPanel from '../../common/view/GreenhouseGasConcentrationPanel.js';
import EnergyLegend from '../../common/view/EnergyLegend.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../model/WavesModel.js';
import CloudCheckbox from '../../common/view/CloudCheckbox.js';
import InfraredWavesSoundGenerator from './InfraredWavesSoundGenerator.js';
import ShowSurfaceTemperatureCheckbox from './ShowSurfaceTemperatureCheckbox.js';
import WaveLandscapeObservationWindow from './WaveLandscapeObservationWindow.js';
import WavesScreenSummaryContentNode from './WavesScreenSummaryContentNode.js';

class WavesScreenView extends GreenhouseEffectScreenView {

  private readonly infraredWavesSoundGenerator: InfraredWavesSoundGenerator;

  public constructor( model: WavesModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, light waves, etc.
    const observationWindow = new WaveLandscapeObservationWindow( model, {
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    const timeControlNode = new LayersModelTimeControlNode( model, {
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {
      energyLegendOptions: {
        energyRepresentation: EnergyLegend.EnergyRepresentation.WAVE,
        tandem: tandem.createTandem( 'energyLegend' )
      },

      // phet-io
      tandem: tandem,

      // pdom
      screenSummaryContent: new WavesScreenSummaryContentNode( model )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox(
      model.groundLayer.showTemperatureProperty,
      model.surfaceTemperatureKelvinProperty,
      model.temperatureUnitsProperty,
      tandem.createTandem( 'surfaceThermometerCheckbox' )
    );

    const showSurfaceTemperatureCheckbox = new ShowSurfaceTemperatureCheckbox(
      model.surfaceTemperatureVisibleProperty,
      model.surfaceTemperatureKelvinProperty,
      model.concentrationControlModeProperty,
      model.dateProperty,
      tandem.createTandem( 'showSurfaceTemperatureCheckbox' )
    );

    // Create the cloud-control checkbox.
    const cloudCheckbox = new CloudCheckbox(
      model.cloudEnabledInManualConcentrationModeProperty,
      model.sunEnergySource.isShiningProperty,
      model.concentrationControlModeProperty,
      tandem.createTandem( 'cloudCheckbox' ) );

    const greenhouseGasConcentrationPanel = new GreenhouseGasConcentrationPanel(
      this.energyLegend.width,
      model,
      {

        // phet-io
        tandem: tandem.createTandem( 'greenhouseGasConcentrationPanel' )
      }
    );

    // Add the concentration controls.  It goes into a VBox to support dynamic layout.
    this.legendAndControlsVBox.addChild( greenhouseGasConcentrationPanel );

    // cloud checkbox
    cloudCheckbox.leftBottom = this.observationWindow.rightBottom.plusXY(
      GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING,
      0
    );
    this.addChild( cloudCheckbox );

    // layout code
    const visibilityBox = new VBox( {
      children: [ surfaceThermometerCheckbox, showSurfaceTemperatureCheckbox ],
      spacing: 5,
      align: 'left'
    } );
    visibilityBox.left = this.observationWindow.left + 5;
    visibilityBox.centerY = this.timeControlNode.centerY;

    greenhouseGasConcentrationPanel.leftTop = this.energyLegend.leftBottom.plusXY(
      0,
      GreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN
    );

    this.addChild( visibilityBox );

    // sound generation
    this.infraredWavesSoundGenerator = new InfraredWavesSoundGenerator( model, this );
    soundManager.addSoundGenerator( this.infraredWavesSoundGenerator );

    // pdom - override the pdomOrders for the supertype to insert subtype components in the desired order
    this.pdomPlayAreaNode.pdomOrder = [
      this.observationWindow,
      this.energyLegend,
      greenhouseGasConcentrationPanel,
      observationWindow.instrumentVisibilityPanel,
      cloudCheckbox
    ];
    this.pdomControlAreaNode.pdomOrder = [
      observationWindow.surfaceThermometer,
      visibilityBox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  public override step( dt: number ): void {
    super.step( dt );

    // Update the IR sound generator if the model is playing.
    if ( this.model.isPlayingProperty.value ) {
      this.infraredWavesSoundGenerator.step();
    }
  }

  public override reset(): void {
    super.reset();
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;