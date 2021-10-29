// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents a layer that absorbs and emits energy.
 *
 * @author John Blanco
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type EnergyAbsorbingEmittingLayerNodeOptions = {
  lineOptions?: {
    stroke?: Color,
    lineWidth?: number
  }
} & NodeOptions;

class EnergyAbsorbingEmittingLayerNode extends Node {

  /**
   * @param {EnergyAbsorbingEmittingLayer} layerModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( layerModel: EnergyAbsorbingEmittingLayer,
               modelViewTransform: ModelViewTransform2,
               options: EnergyAbsorbingEmittingLayerNodeOptions ) {

    options = merge(
      {
        lineOptions: {
          stroke: Color.BLACK,
          lineWidth: 4
        }
      },
      options
    );

    const centerY = modelViewTransform.modelToViewY( layerModel.altitude );
    const widthInView = modelViewTransform.modelToViewDeltaX( EnergyAbsorbingEmittingLayer.WIDTH );
    const line = new Line( 0, centerY, widthInView, centerY, options.lineOptions );

    const numberDisplay = new NumberDisplay( layerModel.temperatureProperty, new Range( 0, 700 ), {
      centerY: line.centerY,
      right: widthInView - 20,
      numberFormatter: ( number: number ) => `${Utils.toFixed( number, 2 )} ${MathSymbols.DEGREES}K`
    } );

    // supertype constructor
    super( merge( { children: [ line, numberDisplay ] }, options ) );
  }
}

greenhouseEffect.register( 'EnergyAbsorbingEmittingLayerNode', EnergyAbsorbingEmittingLayerNode );

export default EnergyAbsorbingEmittingLayerNode;
