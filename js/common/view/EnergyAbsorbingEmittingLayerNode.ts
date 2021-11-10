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
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

// constants
const LAYER_THICKNESS = 26; // in screen coordinates, empirically determined to match design spec

type EnergyAbsorbingEmittingLayerNodeOptions = {
  lineOptions?: {
    stroke?: Color,
    lineWidth?: number
  }
} & NodeOptions;

class EnergyAbsorbingEmittingLayerNode extends Node {
  private readonly disposeEnergyAbsorbingEmittingLayerNode: () => void;

  /**
   * @param {EnergyAbsorbingEmittingLayer} layerModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( layerModel: EnergyAbsorbingEmittingLayer,
               modelViewTransform: ModelViewTransform2,
               options?: EnergyAbsorbingEmittingLayerNodeOptions ) {

    options = merge(
      {
        lineOptions: {
          stroke: Color.BLACK,
          lineWidth: 4
        }
      },
      options
    );

    const mainBody = new Rectangle(
      0,
      -LAYER_THICKNESS / 2,
      modelViewTransform.modelToViewDeltaX( EnergyAbsorbingEmittingLayer.WIDTH ),
      LAYER_THICKNESS,
      {
        fill: Color.LIGHT_GRAY
      }
    );

    const numberDisplay = new NumberDisplay( layerModel.temperatureProperty, new Range( 0, 999 ), {
      centerY: 0,
      right: 100,
      backgroundStroke: Color.BLACK,
      cornerRadius: 3,
      numberFormatter: ( number: number ) => `${Utils.toFixed( number, 1 )} ${MathSymbols.DEGREES}K`,
      textOptions: {
        font: new PhetFont( 14 )
      }
    } );

    // supertype constructor
    super( merge( { children: [ mainBody, numberDisplay ] }, options ) );

    const altitudeAdjuster = ( altitude: number ) => {
      this.centerY = modelViewTransform.modelToViewY( altitude );
    };
    layerModel.altitudeProperty.link( altitudeAdjuster );

    // disposal
    this.disposeEnergyAbsorbingEmittingLayerNode = () => {
      layerModel.altitudeProperty.unlink( altitudeAdjuster );
    };
  }

  /**
   * clean up memory usage
   */
  public dispose() {
    this.disposeEnergyAbsorbingEmittingLayerNode();
    super.dispose();
  }
}

greenhouseEffect.register( 'EnergyAbsorbingEmittingLayerNode', EnergyAbsorbingEmittingLayerNode );

export default EnergyAbsorbingEmittingLayerNode;
