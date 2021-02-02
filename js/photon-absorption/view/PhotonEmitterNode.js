// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents the photon emitter in the view.  The graphical representation of the emitter changes based on
 * wavelength of photons that the model is set to emit. This node is set up such that setting its offset on the
 * photon emission point in the model should position it correctly.  This assumes that photons are
 * emitted to the right.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BooleanRoundStickyToggleButton from '../../../../sun/js/buttons/BooleanRoundStickyToggleButton.js';
import flashlightOffImage from '../../../images/flashlight-off_png.js';
import heatLampOffImage from '../../../images/infrared-source-off_png.js';
import uvLightOffImage from '../../../images/uv-source-off_png.js';
import flashlightOnImage from '../../../mipmaps/flashlight_png.js';
import heatLampOnImage from '../../../mipmaps/infrared-source_png.js';
import microwaveTransmitterImage from '../../../mipmaps/microwave-source_png.js';
import uvLightOnImage from '../../../mipmaps/uv-source_png.js';
import MoleculesAndLightQueryParameters from '../../common/MoleculesAndLightQueryParameters.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import moleculesAndLightStrings from '../../moleculesAndLightStrings.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

const lightSourceButtonLabelPatternString = moleculesAndLightStrings.a11y.lightSource.buttonLabelPattern;
const lightSourcePressedButtonHelpTextString = moleculesAndLightStrings.a11y.lightSource.buttonPressedHelpText;
const lightSourceUnpressedButtonHelpTextString = moleculesAndLightStrings.a11y.lightSource.buttonUnpressedHelpText;
const openSciEdEnergySourceString = moleculesAndLightStrings.openSciEd.energySource;

class PhotonEmitterNode extends Node {

  /**
   * Constructor for the photon emitter node.
   *
   * @param {number} width - Desired width of the emitter image in screen coords.
   * @param {PhotonAbsorptionModel} model
   * @param {Tandem} tandem
   */
  constructor( width, model, tandem ) {

    // supertype constructor
    super();

    // @private
    this.model = model;

    // @public (read-only) {number} height of the label requested by Open Sci Ed, will be 0 if not in that mode
    this.openSciEdLabelHeight = 0;

    if ( MoleculesAndLightQueryParameters.openSciEd ) {

      // add a label to the photon emitter since there is only one possible light source
      this.lightSourceLabel = new Text( openSciEdEnergySourceString, {
        font: new PhetFont( 11 ),
        fill: 'white',
        maxWidth: 150
      } );
      this.addChild( this.lightSourceLabel );

      this.openSciEdLabelHeight = this.lightSourceLabel.height;
    }

    // create the 'on' button for the emitter
    this.button = new BooleanRoundStickyToggleButton( this.model.photonEmitterOnProperty, {
      radius: 15,
      baseColor: '#33dd33',

      // PDOM
      appendDescription: true,

      tandem: tandem.createTandem( 'button' )
    } );

    // PDOM - this button is indicated as a 'switch' for assistive technology
    this.button.setAriaRole( 'switch' );

    // PDOM - signify button is 'pressed' when down - note this is used in addition to aria-pressed (set in the
    // supertype) as using both sounds best in NVDA
    const setAriaPressed = value => this.button.setPDOMAttribute( 'aria-checked', value );
    model.photonEmitterOnProperty.link( setAriaPressed );

    // update the photon emitter upon changes to the photon wavelength
    model.photonWavelengthProperty.link( photonWavelength => {
      const emitterTandemName = WavelengthConstants.getTandemName( photonWavelength );
      this.updateImage( width, photonWavelength, tandem, emitterTandemName );
    } );

    model.photonEmitterOnProperty.link( on => {
      if ( model.photonWavelengthProperty.get() !== WavelengthConstants.MICRO_WAVELENGTH ) {
        this.photonEmitterOnImage.visible = on;
      }

      // PDOM - update the help text for the emitter
      this.button.descriptionContent = on ? lightSourcePressedButtonHelpTextString : lightSourceUnpressedButtonHelpTextString;
    } );
  }


  /**
   * Set the appropriate images based on the current setting for the wavelength of the emitted photons.
   * The emitter is composed of layered 'on' and an 'off' images.
   *
   * @param {number} emitterWidth
   * @param {number} photonWavelength - wavelength of emitted photon to determine if a new control slider needs to be added
   * @param {Tandem} tandem
   * @param {string} emitterTandemName
   * @private
   */
  updateImage( emitterWidth, photonWavelength, tandem, emitterTandemName ) {

    // remove any existing children
    this.removeAllChildren();

    // create the wavelength dependent images and nodes
    if ( photonWavelength === WavelengthConstants.IR_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( heatLampOnImage );
      this.photonEmitterOffImage = new Image( heatLampOffImage );
    }
    else if ( photonWavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( flashlightOnImage );
      this.photonEmitterOffImage = new Image( flashlightOffImage );
    }
    else if ( photonWavelength === WavelengthConstants.UV_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( uvLightOnImage );
      this.photonEmitterOffImage = new Image( uvLightOffImage );
    }
    else if ( photonWavelength === WavelengthConstants.MICRO_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( microwaveTransmitterImage );
    }

    // scale, center - no 'off' image for microwave emitter
    if ( photonWavelength !== WavelengthConstants.MICRO_WAVELENGTH ) {
      this.photonEmitterOffImage.scale( emitterWidth / this.photonEmitterOffImage.width );
      this.photonEmitterOffImage.center = new Vector2( 0, 0 );
      this.addChild( this.photonEmitterOffImage );

      this.photonEmitterOnImage.visible = this.model.photonEmitterOnProperty.get();
    }

    // scale the on image by the desired width of the emitter and add to top
    this.photonEmitterOnImage.scale( emitterWidth / this.photonEmitterOnImage.width );
    this.photonEmitterOnImage.center = new Vector2( 0, 0 );
    this.addChild( this.photonEmitterOnImage );

    if ( MoleculesAndLightQueryParameters.openSciEd ) {
      assert && assert( this.lightSourceLabel, 'label should be defined for Open Sci Ed' );
      this.addChild( this.lightSourceLabel );
      this.lightSourceLabel.centerTop = this.photonEmitterOnImage.centerBottom.plusXY( 0, 5 );
    }

    // PDOM - update the accessible name for the button
    this.button.innerContent = StringUtils.fillIn( lightSourceButtonLabelPatternString, {
      lightSource: WavelengthConstants.getLightSourceName( photonWavelength )
    } );

    // add the button to the correct position on the photon emitter
    this.button.left = this.photonEmitterOffImage.centerX - 20;
    this.button.centerY = this.photonEmitterOffImage.centerY;
    if ( !this.hasChild( this.button ) ) {
      this.addChild( this.button );
    }
  }
}

moleculesAndLight.register( 'PhotonEmitterNode', PhotonEmitterNode );

export default PhotonEmitterNode;
