// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents a layer in the atmosphere that absorbs and emits energy.
 *
 * @author John Blanco
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { Color, Node, Rectangle } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import AtmosphereLayer from '../model/AtmosphereLayer.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

// constants
const LAYER_THICKNESS = 26; // in screen coordinates, empirically determined to match design spec
const LAYER_RECTANGLE_STROKE_BASE_COLOR = Color.DARK_GRAY;
const LAYER_RECTANGLE_FILL_BASE_COLOR = Color.LIGHT_GRAY;
const MINIMUM_OPACITY = 0.4;
const MAXIMUM_OPACITY = 0.85;

type AtmosphereLayerNodeOptions = {
  numberDisplayEnabledProperty?: BooleanProperty
};

class AtmosphereLayerNode extends Node {

  constructor( atmosphereLayer: AtmosphereLayer,
               modelViewTransform: ModelViewTransform2,
               options?: AtmosphereLayerNodeOptions ) {

    // If there is an option provided to enable the display, use it, otherwise create an always-true Property.
    const numberDisplayEnabledProperty = ( options && options.numberDisplayEnabledProperty ) ||
                                         new BooleanProperty( true );

    const mainBody = new Rectangle(
      0,
      -LAYER_THICKNESS / 2,
      modelViewTransform.modelToViewDeltaX( EnergyAbsorbingEmittingLayer.WIDTH ),
      LAYER_THICKNESS,
      {
        stroke: LAYER_RECTANGLE_STROKE_BASE_COLOR,
        fill: LAYER_RECTANGLE_FILL_BASE_COLOR,
        centerY: modelViewTransform.modelToViewY( atmosphereLayer.altitude )
      }
    );

    // Adjust the opacity of the stroke and fill of the layer based on the absorbance.
    atmosphereLayer.energyAbsorptionProportionProperty.link( energyAbsorptionProportion => {

      // Map the proportion to an opacity.  We don't want to go 100% opaque or the photons would be obscured when they
      // pass through the layer, so this mapping was empirically determined to look decent.
      const opacity = MINIMUM_OPACITY + ( energyAbsorptionProportion * ( MAXIMUM_OPACITY - MINIMUM_OPACITY ) );
      // @ts-ignore
      mainBody.fill = LAYER_RECTANGLE_FILL_BASE_COLOR.withAlpha( opacity );
      // @ts-ignore
      mainBody.stroke = LAYER_RECTANGLE_STROKE_BASE_COLOR.withAlpha( opacity );
    } );

    // Create a derived property for the value that will be displayed as the temperature.
    const temperatureValueProperty = new DerivedProperty(
      [ atmosphereLayer.temperatureProperty, numberDisplayEnabledProperty ],
      ( temperature, numberDisplayEnabled ) => numberDisplayEnabled ? temperature : null
    );

    const numberDisplay = new NumberDisplay( temperatureValueProperty, new Range( 0, 999 ), {
      centerY: mainBody.centerY,
      right: 100,
      backgroundStroke: Color.BLACK,
      cornerRadius: 3,
      noValueAlign: 'center',
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
    super( { children: [ mainBody, numberDisplay ] } );

    // This node should only be visible when the atmosphere layer is active.
    atmosphereLayer.isActiveProperty.linkAttribute( this, 'visible' );
  }
}

greenhouseEffect.register( 'AtmosphereLayerNode', AtmosphereLayerNode );

export default AtmosphereLayerNode;
