// Copyright 2021-2022, University of Colorado Boulder

/**
 * The "Energy Flux" meter for Greenhouse Effect. This includes a draggable sensor that can move about the Observation
 * Window and detect the flux of sunlight and infrared photons. A graphical representation of flux is displayed
 * in a panel with large arrows.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import WireNode from '../../../../scenery-phet/js/WireNode.js';
import { Color, DragListener, HBox, Line, Node, NodeOptions, Rectangle, SceneryEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import FluxMeter from '../model/FluxMeter.js';
import LayersModel from '../model/LayersModel.js';
import SunEnergySource from '../model/SunEnergySource.js';

const sunlightString = greenhouseEffectStrings.sunlight;
const infraredString = greenhouseEffectStrings.infrared;
const energyFluxString = greenhouseEffectStrings.fluxMeter.energyFlux;

const METER_SPACING = 8; // spacing used in a few places for layout, in view coordinates
const SENSOR_STROKE_COLOR = 'rgb(254,172,63)';
const SENSOR_FILL_COLOR = 'rgba(200,200,200,0.6)';

// The height of the sensor in the view.  This is needed because the sensor model doesn't have any y-dimension height,
// so we use and arbitrary value that looks decent in the view.
const SENSOR_VIEW_HEIGHT = 30;

class FluxMeterNode extends Node {
  public readonly fluxPanel: Panel;

  /**
   * @param model - model component for the FluxMeter
   * @param visibleProperty
   * @param modelViewTransform
   * @param observationWindowViewBounds - bounds for the ObservationWindow to constrain dragging of the sensor
   * @param tandem
   */
  public constructor( model: FluxMeter,
                      visibleProperty: Property<boolean>,
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

    // Calculate the maximum expected flux based on the size of the sensor and some other attributes of the model.  This
    // was empirically determined and may need to adjust if the model changes.
    const maxExpectedFlux = SunEnergySource.OUTPUT_ENERGY_RATE * 2.2 *
                            model.fluxSensor.size.width * model.fluxSensor.size.height;

    const sunlightDisplayArrow = new EnergyFluxDisplayArrows(
      model.fluxSensor.visibleLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.visibleLightUpEnergyRateTracker.energyRateProperty,
      sunlightString,
      maxExpectedFlux,
      {
        arrowNodeOptions: {
          fill: GreenhouseEffectConstants.SUNLIGHT_COLOR
        }
      }
    );
    const infraredDisplayArrow = new EnergyFluxDisplayArrows(
      model.fluxSensor.infraredLightDownEnergyRateTracker.energyRateProperty,
      model.fluxSensor.infraredLightUpEnergyRateTracker.energyRateProperty,
      infraredString,
      maxExpectedFlux,
      {
        arrowNodeOptions: {
          fill: GreenhouseEffectConstants.INFRARED_COLOR
        }
      }
    );

    const arrows = new HBox( { children: [ sunlightDisplayArrow, infraredDisplayArrow ], spacing: METER_SPACING } );
    const content = new VBox( { children: [ titleText, arrows ], spacing: METER_SPACING } );

    const fluxSensorWidth = modelViewTransform.modelToViewDeltaX( model.fluxSensor.size.width );
    const fluxSensorNode = new Rectangle( 0, 0, fluxSensorWidth, SENSOR_VIEW_HEIGHT, 5, 5, {
      stroke: SENSOR_STROKE_COLOR,
      fill: SENSOR_FILL_COLOR,
      lineWidth: 4
    } );
    this.addChild( fluxSensorNode );

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
      },
      drag: ( event: SceneryEvent ) => {
        const viewPoint = fluxSensorNode.globalToParentPoint( event.pointer.point! ).subtract( startOffset );

        // Constrain the Y position to the top of the atmosphere or a little above the ground.
        const modelY = Utils.clamp(
          modelViewTransform.viewToModelY( viewPoint.y ),
          500,
          LayersModel.HEIGHT_OF_ATMOSPHERE
        );

        // Only allow dragging in the Y direction and not the X direction.
        model.fluxSensor.positionProperty.value = new Vector2( 0, modelY );
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
}

type EnergyFluxDisplayArrowOptions = {
  height?: number;
  arrowNodeOptions: {
    headHeight?: number;
    headWidth?: number;
    tailWidth?: number;
    fill?: Color;
  };
} & NodeOptions;

/**
 * An inner class that implements the arrows displaying the amount of energy flux.
 */
class EnergyFluxDisplayArrows extends Node {
  public constructor( energyDownProperty: Property<number>,
                      energyUpProperty: Property<number>,
                      labelString: string,
                      maxExpectedFlux: number,
                      providedOptions: EnergyFluxDisplayArrowOptions ) {

    const options = <EnergyFluxDisplayArrowOptions>merge( {
      height: 385,

      // {Object} - passed directly to the ArrowNodes
      arrowNodeOptions: {
        headHeight: 16,
        headWidth: 16,
        tailWidth: 8
      }
    }, providedOptions ) as Required<EnergyFluxDisplayArrowOptions>;

    super();

    const labelText = new Text( labelString, {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 80
    } );
    this.addChild( labelText );

    const boundsRectangle = new Rectangle( 0, 0, labelText.width * 1.25, options.height, 5, 5, {
      fill: 'rgba( 0, 0, 100, 0.1 )',
      stroke: 'rgb( 40, 40, 100 )'
    } );
    this.addChild( boundsRectangle );

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
      stroke: options.arrowNodeOptions.fill,
      lineWidth: 3
    } );
    boundsRectangle.addChild( centerIndicatorLine );

    // a linear function that maps the number of photons going through the flux meter per second
    const heightFunction = new LinearFunction(
      -maxExpectedFlux,
      maxExpectedFlux,
      -options.height / 2,
      options.height / 2,
      true
    );

    // Redraw arrows when the flux Properties change.
    energyDownProperty.link( energyDown => {
      downArrow.visible = Math.abs( energyDown ) > 0;
      downArrow.setTip( boundsRectangle.width / 2, boundsRectangle.height / 2 + heightFunction.evaluate( energyDown ) );
    } );

    energyUpProperty.link( energyUp => {
      upArrow.visible = Math.abs( energyUp ) > 0;
      upArrow.setTip( boundsRectangle.width / 2, boundsRectangle.height / 2 - heightFunction.evaluate( energyUp ) );
    } );

    // layout
    boundsRectangle.centerTop = labelText.centerBottom;
  }
}

greenhouseEffect.register( 'FluxMeterNode', FluxMeterNode );
export default FluxMeterNode;
