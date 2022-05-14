// Copyright 2021-2022, University of Colorado Boulder

/**
 * A panel with the Energy Balance plot, representing the net energy in and out of the model system.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import UpDownArrowPlot from '../../../../bamboo/js/UpDownArrowPlot.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import { Node, scenery, Text } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import SunEnergySource from '../model/SunEnergySource.js';
import EnergyDescriber from './describers/EnergyDescriber.js';

// constants
const BAR_COLOR = 'rgb(0,187,115)';
const BAR_STROKE = 'grey';
const PLOT_VIEW_WIDTH = 100; // view coordinates
const PLOT_VIEW_HEIGHT = 120; // view coordinates

class EnergyBalancePanel extends Panel {

  /**
   * @param {Property<boolean>} energyBalanceVisibleProperty - controls whether this Panel is visible in the view
   * @param {Property<number>} netEnergyInProperty
   * @param {Property<number>} netEnergyOutProperty
   * @param {Property<boolean>} inRadiativeBalanceProperty
   * @param {Object} [options]
   */
  constructor( energyBalanceVisibleProperty: Property<boolean>,
               netEnergyInProperty: Property<number>,
               netEnergyOutProperty: Property<number>,
               inRadiativeBalanceProperty: Property<boolean>,
               options?: PanelOptions ) {

    options = merge( {

      // panel options
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 10,

      // pdom
      tagName: 'div',
      labelTagName: 'h4',
      labelContent: greenhouseEffectStrings.energyBalancePanel.title
    }, options ) as PanelOptions;

    // title
    const titleText = new Text( greenhouseEffectStrings.energyBalancePanel.title, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: 150
    } );
    const subTitleText = new Text( greenhouseEffectStrings.energyBalancePanel.subTitle, {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 120
    } );
    const titleNode = new Node( { children: [ titleText, subTitleText ] } );

    // Energy "In" needs to be plotted in the negative y direction to match other graphics related to energy flux
    // in this sim
    const negatedEnergyInProperty: IReadOnlyProperty<number> = new DerivedProperty(
      [ netEnergyInProperty ],
      netEnergyIn => -netEnergyIn
    );

    // TODO: Use model.netInflowOfEnergyProperty instead of this custom one.
    const netEnergyProperty: IReadOnlyProperty<number> = new DerivedProperty(
      [ negatedEnergyInProperty, netEnergyOutProperty ],
      ( netIn, netOut ) => netIn + netOut
    );

    // the plot
    const balancePlot = new EnergyBalancePlot( negatedEnergyInProperty, netEnergyOutProperty, netEnergyProperty );

    const content = new Node( { children: [ titleNode, balancePlot ] } );
    super( content, options );

    // layout
    subTitleText.centerTop = titleText.centerBottom;
    balancePlot.centerTop = titleNode.centerBottom.plusXY( 0, 10 );

    // listeners
    energyBalanceVisibleProperty.link( visible => {
      this.visible = visible;
    } );

    // pdom
    Property.multilink( [ netEnergyProperty, inRadiativeBalanceProperty ], ( netEnergy, inRadiativeBalance ) => {
      this.descriptionContent = EnergyDescriber.getNetEnergyAtAtmosphereDescription( -netEnergy, inRadiativeBalance );
    } );
  }
}

/**
 * Inner class for the actual Plot, using bamboo.
 */
class EnergyBalancePlot extends Node {

  /**
   * @param {Property.<number>} netEnergyInProperty - Representing net energy in, read-only
   * @param {Property.<number>} netEnergyOutProperty - Representing net energy out, read-only
   * @param {Property.<number>} netEnergyProperty - Representing net energy of the system, read-only
   */
  constructor( netEnergyInProperty: IReadOnlyProperty<number>,
               netEnergyOutProperty: Property<number>,
               netEnergyProperty: IReadOnlyProperty<number> ) {
    super();

    // position of each bar, in model coordinates
    const inEnergyModelPosition = 0;
    const outEnergyModelPosition = 1;
    const netEnergyModelPosition = 2;
    const horizontalModelRange = new Range( inEnergyModelPosition, netEnergyModelPosition );

    // range of the entire plot, in model watts, based on the max output of the sun
    const verticalModelSpan = SunEnergySource.OUTPUT_ENERGY_RATE * EnergyAbsorbingEmittingLayer.SURFACE_AREA * 2;

    const chartTransform = new ChartTransform( {
      viewWidth: PLOT_VIEW_WIDTH,
      modelXRange: horizontalModelRange,
      viewHeight: PLOT_VIEW_HEIGHT,
      modelYRange: new Range( -verticalModelSpan, verticalModelSpan )
    } );

    // the dataSet for the barPlot gets set in a multilink of the provided energy Properties
    const barPlot = new UpDownArrowPlot( chartTransform, [], {
      pointToPaintableFields: ( point: Vector2 ) => {
        return { fill: BAR_COLOR, stroke: BAR_STROKE };
      }
    } );

    const axisLine = new AxisLine( chartTransform, Orientation.HORIZONTAL, {
      stroke: 'grey',
      lineDash: [ 10, 5 ]
    } );

    // labels
    const labelOptions = { font: GreenhouseEffectConstants.CONTENT_FONT, maxWidth: 30 };
    const gridLabels = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {

      // the 'extent' is extra spacing between tick marks and labels, negative value because this is vertically
      // above the plot
      extent: -30,

      // place the labels at the max value of the plot
      value: verticalModelSpan,

      createLabel: ( value: number ) => {
        return value === inEnergyModelPosition ? new Text( greenhouseEffectStrings.energyBalancePanel.in, labelOptions ) :
               value === outEnergyModelPosition ? new Text( greenhouseEffectStrings.energyBalancePanel.out, labelOptions ) :
               new Text( greenhouseEffectStrings.energyBalancePanel.net, labelOptions );
      }
    } );

    // contains all plot components and provides consistent bounds as the arrows change size with model data
    const chartRectangle = new ChartRectangle( chartTransform, {
      children: [ axisLine, barPlot, gridLabels ]
    } );
    this.addChild( chartRectangle );

    // Arrows will get cut off if they extend outside of the initial bounds of the plot
    this.clipArea = Shape.bounds( this.bounds );

    // listeners
    Property.multilink(
      [ netEnergyInProperty, netEnergyOutProperty, netEnergyProperty ],
      ( netIn, netOut, netTotal ) => {
        barPlot.setDataSet( [ new Vector2( 0, netIn ), new Vector2( 1, netOut ), new Vector2( 2, netTotal ) ] );
      }
    );
  }
}

scenery.register( 'EnergyBalancePanel', EnergyBalancePanel );
export default EnergyBalancePanel;
