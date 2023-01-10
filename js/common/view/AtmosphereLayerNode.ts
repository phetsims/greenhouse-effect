// Copyright 2021-2023, University of Colorado Boulder

/**
 * Node that represents a layer in the atmosphere that absorbs and emits energy.
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import ShowTemperatureCheckbox from '../../layer-model/view/ShowTemperatureCheckbox.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import AtmosphereLayer from '../model/AtmosphereLayer.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import TemperatureUnits from '../model/TemperatureUnits.js';

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

  // The left side position of the temperature display in its own coordinate frame.  This was added to solve a very
  // specific dynamic layout issue, see https://github.com/phetsims/greenhouse-effect/issues/230.
  temperatureDisplayLeftProperty?: null | TReadOnlyProperty<number>;
};
export type AtmosphereLayerNodeOptions = SelfOptions & NodeOptions;

class AtmosphereLayerNode extends Node {

  private readonly showTemperatureProperty: BooleanProperty;

  // the checkbox, icon, and readout for displaying the temperature of the layer
  public readonly temperatureDisplay: Node;

  // the readout portion of the temperature display
  private readonly temperatureReadout: NumberDisplay;

  public constructor( atmosphereLayer: AtmosphereLayer,
                      temperatureUnitsProperty: TReadOnlyProperty<TemperatureUnits>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: AtmosphereLayerNodeOptions ) {

    const options = optionize<AtmosphereLayerNodeOptions, SelfOptions, NodeOptions>()( {
      layerThickness: DEFAULT_LAYER_THICKNESS,
      numberDisplayEnabledProperty: null,
      temperatureDisplayLeftProperty: null
    }, providedOptions );

    // If there is an option provided to enable the display, use it, otherwise create an always-true Property.
    const numberDisplayEnabledProperty = options.numberDisplayEnabledProperty || new BooleanProperty( true );

    // If there is a property for the temperature display position, use it, otherwise create one with a default value.
    const temperatureDisplayLeftProperty = options.temperatureDisplayLeftProperty ||
                                           new NumberProperty( TEMPERATURE_DISPLAY_DEFAULT_INDENT );

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

    // Create the property and associated checkbox that will control whether the temperature readout is visible.
    const showTemperatureProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'showTemperatureProperty' )
    } );
    const showTemperatureCheckbox = new ShowTemperatureCheckbox( showTemperatureProperty, {
      tandem: options.tandem.createTandem( 'showTemperatureCheckbox' )
    } );

    // Create a derived property for the value that will be displayed as the temperature.
    const temperatureValueProperty = new DerivedProperty(
      [ atmosphereLayer.temperatureProperty, temperatureUnitsProperty, numberDisplayEnabledProperty ],
      ( temperature, temperatureUnits, numberDisplayEnabled ) => {
        let temperatureValue = null;
        if ( numberDisplayEnabled ) {
          temperatureValue = temperatureUnits === TemperatureUnits.KELVIN ? temperature :
                             temperatureUnits === TemperatureUnits.CELSIUS ? GreenhouseEffectUtils.kelvinToCelsius( temperature ) :
                             GreenhouseEffectUtils.kelvinToFahrenheit( temperature );
        }
        return temperatureValue;
      }
    );

    // Create the temperature readout.
    const temperatureReadout = new NumberDisplay( temperatureValueProperty, new Range( 0, 999 ), {
      visibleProperty: showTemperatureProperty,
      backgroundStroke: Color.BLACK,
      minBackgroundWidth: 70, // empirically determined to fit largest number
      valuePattern: new PatternStringProperty(
        GreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty,
        {
          units: new DerivedProperty(
            [
              temperatureUnitsProperty,
              numberDisplayEnabledProperty,
              GreenhouseEffectStrings.temperature.units.kelvinStringProperty,
              GreenhouseEffectStrings.temperature.units.celsiusStringProperty,
              GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty
            ],
            ( temperatureUnits, numberDisplayEnabled, kelvinString, celsiusString, fahrenheitString ) => {
              return !numberDisplayEnabled ? '' :
                     temperatureUnits === TemperatureUnits.KELVIN ? kelvinString :
                     temperatureUnits === TemperatureUnits.CELSIUS ? celsiusString :
                     fahrenheitString;
            }
          )
        }
      ),
      decimalPlaces: 1,
      cornerRadius: 3,
      noValueAlign: 'center',
      textOptions: {
        font: new PhetFont( 14 ),
        maxWidth: 120
      }
    } );

    const temperatureDisplay = new HBox( {
      children: [ showTemperatureCheckbox, temperatureReadout ],
      spacing: 15,
      centerY: mainBody.centerY,
      left: temperatureDisplayLeftProperty.value
    } );

    // Adjust the temperature display horizontal position if it changes.  No unlink needed, since these nodes are never
    // disposed.
    temperatureDisplayLeftProperty.lazyLink( left => {
      temperatureDisplay.left = left;
    } );

    // supertype constructor
    super( { children: [ mainBody, temperatureDisplay ] } );

    // This node should only be visible when the atmosphere layer is active.
    atmosphereLayer.isActiveProperty.linkAttribute( this, 'visible' );

    // Make the temperature property available for reset.
    this.showTemperatureProperty = showTemperatureProperty;

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

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.showTemperatureProperty.reset();
  }

  public static readonly TEMPERATURE_DISPLAY_DEFAULT_INDENT = TEMPERATURE_DISPLAY_DEFAULT_INDENT;
}

greenhouseEffect.register( 'AtmosphereLayerNode', AtmosphereLayerNode );

export default AtmosphereLayerNode;
