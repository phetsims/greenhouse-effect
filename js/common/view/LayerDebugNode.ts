// Copyright 2021-2023, University of Colorado Boulder

/**
 * Node that represents a layer that absorbs and emits energy.  This is generally for debugging the behavior of the
 * model.
 *
 * TODO: Once the "real" node for these layers has been created, this may become obsolete.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { Color, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = {
  lineOptions?: {
    stroke?: Color;
    lineWidth?: number;
  };
};
export type LayerDebugNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visible'>;

class LayerDebugNode extends Node {

  /**
   * @param layerModel
   * @param modelViewTransform
   * @param [providedOptions]
   */
  public constructor( layerModel: EnergyAbsorbingEmittingLayer,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: LayerDebugNodeOptions ) {

    const options = optionize<LayerDebugNodeOptions, SelfOptions, NodeOptions>()( {
      lineOptions: {
        stroke: Color.BLACK,
        lineWidth: 4
      }
    }, providedOptions );

    const centerY = modelViewTransform.modelToViewY( layerModel.altitude );
    const widthInView = modelViewTransform.modelToViewDeltaX( EnergyAbsorbingEmittingLayer.WIDTH );
    const line = new Line( 0, centerY, widthInView, centerY, options.lineOptions );

    const numberDisplay = new NumberDisplay( layerModel.temperatureProperty, new Range( 0, 700 ), {
      centerY: line.centerY,
      right: widthInView - 20,
      numberFormatter: ( number: number ) => `${Utils.toFixed( number, 2 )} ${MathSymbols.DEGREES}K`
    } );

    options.children = [ line, numberDisplay ];

    // supertype constructor
    super( options );
  }
}

greenhouseEffect.register( 'LayerDebugNode', LayerDebugNode );

export default LayerDebugNode;
