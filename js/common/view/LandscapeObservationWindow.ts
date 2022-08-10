// Copyright 2021-2022, University of Colorado Boulder

/**
 * LandscapeObservationWindow is a Scenery Node that is used within the Greenhouse Effect simulation to present a view
 * of a landscape and sky, as well as artwork that represents different time periods.  It is intended to be used as a
 * base class, and subclasses are used to add representations of energy interacting with the landscape and atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, ColorProperty, Image, Node, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import barnAndSheep_png from '../../../images/barnAndSheep_png.js';
import glacier_png from '../../../images/glacier_png.js';
import nineteenFiftyBackground_png from '../../../images/nineteenFiftyBackground_png.js';
import twentyTwentyBackground_png from '../../../images/twentyTwentyBackground_png.js';
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
const GREEN_GRASS_BASE_COLOR = Color.GREEN;
const ICE_AGE_GROUND_BASE_COLOR = new Color( '#746C66' );

class LandscapeObservationWindow extends GreenhouseEffectObservationWindow {
  private readonly gasConcentrationAlerter: GasConcentrationAlerter;

  // Surface thermometer with value readout and units ComboBox, public for pdomOrder.
  public readonly surfaceThermometer: ThermometerAndReadout;

  public constructor( model: ConcentrationModel, providedOptions?: LandscapeObservationWindowOptions ) {

    // Create a color property that can be used to change the color of the ground.
    const groundColorBaseProperty = new ColorProperty( Color.GREEN );

    const options = optionize<LandscapeObservationWindowOptions, SelfOptions, GreenhouseEffectObservationWindowOptions>()( {
      groundBaseColorProperty: groundColorBaseProperty,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

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

    // artwork for the various dates
    const glacierImageNode = new Image( glacier_png, {

      // size and position empirically determined
      maxWidth: SIZE.width * 0.5,
      bottom: SIZE.height,
      right: SIZE.width
    } );
    const barnAndSheepImageNode = new Image( barnAndSheep_png, {

      // size and position empirically determined
      maxWidth: 80,
      centerX: SIZE.width * 0.52,
      centerY: SIZE.height - this.groundNodeHeight * 0.5
    } );
    const nineteenFiftyBackgroundImageNode = new Image( nineteenFiftyBackground_png, {

      // size and position empirically determined
      maxWidth: SIZE.width,
      centerY: SIZE.height - this.groundNodeHeight * 0.5
    } );
    const twentyTwentyBackgroundImageNode = new Image( twentyTwentyBackground_png, {

      // size and position empirically determined
      maxWidth: SIZE.width,
      centerY: SIZE.height - this.groundNodeHeight * 0.5
    } );
    const artworkForDates = [
      glacierImageNode,
      barnAndSheepImageNode,
      nineteenFiftyBackgroundImageNode,
      twentyTwentyBackgroundImageNode
    ];

    // Control the visibility of the various date-oriented artwork.
    Multilink.multilink(
      [ model.concentrationControlModeProperty, model.dateProperty ],
      ( concentrationControlMode, date ) => {

        // Update the visibility of the various images that represent dates.
        glacierImageNode.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                   date === ConcentrationDate.ICE_AGE;
        barnAndSheepImageNode.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                        date === ConcentrationDate.SEVENTEEN_FIFTY;
        nineteenFiftyBackgroundImageNode.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                   date === ConcentrationDate.NINETEEN_FIFTY;
        twentyTwentyBackgroundImageNode.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                                  date === ConcentrationDate.TWENTY_TWENTY;

        // In the ice age, the ground should look brown rather than green.
        if ( concentrationControlMode === ConcentrationControlMode.BY_DATE && date === ConcentrationDate.ICE_AGE ) {
          groundColorBaseProperty.set( ICE_AGE_GROUND_BASE_COLOR );
        }
        else {
          groundColorBaseProperty.set( GREEN_GRASS_BASE_COLOR );
        }
      }
    );

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


    // Add the nodes to the layers provided by the parent class.  The order is important for correct layering.
    artworkForDates.forEach( artworkNode => this.backgroundLayer.addChild( artworkNode ) );
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
}

greenhouseEffect.register( 'LandscapeObservationWindow', LandscapeObservationWindow );
export type { LandscapeObservationWindowOptions };
export default LandscapeObservationWindow;