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
import irWaveEmittedFromAtmosphereSound from '../../../sounds/greenhouse-effect-waves-ir-reemission-starting-sound_mp3.js';
import irWaveEmittedFromGroundSound from '../../../sounds/greenhouse-effect-waves-ir-starting-sound_mp3.js';
import irWaveRadiatingFromAtmosphereSound from '../../../sounds/greenhouse-effect-waves-ir-reemission-loop_mp3.js';
import irWaveRadiatingFromGroundSound from '../../../sounds/greenhouse-effect-waves-ir-loop_mp3.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../../common/GreenhouseEffectQueryParameters.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import EnergyLegend from '../../common/view/EnergyLegend.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LandscapeObservationWindow from '../../common/view/LandscapeObservationWindow.js';
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

    // Create the observation window that will depict the ground, sky, light waves, etc.
    const observationWindow = new LandscapeObservationWindow(
      model,
      tandem.createTandem( 'observationWindow' ),
      { showTemperatureGlow: true }
    );

    super( model, observationWindow, {
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
    // TODO: Much of the code below is in a prototype state, and should be cleaned up and perhaps put into a separate
    //       class once the sounds have been finalized.  See
    //       https://github.com/phetsims/greenhouse-effect/issues/36#issuecomment-929642225 and nearby comments.
    if ( GreenhouseEffectQueryParameters.soundscape ) {

      const irWaveEmittedFromAtmosphereSoundGenerator = new SoundClip( irWaveEmittedFromAtmosphereSound, {
        initialOutputLevel: 0.1,
        enableControlProperties: [ phet.greenhouseEffect.irEmissionFromAtmosphereSoundEnabledProperty ]
      } );
      soundManager.addSoundGenerator( irWaveEmittedFromAtmosphereSoundGenerator );

      const irWaveEmittedFromGroundSoundGenerator = new SoundClip( irWaveEmittedFromGroundSound, {
        initialOutputLevel: 0.1,
        enableControlProperties: [ phet.greenhouseEffect.irEmissionFromGroundSoundEnabledProperty ]
      } );
      soundManager.addSoundGenerator( irWaveEmittedFromGroundSoundGenerator );

      const maxExpectedIRWavesFromGround = 3;
      // Create a sound generator for each of the waves that can originate from the ground.
      const irWaveRadiatingFromGroundSoundGenerators = [];
      _.times( 3, () => {
        const soundGenerator = new SoundClip( irWaveRadiatingFromGroundSound, {
          initialOutputLevel: 0.1,
          loop: true,
          enableControlProperties: [
            phet.greenhouseEffect.irWaveFromGroundExistsSoundEnabledProperty,
            model.isPlayingProperty
          ]
        } );
        soundManager.addSoundGenerator( soundGenerator );
        irWaveRadiatingFromGroundSoundGenerators.push( soundGenerator );
      } );

      // Create a sound generator for each of the waves that can originate from the atmosphere.
      const irWaveRadiatingFromAtmosphereSoundGenerators = [];
      _.times( 3, () => {
        const soundGenerator = new SoundClip( irWaveRadiatingFromAtmosphereSound, {
          initialOutputLevel: 0.1,
          loop: true,
          enableControlProperties: [
            phet.greenhouseEffect.irWaveFromAtmosphereSoundEnabledProperty,
            model.isPlayingProperty
          ]
        } );
        soundManager.addSoundGenerator( soundGenerator );
        irWaveRadiatingFromAtmosphereSoundGenerators.push( soundGenerator );
      } );

      const irWaveRadiatingFromAtmosphereSoundGenerator = new SoundClip( irWaveRadiatingFromAtmosphereSound, {
        initialOutputLevel: 0.1,
        loop: true,
        enableControlProperties: [ phet.greenhouseEffect.irWaveFromAtmosphereSoundEnabledProperty ]
      } );
      soundManager.addSoundGenerator( irWaveRadiatingFromAtmosphereSoundGenerator );

      model.waveGroup.countProperty.link( ( numberOfWaves, previousNumberOfWaves ) => {

        // Fire off the one-shot sounds as new IR waves come into being.
        if ( numberOfWaves > previousNumberOfWaves ) {
          const mostRecentlyAddedWave = model.waveGroup.getElement( numberOfWaves - 1 );

          if ( mostRecentlyAddedWave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {
            if ( mostRecentlyAddedWave.directionOfTravel.y < 0 ) {
              irWaveEmittedFromAtmosphereSoundGenerator.play();
            }
            else {
              irWaveEmittedFromGroundSoundGenerator.play();
            }
          }
        }

        // Start and stop loops for the IR waves from the ground and the atmosphere.
        let numberOfUpwardMovingIRWaves = 0;
        let numberOfDownwardMovingIRWaves = 0;
        model.waveGroup.forEach( wave => {
          if ( wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {
            if ( wave.directionOfTravel.y > 0 ) {
              numberOfUpwardMovingIRWaves++;
            }
            else {
              numberOfDownwardMovingIRWaves++;
            }
          }
        } );
        _.times( maxExpectedIRWavesFromGround, index => {

          // Start or stop the loops that represent the sounds coming from the atmosphere back to the ground.
          const irWaveRadiatingFromAtmosphereSoundGenerator = irWaveRadiatingFromAtmosphereSoundGenerators[ index ];
          if ( numberOfDownwardMovingIRWaves > index && !irWaveRadiatingFromAtmosphereSoundGenerator.isPlaying ) {
            irWaveRadiatingFromAtmosphereSoundGenerator.play();
          }
          else if ( numberOfDownwardMovingIRWaves <= index && irWaveRadiatingFromAtmosphereSoundGenerator.isPlaying ) {
            irWaveRadiatingFromAtmosphereSoundGenerator.stop();
          }

          // The loops for the waves coming from the ground are only played if the loop for the same wave's interaction
          // and subsequent return to the Earth are NOT being played.
          const numberOfGroundEmissionIRLoopsToPlay = numberOfUpwardMovingIRWaves - numberOfDownwardMovingIRWaves;

          // Start or stop the loops that represent the sounds coming from the atmosphere back to the ground.
          const irWaveRadiatingFromGroundSoundGenerator = irWaveRadiatingFromGroundSoundGenerators[ index ];
          if ( numberOfGroundEmissionIRLoopsToPlay > index && !irWaveRadiatingFromGroundSoundGenerator.isPlaying ) {
            irWaveRadiatingFromGroundSoundGenerator.play();
          }
          else if ( numberOfGroundEmissionIRLoopsToPlay <= index && irWaveRadiatingFromGroundSoundGenerator.isPlaying ) {
            irWaveRadiatingFromGroundSoundGenerator.stop();
          }
        } );
      } );
    }

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
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;