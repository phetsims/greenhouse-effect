// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents a layer in the atmosphere that absorbs and emits energy.
 *
 * @author John Blanco
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import AtmosphereLayer from '../model/AtmosphereLayer.js';

// constants
const LAYER_THICKNESS = 26; // in screen coordinates, empirically determined to match design spec

type EnergyAbsorbingEmittingLayerNodeOptions = {
  lineOptions?: {
    stroke?: Color,
    lineWidth?: number
  }
} & NodeOptions;

class AtmosphereLayerNode extends Node {

  constructor( atmosphereLayer: AtmosphereLayer,
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
        fill: Color.LIGHT_GRAY,
        centerY: modelViewTransform.modelToViewY( atmosphereLayer.altitude )
      }
    );

    const numberDisplay = new NumberDisplay( atmosphereLayer.temperatureProperty, new Range( 0, 999 ), {
      centerY: mainBody.centerY,
      right: 100,
      backgroundStroke: Color.BLACK,
      cornerRadius: 3,
      numberFormatter: ( temperature: number ) => {
        return StringUtils.fillIn( greenhouseEffectStrings.temperature.units.valueUnitsPattern, {
          value: Utils.toFixed( temperature, 1 ),
          units: greenhouseEffectStrings.temperature.units.kelvin
        } );
      },
      textOptions: {
        font: new PhetFont( 14 )
      }
    } );

    // supertype constructor
    super( merge( { children: [ mainBody, numberDisplay ] }, options ) );

    // This node should only be visible when the atmosphere layer is active.
    atmosphereLayer.isActiveProperty.linkAttribute( this, 'visible' );
  }
}

greenhouseEffect.register( 'AtmosphereLayerNode', AtmosphereLayerNode );

export default AtmosphereLayerNode;
