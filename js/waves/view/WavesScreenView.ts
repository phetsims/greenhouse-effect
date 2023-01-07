// Copyright 2020-2023, University of Colorado Boulder

/**
 * Main view class for the Waves screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { VBox } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import { ConcentrationControlMode } from '../../common/model/ConcentrationModel.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import EnergyLegend from '../../common/view/EnergyLegend.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import WavesModel from '../model/WavesModel.js';
import CloudCheckbox from './CloudCheckbox.js';
import IrWavesSoundGenerator from './IrWavesSoundGenerator.js';
import SurfaceTemperatureCheckbox from './SurfaceTemperatureCheckbox.js';
import WaveLandscapeObservationWindow from './WaveLandscapeObservationWindow.js';
import WavesScreenSummaryContentNode from './WavesScreenSummaryContentNode.js';

class WavesScreenView extends GreenhouseEffectScreenView {

  public constructor( model: WavesModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, light waves, etc.
    const observationWindow = new WaveLandscapeObservationWindow( model, {

      // phet-io
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    const timeControlNode = new LayersModelTimeControlNode( model, {

      // Requested in https://github.com/phetsims/greenhouse-effect/issues/158 that the TimeControlNode
      // for this screen does not have speed radio buttons or a step forward button
      timeSpeedProperty: null,
      playPauseStepButtonOptions: {
        includeStepForwardButton: false,

        // unique description about the observation window since there are no speed or step buttons in this case
        playingDescription: GreenhouseEffectStrings.a11y.timeControls.playPauseButtonPlayingDescriptionStringProperty,
        pausedDescription: GreenhouseEffectStrings.a11y.timeControls.playPauseButtonPausedDescriptionStringProperty
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {
      energyLegendOptions: {
        energyRepresentation: EnergyLegend.EnergyRepresentation.WAVE
      },

      // phet-io
      tandem: tandem,

      // pdom
      screenSummaryContent: new WavesScreenSummaryContentNode( model )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox(
      model.surfaceThermometerVisibleProperty,
      model.surfaceTemperatureKelvinProperty,
      model.temperatureUnitsProperty,
      tandem.createTandem( 'surfaceThermometerCheckbox' )
    );
    const surfaceTemperatureCheckbox = new SurfaceTemperatureCheckbox(
      model.surfaceTemperatureVisibleProperty,
      model,
      tandem.createTandem( 'surfaceTemperatureCheckbox' )
    );

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

    // Responsible for generating descriptions about the changing radiation.
    const radiationDescriber = new RadiationDescriber( model );

    const concentrationControls = new ConcentrationControlPanel(
      this.energyLegend.width,
      model,
      radiationDescriber,
      {

        // phet-io
        tandem: tandem.createTandem( 'concentrationControlPanel' )
      }
    );

    // Add the concentration controls.  It goes into a VBox to support dynamic layout.
    this.legendAndControlsVBox.addChild( concentrationControls );

    // cloud checkbox
    cloudCheckbox.leftBottom = this.observationWindow.rightBottom.plusXY(
      GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING,
      0
    );
    this.addChild( cloudCheckbox );

    // layout code
    const visibilityBox = new VBox( {
      children: [ surfaceThermometerCheckbox, surfaceTemperatureCheckbox ],
      spacing: 5,
      align: 'left'
    } );
    visibilityBox.left = this.observationWindow.left + 5;
    visibilityBox.centerY = this.timeControlNode.centerY;

    concentrationControls.leftTop = this.energyLegend.leftBottom.plusXY(
      0,
      GreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN
    );

    this.addChild( visibilityBox );

    // sound generation
    const irWavesSoundGenerator = new IrWavesSoundGenerator( model, this );
    soundManager.addSoundGenerator( irWavesSoundGenerator );

    // Update this sound generator when the model is stepped.  No need to unlink since this view is never disposed.
    model.steppedEmitter.addListener( irWavesSoundGenerator.step.bind( irWavesSoundGenerator ) );

    // pdom - override the pdomOrders for the supertype to insert subtype components
    this.pdomPlayAreaNode.pdomOrder = [
      this.observationWindow,
      this.energyLegend,
      concentrationControls,
      observationWindow.surfaceThermometer,
      observationWindow.instrumentVisibilityControls,
      cloudCheckbox
    ];
    this.pdomControlAreaNode.pdomOrder = [
      visibilityBox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;