// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is a control panel that is intended for use in the play area and that allows the setting of 4 different photon
 * emission frequencies.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhotonNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonNode' );
  var Photon = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Photon' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );

  // images
  var heatLampImage = require( 'mipmap!MOLECULES_AND_LIGHT/infrared-source.png' );
  var flashlight2Image = require( 'mipmap!MOLECULES_AND_LIGHT/flashlight.png' );
  var microwaveTransmitter = require( 'mipmap!MOLECULES_AND_LIGHT/microwave-source.png' );
  var uvLight2 = require( 'mipmap!MOLECULES_AND_LIGHT/uv-source.png' );

  // strings
  var microwaveString = require( 'string!MOLECULES_AND_LIGHT/QuadWavelengthSelector.Microwave' );
  var infraredString = require( 'string!MOLECULES_AND_LIGHT/QuadWavelengthSelector.Infrared' );
  var visibleString = require( 'string!MOLECULES_AND_LIGHT/QuadWavelengthSelector.Visible' );
  var ultravioletString = require( 'string!MOLECULES_AND_LIGHT/QuadWavelengthSelector.Ultraviolet' );
  var higherEnergyString = require( 'string!MOLECULES_AND_LIGHT/QuadWavelengthSelector.HigherEnergy' );

  // Description data for the 'Energy Arrow'
  var ARROW_LENGTH = 200;
  var ARROW_HEAD_HEIGHT = 15;
  var ARROW_HEAD_WIDTH = 20;
  var ARROW_TAIL_WIDTH = 1;
  var ARROW_COLOR = 'black';

  // Create a layout box which holds a single panel of this control panel.
  function createRadioButtonContent( emitterImage, photonNode ) {
    emitterImage.scale( 0.27 ); // Scale emitter image to fit in the panel, scale factor determined empirically.
    return new LayoutBox( { orientation: 'horizontal', spacing: 10, children: [ emitterImage, photonNode ] } );
  }

  /**
   * Constructor for the control panel of emitted photon frequency.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {Tandem} tandem - support for exporting instances from the sim
   * @constructor
   */
  function QuadEmissionFrequencyControlPanel( photonAbsorptionModel, tandem ) {

    // Supertype constructor
    Node.call( this );

    // Initialize the photon nodes for the control panel.  Identity model view transform is used because these photon
    // nodes do not correspond to anything in the model.  They are just visual elements of the control panel.
    var identityTransform = ModelViewTransform2.createIdentity();
    var microwavePhotonNode = new PhotonNode( new Photon( WavelengthConstants.MICRO_WAVELENGTH ), identityTransform );
    var infraredPhotonNode = new PhotonNode( new Photon( WavelengthConstants.IR_WAVELENGTH ), identityTransform );
    var visiblePhotonNode = new PhotonNode( new Photon( WavelengthConstants.VISIBLE_WAVELENGTH ), identityTransform );
    var ultravioletPhotonNode = new PhotonNode( new Photon( WavelengthConstants.UV_WAVELENGTH ), identityTransform );

    // Load the radio button content into an array of object literals which holds the node, label string, and
    // value for each button.
    var labelFont = new PhetFont( 18 );
    var radioButtonContent = [
      {
        node: createRadioButtonContent( new Image( microwaveTransmitter ), microwavePhotonNode ),
        value: WavelengthConstants.MICRO_WAVELENGTH,
        label: new Text( microwaveString, { font: labelFont } ),
        tandem: tandem.createTandem( 'microwaveRadioButton' )
      },
      {
        node: createRadioButtonContent( new Image( heatLampImage ), infraredPhotonNode ),
        value: WavelengthConstants.IR_WAVELENGTH,
        label: new Text( infraredString, { font: labelFont } ),
        tandem: tandem.createTandem( 'infraredRadioButton' )
      },
      {
        node: createRadioButtonContent( new Image( flashlight2Image ), visiblePhotonNode ),
        value: WavelengthConstants.VISIBLE_WAVELENGTH,
        label: new Text( visibleString, { font: labelFont } ),
        tandem: tandem.createTandem( 'visibleRadioButton' )
      },
      {
        node: createRadioButtonContent( new Image( uvLight2 ), ultravioletPhotonNode ),
        value: WavelengthConstants.UV_WAVELENGTH,
        label: new Text( ultravioletString, { font: labelFont } ),
        tandem: tandem.createTandem( 'ultravioletRadioButton' )
      }
    ];

    // Scale the radio button text.  This is done mostly to support translations.
    // Determine the max width of panels in the radio button group.
    var panelWidth = _.max( radioButtonContent, function( content ) { return content.node.width; } ).node.width;
    // Calculate the minimum scale factor that must be applied to each label. Ensures constant font size for all labels.
    var scaleFactor = 1;
    _.each( radioButtonContent, function( content ) {
      var labelWidth = content.label.width;
      scaleFactor = Math.min( scaleFactor, panelWidth / labelWidth );
    } );
    // If necessary, scale down each label by the minimum scale value.
    if ( scaleFactor < 1 ) {
      _.each( radioButtonContent, function( content ) {
        content.label.scale( scaleFactor );
      } );
    }

    var radioButtons = new RadioButtonGroup( photonAbsorptionModel.photonWavelengthProperty, radioButtonContent, {
      orientation: 'horizontal',
      spacing: 15,
      baseColor: 'black',
      selectedStroke: 'rgb(47, 101,209)',
      deselectedLineWidth: 0,
      buttonContentXMargin: 5,
      buttonContentYMargin: 8,
      selectedLineWidth: 3,
      cornerRadius: 7
    } );

    // Draw an arrow node to illustrate energy of the emitted photons.
    var energyText = new Text( higherEnergyString, { font: new PhetFont( 19 ) } );
    var energyArrow = new ArrowNode( 0, 0, ARROW_LENGTH, 0, {
      fill: ARROW_COLOR,
      stroke: ARROW_COLOR,
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH,
      tailWidth: ARROW_TAIL_WIDTH
    } );

    // Scale the text below the arrow node. Max text length is the arrow tail length minus twice the head width.
    if ( energyText.width > ARROW_LENGTH - 2 * ARROW_HEAD_WIDTH ) {
      energyText.scale( (ARROW_LENGTH - 2 * ARROW_HEAD_WIDTH ) / energyText.width );
    }

    // Set the positions of all components of the control panel.
    energyArrow.centerX = energyText.centerX = radioButtons.centerX; // All have the same center x component.
    energyArrow.top = radioButtons.bottom + 15; // Arrow is below the buttons by an offset which is chosen empirically.
    energyText.top = energyArrow.bottom;

    // Add all components to the control panel.
    this.addChild( radioButtons );
    this.addChild( energyArrow );
    this.addChild( energyText );
  }

  return inherit( Node, QuadEmissionFrequencyControlPanel );
} );