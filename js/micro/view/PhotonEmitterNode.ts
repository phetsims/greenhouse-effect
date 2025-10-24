// Copyright 2021-2025, University of Colorado Boulder

/**
 * Node that represents the photon emitter in the view.  The graphical representation of the emitter changes based on
 * wavelength of photons that the model is set to emit. This node is set up such that setting its offset on the
 * photon emission point in the model should position it correctly.  This assumes that photons are
 * emitted to the right.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternMessageProperty from '../../../../chipper/js/browser/PatternMessageProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BooleanRoundStickyToggleButton from '../../../../sun/js/buttons/BooleanRoundStickyToggleButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import flashlightOff_png from '../../../images/flashlightOff_png.js';
import infraredSourceOff_png from '../../../images/infraredSourceOff_png.js';
import uvSourceOff_png from '../../../images/uvSourceOff_png.js';
import flashlight_png from '../../../mipmaps/flashlight_png.js';
import infraredSource_png from '../../../mipmaps/infraredSource_png.js';
import microwaveSource_png from '../../../mipmaps/microwaveSource_png.js';
import uvSource_png from '../../../mipmaps/uvSource_png.js';
import GreenhouseEffectQueryParameters from '../../common/GreenhouseEffectQueryParameters.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectMessages from '../../strings/GreenhouseEffectMessages.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

const openSciEdEnergySourceStringProperty = GreenhouseEffectStrings.openSciEd.energySourceStringProperty;

class PhotonEmitterNode extends Node {

  private readonly model: PhotonAbsorptionModel;

  // height of the label requested by Open Sci Ed, will be 0 if not in that mode
  public readonly openSciEdLabelHeight: number;

  // In the "open sci ed" mode, add a label to the photon emitter since there is only one possible light source
  private readonly lightSourceLabel?: Text;

  // the 'on' button for the emitter
  public readonly button: BooleanRoundStickyToggleButton;

  // images for the photon emitter, assigned in updateImage
  private photonEmitterOnImage!: Image;
  private photonEmitterOffImage!: Image;

  /**
   * Constructor for the photon emitter node.
   *
   * @param width - Desired width of the emitter image in screen coords.
   * @param model
   * @param tandem
   */
  public constructor( width: number, model: PhotonAbsorptionModel, tandem: Tandem ) {

    // supertype constructor
    super();

    this.model = model;
    this.openSciEdLabelHeight = 0;

    if ( GreenhouseEffectQueryParameters.openSciEd ) {
      this.lightSourceLabel = new Text( openSciEdEnergySourceStringProperty, {
        font: new PhetFont( 11 ),
        fill: 'white',
        maxWidth: 150
      } );
      this.addChild( this.lightSourceLabel );

      this.openSciEdLabelHeight = this.lightSourceLabel.height;
    }

    this.button = new BooleanRoundStickyToggleButton( this.model.photonEmitterOnProperty, {
      radius: 15,
      baseColor: '#33dd33',

      // pdom
      appendDescription: true,
      accessibleRoleConfiguration: 'switch',

      tandem: tandem.createTandem( 'button' )
    } );

    // update the photon emitter upon changes to the photon wavelength
    model.photonWavelengthProperty.link( photonWavelength => {
      const emitterTandemName = WavelengthConstants.getTandemName( photonWavelength );
      this.updateImage( width, photonWavelength, tandem, emitterTandemName );
    } );

    // pdom - update button label when the light source changes, or when the
    // string pattern changes (dynamic locales).
    this.button.innerContent = new PatternMessageProperty(
      GreenhouseEffectMessages.lightSourceButtonLabelPatternMessageProperty, {
        lightSource: new DerivedProperty( [ model.lightSourceEnumProperty ], lightSource => lightSource.name )
      } );

    model.photonEmitterOnProperty.link( on => {
      if ( model.photonWavelengthProperty.get() !== WavelengthConstants.MICRO_WAVELENGTH ) {
        affirm( this.photonEmitterOnImage, 'on image should be defined when the emitter is on' );
        this.photonEmitterOnImage.visible = on;
      }

      // pdom - update the help text for the emitter
      this.button.descriptionContent = on ?
                                       GreenhouseEffectMessages.lightSourceButtonPressedHelpTextMessageProperty :
                                       GreenhouseEffectMessages.lightSourceButtonUnpressedHelpTextMessageProperty;
    } );
  }


  /**
   * Set the appropriate images based on the current setting for the wavelength of the emitted photons.
   * The emitter is composed of layered 'on' and an 'off' images.
   *
   * @param emitterWidth
   * @param photonWavelength - wavelength of emitted photon to determine if a new control slider needs to be added
   * @param tandem
   * @param emitterTandemName
   */
  private updateImage( emitterWidth: number, photonWavelength: number, tandem: Tandem, emitterTandemName: string ): void {

    // remove any existing children
    this.removeAllChildren();

    // create the wavelength dependent images and nodes
    if ( photonWavelength === WavelengthConstants.IR_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( infraredSource_png );
      this.photonEmitterOffImage = new Image( infraredSourceOff_png );
    }
    else if ( photonWavelength === WavelengthConstants.VISIBLE_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( flashlight_png );
      this.photonEmitterOffImage = new Image( flashlightOff_png );
    }
    else if ( photonWavelength === WavelengthConstants.UV_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( uvSource_png );
      this.photonEmitterOffImage = new Image( uvSourceOff_png );
    }
    else if ( photonWavelength === WavelengthConstants.MICRO_WAVELENGTH ) {
      this.photonEmitterOnImage = new Image( microwaveSource_png );
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

    if ( GreenhouseEffectQueryParameters.openSciEd ) {
      affirm( this.lightSourceLabel, 'label should be defined for Open Sci Ed' );
      this.addChild( this.lightSourceLabel );
      this.lightSourceLabel.centerTop = this.photonEmitterOnImage.centerBottom.plusXY( 0, 5 );
    }

    // add the button to the correct position on the photon emitter
    this.button.left = this.photonEmitterOffImage.centerX - 20;
    this.button.centerY = this.photonEmitterOffImage.centerY;
    if ( !this.hasChild( this.button ) ) {
      this.addChild( this.button );
    }
  }
}

greenhouseEffect.register( 'PhotonEmitterNode', PhotonEmitterNode );

export default PhotonEmitterNode;