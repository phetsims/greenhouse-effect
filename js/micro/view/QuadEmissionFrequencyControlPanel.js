// Copyright 2021-2024, University of Colorado Boulder

/**
 * This is a control panel that is intended for use in the play area and that allows the setting of 4 different photon
 * emission frequencies.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Node, Text } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import multiSelectionSoundPlayerFactory from '../../../../tambo/js/multiSelectionSoundPlayerFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import flashlight_png from '../../../mipmaps/flashlight_png.js';
import infraredSource_png from '../../../mipmaps/infraredSource_png.js';
import microwaveSource_png from '../../../mipmaps/microwaveSource_png.js';
import uvSource_png from '../../../mipmaps/uvSource_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluentMessages from '../../GreenhouseEffectFluentMessages.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import MicroPhoton from '../model/MicroPhoton.js';
import WavelengthConstants from '../model/WavelengthConstants.js';
import MicroPhotonNode from './MicroPhotonNode.js';

const quadWavelengthSelectorHigherEnergyStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.HigherEnergyStringProperty;
const quadWavelengthSelectorInfraredStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.InfraredStringProperty;
const quadWavelengthSelectorMicrowaveStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.MicrowaveStringProperty;
const quadWavelengthSelectorUltravioletStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.UltravioletStringProperty;
const quadWavelengthSelectorVisibleStringProperty = GreenhouseEffectStrings.QuadWavelengthSelector.VisibleStringProperty;
const lightSourcesStringProperty = GreenhouseEffectStrings.a11y.lightSourcesStringProperty;
const lightSourceRadioButtonHelpTextStringProperty = GreenhouseEffectStrings.a11y.lightSourceRadioButtonHelpTextStringProperty;

// Description data for the 'Energy Arrow'
const ARROW_LENGTH = 200;
const ARROW_HEAD_HEIGHT = 15;
const ARROW_HEAD_WIDTH = 20;
const ARROW_TAIL_WIDTH = 1;
const ARROW_COLOR = 'black';

// Create a layout box which holds a single panel of this control panel.
const createRadioButtonContent = ( emitterImage, photonNode ) => {
  emitterImage.scale( 0.27 ); // Scale emitter image to fit in the panel, scale factor determined empirically.
  return new HBox( { spacing: 10, sizable: false, children: [ emitterImage, photonNode ] } );
};

class QuadEmissionFrequencyControlPanel extends Node {
  /**
   * Constructor for the control panel of emitted photon frequency.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {Tandem} tandem
   */
  constructor( photonAbsorptionModel, tandem ) {

    // Supertype constructor
    super( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectFluentMessages.lightSourcesMessageProperty,
      descriptionContent: lightSourceRadioButtonHelpTextStringProperty.value
    } );

    // Initialize the photon nodes for the control panel.  Identity model view transform is used because these photon
    // nodes do not correspond to anything in the model.  They are just visual elements of the control panel.
    const identityTransform = ModelViewTransform2.createIdentity();
    const microwavePhotonNode = new MicroPhotonNode(
      new MicroPhoton( WavelengthConstants.MICRO_WAVELENGTH, { tandem: Tandem.OPT_OUT } ),
      identityTransform
    );
    const infraredPhotonNode = new MicroPhotonNode(
      new MicroPhoton( WavelengthConstants.IR_WAVELENGTH, { tandem: Tandem.OPT_OUT } ),
      identityTransform
    );
    const visiblePhotonNode = new MicroPhotonNode(
      new MicroPhoton( WavelengthConstants.VISIBLE_WAVELENGTH, { tandem: Tandem.OPT_OUT } ),
      identityTransform
    );
    const ultravioletPhotonNode = new MicroPhotonNode(
      new MicroPhoton( WavelengthConstants.UV_WAVELENGTH, { tandem: Tandem.OPT_OUT } ),
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
    const microwaveRadioButtonContent = createRadioButtonContent( new Image( microwaveSource_png ), microwavePhotonNode );
    const infraredPhotonRadioButtonContent = createRadioButtonContent( new Image( infraredSource_png ), infraredPhotonNode );
    const visiblePhotonRadioButtonContent = createRadioButtonContent( new Image( flashlight_png ), visiblePhotonNode );
    const ultravioletPhotonRadioButtonContent = createRadioButtonContent( new Image( uvSource_png ), ultravioletPhotonNode );
    const radioButtonContent = [ {
      createNode: () => microwaveRadioButtonContent,
      value: WavelengthConstants.MICRO_WAVELENGTH,
      label: new Text( quadWavelengthSelectorMicrowaveStringProperty, {
        font: labelFont
      } ),
      tandemName: microwaveTandemName,
      options: {
        accessibleName: quadWavelengthSelectorMicrowaveStringProperty.value
      }
    }, {
      createNode: () => infraredPhotonRadioButtonContent,
      value: WavelengthConstants.IR_WAVELENGTH,
      label: new Text( quadWavelengthSelectorInfraredStringProperty, { font: labelFont } ),
      tandemName: infraredTandemName,
      options: {
        accessibleName: quadWavelengthSelectorInfraredStringProperty.value
      }
    }, {
      createNode: () => visiblePhotonRadioButtonContent,
      value: WavelengthConstants.VISIBLE_WAVELENGTH,
      label: new Text( quadWavelengthSelectorVisibleStringProperty, { font: labelFont } ),
      tandemName: visibleTandemName,
      options: {
        accessibleName: quadWavelengthSelectorVisibleStringProperty.value
      }
    }, {
      createNode: () => ultravioletPhotonRadioButtonContent,
      value: WavelengthConstants.UV_WAVELENGTH,
      label: new Text( quadWavelengthSelectorUltravioletStringProperty, { font: labelFont } ),
      tandemName: ultravioletTandemName,
      options: {
        accessibleName: quadWavelengthSelectorUltravioletStringProperty.value
      }
    } ];

    // Scale the radio button text.  This is done mostly to support translations.
    // Determine the max width of panels in the radio button group.
    const panelWidth = _.maxBy( [ microwaveRadioButtonContent, infraredPhotonRadioButtonContent, visiblePhotonRadioButtonContent, ultravioletPhotonRadioButtonContent ], content => content.width ).width;

    // Calculate the minimum scale factor that must be applied to each label. Ensures constant font size for all labels.
    let scaleFactor = 1;
    _.each( radioButtonContent, content => {
      const labelWidth = content.label.width;
      scaleFactor = Math.min( scaleFactor, panelWidth / labelWidth );
    } );

    // If necessary, scale down each label by the minimum scale value.
    if ( scaleFactor < 1 ) {
      _.each( radioButtonContent, content => {
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

    const radioButtonGroup = new RectangularRadioButtonGroup( photonAbsorptionModel.photonWavelengthProperty, radioButtonContent, {
      orientation: 'horizontal',
      spacing: 15,
      radioButtonOptions: {
        baseColor: 'black',
        cornerRadius: 7,
        xMargin: 5,
        yMargin: 8,
        buttonAppearanceStrategyOptions: {
          selectedStroke: 'rgb(47,101,209)',
          selectedLineWidth: 3,
          deselectedLineWidth: 0
        }
      },
      soundPlayers: radioButtonSoundPlayers,
      tandem: radioButtonGroupTandem
    } );

    // Draw an arrow node to illustrate energy of the emitted photons.
    const energyText = new Text( quadWavelengthSelectorHigherEnergyStringProperty, { font: new PhetFont( 19 ) } );
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
    energyArrow.centerX = energyText.centerX = radioButtonGroup.centerX; // All have the same center x component.
    energyArrow.top = radioButtonGroup.bottom + 15; // Arrow is below the buttons by an offset which is chosen empirically.
    energyText.top = energyArrow.bottom;

    // Add all components to the control panel.
    this.addChild( radioButtonGroup );
    this.addChild( energyArrow );
    this.addChild( energyText );
  }
}

greenhouseEffect.register( 'QuadEmissionFrequencyControlPanel', QuadEmissionFrequencyControlPanel );

export default QuadEmissionFrequencyControlPanel;