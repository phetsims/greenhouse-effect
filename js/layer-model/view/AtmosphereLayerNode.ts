// Copyright 2021-2024, University of Colorado Boulder

/**
 * Node that represents a layer in the atmosphere that absorbs and emits energy.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, HBox, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import AtmosphereLayer from '../../common/model/AtmosphereLayer.js';
import EnergyAbsorbingEmittingLayer from '../../common/model/EnergyAbsorbingEmittingLayer.js';
import TemperatureUnits from '../../common/model/TemperatureUnits.js';
import TemperatureReadout from '../../common/view/TemperatureReadout.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ShowTemperatureCheckbox, { ShowTemperatureCheckboxOptions } from './ShowTemperatureCheckbox.js';

// constants
const DEFAULT_LAYER_THICKNESS = 26; // in screen coordinates, empirically determined to match design spec
const LAYER_RECTANGLE_STROKE_BASE_COLOR = Color.DARK_GRAY;
const LAYER_RECTANGLE_FILL_BASE_COLOR = Color.LIGHT_GRAY;
const MINIMUM_OPACITY = 0.4;
const MAXIMUM_OPACITY = 0.85;
const TEMPERATURE_DISPLAY_DEFAULT_INDENT = 20; // Y offset for the temperature control, in screen coordinates

type SelfOptions = {
  numberDisplayEnabledProperty?: BooleanProperty | null;
  layerThickness?: number;

  // Nested options for the ShowTemperatureCheckbox.
  showTemperatureCheckboxOptions?: StrictOmit<ShowTemperatureCheckboxOptions, 'tandem'>;
};
export type AtmosphereLayerNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

class AtmosphereLayerNode extends Node {

  // the checkbox, icon, and readout for displaying the temperature of the layer
  public readonly temperatureDisplay: Node;

  // the readout portion of the temperature display
  private readonly temperatureReadout: TemperatureReadout;

  public constructor( atmosphereLayer: AtmosphereLayer,
                      temperatureUnitsProperty: EnumerationProperty<TemperatureUnits>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: AtmosphereLayerNodeOptions ) {

    const options = optionize<AtmosphereLayerNodeOptions, SelfOptions, NodeOptions>()( {
      layerThickness: DEFAULT_LAYER_THICKNESS,
      numberDisplayEnabledProperty: null,
      isDisposable: false,
      showTemperatureCheckboxOptions: {}
    }, providedOptions );

    // If a thickness value is provided, use the model-view transform to convert it to view coordinates, otherwise use
    // the default.
    let layerThickness = DEFAULT_LAYER_THICKNESS;
    if ( options && options.layerThickness ) {
      layerThickness = -modelViewTransform.modelToViewDeltaY( options.layerThickness );
    }

    const mainBody = new Rectangle(
      0,
      -layerThickness / 2,
      modelViewTransform.modelToViewDeltaX( EnergyAbsorbingEmittingLayer.WIDTH ),
      layerThickness,
      {
        stroke: LAYER_RECTANGLE_STROKE_BASE_COLOR,
        fill: LAYER_RECTANGLE_FILL_BASE_COLOR,
        centerY: modelViewTransform.modelToViewY( atmosphereLayer.altitude )
      }
    );

    // Adjust the opacity of the stroke and fill based on the absorbance.
    atmosphereLayer.energyAbsorptionProportionProperty.link( energyAbsorptionProportion => {

      // Map the proportion to an opacity.  We don't want to go 100% opaque or the photons would be obscured when they
      // pass through the layer, so this mapping was empirically determined to look decent.
      const opacity = MINIMUM_OPACITY + ( energyAbsorptionProportion * ( MAXIMUM_OPACITY - MINIMUM_OPACITY ) );
      mainBody.fill = LAYER_RECTANGLE_FILL_BASE_COLOR.withAlpha( opacity );
      mainBody.stroke = LAYER_RECTANGLE_STROKE_BASE_COLOR.withAlpha( opacity );
    } );

    const showTemperatureCheckbox = new ShowTemperatureCheckbox(
      atmosphereLayer.showTemperatureProperty,
      combineOptions<ShowTemperatureCheckboxOptions>( {
        tandem: options.tandem.createTandem( 'showTemperatureCheckbox' )
      }, options.showTemperatureCheckboxOptions )
    );

    // Create the temperature readout.
    const temperatureReadout = new TemperatureReadout( atmosphereLayer.temperatureProperty, temperatureUnitsProperty, {
      visibleProperty: atmosphereLayer.showTemperatureProperty,
      numberDisplayEnabledProperty: options.numberDisplayEnabledProperty || new BooleanProperty( true )
    } );

    const temperatureDisplay = new HBox( {
      children: [ showTemperatureCheckbox, temperatureReadout ],
      spacing: 15,
      centerY: mainBody.centerY,
      left: TEMPERATURE_DISPLAY_DEFAULT_INDENT
    } );

    // supertype constructor
    super( { children: [ mainBody, temperatureDisplay ] } );

    // This node should only be visible when the atmosphere layer is active.
    atmosphereLayer.isActiveProperty.linkAttribute( this, 'visible' );

    // Make the temperature display available externally so that external nodes can be aligned with it.
    this.temperatureDisplay = temperatureDisplay;

    // Make the temperature readout available to a method that needs it.
    this.temperatureReadout = temperatureReadout;
  }

  /**
   * Get the center X position in global coordinate space of the temperature readout.  This is an oddly specific piece
   * of information, but is needed for alignment of some visual elements.
   */
  public getTemperatureReadoutCenter(): Vector2 {
    return this.temperatureReadout.parentToGlobalPoint( this.temperatureReadout.getCenter() );
  }

  public static readonly TEMPERATURE_DISPLAY_DEFAULT_INDENT = TEMPERATURE_DISPLAY_DEFAULT_INDENT;
}

greenhouseEffect.register( 'AtmosphereLayerNode', AtmosphereLayerNode );

export default AtmosphereLayerNode;