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
import irWaveRadiatingFromGroundSound from '../../../sounds/greenhouse-effect-waves-ir-loop_mp3.js';
import irWaveRadiatingFromAtmosphereSound from '../../../sounds/greenhouse-effect-waves-ir-reemission-loop_mp3.js';
import irWaveEmittedFromAtmosphereSound from '../../../sounds/greenhouse-effect-waves-ir-reemission-starting-sound_mp3.js';
import irWaveEmittedFromGroundSound from '../../../sounds/greenhouse-effect-waves-ir-starting-sound_mp3.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import EnergyLegend from '../../common/view/EnergyLegend.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import CloudCheckbox from './CloudCheckbox.js';
import SurfaceTemperatureCheckbox from './SurfaceTemperatureCheckbox.js';
import WavesScreenSummaryContentNode from './WavesScreenSummaryContentNode.js';
import WavesModel from '../model/WavesModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import WaveLandscapeObservationWindow from './WaveLandscapeObservationWindow.js';

class WavesScreenView extends GreenhouseEffectScreenView {
  private readonly updateSoundLoopLevels: () => void;

  /**
   * @param {WavesModel} model
   * @param {tandem} tandem
   */
  constructor( model: WavesModel, tandem: Tandem ) {

    // Create the observation window that will depict the ground, sky, light waves, etc.
    const observationWindow = new WaveLandscapeObservationWindow(
      model,
      tandem.createTandem( 'observationWindow' ),
      { showTemperatureGlow: true }
    );

    super( model, observationWindow, {
      energyLegendOptions: {
        // @ts-ignore
        energyRepresentation: EnergyLegend.EnergyRepresentation.WAVE
      },

      // phet-io
      tandem: tandem,

      // pdom
      // @ts-ignore - I (jbphet) got stuck on this one and bailed.
      screenSummaryContent: new WavesScreenSummaryContentNode( model )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox( model.surfaceThermometerVisibleProperty, tandem.createTandem( 'surfaceThermometerCheckbox' ) );
    const surfaceTemperatureCheckbox = new SurfaceTemperatureCheckbox( model.surfaceTemperatureVisibleProperty, tandem.createTandem( 'surfaceTemperatureCheckbox' ) );
    const cloudCheckbox = new CloudCheckbox( model.cloudEnabledProperty, tandem.createTandem( 'cloudCheckbox' ) );

    const concentrationControls = new ConcentrationControlPanel(
      this.energyLegend.width,
      model,
      {

        // phet-io
        tandem: tandem.createTandem( 'concentrationControlPanel' )
      }
    );

    // Add the concentration controls.  It goes into a VBox to support dynamic layout.
    // @ts-ignore
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
      // @ts-ignore TODO: Image doesn't have minWidth
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
    // @ts-ignore
    this.addChild( mockup );

    // sound generation
    // TODO: Much of the code below is in a prototype state, and should be cleaned up and perhaps put into a separate
    //       class once the sounds have been finalized.  See
    //       https://github.com/phetsims/greenhouse-effect/issues/36#issuecomment-929642225 and nearby comments.

    const waveLoopMaxOutputLevel = 0.15;

    const irWaveEmittedFromAtmosphereSoundGenerator = new SoundClip( irWaveEmittedFromAtmosphereSound, {
      initialOutputLevel: 0.15,
      enableControlProperties: [ phet.greenhouseEffect.irEmissionFromAtmosphereSoundEnabledProperty ]
    } );
    soundManager.addSoundGenerator( irWaveEmittedFromAtmosphereSoundGenerator );

    const irWaveEmittedFromGroundSoundGenerator = new SoundClip( irWaveEmittedFromGroundSound, {
      initialOutputLevel: 0.15,
      enableControlProperties: [ phet.greenhouseEffect.irEmissionFromGroundSoundEnabledProperty ]
    } );
    soundManager.addSoundGenerator( irWaveEmittedFromGroundSoundGenerator );

    // Create a sound generator for each of the waves that can originate from the ground.
    const irWaveRadiatingFromGroundSoundGenerators: SoundClip[] = [];
    _.times( 3, () => {
      const soundGenerator = new SoundClip( irWaveRadiatingFromGroundSound, {
        initialOutputLevel: waveLoopMaxOutputLevel,
        loop: true,
        enableControlProperties: [
          phet.greenhouseEffect.irWaveFromGroundExistsSoundEnabledProperty,
          model.isPlayingProperty
        ]
      } );
      soundManager.addSoundGenerator( soundGenerator );
      irWaveRadiatingFromGroundSoundGenerators.push( soundGenerator );
    } );

    // Create a sound generator for each of the IR waves that can originate from the atmosphere.
    const irWaveRadiatingFromAtmosphereSoundGenerators: SoundClip[] = [];
    _.times( 3, () => {
      const soundGenerator = new SoundClip( irWaveRadiatingFromAtmosphereSound, {
        initialOutputLevel: waveLoopMaxOutputLevel,
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

    // Watch for new waves that start emanating from the ground and produce the appropriate sounds when they appear.
    model.waveGroup.countProperty.link( ( numberOfWaves, previousNumberOfWaves ) => {

      // Fire off the one-shot sounds as new IR waves come into being.
      if ( previousNumberOfWaves !== null && numberOfWaves > previousNumberOfWaves ) {
        const mostRecentlyAddedWave = model.waveGroup.getElement( numberOfWaves - 1 );

        if ( mostRecentlyAddedWave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH &&
             mostRecentlyAddedWave.propagationDirection.y > 0 ) {

          // A wave has been added that is coming from the ground, so play the sound that indicates this.
          irWaveEmittedFromGroundSoundGenerator.play();
        }
      }

      const numberOfUpwardMovingIRWaves = model.waveGroup.getArray().reduce( ( previousCount, wave ) => {
        if ( wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH && wave.propagationDirection.y > 0 ) {
          previousCount++;
        }
        return previousCount;
      }, 0 );

      assert && assert(
        numberOfUpwardMovingIRWaves <= irWaveRadiatingFromGroundSoundGenerators.length,
        'The number of waves from the ground exceeds the number of sound generators for ground-produced IR waves.'
      );

      // Make sure that the number of sound generators playing is equal to the number of waves coming from the ground.
      irWaveRadiatingFromGroundSoundGenerators.forEach( ( soundGenerator, index ) => {
        if ( !soundGenerator.isPlaying && numberOfUpwardMovingIRWaves > index ) {
          soundGenerator.play();
        }
        else if ( soundGenerator.isPlaying && numberOfUpwardMovingIRWaves <= index ) {
          soundGenerator.stop();
        }
      } );
    } );

    // Play the sounds related to IR interactions with the atmosphere.
    model.waveAtmosphereInteractions.lengthProperty.lazyLink(
      ( numberOfInteractions: number, previousNumberOfInteractions: number ) => {

        // Play a one-shot sound each time a new interaction starts.
        if ( numberOfInteractions > previousNumberOfInteractions ) {
          irWaveEmittedFromAtmosphereSoundGenerator.play();
        }

        // Make sure that the number of sound generators playing is equal to the number of waves coming from the atmosphere.
        irWaveRadiatingFromAtmosphereSoundGenerators.forEach( ( soundGenerator, index ) => {
          if ( !soundGenerator.isPlaying && numberOfInteractions > index ) {
            soundGenerator.play();
          }
          else if ( soundGenerator.isPlaying && numberOfInteractions <= index ) {
            soundGenerator.stop();
          }
        } );
      }
    );

    // A method that is intended to be called during stepping to update the output levels of the loops to match the
    // intensities of the waves to which they correspond.
    // TODO: This way of doing the updates to the output levels of the loops and the code contained herein are all quite
    //       sub-optimal, since it is inefficient.  If we end up keeping the loops and mapping their intensities to the
    //       output levels of the loops, the Wave class should be modified to use a Property for the intensity, and then
    //       this can be used to adjust the output levels.
    this.updateSoundLoopLevels = () => {
      let wavesFromGroundOutputLevel = waveLoopMaxOutputLevel;
      let wavesFromAtmosphereOutputLevel = waveLoopMaxOutputLevel;
      if ( phet.greenhouseEffect.mapIrWaveLoopOutputLevelsToIntensitiesProperty.value ) {

        model.waveGroup.forEach( wave => {
          if ( wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH && wave.propagationDirection.y > 0 ) {
            wavesFromGroundOutputLevel = waveLoopMaxOutputLevel * wave.intensityAtStart;
          }
          else if ( wave.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH && wave.propagationDirection.y < 0 ) {
            wavesFromAtmosphereOutputLevel = waveLoopMaxOutputLevel * wave.intensityAtStart;
          }
        } );
      }
      irWaveRadiatingFromGroundSoundGenerators.forEach( soundGenerator => {
        if ( soundGenerator.isPlaying && soundGenerator.getOutputLevel() !== wavesFromGroundOutputLevel ) {
          soundGenerator.setOutputLevel( wavesFromGroundOutputLevel );
        }
      } );
      irWaveRadiatingFromAtmosphereSoundGenerators.forEach( soundGenerator => {
        if ( soundGenerator.isPlaying && soundGenerator.getOutputLevel() !== wavesFromAtmosphereOutputLevel ) {
          soundGenerator.setOutputLevel( wavesFromAtmosphereOutputLevel );
        }
      } );
    };

    // pdom - override the pdomOrders for the supertype to insert subtype components
    // @ts-ignore
    this.pdomPlayAreaNode.pdomOrder = [
      this.energyLegend,
      this.observationWindow,
      concentrationControls,
      cloudCheckbox
    ];
    // @ts-ignore
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

  /**
   * @public
   */
  step() {
    this.updateSoundLoopLevels();
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;