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
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import WireNode from '../../../../scenery-phet/js/WireNode.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import { Color, DragListener, HBox, Line, Node, NodeOptions, Rectangle, SceneryEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectOptions from '../GreenhouseEffectOptions.js';
import FluxMeter from '../model/FluxMeter.js';
import FluxSensor from '../model/FluxSensor.js';
import LayersModel from '../model/LayersModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const sunlightString = greenhouseEffectStrings.sunlight;
const infraredString = greenhouseEffectStrings.infrared;
const energyFluxString = greenhouseEffectStrings.fluxMeter.energyFlux;

const METER_SPACING = 8; // spacing used in a few places for layout, in view coordinates
const SENSOR_STROKE_COLOR = 'rgb(254,172,63)';
const SENSOR_FILL_COLOR = 'rgba(200,200,200,0.6)';
const CUE_ARROW_LENGTH = 28; // length of the 'drag cue' arrows around the flux sensor

// Model to view scalars that turn flux values into arrow lengths for the flux meter display will be in intervals
// of this value as the scalar value changes to support zoom buttons.
const FLUX_ARROW_ZOOM_DELTA = 1E-6;

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

const FLUX_SENSOR_VERTICAL_RANGE = new Range( 500, LayersModel.HEIGHT_OF_ATMOSPHERE - 500 );

type SelfOptions = {

  // Whether to include a ZoomButtonGroup on this FluxMeterNode. Buttons allow "zooming" into the meter by scaling
  // the display arrows.
  includeZoomButtons?: boolean;
};
type ParentOptions = NodeOptions;
export type FluxMeterNodeOptions = SelfOptions & PickRequired<ParentOptions, 'tandem'>;

class FluxMeterNode extends Node {
  public readonly fluxPanel: Panel;
  private readonly wasDraggedProperty: BooleanProperty;

  /**
   * @param model - model component for the FluxMeter
   * @param isPlayingProperty - a boolean Property that indicates whether the model in which the flux meter resides is
   *                            running
   * @param visibleProperty - a boolean Property that controls whether this node is visible
   * @param modelViewTransform
   * @param observationWindowViewBounds - bounds for the ObservationWindow to constrain dragging of the sensor
   * @param providedOptions
   */
  public constructor( model: FluxMeter,
                      isPlayingProperty: IReadOnlyProperty<boolean>,
                      visibleProperty: IReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      observationWindowViewBounds: Bounds2,
                      providedOptions?: FluxMeterNodeOptions ) {

    const options = optionize<FluxMeterNodeOptions, SelfOptions, ParentOptions>()( {
      includeZoomButtons: false
    }, providedOptions );

    super();

    // Create the node that represents the wire connecting the panel and the sensor.
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

    // Property for the zoom buttons and flux display arrows so that we can zoom in and out of the display by
    // scaling the arrow lengths
    const zoomLevelProperty = new NumberProperty( 5 * FLUX_ARROW_ZOOM_DELTA, {
      range: new Range( 4 * FLUX_ARROW_ZOOM_DELTA, 6 * FLUX_ARROW_ZOOM_DELTA )
    } ).asRanged();

    const sunlightDisplayArrow = new EnergyFluxDisplay(
      model.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
      zoomLevelProperty,
      sunlightString,
      GreenhouseEffectConstants.SUNLIGHT_COLOR
    );
    const infraredDisplayArrow = new EnergyFluxDisplay(
      model.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty,
      zoomLevelProperty,
      infraredString,
      GreenhouseEffectConstants.INFRARED_COLOR
    );
    const arrows = new HBox( { children: [ sunlightDisplayArrow, infraredDisplayArrow ], spacing: METER_SPACING } );

    const zoomButtons = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      spacing: 5,
      applyZoomIn: ( currentZoom: number ) => currentZoom + FLUX_ARROW_ZOOM_DELTA,
      applyZoomOut: ( currentZoom: number ) => currentZoom - FLUX_ARROW_ZOOM_DELTA,
      magnifyingGlassNodeOptions: {
        glassRadius: 6
      },
      buttonOptions: {
        baseColor: PhetColorScheme.PHET_LOGO_BLUE
      },
      tandem: options.tandem.createTandem( 'zoomButtons' )
    } );

    // zoom buttons conditionally added to the view, but always created because I think that is required for PhET-iO
    const contentChildren = [ titleText, arrows ];
    options.includeZoomButtons && contentChildren.push( zoomButtons );
    const content = new VBox( { children: contentChildren, spacing: METER_SPACING } );

    const fluxSensorNode = new FluxSensorNode( model.fluxSensor, modelViewTransform, {
      startDrag: () => {
        model.fluxSensor.isDraggingProperty.set( true );
      },
      drag: () => {

        // Hide the cue arrows if they are visible.
        this.wasDraggedProperty.set( true );

        // Clear the flux sensor if it is dragged while the main model is paused.  This prevents the display of flux
        // readings that are incorrect for the altitude at which the sensor is positioned.
        if ( !isPlayingProperty.value ) {
          model.fluxSensor.clearEnergyTrackers();
        }
      },
      endDrag: () => {
        model.fluxSensor.isDraggingProperty.set( false );
      }
    } );
    this.addChild( fluxSensorNode );

    // The cueing arrows for the flux sensor are shown initially if globally enabled, then hidden after the first drag.
    this.wasDraggedProperty = new BooleanProperty( false );
    const cueingArrowsShownProperty = new DerivedProperty(
      [ this.wasDraggedProperty, GreenhouseEffectOptions.cueingArrowsEnabledProperty ],
      ( wasDragged, cueingArrowsEnabled ) => !wasDragged && cueingArrowsEnabled
    );

    // green arrows around the flux sensor flag, cues the user to drag it
    const cuingArrowsNode = new VBox( {
      cursor: 'pointer',
      spacing: 15,
      children: [
        new ArrowNode( 0, 0, 0, -CUE_ARROW_LENGTH, CUE_ARROW_OPTIONS ),
        new ArrowNode( 0, 0, 0, CUE_ARROW_LENGTH, CUE_ARROW_OPTIONS )
      ],
      centerX: fluxSensorNode.bounds.maxX,
      visibleProperty: cueingArrowsShownProperty
    } );
    this.addChild( cuingArrowsNode );

    // Reposition the cue arrows as the flux sensor moves.
    model.fluxSensor.altitudeProperty.link( altitude => {
      cuingArrowsNode.centerY = modelViewTransform.modelToViewY( altitude );
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
        startOffset = fluxSensorNode.globalToParentPoint( event.pointer.point ).subtract( fluxSensorNode.center );
        model.fluxSensor.isDraggingProperty.set( true );
      },
      drag: ( event: SceneryEvent ) => {

        // Hide the cue arrows if they are visible.
        this.wasDraggedProperty.set( true );

        // Clear the flux sensor if it is dragged while the main model is paused.  This prevents the display of flux
        // readings that are incorrect for the altitude at which the sensor is positioned.
        if ( !isPlayingProperty.value ) {
          model.fluxSensor.clearEnergyTrackers();
        }

        // Get the view position of the sensor.
        const viewPoint = fluxSensorNode.globalToParentPoint( event.pointer.point ).subtract( startOffset );

        // Constrain the Y position in model space to just below the top of the atmosphere at the high end and just
        // above the ground at the low end.
        const modelY = FLUX_SENSOR_VERTICAL_RANGE.constrainValue( modelViewTransform.viewToModelY( viewPoint.y ) );

        // Set the altitude of the flux sensor based on the drag action.
        model.fluxSensor.altitudeProperty.set( modelY );
      },
      end: () => {
        model.fluxSensor.isDraggingProperty.set( false );
      },
      useInputListenerCursor: true,

      // phet-io
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // never disposed, no need to unlink
    model.fluxSensor.altitudeProperty.link( altitude => {
      fluxSensorNode.centerY = modelViewTransform.modelToViewY( altitude );
    } );
  }

  public reset(): void {
    this.wasDraggedProperty.reset();
  }
}

type EnergyFluxDisplayArrowSelfOptions = {

  // height of the background in screen coordinates
  height?: number;

  // options that are passed through to the arrow nodes
  arrowNodeOptions?: ArrowNodeOptions;
};

type EnergyFluxDisplayOptions = EnergyFluxDisplayArrowSelfOptions & NodeOptions;

/**
 * An inner class that implements a display for energy flux in the up and down directions.  The display consists of a
 * background with two arrows, one that grows upwards and another that grows down.
 *
 * @param energyDownProperty
 * @param energyUpProperty
 * @param fluxToArrowLengthMultiplierProperty -  multiplier maps the flux values from the meter to the arrow lengths
 * @param labelString
 * @param baseColor
 * @param providedOptions
 */
class EnergyFluxDisplay extends Node {
  public constructor( energyDownProperty: Property<number>,
                      energyUpProperty: Property<number>,
                      fluxToArrowLengthMultiplierProperty: IReadOnlyProperty<number>,
                      labelString: string,
                      baseColor: Color,
                      providedOptions?: EnergyFluxDisplayOptions ) {

    const options = optionize<EnergyFluxDisplayOptions, EnergyFluxDisplayArrowSelfOptions, NodeOptions>()( {
      height: 355,
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

    // Set a clip area so that the arrows don't go outside the background.
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
    const getArrowHeightFromFlux = ( flux: number, fluxToArrowLengthMultiplier: number ) => flux * fluxToArrowLengthMultiplier;

    // Redraw arrows when the flux Properties change.
    Multilink.multilink( [ energyDownProperty, fluxToArrowLengthMultiplierProperty ],
      ( energyDown, fluxToArrowLengthMultiplier ) => {
        downArrow.visible = Math.abs( energyDown ) > 0;
        downArrow.setTip( boundsRectangle.width / 2, boundsRectangle.height / 2 + getArrowHeightFromFlux( energyDown, fluxToArrowLengthMultiplier ) );
      } );

    Multilink.multilink( [ energyUpProperty, fluxToArrowLengthMultiplierProperty ],
      ( energyUp, fluxToArrowLengthMultiplier ) => {
        upArrow.visible = Math.abs( energyUp ) > 0;
        upArrow.setTip( boundsRectangle.width / 2, boundsRectangle.height / 2 - getArrowHeightFromFlux( energyUp, fluxToArrowLengthMultiplier ) );
      } );

    // layout
    boundsRectangle.centerTop = labelText.centerBottom;
  }
}

/**
 * An inner class to support alternative input for the flux sensor with AccessibleSlider so that arrow keys
 * change the altitude.
 */
type FluxSensorNodeSelfOptions = EmptySelfOptions;
type FluxSensorNodeParentOptions = AccessibleSliderOptions & NodeOptions;
type FluxSensorNodeOptions = NodeOptions & StrictOmit<AccessibleSliderOptions, 'valueProperty' | 'enabledRangeProperty'>;

class FluxSensorNode extends AccessibleSlider( Node, 0 ) {
  public constructor( fluxSensor: FluxSensor, modelViewTransform: ModelViewTransform2, providedOptions?: FluxSensorNodeOptions ) {

    const options = optionize<FluxSensorNodeOptions, FluxSensorNodeSelfOptions, FluxSensorNodeParentOptions>()( {
      valueProperty: fluxSensor.altitudeProperty,
      enabledRangeProperty: new Property( FLUX_SENSOR_VERTICAL_RANGE ),
      keyboardStep: FLUX_SENSOR_VERTICAL_RANGE.getLength() / 30,
      a11yCreateAriaValueText: value => `${Utils.roundSymmetric( value )} m`
    }, providedOptions );

    super( options );

    const fluxSensorWidth = modelViewTransform.modelToViewDeltaX( fluxSensor.size.width );
    const rectangleNode = new Rectangle( 0, 0, fluxSensorWidth, SENSOR_VIEW_HEIGHT, 5, 5, {
      stroke: SENSOR_STROKE_COLOR,
      fill: SENSOR_FILL_COLOR,
      lineWidth: 2,
      cursor: 'ns-resize',
      center: modelViewTransform.modelToViewXY( fluxSensor.xPosition, fluxSensor.altitudeProperty.value )
    } );
    this.addChild( rectangleNode );
  }
}

greenhouseEffect.register( 'FluxMeterNode', FluxMeterNode );
export default FluxMeterNode;
