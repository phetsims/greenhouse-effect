// Copyright 2014-2019, University of Colorado Boulder

/**
 * View for Molecules and Light
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 *
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LightSpectrumDialog = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/LightSpectrumDialog' );
  const malSoundOptionsDialogContent = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/malSoundOptionsDialogContent' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const MoleculeSelectionPanel = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/MoleculeSelectionPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ObservationWindow = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/ObservationWindow' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const QuadEmissionFrequencyControlPanel = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/QuadEmissionFrequencyControlPanel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const SpectrumDiagram = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumDiagram' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  const WindowFrameNode = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/WindowFrameNode' );

  // strings
  const spectrumWindowButtonCaptionString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.buttonCaption' );

  // a11y strings
  const spectrumButtonLabelString = MoleculesAndLightA11yStrings.spectrumButtonLabelString.value;
  const spectrumButtonDescriptionString = MoleculesAndLightA11yStrings.spectrumButtonDescriptionString.value;
  const screenSummaryString = MoleculesAndLightA11yStrings.screenSummaryString.value;
  const summaryInteractionHintString = MoleculesAndLightA11yStrings.summaryInteractionHintString.value;
  const playDescriptionString = MoleculesAndLightA11yStrings.playDescriptionString.value;
  const pauseDescriptionString = MoleculesAndLightA11yStrings.pauseDescriptionString.value;
  const stepButtonLabelString = MoleculesAndLightA11yStrings.stepButtonLabelString.value;
  const stepButtonDescriptionString = MoleculesAndLightA11yStrings.stepButtonDescriptionString.value;

  // sounds
  const brokeApartSoundInfo = require( 'sound!MOLECULES_AND_LIGHT/break-apart.mp3' );
  const moleculeEnergizedLoopInfo = require( 'sound!MOLECULES_AND_LIGHT/glow-loop.mp3' );
  const moleculeEnergizedStartSoundInfo = require( 'sound!MOLECULES_AND_LIGHT/glow-start-one-shot.mp3' );
  const rotateSoundInfo = require( 'sound!MOLECULES_AND_LIGHT/rotate-loop.mp3' );
  const vibratingLoopSoundInfo = require( 'sound!MOLECULES_AND_LIGHT/vibration-loop-001.mp3' );
  const vibrationStartSoundInfo = require( 'sound!MOLECULES_AND_LIGHT/vibration-one-shot-for-loop-start.mp3' );
  const microwavePhotonV1SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v1-4th-interval-000.mp3' );
  const infraredPhotonV1SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v1-4th-interval-001.mp3' );
  const visiblePhotonV1SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v1-4th-interval-002.mp3' );
  const ultravioletPhotonV1SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v1-4th-interval-003.mp3' );
  const microwavePhotonV2SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v2-4th-interval-000.mp3' );
  const infraredPhotonV2SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v2-4th-interval-001.mp3' );
  const visiblePhotonV2SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v2-4th-interval-002.mp3' );
  const ultravioletPhotonV2SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v2-4th-interval-003.mp3' );
  const microwavePhotonV3SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v3-4th-interval-000.mp3' );
  const infraredPhotonV3SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v3-4th-interval-001.mp3' );
  const visiblePhotonV3SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v3-4th-interval-002.mp3' );
  const ultravioletPhotonV3SoundInfo = require( 'sound!MOLECULES_AND_LIGHT/photon-v3-4th-interval-003.mp3' );

  // constants
  // Model-view transform for intermediate coordinates.
  const INTERMEDIATE_RENDERING_SIZE = new Dimension2( 500, 300 );

  // Location of the top left corner of the observation window.
  const OBSERVATION_WINDOW_LOCATION = new Vector2( 15, 15 );

  // Corner radius of the observation window.
  const CORNER_RADIUS = 7;

  // Line width of the observation window frame
  const FRAME_LINE_WIDTH = 5;

  // Photon wavelengths in order from longest to shortest
  const ORDERED_WAVELENGTHS = [
    WavelengthConstants.MICRO_WAVELENGTH,
    WavelengthConstants.IR_WAVELENGTH,
    WavelengthConstants.VISIBLE_WAVELENGTH,
    WavelengthConstants.UV_WAVELENGTH
  ];

  /**
   * Constructor for the screen view of Molecules and Light.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculesAndLightScreenView( photonAbsorptionModel, tandem ) {

    const summaryNode = new Node( {
      tagName: 'p',
      accessibleName: screenSummaryString
    } );

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem,
      screenSummaryContent: summaryNode
    } );

    // interaction hint and keyboard shortcuts
    summaryNode.addChild( new Node( { tagName: 'p', innerContent: summaryInteractionHintString } ) );

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( Util.roundSymmetric( INTERMEDIATE_RENDERING_SIZE.width * 0.55 ),
        Util.roundSymmetric( INTERMEDIATE_RENDERING_SIZE.height * 0.50 ) ),
      0.10 ); // Scale factor - Smaller number zooms out, bigger number zooms in.

    // Create the observation window.  This will hold all photons, molecules, and photonEmitters for this photon
    // absorption model.
    const observationWindow = new ObservationWindow(
      photonAbsorptionModel,
      modelViewTransform,
      tandem.createTandem( 'observationWindow' )
    );
    this.playAreaNode.addChild( observationWindow );

    // This rectangle hides photons that are outside the observation window.
    // TODO: This rectangle is a temporary workaround that replaces the clipping area in ObservationWindow because of a
    // Safari specific SVG bug caused by clipping.  See https://github.com/phetsims/molecules-and-light/issues/105 and
    // https://github.com/phetsims/scenery/issues/412.
    const clipRectangle = new Rectangle( observationWindow.bounds.copy().dilate( 4 * FRAME_LINE_WIDTH ),
      CORNER_RADIUS, CORNER_RADIUS, {
        stroke: '#C5D6E8',
        lineWidth: 8 * FRAME_LINE_WIDTH
      } );
    this.playAreaNode.addChild( clipRectangle );

    // Create the window frame node that borders the observation window.
    const windowFrameNode = new WindowFrameNode( observationWindow, '#BED0E7', '#4070CE' );
    this.playAreaNode.addChild( windowFrameNode );

    // Set positions of the observation window and window frame.
    observationWindow.translate( OBSERVATION_WINDOW_LOCATION );
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
    this.controlAreaNode.addChild( resetAllButton );

    // Add play/pause button.
    const playPauseButton = new PlayPauseButton( photonAbsorptionModel.runningProperty, {
      bottom: moleculeControlPanel.bottom + 60,
      centerX: moleculeControlPanel.centerX - 25,
      radius: 23,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'playPauseButton' ),

      // a11y
      a11yPauseDescription: pauseDescriptionString,
      a11yPlayDescription: playDescriptionString
    } );
    this.controlAreaNode.addChild( playPauseButton );

    // Add step button to manually step the animation.
    const stepButton = new StepForwardButton( {
      isPlayingProperty: photonAbsorptionModel.runningProperty,
      listener: function() { photonAbsorptionModel.manualStep(); },
      centerY: playPauseButton.centerY,
      centerX: moleculeControlPanel.centerX + 25,
      radius: 15,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'stepButton' ),

      // a11y
      innerContent: stepButtonLabelString,
      descriptionContent: stepButtonDescriptionString,
      appendDescription: true
    } );
    this.controlAreaNode.addChild( stepButton );

    // Content for the window that displays the EM spectrum upon request.  Constructed once here so that time is not
    // waisted drawing a new spectrum window every time the user presses the 'Show Light Spectrum' button.
    // @private
    const spectrumButtonLabel = new SpectrumDiagram( tandem.createTandem( 'spectrumButtonLabel' ) );

    // the spectrum dialog, created lazily because Dialog requires sim bounds during construction
    let dialog = null;

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
        if ( !dialog ) {
          dialog = new LightSpectrumDialog( spectrumButtonLabel, tandem.createTandem( 'lightSpectrumDialog' ) );
        }
        dialog.show();

        // if listener was fired because of accessibility
        if ( showLightSpectrumButton.buttonModel.isA11yClicking() ) {
          dialog.focusCloseButton();
        }
      },
      tandem: tandem.createTandem( 'showLightSpectrumButton' ),

      // a11y
      innerContent: spectrumButtonLabelString,
      descriptionContent: spectrumButtonDescriptionString,
      appendDescription: true,
      containerTagName: 'div'
    } );

    // a11y - add an attribute that lets the user know the button opens a menu
    showLightSpectrumButton.setAccessibleAttribute( 'aria-haspopup', true );

    showLightSpectrumButton.center = ( new Vector2( moleculeControlPanel.centerX, photonEmissionControlPanel.centerY - 13 ) );
    this.controlAreaNode.addChild( showLightSpectrumButton );

    // Add the nodes in the order necessary for correct layering.
    this.playAreaNode.addChild( photonEmissionControlPanel );
    this.playAreaNode.addChild( moleculeControlPanel );

    //-----------------------------------------------------------------------------------------------------------------
    // sound generation
    //-----------------------------------------------------------------------------------------------------------------

    // sound to play when molecule becomes "energized", which is depicted as glowing in the view
    const moleculeEnergizedLoop = new SoundClip( moleculeEnergizedLoopInfo, {
      loop: true,
      initialOutputLevel: 0.4
    } );
    soundManager.addSoundGenerator( moleculeEnergizedLoop );
    const moleculeEnergizedStartSound = new SoundClip( moleculeEnergizedStartSoundInfo, {
      initialOutputLevel: 0.7
    } );
    soundManager.addSoundGenerator( moleculeEnergizedStartSound );
    const moleculeEnergizedSoundPlayer = moleculeEnergized => {
      if ( moleculeEnergized ) {
        moleculeEnergizedStartSound.play();
        moleculeEnergizedLoop.play();
      }
      else {
        moleculeEnergizedLoop.stop();
      }
    };

    // broke apart sound
    const brokeApartSound = new SoundClip( brokeApartSoundInfo, { initialOutputLevel: 0.2 } );
    soundManager.addSoundGenerator( brokeApartSound );
    const brokeApartSoundPlayer = () => {
      brokeApartSound.play();
    };

    // molecule rotating sound
    const rotateSound = new SoundClip( rotateSoundInfo, { initialOutputLevel: 0.2, loop: true } );
    soundManager.addSoundGenerator( rotateSound );
    const rotateSoundPlayer = rotating => {
      rotating ? rotateSound.play() : rotateSound.stop();
    };

    // molecule vibration sounds
    const startVibratingSound = new SoundClip( vibrationStartSoundInfo, { initialOutputLevel: 1 } );
    soundManager.addSoundGenerator( startVibratingSound );
    const vibratingLoopSound = new SoundClip( vibratingLoopSoundInfo, { initialOutputLevel: 0.05, loop: true } );
    soundManager.addSoundGenerator( vibratingLoopSound );
    const vibrationSoundPlayer = vibrating => {
      if ( vibrating ) {
        startVibratingSound.play();
        vibratingLoopSound.play();
      }
      else {
        vibratingLoopSound.stop();
      }
    };

    // function that adds all of the listeners involved in creating sound
    const addSoundPlayersToMolecule = molecule => {
      molecule.highElectronicEnergyStateProperty.link( moleculeEnergizedSoundPlayer );
      molecule.brokeApartEmitter.addListener( brokeApartSoundPlayer );
      molecule.rotatingProperty.link( rotateSoundPlayer );
      molecule.vibratingProperty.link( vibrationSoundPlayer );
    };

    // add listeners to molecules for playing the sounds
    photonAbsorptionModel.activeMolecules.forEach( addSoundPlayersToMolecule );
    photonAbsorptionModel.activeMolecules.addItemAddedListener( addSoundPlayersToMolecule );

    // remove listeners when the molecules go away
    photonAbsorptionModel.activeMolecules.addItemRemovedListener( function( removedMolecule ) {
      if ( removedMolecule.highElectronicEnergyStateProperty.hasListener( moleculeEnergizedSoundPlayer ) ) {
        removedMolecule.highElectronicEnergyStateProperty.unlink( moleculeEnergizedSoundPlayer );
      }
      if ( removedMolecule.brokeApartEmitter.hasListener( brokeApartSoundPlayer ) ) {
        removedMolecule.brokeApartEmitter.removeListener( brokeApartSoundPlayer );
      }
      if ( removedMolecule.rotatingProperty.hasListener( rotateSoundPlayer ) ) {
        removedMolecule.rotatingProperty.unlink( rotateSoundPlayer );
      }
      if ( removedMolecule.vibratingProperty.hasListener( vibrationSoundPlayer ) ) {
        removedMolecule.vibratingProperty.unlink( vibrationSoundPlayer );
      }
    } );

    // photon generation sounds (i.e. the photons coming from the lamps)
    const photonSoundClipOptions = { initialOutputLevel: 0.3 };

    // TODO: Once the photon sound set is finalized, use a Map here instead of a 2D array
    const photonEmissionSoundPlayers = [
      [
        new SoundClip( microwavePhotonV1SoundInfo, photonSoundClipOptions ),
        new SoundClip( infraredPhotonV1SoundInfo, photonSoundClipOptions ),
        new SoundClip( visiblePhotonV1SoundInfo, photonSoundClipOptions ),
        new SoundClip( ultravioletPhotonV1SoundInfo, photonSoundClipOptions )
      ],
      [
        new SoundClip( microwavePhotonV2SoundInfo, photonSoundClipOptions ),
        new SoundClip( infraredPhotonV2SoundInfo, photonSoundClipOptions ),
        new SoundClip( visiblePhotonV2SoundInfo, photonSoundClipOptions ),
        new SoundClip( ultravioletPhotonV2SoundInfo, photonSoundClipOptions )
      ],
      [
        new SoundClip( microwavePhotonV3SoundInfo, photonSoundClipOptions ),
        new SoundClip( infraredPhotonV3SoundInfo, photonSoundClipOptions ),
        new SoundClip( visiblePhotonV3SoundInfo, photonSoundClipOptions ),
        new SoundClip( ultravioletPhotonV3SoundInfo, photonSoundClipOptions )
      ]
    ];
    photonEmissionSoundPlayers.forEach( soundSet => {
      soundSet.forEach( soundClip => {
        soundManager.addSoundGenerator( soundClip );
      } );
    } );
    photonAbsorptionModel.photons.addItemAddedListener( photon => {
      const soundSetIndex = malSoundOptionsDialogContent.photonSoundSetProperty.value - 1;
      const soundClipIndex = ORDERED_WAVELENGTHS.indexOf( photon.wavelength );
      photonEmissionSoundPlayers[ soundSetIndex ][ soundClipIndex ].play();
    } );
  }

  moleculesAndLight.register( 'MoleculesAndLightScreenView', MoleculesAndLightScreenView );

  return inherit( ScreenView, MoleculesAndLightScreenView );
} );
