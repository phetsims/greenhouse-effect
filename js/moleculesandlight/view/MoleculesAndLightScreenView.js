// Copyright 2014-2015, University of Colorado Boulder

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
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var QuadEmissionFrequencyControlPanel = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/QuadEmissionFrequencyControlPanel' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var MoleculeSelectionPanel = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/MoleculeSelectionPanel' );
  var ObservationWindow = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/ObservationWindow' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpectrumWindowDialog = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumWindowDialog' );
  var SpectrumDiagram = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumDiagram' );
  var WindowFrameNode = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/WindowFrameNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );

  // strings
  var spectrumWindowButtonCaptionString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.buttonCaption' );

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

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( Math.round( INTERMEDIATE_RENDERING_SIZE.width * 0.55 ),
        Math.round( INTERMEDIATE_RENDERING_SIZE.height * 0.50 ) ),
      0.10 ); // Scale factor - Smaller number zooms out, bigger number zooms in.

    // Create the observation window.  This will hold all photons, molecules, and photonEmitters for this photon
    // absorption model.
    var observationWindow = new ObservationWindow( photonAbsorptionModel, modelViewTransform, tandem.createTandem( 'observationWindow' ) );
    this.addChild( observationWindow );

    // This rectangle hides photons that are outside the observation window.
    // TODO: This rectangle is a temporary workaround that replaces the clipping area in ObservationWindow because of a
    // Safari specific SVG bug caused by clipping.  See https://github.com/phetsims/molecules-and-light/issues/105 and
    // https://github.com/phetsims/scenery/issues/412.
    var clipRectangle = new Rectangle( observationWindow.bounds.copy().dilate( 4 * FRAME_LINE_WIDTH ),
      CORNER_RADIUS, CORNER_RADIUS, {
        stroke: '#C5D6E8',
        lineWidth: 8 * FRAME_LINE_WIDTH
      } );
    this.addChild( clipRectangle );

    // Create the window frame node that borders the observation window.
    var windowFrameNode = new WindowFrameNode( observationWindow, '#BED0E7', '#4070CE' );
    this.addChild( windowFrameNode );

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
    this.addChild( resetAllButton );

    // Add play/pause button.
    var playPauseButton = new PlayPauseButton( photonAbsorptionModel.runningProperty, {
      bottom: moleculeControlPanel.bottom + 60,
      centerX: moleculeControlPanel.centerX - 25,
      radius: 23,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );
    this.addChild( playPauseButton );

    // Add step button to manually step the animation.
    var stepButton = new StepForwardButton( {
      playingProperty: photonAbsorptionModel.runningProperty,
      listener: function() { photonAbsorptionModel.manualStep(); },
      centerY: playPauseButton.centerY,
      centerX: moleculeControlPanel.centerX + 25,
      radius: 15,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'stepButton' )
    } );
    this.addChild( stepButton );

    // Content for the window that displays the EM spectrum upon request.  Constructed once here so that time is not
    // waisted drawing a new spectrum window every time the user presses the 'Show Light Spectrum' button.
    // @private
    var spectrumDiagram = new SpectrumDiagram( tandem.createTandem( 'spectrumDiagram' ) );

    // the spectrum dialog, created lazily because Dialog requires sim bounds during construction
    var dialog = null;

    // Add the button for displaying the electromagnetic spectrum. Scale down the button content when it gets too
    // large.  This is done to support translations.  Max width of this button is the width of the molecule control
    // panel minus twice the default x margin of a rectangular push button.
    var buttonContent = new Text( spectrumWindowButtonCaptionString, { font: new PhetFont( 18 ) } );
    if ( buttonContent.width > moleculeControlPanel.width - 16 ) {
      buttonContent.scale( (moleculeControlPanel.width - 16 ) / buttonContent.width );
    }
    var showLightSpectrumButton = new RectangularPushButton( {
      content: buttonContent,
      baseColor: 'rgb(98, 173, 205)',
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      listener: function() {
        if ( !dialog ) {
          dialog = new SpectrumWindowDialog( spectrumDiagram, showLightSpectrumButton, tandem.createTandem( 'spectrumWindowDialog' ) );
        }
        dialog.show();
      },
      accessibleFire: function() {

        // if (and only if) the dialog is opened with the keyboard, send focus directly to the close button
        assert && assert( dialog, 'No dialog was created, nothing to focus.' );
        dialog.closeButton.focus();
      },
      tandem: tandem.createTandem( 'showLightSpectrumButton' )
    } );
    showLightSpectrumButton.center = ( new Vector2( moleculeControlPanel.centerX, photonEmissionControlPanel.centerY - 33 ) );
    this.addChild( showLightSpectrumButton );

    // Add the nodes in the order necessary for correct layering.
    this.addChild( photonEmissionControlPanel );
    this.addChild( moleculeControlPanel );

    // a11y
    this.accessibleOrder = [observationWindow, moleculeControlPanel, photonEmissionControlPanel, playPauseButton, stepButton, showLightSpectrumButton, resetAllButton ];
  }

  moleculesAndLight.register( 'MoleculesAndLightScreenView', MoleculesAndLightScreenView );

  return inherit( ScreenView, MoleculesAndLightScreenView );
} );
