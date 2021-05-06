// Copyright 2021, University of Colorado Boulder

/**
 * A panel with the Energy Balance plot, representing the net energy in and out of the model system.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import scenery from '../../../../scenery/js/scenery.js';
import Panel from '../../../../sun/js/Panel.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// constants
const BAR_COLOR = 'rgb(0,187,115)';
const BAR_STROKE = 'grey';
const PLOT_VIEW_WIDTH = 100; // view coordinates
const PLOT_VIEW_HEIGHT = 60; // view coordinates

class EnergyBalancePanel extends Panel {

  /**
   * @param {BooleanProperty} energyBalanceVisibleProperty - controls whether this Panel is visible in the view
   * @param {Object} [options]
   */
  constructor( energyBalanceVisibleProperty, options ) {

    options = merge( {

      // panel options
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 10
    }, options );

    // title
    const titleText = new Text( greenhouseEffectStrings.energyBalancePanel.title, { font: GreenhouseEffectConstants.TITLE_FONT } );
    const subTitleText = new Text( greenhouseEffectStrings.energyBalancePanel.subTitle, { font: GreenhouseEffectConstants.CONTENT_FONT } );
    const titleNode = new Node( { children: [ titleText, subTitleText ] } );

    // TODO: These are dummy Properties to get the visuals up and running, to be replaced with model Properties
    // value of 240 comes from SunEnergySource
    const netEnergyInProperty = new NumberProperty( 240 );
    const netEnergyOutProperty = new NumberProperty( -240 );
    const netEnergyProperty = new DerivedProperty( [ netEnergyInProperty, netEnergyOutProperty ], ( netIn, netOut ) => {
      return netIn + netOut;
    } );

    // the plot
    const balancePlot = new EnergyBalancePlot( netEnergyInProperty, netEnergyOutProperty, netEnergyProperty );

    const content = new Node( { children: [ titleNode, balancePlot ] } );
    super( content, options );

    // layout
    subTitleText.centerTop = titleText.centerBottom;
    balancePlot.centerTop = titleNode.centerBottom.plusXY( 0, 10 );

    // listeners
    energyBalanceVisibleProperty.link( visible => {
      this.visible = visible;
    } );
  }
}

/**
 * Inner class for the actual Plot, using bamboo.
 */
class EnergyBalancePlot extends Node {

  /**
   * @param {NumberProperty} netEnergyInProperty - Representing net energy in, read-only
   * @param {NumberProperty} netEnergyOutProperty - Representing net energy out, read-only
   * @param {NumberProperty} netEnergyProperty - Representing net energy of the system, read-only
   */
  constructor( netEnergyInProperty, netEnergyOutProperty, netEnergyProperty ) {
    super();

    // position of each bar, in model coordinates
    const inEnergyModelPosition = 0;
    const outEnergyModelPosition = 1;
    const netEnergyModelPosition = 2;
    const horizontalModelRange = new Range( inEnergyModelPosition, netEnergyModelPosition );

    // range of the entire plot, in model coordinates
    const verticalModelRange = 300;

    const chartTransform = new ChartTransform( {
      viewWidth: PLOT_VIEW_WIDTH,
      modelXRange: horizontalModelRange,
      viewHeight: PLOT_VIEW_HEIGHT,
      modelYRange: new Range( 0, verticalModelRange )
    } );

    // the dataSet for the barPlot gets set in a multilink of the provided energy Properties
    const barPlot = new BarPlot( chartTransform, [], {
      pointToPaintableFields: point => {
        return { fill: BAR_COLOR, stroke: BAR_STROKE };
      }
    } );

    const gridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, verticalModelRange * 2, {
      stroke: 'grey',
      lineDash: [ 10, 5 ]
    } );

    // labels
    const labelOptions = { font: GreenhouseEffectConstants.CONTENT_FONT };
    const gridLabels = new LabelSet( chartTransform, Orientation.HORIZONTAL, 1, {

      // the 'extent' is extra spacing between tick marks and labels, negative value because this is vertically
      // above the plot
      extent: -20,

      // place the labels at the max value of the plot
      value: verticalModelRange,

      createLabel: value => {
        return value === inEnergyModelPosition ? new Text( greenhouseEffectStrings.energyBalancePanel.in, labelOptions ) :
               value === outEnergyModelPosition ? new Text( greenhouseEffectStrings.energyBalancePanel.out, labelOptions ) :
               new Text( greenhouseEffectStrings.energyBalancePanel.net, labelOptions );
      }
    } );

    // contains all plot components and provides consistent bounds as bar sizes change with model data
    const chartRectangle = new Rectangle( 0, 0, PLOT_VIEW_WIDTH, PLOT_VIEW_HEIGHT * 2 );

    chartRectangle.addChild( gridLines );
    chartRectangle.addChild( barPlot );
    chartRectangle.addChild( gridLabels );
    this.addChild( chartRectangle );

    // plot bars will get cut off if they extend outside of the initial bounds
    this.clipArea = Shape.bounds( this.bounds );

    // listeners
    Property.multilink( [ netEnergyInProperty, netEnergyOutProperty, netEnergyProperty ], ( netIn, netOut, net ) => {
      barPlot.setDataSet( [ new Vector2( 0, netIn ), new Vector2( 1, netOut ), new Vector2( 2, net ) ] );
    } );
  }
}

scenery.register( 'EnergyBalancePanel', EnergyBalancePanel );
export default EnergyBalancePanel;
