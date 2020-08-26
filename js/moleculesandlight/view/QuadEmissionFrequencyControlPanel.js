// Copyright 2014-2020, University of Colorado Boulder

/**
 * This is a control panel that is intended for use in the play area and that allows the setting of 4 different photon
 * emission frequencies.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import multiSelectionSoundPlayerFactory from '../../../../tambo/js/multiSelectionSoundPlayerFactory.js';
import flashlight2Image from '../../../mipmaps/flashlight_png.js';
import heatLampImage from '../../../mipmaps/infrared-source_png.js';
import microwaveTransmitter from '../../../mipmaps/microwave-source_png.js';
import uvLight2 from '../../../mipmaps/uv-source_png.js';
import moleculesAndLightStrings from '../../moleculesAndLightStrings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import Photon from '../../photon-absorption/model/Photon.js';
import WavelengthConstants from '../../photon-absorption/model/WavelengthConstants.js';
import PhotonNode from '../../photon-absorption/view/PhotonNode.js';

const quadWavelengthSelectorHigherEnergyString = moleculesAndLightStrings.QuadWavelengthSelector.HigherEnergy;
const quadWavelengthSelectorInfraredString = moleculesAndLightStrings.QuadWavelengthSelector.Infrared;
const quadWavelengthSelectorMicrowaveString = moleculesAndLightStrings.QuadWavelengthSelector.Microwave;
const quadWavelengthSelectorUltravioletString = moleculesAndLightStrings.QuadWavelengthSelector.Ultraviolet;
const quadWavelengthSelectorVisibleString = moleculesAndLightStrings.QuadWavelengthSelector.Visible;
const lightSourcesString = moleculesAndLightStrings.a11y.lightSources;
const lightSourceRadioButtonHelpTextString = moleculesAndLightStrings.a11y.lightSourceRadioButtonHelpText;

// Description data for the 'Energy Arrow'
const ARROW_LENGTH = 200;
const ARROW_HEAD_HEIGHT = 15;
const ARROW_HEAD_WIDTH = 20;
const ARROW_TAIL_WIDTH = 1;
const ARROW_COLOR = 'black';

// Create a layout box which holds a single panel of this control panel.
function createRadioButtonContent( emitterImage, photonNode ) {
  emitterImage.scale( 0.27 ); // Scale emitter image to fit in the panel, scale factor determined empirically.
  return new LayoutBox( { orientation: 'horizontal', spacing: 10, children: [ emitterImage, photonNode ] } );
}

/**
 * Constructor for the control panel of emitted photon frequency.
 *
 * @param {PhotonAbsorptionModel} photonAbsorptionModel
 * @param {Tandem} tandem
 * @constructor
 */
function QuadEmissionFrequencyControlPanel( photonAbsorptionModel, tandem ) {

  // Supertype constructor
  Node.call( this, {
    tagName: 'div',
    labelTagName: 'h3',
    labelContent: lightSourcesString,
    descriptionContent: lightSourceRadioButtonHelpTextString
  } );

  // Initialize the photon nodes for the control panel.  Identity model view transform is used because these photon
  // nodes do not correspond to anything in the model.  They are just visual elements of the control panel.
  const identityTransform = ModelViewTransform2.createIdentity();
  const microwavePhotonNode = new PhotonNode(
    new Photon( WavelengthConstants.MICRO_WAVELENGTH, tandem.createTandem( 'microwavePhotonNode' ) ),
    identityTransform
  );
  const infraredPhotonNode = new PhotonNode(
    new Photon( WavelengthConstants.IR_WAVELENGTH, tandem.createTandem( 'infraredPhotonNode' ) ),
    identityTransform
  );
  const visiblePhotonNode = new PhotonNode(
    new Photon( WavelengthConstants.VISIBLE_WAVELENGTH, tandem.createTandem( 'visiblePhotonNode' ) ),
    identityTransform
  );
  const ultravioletPhotonNode = new PhotonNode(
    new Photon( WavelengthConstants.UV_WAVELENGTH, tandem.createTandem( 'ultravioletPhotonNode' ) ),
    identityTransform
  );

  // Load the radio button content into an array of object literals which holds the node, label string, and
  // value for each button.
  const labelFont = new PhetFont( 18 );

  // This is sort of hack to pass through the tandem of the radioButtonGroupMember to its child.
  const microwaveTandemName = 'microwaveRadioButton';
  const infraredTandemName = 'infraredRadioButton';
  const visibleTandemName = 'visibleRadioButton';
  const ultravioletTandemName = 'ultravioletRadioButton';
  const radioButtonGroupTandem = tandem.createTandem( 'radioButtonGroup' );
  const radioButtonContent = [ {
    node: createRadioButtonContent( new Image( microwaveTransmitter ), microwavePhotonNode ),
    value: WavelengthConstants.MICRO_WAVELENGTH,
    label: new Text( quadWavelengthSelectorMicrowaveString, {
      font: labelFont,
      tandem: radioButtonGroupTandem.createTandem( microwaveTandemName ).createTandem( 'microwaveRadioButtonLabel' )
    } ),
    tandemName: microwaveTandemName,
    labelContent: quadWavelengthSelectorMicrowaveString
  }, {
    node: createRadioButtonContent( new Image( heatLampImage ), infraredPhotonNode ),
    value: WavelengthConstants.IR_WAVELENGTH,
    label: new Text( quadWavelengthSelectorInfraredString, {
      font: labelFont,
      tandem: radioButtonGroupTandem.createTandem( infraredTandemName ).createTandem( 'infraredRadioButtonLabel' )
    } ),
    tandemName: infraredTandemName,
    labelContent: quadWavelengthSelectorInfraredString
  }, {
    node: createRadioButtonContent( new Image( flashlight2Image ), visiblePhotonNode ),
    value: WavelengthConstants.VISIBLE_WAVELENGTH,
    label: new Text( quadWavelengthSelectorVisibleString, {
      font: labelFont,
      tandem: radioButtonGroupTandem.createTandem( visibleTandemName ).createTandem( 'visibleRadioButtonLabel' )
    } ),
    tandemName: visibleTandemName,
    labelContent: quadWavelengthSelectorVisibleString
  }, {
    node: createRadioButtonContent( new Image( uvLight2 ), ultravioletPhotonNode ),
    value: WavelengthConstants.UV_WAVELENGTH,
    label: new Text( quadWavelengthSelectorUltravioletString, {
      font: labelFont,
      tandem: radioButtonGroupTandem.createTandem( ultravioletTandemName ).createTandem( 'ultravioletRadioButtonLabel' )
    } ),
    tandemName: ultravioletTandemName,
    labelContent: quadWavelengthSelectorUltravioletString
  } ];

  // Scale the radio button text.  This is done mostly to support translations.
  // Determine the max width of panels in the radio button group.
  const panelWidth = _.maxBy( radioButtonContent, function( content ) { return content.node.width; } ).node.width;

  // Calculate the minimum scale factor that must be applied to each label. Ensures constant font size for all labels.
  let scaleFactor = 1;
  _.each( radioButtonContent, function( content ) {
    const labelWidth = content.label.width;
    scaleFactor = Math.min( scaleFactor, panelWidth / labelWidth );
  } );

  // If necessary, scale down each label by the minimum scale value.
  if ( scaleFactor < 1 ) {
    _.each( radioButtonContent, function( content ) {
      content.label.scale( scaleFactor );
    } );
  }

  // Create sound generators for the radio buttons.  This is done because by default the sound generators for radio
  // button groups decrease in pitch from left to right, but these radio buttons will be selecting higher frequency
  // light from left to right, so this seems more intuitive.
  const radioButtonSoundPlayers = [];
  _.times( radioButtonContent.length, index => {
    radioButtonSoundPlayers.push(
      multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( radioButtonContent.length - index - 1 )
    );
  } );

  const radioButtons = new RadioButtonGroup( photonAbsorptionModel.photonWavelengthProperty, radioButtonContent, {
    orientation: 'horizontal',
    spacing: 15,
    baseColor: 'black',
    selectedStroke: 'rgb(47, 101,209)',
    deselectedLineWidth: 0,
    buttonContentXMargin: 5,
    buttonContentYMargin: 8,
    selectedLineWidth: 3,
    cornerRadius: 7,
    soundPlayers: radioButtonSoundPlayers,
    tandem: radioButtonGroupTandem
  } );

  // Draw an arrow node to illustrate energy of the emitted photons.
  const energyText = new Text( quadWavelengthSelectorHigherEnergyString, { font: new PhetFont( 19 ) } );
  const energyArrow = new ArrowNode( 0, 0, ARROW_LENGTH, 0, {
    fill: ARROW_COLOR,
    stroke: ARROW_COLOR,
    headHeight: ARROW_HEAD_HEIGHT,
    headWidth: ARROW_HEAD_WIDTH,
    tailWidth: ARROW_TAIL_WIDTH,
    tandem: tandem.createTandem( 'energyArrow' )
  } );

  // Scale the text below the arrow node. Max text length is the arrow tail length minus twice the head width.
  if ( energyText.width > ARROW_LENGTH - 2 * ARROW_HEAD_WIDTH ) {
    energyText.scale( ( ARROW_LENGTH - 2 * ARROW_HEAD_WIDTH ) / energyText.width );
  }

  // Set the positions of all components of the control panel.
  energyArrow.centerX = energyText.centerX = radioButtons.centerX; // All have the same center x component.
  energyArrow.top = radioButtons.bottom + 15; // Arrow is below the buttons by an offset which is chosen empirically.
  energyText.top = energyArrow.bottom;

  // Add all components to the control panel.
  this.addChild( radioButtons );
  this.addChild( energyArrow );
  this.addChild( energyText );

  // // pdom - link alerts to the model's wavelength property
  // const handleWavelengthChangeAlert = function( wavelength ) {
  //   const utteranceText = StringUtils.fillIn(
  //     wavelengthSelectionAlertPatternString,
  //     { wavelength: WavelengthConstants.getLightSourceName( wavelength ) }
  //   );
  //   phet.joist.sim.utteranceQueue.addToBack( utteranceText );
  // };

  // photonAbsorptionModel.photonWavelengthProperty.link( handleWavelengthChangeAlert );
}

moleculesAndLight.register( 'QuadEmissionFrequencyControlPanel', QuadEmissionFrequencyControlPanel );

inherit( Node, QuadEmissionFrequencyControlPanel );
export default QuadEmissionFrequencyControlPanel;