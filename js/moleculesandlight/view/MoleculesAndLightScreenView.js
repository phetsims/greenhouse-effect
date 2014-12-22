//  Copyright 2002-2014, University of Colorado Boulder

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
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpectrumWindow = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumWindow' );
  var Plane = require( 'SCENERY/nodes/Plane' );

  // strings
  var buttonCaptionString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.buttonCaption' );

  // Model-view transform for intermediate coordinates.
  var INTERMEDIATE_RENDERING_SIZE = new Dimension2( 500, 300 );

  // Location of the top left corner of the observation window.
  var OBSERVATION_WINDOW_LOCATION = new Vector2( 15, 15 );

  /**
   * Constructor for the screen view of Molecules and Light.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @constructor
   */
  function MoleculesAndLightScreenView( photonAbsorptionModel ) {

    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    var thisScreenView = this;

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( Math.round( INTERMEDIATE_RENDERING_SIZE.width * 0.55 ),
        Math.round( INTERMEDIATE_RENDERING_SIZE.height * 0.50 ) ),
      0.10 ); // Scale factor - Smaller number zooms out, bigger number zooms in.

    // Create the observation window.  This will hold all photons, molecules, and photonEmitters for this photon
    // absorption model.
    var observationWindow = new ObservationWindow( photonAbsorptionModel, modelViewTransform );
    this.addChild( observationWindow );
    observationWindow.translate( OBSERVATION_WINDOW_LOCATION );

    // Create the control panel for photon emission frequency.
    var photonEmissionControlPanel = new QuadEmissionFrequencyControlPanel( photonAbsorptionModel );
    photonEmissionControlPanel.leftTop = ( new Vector2( OBSERVATION_WINDOW_LOCATION.x, 350 ) );

    // Create the molecule control panel
    var moleculeControlPanel = new MoleculeSelectionPanel( photonAbsorptionModel );
    moleculeControlPanel.leftTop = ( new Vector2( 530, observationWindow.top - observationWindow.frameLineWidth ) );

    // Add reset all button.
    var resetAllButton = new ResetAllButton(
      {
        listener: function() { photonAbsorptionModel.reset(); },
        bottom: this.layoutBounds.bottom - 15,
        right: this.layoutBounds.right - 15,
        radius: 18
      } );
    this.addChild( resetAllButton );

    // Add play/pause button.
    var playPauseButton = new PlayPauseButton( photonAbsorptionModel.playProperty,
      {
        bottom: moleculeControlPanel.bottom + 60,
        centerX: moleculeControlPanel.centerX - 25,
        radius: 23
      } );
    this.addChild( playPauseButton );

    // Add step button to manually step the animation.
    var stepButton = new StepButton( function() { photonAbsorptionModel.manualStep(); }, photonAbsorptionModel.playProperty,
      {
        centerY: playPauseButton.centerY,
        centerX: moleculeControlPanel.centerX + 25,
        radius: 15
      } );
    this.addChild( stepButton );

    // Window that displays the EM spectrum upon request.
    var spectrumWindow = new SpectrumWindow();

    // Add the button for displaying the electromagnetic spectrum.
    // Scale down the button content when it gets too large.  This is here to support translations.  Max width of this
    // button is the width of the molecule control panel minus twice the default x margin of a rectangular push button.
    var buttonContent = new Text( buttonCaptionString, {font: new PhetFont( 18 ) } );
    if ( buttonContent.width > moleculeControlPanel.width - 16 ) {
      buttonContent.scale( (moleculeControlPanel.width - 16 ) / buttonContent.width );
    }
    var showSpectrumButton = new RectangularPushButton( {
      content: buttonContent,
      baseColor: 'rgb(98, 173, 205)',
      listener: function() { thisScreenView.updateSpectrumWindowVisibility( spectrumWindow ); }
    } );
    showSpectrumButton.center = ( new Vector2( moleculeControlPanel.centerX, photonEmissionControlPanel.centerY - 33 ) );
    this.addChild( showSpectrumButton );

    // Add the nodes in the order necessary for correct layering.
    this.addChild( photonEmissionControlPanel );
    this.addChild( moleculeControlPanel );
  }

  return inherit( ScreenView, MoleculesAndLightScreenView, {

    /**
     * Update the spectrum window visibility.  The spectrum window has behavior which is identical to the about dialog
     * window, and this code is heavily borrowed from AboutDialog.js.
     *
     * @param {SpectrumWindow} spectrumWindow - The spectrum window whose visibility should be updated.
     * @private
     */
    updateSpectrumWindowVisibility: function( spectrumWindow ) {
      // Renderer must be specified here because the plane is added directly to the scene (instead of to some other node
      // that already has svg renderer)
      var plane = new Plane( {fill: 'black', opacity: 0.3, renderer: 'svg'} );
      this.addChild( plane );
      this.addChild( spectrumWindow );

      var spectrumWindowListener = {up: function() {
        spectrumWindow.removeInputListener( spectrumWindowListener );
        plane.addInputListener( spectrumWindowListener );
        spectrumWindow.detach();
        plane.detach();
      }};

      spectrumWindow.addInputListener( spectrumWindowListener );
      plane.addInputListener( spectrumWindowListener );

    }

  } );

} );
