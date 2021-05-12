// Copyright 2021, University of Colorado Boulder

/**
 * The "Energy Flux" meter for Greenhouse Effect. This includes a draggable sensor that can move about the Observation
 * Window and detect the flux of sunlight and infrared photons. A graphical representation of flux is displayed
 * in a panel with large arrows.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

const sunlightString = greenhouseEffectStrings.fluxMeter.sunlight;
const infraredString = greenhouseEffectStrings.fluxMeter.infrared;
const energyFluxString = greenhouseEffectStrings.fluxMeter.energyFlux;

const METER_SPACING = 8; // spacing used in a few places for layout, in view coordinates
const SENSOR_STROKE_COLOR = 'rgb(254,172,63)';
const SENSOR_FILL_COLOR = 'rgba(200,200,200,0.6)';

class FluxMeter extends Node {
  constructor( visibleProperty ) {
    super();

    // These are dummy Properties for now. I am guessing that the real way to do this will be to have a Model for the
    // sensor that will include its position, bounds, and calculate the flux of Photons in the model through
    // the bounds of the sensor to count values for these Properties per unit time.
    const sunlightInProperty = new NumberProperty( 70 );
    const sunlightOutProperty = new NumberProperty( -20 );
    const infraredInProperty = new NumberProperty( 40 );
    const infraredOutProperty = new NumberProperty( -60 );

    const titleText = new Text( energyFluxString, { font: GreenhouseEffectConstants.LABEL_FONT } );

    const sunlightDisplayArrow = new EnergyFluxDisplayArrow( sunlightInProperty, sunlightOutProperty, sunlightString, {
      arrowNodeOptions: {
        fill: GreenhouseEffectConstants.SUNLIGHT_COLOR
      }
    } );
    const infraredDisplayArrow = new EnergyFluxDisplayArrow( infraredInProperty, infraredOutProperty, infraredString, {
      arrowNodeOptions: {
        fill: GreenhouseEffectConstants.INFRARED_COLOR
      }
    } );

    const arrows = new HBox( { children: [ sunlightDisplayArrow, infraredDisplayArrow ], spacing: METER_SPACING } );
    const content = new VBox( { children: [ titleText, arrows ], spacing: METER_SPACING } );

    const fluxPanel = new Panel( content );
    this.addChild( fluxPanel );

    const fluxSensor = new Rectangle( 0, 0, 160, 30, 10, 10, {
      stroke: SENSOR_STROKE_COLOR,
      fill: SENSOR_FILL_COLOR,
      lineWidth: 5
    } );
    this.addChild( fluxSensor );
    fluxSensor.rightTop = fluxPanel.leftTop;

    // listeners
    visibleProperty.link( visible => {
      this.visible = visible;
    } );
  }
}

class EnergyFluxDisplayArrow extends Node {
  constructor( energyInProperty, energyOutProperty, labelString, options ) {

    options = merge( {
      height: 385,

      // {Object} - passed directly to the ArrowNodes
      arrowNodeOptions: {
        headHeight: 16,
        headWidth: 16,
        tailWidth: 8
      }
    }, options );

    super();

    const labelText = new Text( labelString, { font: GreenhouseEffectConstants.CONTENT_FONT } );
    this.addChild( labelText );

    const boundsRectangle = new Rectangle( 0, 0, labelText.width * 1.4, options.height );
    this.addChild( boundsRectangle );

    const inArrow = new ArrowNode( boundsRectangle.centerX, boundsRectangle.centerY + 10, boundsRectangle.centerX, boundsRectangle.centerY, options.arrowNodeOptions );
    const outArrow = new ArrowNode( boundsRectangle.centerX, boundsRectangle.centerY - 10, boundsRectangle.centerX, boundsRectangle.centerY, options.arrowNodeOptions );
    boundsRectangle.addChild( inArrow );
    boundsRectangle.addChild( outArrow );

    // a linear function that maps the number of photons going through the flux meter per second
    const heightFunction = new LinearFunction( -100, 100, -options.height / 2, options.height / 2, true );

    // redraw arrows when the flux Properties change
    energyInProperty.link( energyIn => {
      inArrow.setTip( boundsRectangle.centerX, boundsRectangle.centerY + heightFunction( energyIn ) );
    } );

    energyOutProperty.link( energyOut => {
      outArrow.setTip( boundsRectangle.centerX, boundsRectangle.centerY + heightFunction( energyOut ) );
    } );

    // layout
    boundsRectangle.centerTop = labelText.centerBottom;
  }
}

greenhouseEffect.register( 'FluxMeter', FluxMeter );
export default FluxMeter;
