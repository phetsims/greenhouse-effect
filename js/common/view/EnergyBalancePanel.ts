// Copyright 2021-2024, University of Colorado Boulder

/**
 * EnergyBalancePanel is a panel that portrays a plot of the energy balance at a point in the atmosphere, showing the
 * energy in, energy out, and the net energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import UpDownArrowPlot from '../../../../bamboo/js/UpDownArrowPlot.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import { Node, scenery, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import SunEnergySource from '../model/SunEnergySource.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import EnergyBalanceSoundGenerator from './EnergyBalanceSoundGenerator.js';
import LayersModel from '../model/LayersModel.js';

// constants
const BAR_COLOR = 'rgb(0,187,115)';
const BAR_STROKE = 'grey';
const PLOT_VIEW_WIDTH = 100; // view coordinates
const PLOT_VIEW_HEIGHT = 120; // view coordinates

class EnergyBalancePanel extends Panel {

  private readonly energyBalanceSoundGenerator: EnergyBalanceSoundGenerator;
  private readonly balancePlot: EnergyBalancePlot;

  /**
   * @param model - a model of energy capture in an atmosphere based on energy absorbing and emitting layers
   */
  public constructor( model: LayersModel ) {

    const options: PanelOptions = {
      visibleProperty: model.energyBalanceVisibleProperty,
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 10,

      // pdom
      tagName: 'div',
      labelTagName: 'h4',
      labelContent: GreenhouseEffectStrings.energyBalancePanel.titleStringProperty
    };

    // title
    const titleText = new Text( GreenhouseEffectStrings.energyBalancePanel.titleStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: 150
    } );
    const subTitleText = new Text( GreenhouseEffectStrings.energyBalancePanel.subTitleStringProperty, {
      font: GreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 120
    } );
    const titleNode = new VBox( {
      spacing: 5,
      children: [ titleText, subTitleText ]
    } );

    // Energy "In" needs to be plotted in the negative y direction to match other graphics related to energy flux
    // in this sim.
    const negatedEnergyInProperty: TReadOnlyProperty<number> = new DerivedProperty(
      [ model.sunEnergySource.outputEnergyRateTracker.energyRateProperty ],
      netEnergyIn => -netEnergyIn
    );

    // Create a derived property to represent the net energy coming into the system.  This will be negative if more
    // energy is leaving than is coming in.
    const netIncomingEnergyProperty: TReadOnlyProperty<number> = new DerivedProperty(
      [ negatedEnergyInProperty, model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty ],
      ( netIn, netOut ) => netIn + netOut
    );

    // the plot
    const balancePlot = new EnergyBalancePlot(
      negatedEnergyInProperty,
      model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty,
      netIncomingEnergyProperty
    );

    const content = new VBox( {
      spacing: 5,
      children: [ titleNode, balancePlot ]
    } );

    super( content, options );

    // Make the plot available to the step method.
    this.balancePlot = balancePlot;

    // sound generation
    this.energyBalanceSoundGenerator = new EnergyBalanceSoundGenerator(
      model.netInflowOfEnergyProperty,
      model.inRadiativeBalanceProperty,
      model.energyBalanceVisibleProperty
    );
    soundManager.addSoundGenerator( this.energyBalanceSoundGenerator );

    // pdom
    Multilink.multilink(
      [
        model.netInflowOfEnergyProperty,
        model.inRadiativeBalanceProperty,
        model.sunEnergySource.isShiningProperty
      ],
      ( netEnergy, inRadiativeBalance, sunIsShining ) => {

        if ( !sunIsShining ) {

          // describe no flow of energy and a hint to start sunlight to make use of the energy balance panel
          this.descriptionContent = GreenhouseEffectStrings.a11y.noFlowOfEnergyHintDescriptionStringProperty;
        }
        else {
          this.descriptionContent = EnergyDescriber.getNetEnergyAtAtmosphereDescription( -netEnergy, inRadiativeBalance );
        }
      } );
  }

  /**
   * time-based behavior
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {
    this.energyBalanceSoundGenerator.step( dt );
    this.balancePlot.update();
  }
}

/**
 * Inner class for the actual Plot, using bamboo.
 */
class EnergyBalancePlot extends Node {
  private readonly barPlot: UpDownArrowPlot;
  private readonly netEnergyInProperty: TReadOnlyProperty<number>;
  private readonly netEnergyOutProperty: TReadOnlyProperty<number>;
  private readonly netEnergyProperty: TReadOnlyProperty<number>;

  /**
   * @param netEnergyInProperty - Representing net energy in
   * @param netEnergyOutProperty - Representing net energy out
   * @param netEnergyProperty - Representing net energy of the system
   */
  public constructor( netEnergyInProperty: TReadOnlyProperty<number>,
                      netEnergyOutProperty: Property<number>,
                      netEnergyProperty: TReadOnlyProperty<number> ) {
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
      pointToPaintableFields: () => {
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
        return value === inEnergyModelPosition ?
               new Text( GreenhouseEffectStrings.energyBalancePanel.inStringProperty, labelOptions ) :
               value === outEnergyModelPosition ? new Text( GreenhouseEffectStrings.energyBalancePanel.outStringProperty, labelOptions ) :
               new Text( GreenhouseEffectStrings.energyBalancePanel.netStringProperty, labelOptions );
      }
    } );

    // contains all plot components and provides consistent bounds as the arrows change size with model data
    const chartRectangle = new ChartRectangle( chartTransform, {
      children: [ axisLine, barPlot, gridLabels ]
    } );
    this.addChild( chartRectangle );

    // The arrows will be clipped if they extend outside the bounds of the plot, and this clipping should make sure
    // that they don't overlap with the labels.  Also, the clip area can't be too small in the x-direction or the edges
    // of the arrow heads can be cut off (see https://github.com/phetsims/greenhouse-effect/issues/240).
    barPlot.clipArea = Shape.bounds( this.bounds.withMinY( gridLabels.bounds.maxY ).dilateX( 5 ) );

    // Make the plot and the energy properties visible to the update method.
    this.barPlot = barPlot;
    this.netEnergyInProperty = netEnergyInProperty;
    this.netEnergyOutProperty = netEnergyOutProperty;
    this.netEnergyProperty = netEnergyProperty;
  }

  /**
   * Update the bar chart.  This is done in a method rather than linking to properties because the latter approach was
   * updating multiple times per frame and causing some performance issues.  See
   * https://github.com/phetsims/greenhouse-effect/issues/265.
   */
  public update(): void {
    this.barPlot.setDataSet( [
      new Vector2( 0, this.netEnergyInProperty.value ),
      new Vector2( 1, this.netEnergyOutProperty.value ),
      new Vector2( 2, this.netEnergyProperty.value )
    ] );
  }
}

scenery.register( 'EnergyBalancePanel', EnergyBalancePanel );
export default EnergyBalancePanel;