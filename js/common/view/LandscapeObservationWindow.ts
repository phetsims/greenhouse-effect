// Copyright 2021-2023, University of Colorado Boulder

/**
 * LandscapeObservationWindow is a Scenery Node that is used within the Greenhouse Effect simulation to present a view
 * of a landscape and sky, as well as artwork that represents different time periods.  It is intended to be used as a
 * base class, and subclasses are used to add representations of energy interacting with the landscape and atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { Color, Image, LinearGradient, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import agriculturalLandscapeBackground_png from '../../../images/agriculturalLandscapeBackground_png.js';
import agriculturalLandscapeForeground_png from '../../../images/agriculturalLandscapeForeground_png.js';
import fiftiesLandscapeBackground_png from '../../../images/fiftiesLandscapeBackground_png.js';
import fiftiesLandscapeForeground_png from '../../../images/fiftiesLandscapeForeground_png.js';
import iceAgeLandscapeBackground_png from '../../../images/iceAgeLandscapeBackground_png.js';
import iceAgeLandscapeForeground_png from '../../../images/iceAgeLandscapeForeground_png.js';
import twentyTwentiesLandscapeBackground_png from '../../../images/twentyTwentiesLandscapeBackground_png.js';
import twentyTwentiesLandscapeForeground_png from '../../../images/twentyTwentiesLandscapeForeground_png.js';
import unadornedLandscape_png from '../../../images/unadornedLandscape_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import CloudNode from './CloudNode.js';
import GasConcentrationAlerter from './GasConcentrationAlerter.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';
import LayerDebugNode from './LayerDebugNode.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';

type SelfOptions = EmptySelfOptions;
type LandscapeObservationWindowOptions = SelfOptions & GreenhouseEffectObservationWindowOptions;

// constants
const SIZE = GreenhouseEffectObservationWindow.SIZE;

// The opacity of the surface temperature is scaled over this range.  The values, which are in Kelvin, were empirically
// determined and can be adjusted as needed to achieve the desired visual effect.
const SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE = new Range( 250, 295 );

class LandscapeObservationWindow extends GreenhouseEffectObservationWindow {
  private readonly gasConcentrationAlerter: GasConcentrationAlerter;
  private readonly isPlayingProperty: TReadOnlyProperty<boolean>;

  // Surface thermometer with value readout and units ComboBox, public for pdomOrder.
  public readonly surfaceThermometer: ThermometerAndReadout;

  public constructor( model: ConcentrationModel, options: LandscapeObservationWindowOptions ) {

    super( model, options );
    this.isPlayingProperty = model.isPlayingProperty;

    // thermometer
    const listParentNode = new Node();
    this.surfaceThermometer = new ThermometerAndReadout( model, {

      minTemperature: model.groundLayer.minimumTemperature - 5,

      // phet-io
      tandem: options.tandem.createTandem( 'surfaceThermometer' )
    } );
    this.surfaceThermometer.leftBottom = this.windowFrame.leftBottom.plusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      -GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );
    listParentNode.leftBottom = this.surfaceThermometer.leftBottom;
    this.controlsLayer.addChild( this.surfaceThermometer );
    this.controlsLayer.addChild( listParentNode );

    // Create the node that will make the sky look a bit hazy as more greenhouse gases are added.  Strictly speaking,
    // most greenhouse gases do not interact with visible light, so this is a bit of "Hollywooding" to make it clear
    // that something in the atmosphere is changing.
    const hazeNode = new Rectangle( 0, 0, SIZE.width, SIZE.height );
    this.presentationLayer.addChild( hazeNode );

    // Adjust the amount of "haze" based on the concentration of greenhouse gases.
    model.concentrationProperty.link( concentration => {

      // mapping of concentration to alpha we empirically determined
      hazeNode.fill = Color.LIGHT_GRAY.withAlpha( concentration / 3 );
    } );

    // Debug code for representing layers, only added if the appropriate query parameter is set.
    const energyAbsorbingEmittingLayerNodes = [];
    if ( GreenhouseEffectQueryParameters.showAllLayers ) {

      // Add the ground layer node.
      energyAbsorbingEmittingLayerNodes.push( new LayerDebugNode(
        model.groundLayer,
        this.modelViewTransform,
        {
          lineOptions: { stroke: Color.GREEN },
          visible: GreenhouseEffectQueryParameters.showAllLayers
        }
      ) );

      // Add the atmosphere layer nodes.
      model.atmosphereLayers.forEach( atmosphereLayer => {
        energyAbsorbingEmittingLayerNodes.push( new LayerDebugNode(
          atmosphereLayer,
          this.modelViewTransform,
          {
            lineOptions: { stroke: new Color( 50, 50, 200, 0.5 ) },
            visible: GreenhouseEffectQueryParameters.showAllLayers
          }
        ) );
      } );
    }

    // Add the layer nodes.
    energyAbsorbingEmittingLayerNodes.forEach( layerNode => this.backgroundLayer.addChild( layerNode ) );

    // Add the cloud, if present.
    if ( model.cloud ) {
      this.backgroundLayer.addChild( new CloudNode( model.cloud, this.modelViewTransform ) );
    }

    // pdom - responsive descriptions
    this.gasConcentrationAlerter = new GasConcentrationAlerter( model, {
      descriptionAlertNode: this
    } );
  }

  /**
   * Redraw components of the observation window. Does not get called if sim is paused for performance reasons.
   */
  public override step( dt: number ): void {
    super.step( dt );
  }

  /**
   * Step alerters of this ObservationWindow (mostly to support polling descriptions). This is separate from
   * step() because this needs to be stepped even while the sim is paused.
   */
  public override stepAlerters( dt: number ): void {
    this.gasConcentrationAlerter.step( dt );
  }

  public override reset(): void {
    this.gasConcentrationAlerter.reset();
    super.reset();
  }

  /**
   * Create the node that will represent the ground, and will use appropriate images for the various dates.
   */
  protected override createGroundNode( model: ConcentrationModel ): Node {

    const sharedImageOptions = {
      maxWidth: this.width,
      bottom: SIZE.height
    };

    // background and foreground images
    const unadornedLandscapeImage = new Image( unadornedLandscape_png, sharedImageOptions );
    const agriculturalLandscapeBackgroundImage = new Image( agriculturalLandscapeBackground_png, sharedImageOptions );
    const agriculturalLandscapeForegroundImage = new Image( agriculturalLandscapeForeground_png, sharedImageOptions );
    const fiftiesLandscapeBackgroundImage = new Image( fiftiesLandscapeBackground_png, sharedImageOptions );
    const fiftiesLandscapeForegroundImage = new Image( fiftiesLandscapeForeground_png, sharedImageOptions );
    const denseCityLandscapeBackgroundImage = new Image( twentyTwentiesLandscapeBackground_png, sharedImageOptions );
    const denseCityLandscapeForegroundImage = new Image( twentyTwentiesLandscapeForeground_png, sharedImageOptions );
    const iceAgeLandscapeBackgroundImage = new Image( iceAgeLandscapeBackground_png, sharedImageOptions );
    const iceAgeLandscapeForegroundImage = new Image( iceAgeLandscapeForeground_png, sharedImageOptions );

    // surface temperature node, which is meant to look like a glow on the surface
    const groundShape = GreenhouseEffectObservationWindow.createGroundShape();
    const groundShapeBounds = groundShape.getBounds();
    const surfaceTemperatureNode = new Path( groundShape, {
      fill: new LinearGradient( 0, groundShapeBounds.minY, 0, groundShapeBounds.maxY )
        .addColorStop( 0, PhetColorScheme.RED_COLORBLIND )
        .addColorStop( 1, 'rgba( 255, 0, 0, 0 )' ),
      bottom: SIZE.height
    } );

    model.surfaceTemperatureVisibleProperty.linkAttribute( surfaceTemperatureNode, 'visible' );

    model.surfaceTemperatureKelvinProperty.link( surfaceTemperature => {
      surfaceTemperatureNode.opacity = Utils.clamp(
        ( surfaceTemperature - SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE.min ) / SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE.getLength(),
        0,
        1
      );
    } );

    // Control the visibility of the images based on the state of the model.
    Multilink.multilink(
      [ model.concentrationControlModeProperty, model.dateProperty ],
      ( concentrationControlMode, date ) => {
        unadornedLandscapeImage.visible = concentrationControlMode === ConcentrationControlMode.BY_VALUE ||
                                          date === ConcentrationDate.ICE_AGE ||
                                          date === ConcentrationDate.TWENTY_TWENTY;
        iceAgeLandscapeBackgroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                            date === ConcentrationDate.ICE_AGE;
        iceAgeLandscapeForegroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                            date === ConcentrationDate.ICE_AGE;
        agriculturalLandscapeBackgroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                       date === ConcentrationDate.SEVENTEEN_FIFTY;
        agriculturalLandscapeForegroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                       date === ConcentrationDate.SEVENTEEN_FIFTY;
        fiftiesLandscapeBackgroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                  date === ConcentrationDate.NINETEEN_FIFTY;
        fiftiesLandscapeForegroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                  date === ConcentrationDate.NINETEEN_FIFTY;
        denseCityLandscapeBackgroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                    date === ConcentrationDate.TWENTY_TWENTY;
        denseCityLandscapeForegroundImage.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                    date === ConcentrationDate.TWENTY_TWENTY;
      }
    );

    // Return a node that contains all the images.
    return new Node( {
      children: [

        // landscape image backgrounds
        unadornedLandscapeImage,
        iceAgeLandscapeBackgroundImage,
        agriculturalLandscapeBackgroundImage,
        fiftiesLandscapeBackgroundImage,
        denseCityLandscapeBackgroundImage,

        // The surface temperature node must be between the background and foreground images for correct layering.
        surfaceTemperatureNode,

        // landscape image foregrounds
        agriculturalLandscapeForegroundImage,
        iceAgeLandscapeForegroundImage,
        fiftiesLandscapeForegroundImage,
        denseCityLandscapeForegroundImage
      ]
    } );
  }
}

greenhouseEffect.register( 'LandscapeObservationWindow', LandscapeObservationWindow );
export type { LandscapeObservationWindowOptions };
export default LandscapeObservationWindow;