// Copyright 2021, University of Colorado Boulder

/**
 * The "Energy Flux" meter for Greenhouse Effect. This includes a draggable sensor that can move about the Observation
 * Window and detect the flux of sunlight and infrared photons. A graphical representation of flux is displayed
 * in a panel with large arrows.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import WireNode from '../../../../scenery-phet/js/WireNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import FluxMeter from '../model/FluxMeter.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SceneryEvent from '../../../../scenery/js/input/SceneryEvent.js';
import Color from '../../../../scenery/js/util/Color.js';

const sunlightString = greenhouseEffectStrings.sunlight;
const infraredString = greenhouseEffectStrings.infrared;
const energyFluxString = greenhouseEffectStrings.fluxMeter.energyFlux;

const METER_SPACING = 8; // spacing used in a few places for layout, in view coordinates
const SENSOR_STROKE_COLOR = 'rgb(254,172,63)';
const SENSOR_FILL_COLOR = 'rgba(200,200,200,0.6)';

class FluxMeterNode extends Node {
  readonly fluxPanel: Panel;

  /**
   * @param {FluxMeter} model - model component for the FluxMeter
   * @param {Property.<boolean>} visibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} observationWindowViewBounds - bounds for the ObservationWindow to constrain dragging of the sensor
   * @param {Tandem} tandem
   */
  constructor( model: FluxMeter,
               visibleProperty: Property<boolean>,
               modelViewTransform: ModelViewTransform2,
               observationWindowViewBounds: Bounds2,
               tandem: Tandem ) {

    super();

    // wire connecting panel and sensor, beneath both so it appears like the wire is solidly connected to both
    const wireNode = new WireNode(
      new DerivedProperty(
        [ model.wireSensorAttachmentPositionProperty ],
        ( position: Vector2 ) => modelViewTransform.modelToViewPosition( position )
      ),
      new Vector2Property( new Vector2( 100, 0 ) ),
      new DerivedProperty(
        [ model.wireMeterAttachmentPositionProperty ],
        ( position: Vector2 ) => modelViewTransform.modelToViewPosition( position )
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

    const sunlightDisplayArrow = new EnergyFluxDisplayArrow( model.sunlightInProperty, model.sunlightOutProperty, sunlightString, {
      arrowNodeOptions: {
        fill: GreenhouseEffectConstants.SUNLIGHT_COLOR
      }
    } );
    const infraredDisplayArrow = new EnergyFluxDisplayArrow( model.infraredInProperty, model.infraredOutProperty, infraredString, {
      arrowNodeOptions: {
        fill: GreenhouseEffectConstants.INFRARED_COLOR
      }
    } );

    const arrows = new HBox( { children: [ sunlightDisplayArrow, infraredDisplayArrow ], spacing: METER_SPACING } );
    const content = new VBox( { children: [ titleText, arrows ], spacing: METER_SPACING } );

    const fluxSensor = new Rectangle( modelViewTransform.modelToViewBounds( model.sensorBounds ), 10, 10, {
      stroke: SENSOR_STROKE_COLOR,
      fill: SENSOR_FILL_COLOR,
      lineWidth: 5
    } );
    this.addChild( fluxSensor );

    // @public {Panel} - contains the display showing energy flux, public for positioning in the view
    this.fluxPanel = new Panel( content );
    // @ts-ignore
    this.addChild( this.fluxPanel );

    // listeners
    visibleProperty.link( visible => {
      this.visible = visible;
    } );

    // the offset position for the drag pickup, so that the translation doesn't snap to the cursor position
    let startOffset: Vector2 = Vector2.ZERO;

    // the sensor is constrained to the bounds of the observation window - the center is allowed to reach y=0, but
    // the top of the sensor cannot leave the observation window
    const dragViewBounds = observationWindowViewBounds.withMinY( observationWindowViewBounds.minY + fluxSensor.height );

    fluxSensor.addInputListener( new DragListener( {
      start: ( event: SceneryEvent ) => {
        startOffset = fluxSensor.globalToParentPoint( event.pointer.point! ).subtract( fluxSensor.center );
      },
      drag: ( event: SceneryEvent ) => {
        const viewPoint = fluxSensor.globalToParentPoint( event.pointer.point! ).subtract( startOffset );
        const constrainedViewPoint = dragViewBounds.closestPointTo( viewPoint );

        // do not let the sensor go below ground (y=0)
        const modelY = Math.max( 0, modelViewTransform.viewToModelY( constrainedViewPoint.y ) );
        model.sensorPositionProperty.value = new Vector2( 0, modelY );
      },
      useInputListenerCursor: true,

      // phet-io
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    model.sensorPositionProperty.link( sensorPosition => {
      fluxSensor.center = modelViewTransform.modelToViewPosition( sensorPosition );
    } );
  }
}

type EnergyFluxDisplayArrowOptions = {
  height?: number,
  arrowNodeOptions: {
    headHeight?: number,
    headWidth?: number,
    tailWidth?: number,
    fill?: Color
  }
} & NodeOptions;

/**
 * An inner class that implements the arrows displaying the amount of energy flux.
 */
class EnergyFluxDisplayArrow extends Node {
  constructor( energyInProperty: Property<number>,
               energyOutProperty: Property<number>,
               labelString: string,
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

    const boundsRectangle = new Rectangle( 0, 0, labelText.width * 1.4, options.height );
    this.addChild( boundsRectangle );

    const inArrow = new ArrowNode(
      boundsRectangle.centerX,
      boundsRectangle.centerY + 10,
      boundsRectangle.centerX,
      boundsRectangle.centerY,
      options.arrowNodeOptions
    );
    const outArrow = new ArrowNode(
      boundsRectangle.centerX,
      boundsRectangle.centerY - 10,
      boundsRectangle.centerX,
      boundsRectangle.centerY,
      options.arrowNodeOptions
    );
    boundsRectangle.addChild( inArrow );
    boundsRectangle.addChild( outArrow );

    // a linear function that maps the number of photons going through the flux meter per second
    const heightFunction = new LinearFunction( -100, 100, -options.height / 2, options.height / 2, true );

    // redraw arrows when the flux Properties change
    energyInProperty.link( energyIn => {
      // @ts-ignore
      inArrow.setTip( boundsRectangle.centerX, boundsRectangle.centerY + heightFunction.evaluate( energyIn ) );
    } );

    energyOutProperty.link( energyOut => {
      // @ts-ignore
      outArrow.setTip( boundsRectangle.centerX, boundsRectangle.centerY + heightFunction.evaluate( energyOut ) );
    } );

    // layout
    boundsRectangle.centerTop = labelText.centerBottom;
  }
}

greenhouseEffect.register( 'FluxMeterNode', FluxMeterNode );
export default FluxMeterNode;
