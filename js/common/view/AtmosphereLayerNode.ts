// Copyright 2021-2022, University of Colorado Boulder

/**
 * Node that represents a layer in the atmosphere that absorbs and emits energy.
 *
 * @author John Blanco
 */

import Range from '../../../../dot/js/Range.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { Color, HBox, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ShowTemperatureCheckbox from '../../layer-model/view/ShowTemperatureCheckbox.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import AtmosphereLayer from '../model/AtmosphereLayer.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const DEFAULT_LAYER_THICKNESS = 26; // in screen coordinates, empirically determined to match design spec
const LAYER_RECTANGLE_STROKE_BASE_COLOR = Color.DARK_GRAY;
const LAYER_RECTANGLE_FILL_BASE_COLOR = Color.LIGHT_GRAY;
const MINIMUM_OPACITY = 0.4;
const MAXIMUM_OPACITY = 0.85;

type SelfOptions = {
  numberDisplayEnabledProperty?: BooleanProperty | null;
  layerThickness?: number;
};
export type AtmosphereLayerNodeOptions = SelfOptions & NodeOptions;

class AtmosphereLayerNode extends Node {

  private readonly showTemperatureProperty: BooleanProperty;

  public constructor( atmosphereLayer: AtmosphereLayer,
                      temperatureUnitsProperty: TReadOnlyProperty<TemperatureUnits>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: AtmosphereLayerNodeOptions ) {

    const options = optionize<AtmosphereLayerNodeOptions, SelfOptions, NodeOptions>()( {
      layerThickness: DEFAULT_LAYER_THICKNESS,
      numberDisplayEnabledProperty: null
    }, providedOptions );

    // If there is an option provided to enable the display, use it, otherwise create an always-true Property.
    const numberDisplayEnabledProperty = ( options.numberDisplayEnabledProperty ) ||
                                         new BooleanProperty( true );

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
    const showTemperatureProperty = new BooleanProperty( true );
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
      centerY: mainBody.centerY,
      right: 100,
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
        font: new PhetFont( 14 )
      }
    } );

    const temperatureDisplay = new HBox( {
      children: [ showTemperatureCheckbox, temperatureReadout ],
      spacing: 15,
      centerY: mainBody.centerY,
      left: 20
    } );

    // supertype constructor
    super( { children: [ mainBody, temperatureDisplay ] } );

    // This node should only be visible when the atmosphere layer is active.
    atmosphereLayer.isActiveProperty.linkAttribute( this, 'visible' );

    // Make the temperature property available for reset.
    this.showTemperatureProperty = showTemperatureProperty;
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.showTemperatureProperty.reset();
  }
}

greenhouseEffect.register( 'AtmosphereLayerNode', AtmosphereLayerNode );

export default AtmosphereLayerNode;
