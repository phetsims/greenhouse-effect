// Copyright 2021-2023, University of Colorado Boulder

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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import WireNode from '../../../../scenery-phet/js/WireNode.js';
import { Color, ColorProperty, DragListener, HBox, Line, Node, NodeOptions, Path, Rectangle, SceneryEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import SoundLevelEnum from '../../../../tambo/js/SoundLevelEnum.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectColors from '../GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import FluxMeter from '../model/FluxMeter.js';
import FluxSensor from '../model/FluxSensor.js';
import LayersModel from '../model/LayersModel.js';
import FluxMeterSoundGenerator from './FluxMeterSoundGenerator.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import GreenhouseEffectPreferences from '../model/GreenhouseEffectPreferences.js';

const sunlightStringProperty = GreenhouseEffectStrings.sunlightStringProperty;
const infraredStringProperty = GreenhouseEffectStrings.infraredStringProperty;
const energyFluxStringProperty = GreenhouseEffectStrings.fluxMeter.energyFluxStringProperty;

const METER_SPACING = 8; // spacing used in a few places for layout, in view coordinates
const SENSOR_STROKE_COLOR = 'rgb(254,153,18)';
const SENSOR_FILL_COLOR = 'rgba(200,200,200,0.6)';
const CUE_ARROW_LENGTH = 28; // length of the 'drag cue' arrows around the flux sensor
const FLUX_PANEL_X_MARGIN = 6;

// multiplier used to map energy flux values to arrow lengths in nominal (un-zoomed) case, empirically determined
const NOMINAL_FLUX_TO_ARROW_LENGTH_MULTIPLIER = 5E-6;

// Zoom factor for zooming in and out in the flux meter, only used if zoom is enabled.  This value was empirically
// determined in conjunction with others to make sure that the max outgoing IR will fix in the flux meter.
const FLUX_ARROW_ZOOM_FACTOR = 2.5;

// number of zoom levels in each direction
const NUMBER_OF_ZOOM_OUT_LEVELS = 2;
const NUMBER_OF_ZOOM_IN_LEVELS = 1;

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

// The vertical range over which the flux meter is allowed to move.  The lower end allows the sensor to get close to the
// ground but not overlap with UI elements (see https://github.com/phetsims/greenhouse-effect/issues/248).  The upper
// end makes sure that the sensor stays fully within the observation window.
const FLUX_SENSOR_VERTICAL_RANGE = new Range( 750, LayersModel.HEIGHT_OF_ATMOSPHERE - 700 );

type SelfOptions = {

  // Whether to include a ZoomButtonGroup on this FluxMeterNode. Buttons allow "zooming" into the meter by scaling
  // the display arrows.
  includeZoomButtons?: boolean;
};
export type FluxMeterNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

class FluxMeterNode extends Node {

  // the panel that contains the display showing energy flux, public for positioning in the view
  public readonly fluxPanel: Panel;

  // a Property that tracks whether the sensor was dragged since startup or last reset, used to hide the queuing errors
  private readonly wasDraggedProperty: BooleanProperty;

  // zoom factor, only used if the zoom feature is enabled
  private readonly zoomFactorProperty: NumberProperty;

  // sound generator for this node
  private readonly soundGenerator: FluxMeterSoundGenerator;

  private readonly isModelPlayingProperty: TReadOnlyProperty<boolean>;

  // displays for the flux, which consist of arrows and a background
  private readonly sunlightFluxDisplay: EnergyFluxDisplay;
  private readonly infraredFluxDisplay: EnergyFluxDisplay;

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
                      isPlayingProperty: TReadOnlyProperty<boolean>,
                      visibleProperty: TReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      observationWindowViewBounds: Bounds2,
                      providedOptions?: FluxMeterNodeOptions ) {

    const options = optionize<FluxMeterNodeOptions, SelfOptions, NodeOptions>()( {
      includeZoomButtons: false,
      visibleProperty: visibleProperty
    }, providedOptions );

    super( options );

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
        stroke: new Color( 90, 90, 90 ),
        lineWidth: 5
      }
    );
    this.addChild( wireNode );

    const titleText = new Text( energyFluxStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: ( FLUX_PANEL_X_MARGIN * 2 + EnergyFluxDisplay.WIDTH * 2 + METER_SPACING ) * 0.9
    } );

    this.zoomFactorProperty = new NumberProperty( 0, {
      range: new Range( -NUMBER_OF_ZOOM_OUT_LEVELS, NUMBER_OF_ZOOM_IN_LEVELS ),
      tandem: options.tandem.createTandem( 'zoomFactorProperty' ),
      phetioFeatured: true
    } );

    const fluxToIndicatorLengthProperty = new DerivedProperty( [ this.zoomFactorProperty ], zoomFactor =>
      NOMINAL_FLUX_TO_ARROW_LENGTH_MULTIPLIER * Math.pow( FLUX_ARROW_ZOOM_FACTOR, zoomFactor )
    );

    this.sunlightFluxDisplay = new EnergyFluxDisplay(
      model.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
      fluxToIndicatorLengthProperty,
      sunlightStringProperty,
      GreenhouseEffectColors.sunlightColorProperty
    );
    this.infraredFluxDisplay = new EnergyFluxDisplay(
      model.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty,
      fluxToIndicatorLengthProperty,
      infraredStringProperty,
      GreenhouseEffectColors.infraredColorProperty
    );
    const fluxArrows = new HBox( {
      children: [ this.sunlightFluxDisplay, this.infraredFluxDisplay ],
      spacing: METER_SPACING
    } );

    const contentChildren: Node[] = [ titleText, fluxArrows ];

    // zoom buttons conditionally added to the view
    if ( options.includeZoomButtons ) {
      const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( this.zoomFactorProperty, {
        spacing: 5,
        applyZoomIn: ( currentZoom: number ) => currentZoom + 1,
        applyZoomOut: ( currentZoom: number ) => currentZoom - 1,
        magnifyingGlassNodeOptions: {
          glassRadius: 6
        },
        buttonOptions: {
          baseColor: PhetColorScheme.PHET_LOGO_BLUE
        },
        tandem: options.tandem.createTandem( 'zoomButtonGroup' ),
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } );
      contentChildren.push( zoomButtonGroup );
    }

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
      [ this.wasDraggedProperty, GreenhouseEffectPreferences.cueingArrowsEnabledProperty ],
      ( wasDragged, cueingArrowsEnabled ) => !wasDragged && cueingArrowsEnabled
    );

    // colored arrows around the flux sensor, cues the user to drag it
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

    // create the panel
    this.fluxPanel = new Panel( content, {
      xMargin: FLUX_PANEL_X_MARGIN
    } );
    this.addChild( this.fluxPanel );

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

    // Add sound generation.
    this.soundGenerator = new FluxMeterSoundGenerator(
      model.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
      model.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty,
      model.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
      {
        initialOutputLevel: 0.15,
        enableControlProperties: [ isPlayingProperty, visibleProperty ]
      }
    );
    soundManager.addSoundGenerator( this.soundGenerator, {
      sonificationLevel: SoundLevelEnum.EXTRA,
      associatedViewNode: this
    } );

    // Make some things available to the methods.
    this.isModelPlayingProperty = isPlayingProperty;

    // never disposed, no need to unlink
    model.fluxSensor.altitudeProperty.link( altitude => {
      fluxSensorNode.centerY = modelViewTransform.modelToViewY( altitude );
    } );
  }

  public step( dt: number ): void {
    this.soundGenerator.step( dt );
    this.sunlightFluxDisplay.updateFluxArrows();
    this.infraredFluxDisplay.updateFluxArrows();
  }

  public reset(): void {
    this.wasDraggedProperty.reset();
    this.zoomFactorProperty.reset();
    this.soundGenerator.reset();
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
 * background with two arrows, one that grows upwards and another that grows down.  The background includes reference
 * lines so that the display can be zoomed in and out.
 *
 * @param energyDownProperty
 * @param energyUpProperty
 * @param fluxToArrowLengthMultiplierProperty -  multiplier maps the flux values from the meter to the arrow lengths
 * @param labelString
 * @param baseColor
 * @param providedOptions
 */
class EnergyFluxDisplay extends Node {

  private readonly energyUpProperty: TReadOnlyProperty<number>;
  private readonly energyDownProperty: TReadOnlyProperty<number>;
  private readonly fluxToArrowLengthMultiplierProperty: TReadOnlyProperty<number>;
  private readonly upArrow: ArrowNode;
  private readonly downArrow: ArrowNode;
  private readonly size: Dimension2;

  public constructor( energyDownProperty: TReadOnlyProperty<number>,
                      energyUpProperty: TReadOnlyProperty<number>,
                      fluxToArrowLengthMultiplierProperty: TReadOnlyProperty<number>,
                      labelStringProperty: TReadOnlyProperty<string>,
                      baseColorProperty: ColorProperty,
                      providedOptions?: EnergyFluxDisplayOptions ) {

    const options = optionize<EnergyFluxDisplayOptions, EnergyFluxDisplayArrowSelfOptions, NodeOptions>()( {

      // lots of empirically determined values here, chosen to make the thing look decent
      height: 340,
      arrowNodeOptions: {
        headHeight: 16,
        headWidth: 16,
        tailWidth: 8,
        fill: baseColorProperty
      }
    }, providedOptions );

    super();

    this.energyDownProperty = energyDownProperty;
    this.energyUpProperty = energyUpProperty;
    this.fluxToArrowLengthMultiplierProperty = fluxToArrowLengthMultiplierProperty;

    const labelText = new Text( labelStringProperty, {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: EnergyFluxDisplay.WIDTH
    } );
    this.addChild( labelText );

    // Create and add a rectangle that is invisible but acts as a container for the energy arrows and reference lines.
    // Its shape is used as a clip area for the display so that arrows and reference lines don't go beyond the height of
    // this display.
    const boundsRectangle = new Rectangle( 0, 0, EnergyFluxDisplay.WIDTH, options.height, 5, 5 );
    this.addChild( boundsRectangle );

    // Make the size available to the methods.
    this.size = new Dimension2( boundsRectangle.width, boundsRectangle.height );

    this.addChild( new VBox( {
      children: [ labelText, boundsRectangle ],
      spacing: 5
    } ) );

    // Add the Path that will display reference lines behind the arrows.
    const referenceLinesNode = new Path( null, {
      stroke: Color.GRAY.withAlpha( 0.3 ),
      lineWidth: 2
    } );
    boundsRectangle.addChild( referenceLinesNode );

    // Set a clip area so that the arrows don't go outside the background.
    boundsRectangle.clipArea = Shape.bounds( boundsRectangle.getRectBounds() );

    // Create and add the arrows.
    this.downArrow = new ArrowNode(
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      options.arrowNodeOptions
    );
    this.upArrow = new ArrowNode(
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      boundsRectangle.width / 2,
      boundsRectangle.height / 2,
      options.arrowNodeOptions
    );
    boundsRectangle.addChild( this.downArrow );
    boundsRectangle.addChild( this.upArrow );

    const darkenedBaseColorProperty = new DerivedProperty(
      [ baseColorProperty ],
      color => color.colorUtilsDarker( 0.25 )
    );

    // Add a horizontal line at the origin of the arrows that can be seen when the arrows have no length.
    const centerIndicatorLine = new Line( 0, 0, boundsRectangle.width * 0.5, 0, {
      centerX: boundsRectangle.width / 2,
      centerY: boundsRectangle.height / 2,
      stroke: darkenedBaseColorProperty,
      lineWidth: 3
    } );
    boundsRectangle.addChild( centerIndicatorLine );

    // Define a reference flux value that will be used to define the spacing between the reference marks.  This value
    // was empirically determined to provide the desired look, and is based on the flux values that naturally occur in
    // the model.
    const referenceFlux = 5E6;

    // Update the background reference marks when the zoom level changes.
    fluxToArrowLengthMultiplierProperty.link( fluxToArrowLengthMultiplier => {
      const referenceLinesShape = new Shape();
      const interReferenceLineDistance = fluxToArrowLengthMultiplier * referenceFlux;
      const referenceLineWidth = boundsRectangle.width * 0.5; // empirically determined

      // Loop, creating the shape that will represent the reference lines.
      for ( let distanceFromCenter = interReferenceLineDistance;
            distanceFromCenter < boundsRectangle.height / 2;
            distanceFromCenter += interReferenceLineDistance ) {

        // Add lines in both the upward and downward directions.
        referenceLinesShape.moveTo( 0, distanceFromCenter );
        referenceLinesShape.lineTo( referenceLineWidth, distanceFromCenter );
        referenceLinesShape.moveTo( 0, -distanceFromCenter );
        referenceLinesShape.lineTo( referenceLineWidth, -distanceFromCenter );
      }

      // Set the shape and its position.
      referenceLinesNode.setShape( referenceLinesShape );
      referenceLinesNode.centerX = boundsRectangle.width / 2;
      referenceLinesNode.centerY = boundsRectangle.height / 2;

      // Update the flux arrows for the new multiplier.
      this.updateFluxArrows();
    } );
  }

  /**
   * Update the arrows that represent the amount of flux.  This is done as a method called during a step instead of
   * being based on linkages to the energy properties for better performance, see
   * https://github.com/phetsims/greenhouse-effect/issues/265#issuecomment-1405870321.
   */
  public updateFluxArrows(): void {

    // update the down arrow
    const energyDown = this.energyDownProperty.value;
    const downArrowHeight = this.size.height / 2 + this.getArrowHeightFromFlux( energyDown );
    this.downArrow.visible = Math.abs( energyDown ) > 0;
    this.downArrow.setTip( this.size.width / 2, downArrowHeight );

    // update the up arrow
    const energyUp = this.energyUpProperty.value;
    const upArrowHeight = this.size.height / 2 - this.getArrowHeightFromFlux( energyUp );
    this.upArrow.visible = Math.abs( energyUp ) > 0;
    this.upArrow.setTip( this.size.width / 2, upArrowHeight );
  }

  /**
   * Map the flux to a value for the height of the flux arrow.
   */
  private getArrowHeightFromFlux( flux: number ): number {
    return flux * this.fluxToArrowLengthMultiplierProperty.value;
  }

  // an empirically determined value used in part to set the overall width of the panel
  public static readonly WIDTH = 45;
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
    const fluxSensorTouchAreaYDilation = 10;
    const sensorNode = new Rectangle( 0, 0, fluxSensorWidth, SENSOR_VIEW_HEIGHT, 5, 5, {
      stroke: SENSOR_STROKE_COLOR,
      fill: SENSOR_FILL_COLOR,
      lineWidth: 2,
      cursor: 'ns-resize',
      center: modelViewTransform.modelToViewXY( fluxSensor.xPosition, fluxSensor.altitudeProperty.value ),
      touchArea: Shape.rectangle(
        0,
        -fluxSensorTouchAreaYDilation,
        fluxSensorWidth,
        SENSOR_VIEW_HEIGHT + fluxSensorTouchAreaYDilation * 2
      )
    } );
    this.addChild( sensorNode );
  }
}

greenhouseEffect.register( 'FluxMeterNode', FluxMeterNode );
export default FluxMeterNode;
