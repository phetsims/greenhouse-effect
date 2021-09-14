// Copyright 2020-2021, University of Colorado Boulder

/**
 * Main view class for the Waves screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import wavesScreenMockup from '../../../images/waves-screen-mockup_png.js';
import irReemissionSound from '../../../sounds/greenhouse-effect-ir-reemission_mp3.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../../common/GreenhouseEffectQueryParameters.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import EnergyLegend from '../../common/view/EnergyLegend.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import CloudCheckbox from './CloudCheckbox.js';
import SurfaceTemperatureCheckbox from './SurfaceTemperatureCheckbox.js';
import WavesScreenSummaryContentNode from './WavesScreenSummaryContentNode.js';

class WavesScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {WavesModel} model
   * @param {tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, {
      energyLegendOptions: {
        energyRepresentation: EnergyLegend.EnergyRepresentation.WAVE
      },

      // phet-io
      tandem: tandem,

      // pdom
      screenSummaryContent: new WavesScreenSummaryContentNode( model )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox( model.surfaceThermometerVisibleProperty, tandem.createTandem( 'surfaceThermometerCheckbox' ) );
    const surfaceTemperatureCheckbox = new SurfaceTemperatureCheckbox( model.surfaceTemperatureVisibleProperty, tandem.createTandem( 'surfaceTemperatureCheckbox' ) );
    const cloudCheckbox = new CloudCheckbox( model.cloudEnabledProperty, tandem.createTandem( 'cloudCheckbox' ) );

    const concentrationControls = new ConcentrationControlPanel(
      this.energyLegend.width,
      model, {

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

    // The mockup is an image that represents the design, and is useful for positioning elements during the early
    // implementation process. TODO - remove prior to publication, see https://github.com/phetsims/greenhouse-effect/issues/16.
    const mockup = new Image( wavesScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: phet.greenhouseEffect.mockupOpacityProperty.value
    } );
    phet.greenhouseEffect.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // layout code
    const visibilityBox = new VBox( {
      children: [ surfaceThermometerCheckbox, surfaceTemperatureCheckbox ],
      spacing: 5,
      align: 'left'
    } );
    visibilityBox.left = this.observationWindow.left + 5;
    visibilityBox.centerY = this.timeControlNode.centerY;

    concentrationControls.leftTop = this.energyLegend.leftBottom.plusXY( 0, 10 );

    this.addChild( visibilityBox );
    this.addChild( mockup );

    // sound generation
    const irReemissionSoundGenerator = new SoundClip( irReemissionSound, {
      initialOutputLevel: GreenhouseEffectQueryParameters.soundscape ? 0.1 : 0,
      enableControlProperties: [ phet.greenhouseEffect.irReemissionSoundEnabled ]
    } );
    soundManager.addSoundGenerator( irReemissionSoundGenerator );
    model.waveGroup.countProperty.link( ( numberOfWaves, previousNumberOfWaves ) => {
      if ( numberOfWaves > previousNumberOfWaves ) {
        const mostRecentlyAddedWave = model.waveGroup.getElement( numberOfWaves - 1 );

        // If the newly added wave is downward-moving and infrared, produce the sound.
        if ( mostRecentlyAddedWave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
             mostRecentlyAddedWave.directionOfTravel.y < 0 ) {

          irReemissionSoundGenerator.play();
        }
      }
    } );

    // pdom - override the pdomOrders for the supertype to insert subtype components
    this.pdomPlayAreaNode.pdomOrder = [
      this.energyLegend,
      this.observationWindow,
      concentrationControls,
      cloudCheckbox
    ];
    this.pdomControlAreaNode.pdomOrder = [
      visibilityBox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  /**
   * Reset view components.
   * @protected
   * @override
   */
  reset() {
    super.reset();
    this.observationWindow.reset();
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;