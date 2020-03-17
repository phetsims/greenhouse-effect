// Copyright 2014-2020, University of Colorado Boulder

/**
 * View for Molecules and Light
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 *
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import inherit from '../../../../phet-core/js/inherit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import DialogIO from '../../../../sun/js/DialogIO.js';
import Playable from '../../../../tambo/js/Playable.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PhetioCapsule from '../../../../tandem/js/PhetioCapsule.js';
import PhetioCapsuleIO from '../../../../tandem/js/PhetioCapsuleIO.js';
import infraredPhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-ir_mp3.js';
import infraredPhotonInitialEmissionSpatializedSoundInfo from '../../../sounds/photon-000-spatialized_mp3.js';
import microwavePhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-microwave_mp3.js';
import microwavePhotonInitialEmissionSpatializedSoundInfo from '../../../sounds/photon-003-spatialized_mp3.js';
import ultravioletPhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-uv_mp3.js';
import ultravioletPhotonInitialEmissionSpatializedSoundInfo from '../../../sounds/photon-002-spatialized_mp3.js';
import visiblePhotonInitialEmissionSoundInfo from '../../../sounds/photon-emit-visible_mp3.js';
import visiblePhotonInitialEmissionSpatializedSoundInfo from '../../../sounds/photon-003-spatialized_mp3.js';
import infraredPhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-ir_mp3.js';
import microwavePhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-microwave_mp3.js';
import ultravioletPhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-uv_mp3.js';
import visiblePhotonFromMoleculeSoundInfo from '../../../sounds/photon-release-visible_mp3.js';
import MoleculesAndLightConstants from '../../common/MoleculesAndLightConstants.js';
import MoleculesAndLightA11yStrings from '../../common/MoleculesAndLightA11yStrings.js';
import moleculesAndLightStrings from '../../molecules-and-light-strings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import WavelengthConstants from '../../photon-absorption/model/WavelengthConstants.js';
import LightSpectrumDialog from './LightSpectrumDialog.js';
import MoleculeActionSoundGenerator from './MoleculeActionSoundGenerator.js';
import MoleculesAndLightScreenSummaryNode from './MoleculesAndLightScreenSummaryNode.js';
import MoleculeSelectionPanel from './MoleculeSelectionPanel.js';
import ObservationWindow from './ObservationWindow.js';
import QuadEmissionFrequencyControlPanel from './QuadEmissionFrequencyControlPanel.js';
import SpectrumDiagram from './SpectrumDiagram.js';
import WindowFrameNode from './WindowFrameNode.js';

const spectrumWindowButtonCaptionString = moleculesAndLightStrings.SpectrumWindow.buttonCaption;

// a11y strings
const spectrumButtonLabelString = MoleculesAndLightA11yStrings.spectrumButtonLabelString.value;
const spectrumButtonDescriptionString = MoleculesAndLightA11yStrings.spectrumButtonDescriptionString.value;

// constants
// Model-view transform for intermediate coordinates.
const INTERMEDIATE_RENDERING_SIZE = new Dimension2( 500, 300 );

// Location of the top left corner of the observation window.
const OBSERVATION_WINDOW_LOCATION = new Vector2( 15, 15 );

// Corner radius of the observation window.
const CORNER_RADIUS = 7;

// Line width of the observation window frame
const FRAME_LINE_WIDTH = 5;

// volume of photon emission sounds
const PHOTON_INITIAL_EMISSION_OUTPUT_LEVEL = 0.05;
const PHOTON_EMISSION_FROM_MOLECULE_OUTPUT_LEVEL = 0.09;

// X position at which the lamp emission sound is played, empirically determined
const PLAY_LAMP_EMISSION_X_POSITION = -1400;

/**
 * Constructor for the screen view of Molecules and Light.
 *
 * @param {PhotonAbsorptionModel} photonAbsorptionModel
 * @param {Tandem} tandem
 * @constructor
 */
function MoleculesAndLightScreenView( photonAbsorptionModel, tandem ) {

  const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    Vector2.ZERO,
    new Vector2( Utils.roundSymmetric( INTERMEDIATE_RENDERING_SIZE.width * 0.55 ),
      Utils.roundSymmetric( INTERMEDIATE_RENDERING_SIZE.height * 0.50 ) ),
    0.10 ); // Scale factor - Smaller number zooms out, bigger number zooms in.

  // @private - Create the observation window.  This will hold all photons, molecules, and photonEmitters for this photon
  // absorption model.
  this.observationWindow = new ObservationWindow(
    photonAbsorptionModel,
    modelViewTransform,
    tandem.createTandem( 'observationWindow' )
  );

  ScreenView.call( this, {
    layoutBounds: new Bounds2( 0, 0, 768, 504 ),
    tandem: tandem,
    screenSummaryContent: new MoleculesAndLightScreenSummaryNode( photonAbsorptionModel, this.observationWindow.returnMoleculeButtonVisibleProperty )
  } );
  this.pdomPlayAreaNode.addChild( this.observationWindow );


  // This rectangle hides photons that are outside the observation window.
  // TODO: This rectangle is a temporary workaround that replaces the clipping area in ObservationWindow because of a
  // Safari specific SVG bug caused by clipping.  See https://github.com/phetsims/molecules-and-light/issues/105 and
  // https://github.com/phetsims/scenery/issues/412.
  const clipRectangle = new Rectangle( this.observationWindow.bounds.copy().dilate( 4 * FRAME_LINE_WIDTH ),
    CORNER_RADIUS, CORNER_RADIUS, {
      stroke: '#C5D6E8',
      lineWidth: 8 * FRAME_LINE_WIDTH,
      pickable: false
    } );
  this.pdomPlayAreaNode.addChild( clipRectangle );

  // Create the window frame node that borders the observation window.
  const windowFrameNode = new WindowFrameNode( this.observationWindow, '#BED0E7', '#4070CE' );
  this.pdomPlayAreaNode.addChild( windowFrameNode );

  // Set positions of the observation window and window frame.
  this.observationWindow.translate( OBSERVATION_WINDOW_LOCATION );
  clipRectangle.translate( OBSERVATION_WINDOW_LOCATION );
  windowFrameNode.translate( OBSERVATION_WINDOW_LOCATION );

  // Create the control panel for photon emission frequency.
  const photonEmissionControlPanel = new QuadEmissionFrequencyControlPanel(
    photonAbsorptionModel,
    tandem.createTandem( 'photonEmissionControlPanel' )
  );
  photonEmissionControlPanel.leftTop = ( new Vector2( OBSERVATION_WINDOW_LOCATION.x, 350 ) );

  // Create the molecule control panel
  const moleculeControlPanel = new MoleculeSelectionPanel(
    photonAbsorptionModel,
    tandem.createTandem( 'moleculeControlPanel' )
  );
  moleculeControlPanel.leftTop = ( new Vector2( 530, windowFrameNode.top ) );

  // Add reset all button.
  const resetAllButton = new ResetAllButton( {
    listener: function() { photonAbsorptionModel.reset(); },
    bottom: this.layoutBounds.bottom - 15,
    right: this.layoutBounds.right - 15,
    radius: 18,
    tandem: tandem.createTandem( 'resetAllButton' )
  } );
  this.pdomControlAreaNode.addChild( resetAllButton );

  const timeControlNode = new TimeControlNode( photonAbsorptionModel.runningProperty, {
    timeControlSpeedProperty: photonAbsorptionModel.timeControlSpeedProperty,
    speedRadioButtonGroupOnLeft: true,
    playPauseStepButtonOptions: {
      playPauseButtonOptions: {
        radius: 23
      },
      stepForwardButtonOptions: {
        radius: 15,
        listener: function() { photonAbsorptionModel.manualStep(); }
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
  this.pdomControlAreaNode.addChild( timeControlNode );

  // Content for the window that displays the EM spectrum upon request.  Constructed once here so that time is not
  // waisted drawing a new spectrum window every time the user presses the 'Show Light Spectrum' button.
  // @private
  const spectrumButtonLabel = new SpectrumDiagram( tandem.createTandem( 'spectrumButtonLabel' ) );

  const lightSpectrumDialogCapsule = new PhetioCapsule( tandem => {
    return new LightSpectrumDialog( spectrumButtonLabel, tandem );
  }, [], {
    tandem: tandem.createTandem( 'lightSpectrumDialogCapsule' ),
    phetioType: PhetioCapsuleIO( DialogIO )
  } );

  // Add the button for displaying the electromagnetic spectrum. Scale down the button content when it gets too
  // large.  This is done to support translations.  Max width of this button is the width of the molecule control
  // panel minus twice the default x margin of a rectangular push button.
  const buttonContent = new Text( spectrumWindowButtonCaptionString, { font: new PhetFont( 18 ) } );
  if ( buttonContent.width > moleculeControlPanel.width - 16 ) {
    buttonContent.scale( ( moleculeControlPanel.width - 16 ) / buttonContent.width );
  }
  var showLightSpectrumButton = new RectangularPushButton( {
    content: buttonContent,
    baseColor: 'rgb(98, 173, 205)',
    touchAreaXDilation: 7,
    touchAreaYDilation: 7,
    listener: function() {
      const dialog = lightSpectrumDialogCapsule.getInstance();
      dialog.show();

      // if listener was fired because of accessibility
      if ( showLightSpectrumButton.buttonModel.isA11yClicking() ) {
        dialog.focusCloseButton();
      }
    },
    tandem: tandem.createTandem( 'showLightSpectrumButton' ),

    // turn off default sound generation since dialog makes a sound when it opens
    soundPlayer: Playable.NO_SOUND,

    // a11y
    innerContent: spectrumButtonLabelString,
    descriptionContent: spectrumButtonDescriptionString,
    appendDescription: true,
    containerTagName: 'div'
  } );

  // a11y - add an attribute that lets the user know the button opens a menu
  showLightSpectrumButton.setAccessibleAttribute( 'aria-haspopup', true );

  showLightSpectrumButton.centerTop = ( new Vector2( moleculeControlPanel.centerX, timeControlNode.bottom + 13 ) );
  this.pdomPlayAreaNode.addChild( showLightSpectrumButton );

  // Add the nodes in the order necessary for correct layering.
  this.pdomPlayAreaNode.addChild( photonEmissionControlPanel );
  this.pdomPlayAreaNode.addChild( moleculeControlPanel );

  // PDOM - the accessible order for the control area contents
  this.pdomPlayAreaNode.accessibleOrder = [ this.observationWindow, clipRectangle, windowFrameNode, photonEmissionControlPanel, moleculeControlPanel ];
  this.pdomControlAreaNode.accessibleOrder = [ timeControlNode, showLightSpectrumButton, resetAllButton ];

  //-----------------------------------------------------------------------------------------------------------------
  // sound generation
  //-----------------------------------------------------------------------------------------------------------------

  // add the sound generator that will produce sound for the molecule actions, such as vibration, rotation, etc.
  soundManager.addSoundGenerator( new MoleculeActionSoundGenerator(
    photonAbsorptionModel.activeMolecules,
    photonAbsorptionModel.runningProperty,
    photonAbsorptionModel.slowMotionProperty
  ) );

  // photon generation sounds (i.e. the photons coming from the lamps)
  const photonInitialEmissionSoundClipOptions = { initialOutputLevel: PHOTON_INITIAL_EMISSION_OUTPUT_LEVEL };

  // Note - can't use initialization constructor for Map due to lack of support in IE.
  const photonInitialEmissionSoundPlayers = new Map();
  photonInitialEmissionSoundPlayers.set(
    WavelengthConstants.MICRO_WAVELENGTH,
    new SoundClip(
      MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? microwavePhotonInitialEmissionSpatializedSoundInfo : microwavePhotonInitialEmissionSoundInfo,
      photonInitialEmissionSoundClipOptions
    )
  );
  photonInitialEmissionSoundPlayers.set(
    WavelengthConstants.IR_WAVELENGTH,
    new SoundClip(
      MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? infraredPhotonInitialEmissionSpatializedSoundInfo : infraredPhotonInitialEmissionSoundInfo,
      photonInitialEmissionSoundClipOptions
    )
  );
  photonInitialEmissionSoundPlayers.set(
    WavelengthConstants.VISIBLE_WAVELENGTH,
    new SoundClip(
      MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? visiblePhotonInitialEmissionSpatializedSoundInfo : visiblePhotonInitialEmissionSoundInfo,
      photonInitialEmissionSoundClipOptions
    )
  );
  photonInitialEmissionSoundPlayers.set(
    WavelengthConstants.UV_WAVELENGTH,
    new SoundClip(
      MoleculesAndLightConstants.USE_SPATIALIZED_SOUNDS ? ultravioletPhotonInitialEmissionSpatializedSoundInfo : ultravioletPhotonInitialEmissionSoundInfo,
      photonInitialEmissionSoundClipOptions
    )
  );
  photonInitialEmissionSoundPlayers.forEach( value => {
    soundManager.addSoundGenerator( value );
  } );

  // photon re-emissions sounds, i.e. photons that are emitted from a molecule that previously absorbed one
  const photonEmissionFromMoleculeSoundClipOptions = { initialOutputLevel: PHOTON_EMISSION_FROM_MOLECULE_OUTPUT_LEVEL };

  // Note - can't use initialization constructor for Map due to lack of support in IE.
  const photonEmissionFromMoleculeSoundPlayers = new Map();
  photonEmissionFromMoleculeSoundPlayers.set(
    WavelengthConstants.MICRO_WAVELENGTH,
    new SoundClip( microwavePhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
  );
  photonEmissionFromMoleculeSoundPlayers.set(
    WavelengthConstants.IR_WAVELENGTH,
    new SoundClip( infraredPhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
  );
  photonEmissionFromMoleculeSoundPlayers.set(
    WavelengthConstants.VISIBLE_WAVELENGTH,
    new SoundClip( visiblePhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
  );
  photonEmissionFromMoleculeSoundPlayers.set(
    WavelengthConstants.UV_WAVELENGTH,
    new SoundClip( ultravioletPhotonFromMoleculeSoundInfo, photonEmissionFromMoleculeSoundClipOptions )
  );
  photonEmissionFromMoleculeSoundPlayers.forEach( value => {
    soundManager.addSoundGenerator( value );
  } );

  photonAbsorptionModel.photons.addItemAddedListener( photon => {
    if ( photon.locationProperty.value.x < 0 ) {

      // photon was emitted from lamp, use the initial emission sound
      const playEmitFromLampSound = position => {
        if ( position.x >= PLAY_LAMP_EMISSION_X_POSITION ) {
          photonInitialEmissionSoundPlayers.get( photon.wavelength ).play();
          photon.locationProperty.unlink( playEmitFromLampSound );
        }
      };
      photon.locationProperty.link( playEmitFromLampSound );
    }
    else {

      // photon was emitted from lamp, use the secondary emission sound (finalized as of 12/2/2019)
      photonEmissionFromMoleculeSoundPlayers.get( photon.wavelength ).play();
    }
  } );
}

moleculesAndLight.register( 'MoleculesAndLightScreenView', MoleculesAndLightScreenView );

export default inherit( ScreenView, MoleculesAndLightScreenView, {

  /**
   * View step, called by joist.
   * @public
   *
   * @param {number} dt
   * @returns {}
   */
  step( dt ) {
    this.observationWindow.step( dt );
  }
} );