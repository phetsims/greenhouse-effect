// Copyright 2020-2024, University of Colorado Boulder

/**
 * View for Molecules and Light
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 *
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { AriaHasPopUpMutator, HotkeyData, KeyboardListener, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import GreenhouseEffectQueryParameters from '../../common/GreenhouseEffectQueryParameters.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluentMessages from '../../GreenhouseEffectFluentMessages.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import Molecule from '../model/Molecule.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import LightSpectrumDialog from './LightSpectrumDialog.js';
import MicroObservationWindow from './MicroObservationWindow.js';
import MicroScreenSummaryNode from './MicroScreenSummaryNode.js';
import MoleculeActionSoundGenerator from './MoleculeActionSoundGenerator.js';
import MoleculeSelectionPanel from './MoleculeSelectionPanel.js';
import PhotonEmissionSoundGenerator from './PhotonEmissionSoundGenerator.js';
import QuadEmissionFrequencyControlPanel from './QuadEmissionFrequencyControlPanel.js';
import SpectrumDiagram from './SpectrumDiagram.js';
import WindowFrameNode from './WindowFrameNode.js';

const spectrumWindowButtonCaptionStringProperty = GreenhouseEffectStrings.SpectrumWindow.buttonCaptionStringProperty;
const spectrumButtonLabelMessageProperty = GreenhouseEffectFluentMessages.spectrumButtonLabelMessageProperty;
const spectrumButtonDescriptionMessageProperty = GreenhouseEffectFluentMessages.spectrumButtonDescriptionMessageProperty;

// constants
// Model-view transform for intermediate coordinates.
const INTERMEDIATE_RENDERING_SIZE = new Dimension2( 500, 300 );

// Position for the top left corner of the observation window.
const OBSERVATION_WINDOW_POSITION = new Vector2( 15, 15 );

class MicroScreenView extends ScreenView {

  /**
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {Tandem} tandem
   */
  constructor( photonAbsorptionModel, tandem ) {

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( Utils.roundSymmetric( INTERMEDIATE_RENDERING_SIZE.width * 0.55 ),
        Utils.roundSymmetric( INTERMEDIATE_RENDERING_SIZE.height * 0.50 ) ),
      0.10 ); // Scale factor - Smaller number zooms out, bigger number zooms in.

    // Create the observation window. This will hold all photons, molecules, and photonEmitters for this photon
    // absorption model.
    const observationWindow = new MicroObservationWindow(
      photonAbsorptionModel,
      modelViewTransform,
      tandem.createTandem( 'observationWindow' )
    );

    super( {

      // This sim uses non-default layout bounds because it was ported from Java long ago when PhET didn't try to make
      // the bounds consistent and, once a sim is published as phet-io brand, changing the layout bounds is not
      // recommended.  See https://github.com/phetsims/greenhouse-effect/issues/279.
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),

      tandem: tandem,
      screenSummaryContent: new MicroScreenSummaryNode( photonAbsorptionModel, observationWindow.returnMoleculeButtonVisibleProperty )
    } );

    // @private
    this.observationWindow = observationWindow;

    this.addChild( this.observationWindow );

    // Create the window frame node that borders the observation window.
    const windowFrameNode = new WindowFrameNode( this.observationWindow, '#BED0E7', '#4070CE' );
    this.addChild( windowFrameNode );

    // Set positions of the observation window and window frame.
    this.observationWindow.translate( OBSERVATION_WINDOW_POSITION );
    windowFrameNode.translate( OBSERVATION_WINDOW_POSITION );

    // Create the control panel for photon emission frequency.
    const photonEmissionControlPanel = new QuadEmissionFrequencyControlPanel(
      photonAbsorptionModel,
      tandem.createTandem( 'photonEmissionControlPanel' )
    );
    photonEmissionControlPanel.leftTop = ( new Vector2( OBSERVATION_WINDOW_POSITION.x, 350 ) );

    // Create the molecule control panel
    const moleculeControlPanel = new MoleculeSelectionPanel(
      photonAbsorptionModel,
      tandem.createTandem( 'moleculeControlPanel' )
    );
    moleculeControlPanel.leftTop = ( new Vector2( 530, windowFrameNode.top ) );

    // Add reset all button.
    const resetAllButton = new ResetAllButton( {
      listener: () => { photonAbsorptionModel.reset(); },
      bottom: this.layoutBounds.bottom - 15,
      right: this.layoutBounds.right - 15,
      radius: 18,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    const timeControlNode = new TimeControlNode( photonAbsorptionModel.runningProperty, {
      timeSpeedProperty: photonAbsorptionModel.timeSpeedProperty,
      speedRadioButtonGroupOnLeft: true,
      playPauseStepButtonOptions: {

        // pdom
        playingHelpText: GreenhouseEffectFluentMessages.timeControlsPlayPauseButtonPlayingWithSpeedDescriptionMessageProperty,
        pausedHelpText: GreenhouseEffectFluentMessages.timeControlsPlayPauseButtonPausedWithSpeedDescriptionMessageProperty,

        playPauseButtonOptions: {
          radius: 23
        },
        stepForwardButtonOptions: {
          radius: 15,

          // assuming 60 frames per second
          listener: () => { photonAbsorptionModel.manualStep( 1 / 60 ); }
        }
      },
      speedRadioButtonGroupOptions: {
        labelOptions: {
          maxWidth: 100 // i18n
        }
      },
      buttonGroupXSpacing: 25,

      centerBottom: moleculeControlPanel.centerBottom.plusXY( 0, 65 ),

      tandem: tandem.createTandem( 'timeControlNode' )
    } );
    this.addChild( timeControlNode );

    // @private
    const lightSpectrumDialog = new LightSpectrumDialog(
      new SpectrumDiagram( tandem.createTandem( 'spectrumButtonLabelText' ) ),
      tandem.createTandem( 'lightSpectrumDialog' )
    );

    // Add the button for displaying the electromagnetic spectrum. Scale down the button content when it gets too
    // large.  This is done to support translations.  Max width of this button is the width of the molecule control
    // panel minus twice the default x margin of a rectangular push button.
    const buttonContent = new Text( spectrumWindowButtonCaptionStringProperty, { font: new PhetFont( 18 ) } );
    if ( buttonContent.width > moleculeControlPanel.width - 16 ) {
      buttonContent.scale( ( moleculeControlPanel.width - 16 ) / buttonContent.width );
    }
    const showLightSpectrumButton = new RectangularPushButton( {
      content: buttonContent,
      baseColor: 'rgb(98, 173, 205)',
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      listener: () => {
        lightSpectrumDialog.show();
      },
      tandem: tandem.createTandem( 'showLightSpectrumButton' ),

      // turn off default sound generation since dialog makes a sound when it opens
      soundPlayer: nullSoundPlayer,

      // pdom
      innerContent: spectrumButtonLabelMessageProperty,
      descriptionContent: spectrumButtonDescriptionMessageProperty,
      appendDescription: true,
      containerTagName: 'div'
    } );

    // pdom - add an attribute that lets the user know the button opens a menu
    AriaHasPopUpMutator.mutateNode( showLightSpectrumButton, true );

    showLightSpectrumButton.centerTop = ( new Vector2( moleculeControlPanel.centerX, timeControlNode.bottom + 13 ) );
    this.addChild( showLightSpectrumButton );

    // Add the nodes in the order necessary for correct layering.
    this.addChild( photonEmissionControlPanel );
    this.addChild( moleculeControlPanel );

    // pdom - the accessible order for contents in each PDOM section
    this.pdomPlayAreaNode.pdomOrder = [ this.observationWindow, photonEmissionControlPanel, moleculeControlPanel ];
    this.pdomControlAreaNode.pdomOrder = [ timeControlNode, showLightSpectrumButton, resetAllButton ];

    // sound generation
    const stepForwardSoundPlayer = sharedSoundPlayers.get( 'stepForward' );


    KeyboardListener.createGlobal( timeControlNode, {
      keyStringProperties: MicroScreenView.STEP_FORWARD_HOTKEY_DATA.keyStringProperties,
      fireOnDown: false,
      fire: () => {
        if ( !photonAbsorptionModel.runningProperty.get() ) {

          // The global hotkey step has a larger time step so that it is easier for the photon to reach the molecule
          // and provide feedback for a non-visual experience. The timeStep is calculated so that a photon can never
          // move farther than the absorption window of a molecule in a single step and pass over the molecule without
          // checking for absorption.
          const timeStep = 2 * Molecule.PHOTON_ABSORPTION_DISTANCE / PhotonAbsorptionModel.PHOTON_VELOCITY;
          photonAbsorptionModel.manualStep( timeStep );

          stepForwardSoundPlayer.play();
        }
      }
    } );

    // the light spectrum dialog and emission frequency control panel are removed in the
    // Open Sci Ed version
    if ( GreenhouseEffectQueryParameters.openSciEd ) {
      this.removeChild( showLightSpectrumButton );
      this.removeChild( photonEmissionControlPanel );
    }

    //-----------------------------------------------------------------------------------------------------------------
    // sound generation
    //-----------------------------------------------------------------------------------------------------------------

    // add the sound generator that will produce sound for the molecule actions, such as vibration, rotation, etc.
    soundManager.addSoundGenerator( new MoleculeActionSoundGenerator(
      photonAbsorptionModel.activeMolecules,
      photonAbsorptionModel.runningProperty,
      photonAbsorptionModel.slowMotionProperty
    ) );

    // Add the sound generator that will produce sounds when photons are emitted by the lamps or the active molecule.
    soundManager.addSoundGenerator( new PhotonEmissionSoundGenerator( photonAbsorptionModel.photonGroup ) );
  }

  /**
   * View step, called by joist.
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.observationWindow.step( dt );
  }

  // Alternative Input - no matter where focus is in the document, pressing Alt+L will manually step forward
  // in time
  static STEP_FORWARD_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( 'alt+l' ) ],

    // TODO: This string lives in molecules-and-light, determine the best way to move it to greenhouse-effect,
    //   See https://github.com/phetsims/greenhouse-effect/issues/271
    binderName: 'When action is paused step forward in bigger steps',
    repoName: greenhouseEffect.name,
    global: true
  } );
}

greenhouseEffect.register( 'MicroScreenView', MicroScreenView );
export default MicroScreenView;