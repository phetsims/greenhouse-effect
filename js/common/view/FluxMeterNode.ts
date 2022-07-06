// Copyright 2021-2022, University of Colorado Boulder

/**
 * The "Energy Flux" meter for Greenhouse Effect. This includes a draggable sensor that can move about the Observation
 * Window and detect the flux of sunlight and infrared photons. A graphical representation of flux is displayed
 * in a panel with large arrows.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import WireNode from '../../../../scenery-phet/js/WireNode.js';
import { Color, DragListener, HBox, Line, Node, NodeOptions, Rectangle, SceneryEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import FluxMeter from '../model/FluxMeter.js';
import LayersModel from '../model/LayersModel.js';

const sunlightString = greenhouseEffectStrings.sunlight;
const infraredString = greenhouseEffectStrings.infrared;
const energyFluxString = greenhouseEffectStrings.fluxMeter.energyFlux;

const METER_SPACING = 8; // spacing used in a few places for layout, in view coordinates
const SENSOR_STROKE_COLOR = 'rgb(254,172,63)';
const SENSOR_FILL_COLOR = 'rgba(200,200,200,0.6)';
const CUE_ARROW_LENGTH = 28; // length of the 'drag cue' arrows around the flux sensor
const CUE_ARROW_OPTIONS = {
  fill: SENSOR_STROKE_COLOR,
  lineWidth: 0.5,
  headWidth: 20,
  headHeight: 16,
  tailWidth: 7
};

// The height of the sensor in the view.  This is needed because the sensor model doesn't have any y-dimension height,
// so we use and arbitrary value that looks decent in the view.
const SENSOR_VIEW_HEIGHT = 10;

class FluxMeterNode extends Node {
  public readonly fluxPanel: Panel;
  private readonly showFluxSensorCueArrowProperty: BooleanProperty

  /**
   * @param model - model component for the FluxMeter
   * @param isPlayingProperty - a boolean Property that indicates whether the model in which the flux meter resides is
   *                            running
   * @param visibleProperty - a boolean Property that controls whether this node is visible
   * @param modelViewTransform
   * @param observationWindowViewBounds - bounds for the ObservationWindow to constrain dragging of the sensor
   * @param tandem
   */
  public constructor( model: FluxMeter,
                      isPlayingProperty: IReadOnlyProperty<boolean>,
                      visibleProperty: IReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      observationWindowViewBounds: Bounds2,
                      tandem: Tandem ) {

    super();

    // wire connecting panel and sensor, beneath both so it appears like the wire is solidly connected to both
    const wireNode = new WireNode(
      new DerivedProperty(
        [ model.wireSensorAttachmentPositionProperty ],
        position => modelViewTransform.modelToViewPosition( position )
      ),
      new Vector2Property( new Vector2( 100, 0 ) ),
      new DerivedProperty(
        [ model.wireMeterAttachmentPositionProperty ],
        position => modelViewTransform.modelToViewPosition( position )
      ),
      new Vector2Property( new Vector2( -100, 0 ) ), {
        stroke: 'grey',
        lineWidth: 5
      }
    );
    this.addChild( wireNode );

    const titleText = new Text( energyFluxString, {
      font: GreenhouseEffectConstants.LABEL_FONT,
      maxWidth: 120
    } );

    const sunlightDisplayArrow = new EnergyFluxDisplay(
      model.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
      sunlightString,
      GreenhouseEffectConstants.SUNLIGHT_COLOR
    );
    const infraredDisplayArrow = new EnergyFluxDisplay(
      model.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty,
      infraredString,
      GreenhouseEffectConstants.INFRARED_COLOR
    );

    const arrows = new HBox( { children: [ sunlightDisplayArrow, infraredDisplayArrow ], spacing: METER_SPACING } );
    const content = new VBox( { children: [ titleText, arrows ], spacing: METER_SPACING } );

    const fluxSensorWidth = modelViewTransform.modelToViewDeltaX( model.fluxSensor.size.width );
    const fluxSensorNode = new Rectangle( 0, 0, fluxSensorWidth, SENSOR_VIEW_HEIGHT, 5, 5, {
      stroke: SENSOR_STROKE_COLOR,
      fill: SENSOR_FILL_COLOR,
      lineWidth: 2,
      cursor: 'ns-resize'
    } );
    this.addChild( fluxSensorNode );

    // green arrows around the flux sensor flag, cues the user to drag it
    const cueArrowsNode = new VBox( {
      cursor: 'pointer',
      spacing: 15,
      children: [
        new ArrowNode( 0, 0, 0, -CUE_ARROW_LENGTH, CUE_ARROW_OPTIONS ),
        new ArrowNode( 0, 0, 0, CUE_ARROW_LENGTH, CUE_ARROW_OPTIONS )
      ],
      centerX: modelViewTransform.modelToViewX( 0 )
    } );
    this.addChild( cueArrowsNode );

    // Reposition the cue arrows as the flux sensor moves.
    model.fluxSensor.positionProperty.link( fluxSensorPosition => {
      cueArrowsNode.centerY = modelViewTransform.modelToViewY( fluxSensorPosition.y );
    } );

    // The flux arrows are shown initially, then hidden after the first drag.  This is where the visibility is
    // controlled.
    this.showFluxSensorCueArrowProperty = new BooleanProperty( true );
    this.showFluxSensorCueArrowProperty.link( showFluxSensorCueArrows => {
      cueArrowsNode.visible = showFluxSensorCueArrows;
    } );

    // {Panel} - contains the display showing energy flux, public for positioning in the view
    this.fluxPanel = new Panel( content );
    this.addChild( this.fluxPanel );

    // listeners
    visibleProperty.link( visible => {
      this.visible = visible;
    } );

    // the offset position for the drag pickup, so that the translation doesn't snap to the cursor position
    let startOffset: Vector2 = Vector2.ZERO;

    fluxSensorNode.addInputListener( new DragListener( {
      start: ( event: SceneryEvent ) => {
        startOffset = fluxSensorNode.globalToParentPoint( event.pointer.point! ).subtract( fluxSensorNode.center );
        model.fluxSensor.isDraggingProperty.set( true );
      },
      drag: ( event: SceneryEvent ) => {

        // Hide the cue arrows if they are visible.
        this.showFluxSensorCueArrowProperty.set( false );

        // Clear the flux sensor if it is dragged while the main model is paused.  This prevents the display of flux
        // readings that are incorrect for the altitude at which the sensor is positioned.
        if ( !isPlayingProperty.value ) {
          model.fluxSensor.clearEnergyTrackers();
        }

        // Get the view position of the sensor.
        const viewPoint = fluxSensorNode.globalToParentPoint( event.pointer.point! ).subtract( startOffset );

        // Constrain the Y position in model space to just below the top of the atmosphere at the high end and just
        // above the ground at the low end.
        const modelY = Utils.clamp(
          modelViewTransform.viewToModelY( viewPoint.y ),
          500,
          LayersModel.HEIGHT_OF_ATMOSPHERE - 500
        );

        // Only allow dragging in the Y direction and not the X direction.
        model.fluxSensor.positionProperty.value = new Vector2( model.fluxSensor.positionProperty.value.x, modelY );
      },
      end: () => {
        model.fluxSensor.isDraggingProperty.set( false );
      },
      useInputListenerCursor: true,

      // phet-io
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    // never disposed, no need to unlink
    model.fluxSensor.positionProperty.link( sensorPosition => {
      fluxSensorNode.center = modelViewTransform.modelToViewPosition( sensorPosition );
    } );
  }

  public reset(): void {
    this.showFluxSensorCueArrowProperty.reset();
  }
}

type EnergyFluxDisplayArrowSelfOptions = {

  // height of the background in screen coordinates
  height?: number;


  // multiplier used to map the flux values from the meter to the arrow lengths
  fluxToArrowLengthMultiplier?: number;

  // options that are passed through to the arrow nodes
  arrowNodeOptions?: ArrowNodeOptions;
};

type EnergyFluxDisplayOptions = EnergyFluxDisplayArrowSelfOptions & NodeOptions;

/**
 * An inner class that implements a display for energy flux in the up and down directions.  The display consists of a
 * background with two arrows, one that grows upwards and another that grows down.
 */
class EnergyFluxDisplay extends Node {
  public constructor( energyDownProperty: Property<number>,
                      energyUpProperty: Property<number>,
                      labelString: string,
                      baseColor: Color,
                      providedOptions?: EnergyFluxDisplayOptions ) {

    const options = optionize<EnergyFluxDisplayOptions, EnergyFluxDisplayArrowSelfOptions, NodeOptions>()( {
      height: 385,
      fluxToArrowLengthMultiplier: 5E-6,
      arrowNodeOptions: {
        headHeight: 16,
        headWidth: 16,
        tailWidth: 8,
        fill: baseColor
      }
    }, providedOptions );

    super();

    const labelText = new Text( labelString, {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 80
    } );
    this.addChild( labelText );

    const boundsRectangle = new Rectangle( 0, 0, labelText.width * 1.25, options.height, 5, 5, {
      fill: 'rgb( 225, 225, 235 )',
      stroke: 'rgb( 40, 40, 100 )'
    } );
    this.addChild( boundsRectangle );

    // Set a clip area so that the arrows don't go outside of the background.
    boundsRectangle.clipArea = Shape.bounds( boundsRectangle.getRectBounds() );

    // Create and add the arrows.
    const downArrow = new ArrowNode(
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      options.arrowNodeOptions
    );
    const upArrow = new ArrowNode(
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      options.arrowNodeOptions
    );
    boundsRectangle.addChild( downArrow );
    boundsRectangle.addChild( upArrow );

    // Add a horizontal line at the origin of the arrows that can be seen when the arrows have no length.
    const centerIndicatorLine = new Line( 0, 0, boundsRectangle.width * 0.5, 0, {
      centerX: boundsRectangle.width / 2,
      centerY: boundsRectangle.height / 2,
      stroke: baseColor.colorUtilsDarker( 0.25 ),
      lineWidth: 3
    } );
    boundsRectangle.addChild( centerIndicatorLine );

    // a linear function that maps the number of photons going through the flux meter per second
    const getArrowHeightFromFlux = ( flux: number ) => flux * options.fluxToArrowLengthMultiplier;

    // Redraw arrows when the flux Properties change.
    energyDownProperty.link( energyDown => {
      downArrow.visible = Math.abs( energyDown ) > 0;
      downArrow.setTip( boundsRectangle.width / 2, boundsRectangle.height / 2 + getArrowHeightFromFlux( energyDown ) );
    } );

    energyUpProperty.link( energyUp => {
      upArrow.visible = Math.abs( energyUp ) > 0;
      upArrow.setTip( boundsRectangle.width / 2, boundsRectangle.height / 2 - getArrowHeightFromFlux( energyUp ) );
    } );

    // layout
    boundsRectangle.centerTop = labelText.centerBottom;
  }
}

greenhouseEffect.register( 'FluxMeterNode', FluxMeterNode );
export default FluxMeterNode;
