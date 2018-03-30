// Copyright 2014-2017, University of Colorado Boulder

/**
 * View for Molecules and Light
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  var MoleculeSelectionPanel = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/MoleculeSelectionPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ObservationWindow = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/ObservationWindow' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var QuadEmissionFrequencyControlPanel = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/QuadEmissionFrequencyControlPanel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpectrumDiagram = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumDiagram' );
  var SpectrumWindowDialog = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumWindowDialog' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var WindowFrameNode = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/WindowFrameNode' );

  // strings
  var spectrumWindowButtonCaptionString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.buttonCaption' );

  // a11y strings
  var spectrumButtonLabelString = MoleculesAndLightA11yStrings.spectrumButtonLabelString.value;
  var spectrumButtonDescriptionString = MoleculesAndLightA11yStrings.spectrumButtonDescriptionString.value;
  var sceneSummaryString = MoleculesAndLightA11yStrings.sceneSummaryString.value;
  var summaryInteractionHintString = MoleculesAndLightA11yStrings.summaryInteractionHintString.value;
  var keyboardShortcutsHintString = MoleculesAndLightA11yStrings.keyboardShortcutsHintString.value;
  var playDescriptionString = MoleculesAndLightA11yStrings.playDescriptionString.value;
  var pauseDescriptionString = MoleculesAndLightA11yStrings.pauseDescriptionString.value;
  var stepButtonLabelString = MoleculesAndLightA11yStrings.stepButtonLabelString.value;
  var stepButtonDescriptionString = MoleculesAndLightA11yStrings.stepButtonDescriptionString.value;

  // constants
  // Model-view transform for intermediate coordinates.
  var INTERMEDIATE_RENDERING_SIZE = new Dimension2( 500, 300 );

  // Location of the top left corner of the observation window.
  var OBSERVATION_WINDOW_LOCATION = new Vector2( 15, 15 );

  // Corner radius of the observation window.
  var CORNER_RADIUS = 7;

  // Line width of the observation window frame
  var FRAME_LINE_WIDTH = 5;

  /**
   * Constructor for the screen view of Molecules and Light.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculesAndLightScreenView( photonAbsorptionModel, tandem ) {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem
    } );

    var summaryNode = new AccessibleSectionNode( 'Scene Summary', {
      descriptionTagName: 'p',
      accessibleDescription: sceneSummaryString
    } );

    // interaction hint and keyboard shortcuts
    summaryNode.addChild( new Node( { tagName: 'p', innerContent: summaryInteractionHintString } ) );
    summaryNode.addChild( new Node( { tagName: 'p', innerContent: keyboardShortcutsHintString } ) );

    var playAreaSectionNode = new AccessibleSectionNode( 'Play Area' );

    var controlPanelSectionNode = new AccessibleSectionNode( 'Control Panel' );

    this.addChild( summaryNode );
    this.addChild( playAreaSectionNode );
    this.addChild( controlPanelSectionNode );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( Math.round( INTERMEDIATE_RENDERING_SIZE.width * 0.55 ),
        Math.round( INTERMEDIATE_RENDERING_SIZE.height * 0.50 ) ),
      0.10 ); // Scale factor - Smaller number zooms out, bigger number zooms in.

    // Create the observation window.  This will hold all photons, molecules, and photonEmitters for this photon
    // absorption model.
    var observationWindow = new ObservationWindow( photonAbsorptionModel, modelViewTransform, tandem.createTandem( 'observationWindow' ) );
    playAreaSectionNode.addChild( observationWindow );

    // This rectangle hides photons that are outside the observation window.
    // TODO: This rectangle is a temporary workaround that replaces the clipping area in ObservationWindow because of a
    // Safari specific SVG bug caused by clipping.  See https://github.com/phetsims/molecules-and-light/issues/105 and
    // https://github.com/phetsims/scenery/issues/412.
    var clipRectangle = new Rectangle( observationWindow.bounds.copy().dilate( 4 * FRAME_LINE_WIDTH ),
      CORNER_RADIUS, CORNER_RADIUS, {
        stroke: '#C5D6E8',
        lineWidth: 8 * FRAME_LINE_WIDTH
      } );
    playAreaSectionNode.addChild( clipRectangle );

    // Create the window frame node that borders the observation window.
    var windowFrameNode = new WindowFrameNode( observationWindow, '#BED0E7', '#4070CE' );
    playAreaSectionNode.addChild( windowFrameNode );

    // Set positions of the observation window and window frame.
    observationWindow.translate( OBSERVATION_WINDOW_LOCATION );
    clipRectangle.translate( OBSERVATION_WINDOW_LOCATION );
    windowFrameNode.translate( OBSERVATION_WINDOW_LOCATION );

    // Create the control panel for photon emission frequency.
    var photonEmissionControlPanel = new QuadEmissionFrequencyControlPanel( photonAbsorptionModel, tandem.createTandem( 'photonEmissionControlPanel' ) );
    photonEmissionControlPanel.leftTop = ( new Vector2( OBSERVATION_WINDOW_LOCATION.x, 350 ) );

    // Create the molecule control panel
    var moleculeControlPanel = new MoleculeSelectionPanel( photonAbsorptionModel, tandem.createTandem( 'moleculeControlPanel' ) );
    moleculeControlPanel.leftTop = ( new Vector2( 530, windowFrameNode.top ) );

    // Add reset all button.
    var resetAllButton = new ResetAllButton( {
      listener: function() { photonAbsorptionModel.reset(); },
      bottom: this.layoutBounds.bottom - 15,
      right: this.layoutBounds.right - 15,
      radius: 18,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    controlPanelSectionNode.addChild( resetAllButton );

    // Add play/pause button.
    var playPauseButton = new PlayPauseButton( photonAbsorptionModel.runningProperty, {
      bottom: moleculeControlPanel.bottom + 60,
      centerX: moleculeControlPanel.centerX - 25,
      radius: 23,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'playPauseButton' ),

      // a11y
      a11yPauseDescription: pauseDescriptionString,
      a11yPlayDescription: playDescriptionString
    } );
    controlPanelSectionNode.addChild( playPauseButton );

    // Add step button to manually step the animation.
    var stepButton = new StepForwardButton( {
      playingProperty: photonAbsorptionModel.runningProperty,
      listener: function() { photonAbsorptionModel.manualStep(); },
      centerY: playPauseButton.centerY,
      centerX: moleculeControlPanel.centerX + 25,
      radius: 15,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'stepButton' ),

      // a11y
      innerContent: stepButtonLabelString,
      accessibleDescription: stepButtonDescriptionString
    } );
    controlPanelSectionNode.addChild( stepButton );

    // Content for the window that displays the EM spectrum upon request.  Constructed once here so that time is not
    // waisted drawing a new spectrum window every time the user presses the 'Show Light Spectrum' button.
    // @private
    var spectrumButtonLabel = new SpectrumDiagram( tandem.createTandem( 'spectrumButtonLabel' ) );

    // the spectrum dialog, created lazily because Dialog requires sim bounds during construction
    var dialog = null;

    // Add the button for displaying the electromagnetic spectrum. Scale down the button content when it gets too
    // large.  This is done to support translations.  Max width of this button is the width of the molecule control
    // panel minus twice the default x margin of a rectangular push button.
    var buttonContent = new Text( spectrumWindowButtonCaptionString, { font: new PhetFont( 18 ) } );
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
          dialog = new SpectrumWindowDialog( spectrumButtonLabel, showLightSpectrumButton, tandem.createTandem( 'spectrumWindowDialog' ) );
        }
        dialog.show();
      },
      accessibleFire: function() {

        // if (and only if) the dialog is opened with the keyboard, send focus directly to the close button
        assert && assert( dialog, 'No dialog was created, nothing to focus.' );
        dialog.closeButton.focus();
      },
      tandem: tandem.createTandem( 'showLightSpectrumButton' ),

      // a11y
      innerContent: spectrumButtonLabelString,
      accessibleDescription: spectrumButtonDescriptionString,
      containerTagName: 'div'
    } );

    // a11y - add an attribute that lets the user know the button opens a menu
    showLightSpectrumButton.setAccessibleAttribute( 'aria-haspopup', true );

    showLightSpectrumButton.center = ( new Vector2( moleculeControlPanel.centerX, photonEmissionControlPanel.centerY - 13 ) );
    controlPanelSectionNode.addChild( showLightSpectrumButton );

    // Add the nodes in the order necessary for correct layering.
    playAreaSectionNode.addChild( photonEmissionControlPanel );
    playAreaSectionNode.addChild( moleculeControlPanel );

    // a11y
    // this.accessibleOrder = [ observationWindow, moleculeControlPanel, photonEmissionControlPanel, playPauseButton, stepButton, showLightSpectrumButton, resetAllButton ];
  }

  moleculesAndLight.register( 'MoleculesAndLightScreenView', MoleculesAndLightScreenView );

  return inherit( ScreenView, MoleculesAndLightScreenView );
} );
