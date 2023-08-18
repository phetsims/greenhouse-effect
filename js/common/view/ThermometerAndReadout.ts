// Copyright 2021-2023, University of Colorado Boulder

/**
 * ThermometerAndReadout is a Scenery Node that depicts a thermometer and a numerical readout that indicates the
 * temperature.  Based on configuration options, the readout can either be a combo box from which the user can select
 * different units (e.g. Fahrenheit or Celsius), or a simple readout that just shows the temperature.  Options can be
 * used to adjust the size and appearance.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ThermometerNode, { ThermometerNodeOptions } from '../../../../scenery-phet/js/ThermometerNode.js';
import { Color, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import GroundLayer from '../model/GroundLayer.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import GreenhouseEffectObservationWindow from './GreenhouseEffectObservationWindow.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

// constants
const THERMOMETER_TO_READOUT_DISTANCE = 15; // in screen coordinates
const DECIMAL_PLACES_IN_READOUT = GreenhouseEffectQueryParameters.showAdditionalTemperatureDigits ? 3 : 1;
const kelvinUnitsStringProperty = GreenhouseEffectStrings.temperature.units.kelvinStringProperty;
const celsiusUnitsStringProperty = GreenhouseEffectStrings.temperature.units.celsiusStringProperty;
const fahrenheitUnitsStringProperty = GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty;

class ReadoutType extends EnumerationValue {
  public static readonly SELECTABLE = new ReadoutType();
  public static readonly FIXED = new ReadoutType();

  public static readonly enumeration = new Enumeration( ReadoutType );
}

type SelfOptions = {
  minTemperature?: number;
  maxTemperature?: number;
  readoutType?: ReadoutType;
  listParentNode?: Node | null;
  thermometerNodeOptions?: ThermometerNodeOptions;
};

type ThermometerAndReadoutOptions =
  SelfOptions &
  NodeTranslationOptions &
  PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

class ThermometerAndReadout extends Node {

  public constructor( temperatureInKelvinProperty: TRangedProperty,
                      temperatureInCelsiusProperty: TReadOnlyProperty<number>,
                      temperatureInFahrenheitProperty: TReadOnlyProperty<number>,
                      unitsProperty: EnumerationProperty<TemperatureUnits>,
                      providedOptions?: ThermometerAndReadoutOptions ) {

    const options = optionize<ThermometerAndReadoutOptions, SelfOptions, NodeOptions>()( {

      minTemperature: GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE,
      maxTemperature: GreenhouseEffectObservationWindow.EXPECTED_MAX_TEMPERATURE + 3,

      // readout type that will be shown below the thermometer, either SELECTABLE (i.e. a combo box) or fixed
      readoutType: ReadoutType.SELECTABLE,

      // parent node used for the combo box list, only used for SELECTABLE readout
      listParentNode: null,

      // options passed along to the ThermometerNode
      thermometerNodeOptions: {
        bulbDiameter: 40,
        tubeHeight: 150,
        tubeWidth: 20,
        backgroundFill: 'white'
      }
    }, providedOptions );

    // options passed to the supertype later in mutate
    super();

    // thermometer - range chosen empirically to make it look reasonable in the sim
    const thermometerNode = new ThermometerNode(
      temperatureInKelvinProperty,
      options.minTemperature,
      options.maxTemperature,
      options.thermometerNodeOptions
    );
    this.addChild( thermometerNode );

    // ranges for each temperature Property, so the NumberDisplay can determine space needed for each readout
    const kelvinRange = temperatureInKelvinProperty.range;
    const celsiusRange = new Range(
      GreenhouseEffectUtils.kelvinToCelsius( kelvinRange.min ),
      GreenhouseEffectUtils.kelvinToCelsius( kelvinRange.max )
    );
    const fahrenheitRange = new Range(
      GreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange.min ),
      GreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange.max )
    );

    if ( options.readoutType === ReadoutType.SELECTABLE ) {

      const comboBoxItems = [
        ThermometerAndReadout.createComboBoxItem(
          kelvinUnitsStringProperty,
          temperatureInKelvinProperty,
          temperatureInKelvinProperty.range,
          TemperatureUnits.KELVIN,
          `kelvin${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
        ),
        ThermometerAndReadout.createComboBoxItem(
          celsiusUnitsStringProperty,
          temperatureInCelsiusProperty,
          celsiusRange,
          TemperatureUnits.CELSIUS,
          `celsius${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
        ),
        ThermometerAndReadout.createComboBoxItem(
          fahrenheitUnitsStringProperty,
          temperatureInFahrenheitProperty,
          fahrenheitRange,
          TemperatureUnits.FAHRENHEIT,
          `fahrenheit${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
        )
      ];

      const comboBox = new ComboBox( unitsProperty, comboBoxItems, options.listParentNode || this, {
        align: 'right',
        listPosition: 'above',
        yMargin: 4,
        xMargin: 4,
        buttonTouchAreaXDilation: 5,
        buttonTouchAreaYDilation: 5,

        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE ),

        // pdom
        helpText: GreenhouseEffectStrings.a11y.temperatureUnitsHelpTextStringProperty,
        accessibleName: GreenhouseEffectStrings.a11y.temperatureUnitsLabelStringProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'comboBox' )
      } );
      this.addChild( comboBox );

      // Make sure the NumberDisplays are all the same width.  This has to be done after the ComboBox is constructed
      // because the ComboBox creates these nodes using a passed-in creator function.  See
      // https://github.com/phetsims/greenhouse-effect/issues/256.
      const maxItemWidth = Math.max( ..._.map( comboBox.nodes, 'width' ) );
      comboBox.nodes.forEach( ( node: Node ) => {
        if ( node instanceof NumberDisplay ) {
          node.setBackgroundWidth( maxItemWidth );
        }
      } );
    }
    else {

      // Create a derived property for the value that will be displayed as the temperature.
      const temperatureValueProperty = new DerivedProperty(
        [ temperatureInKelvinProperty, unitsProperty ],
        ( temperature, temperatureUnits ) =>
          temperatureUnits === TemperatureUnits.KELVIN ? temperature :
          temperatureUnits === TemperatureUnits.CELSIUS ? GreenhouseEffectUtils.kelvinToCelsius( temperature ) :
          GreenhouseEffectUtils.kelvinToFahrenheit( temperature )
      );

      const unitsStringProperty = new DerivedStringProperty(
        [
          unitsProperty,
          GreenhouseEffectStrings.temperature.units.kelvinStringProperty,
          GreenhouseEffectStrings.temperature.units.celsiusStringProperty,
          GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty
        ],
        ( units, kelvinUnitsString, celsiusUnitsString, fahrenheitUnitsString ) => {
          return units === TemperatureUnits.KELVIN ? kelvinUnitsString :
                 units === TemperatureUnits.CELSIUS ? celsiusUnitsString :
                 fahrenheitUnitsString;
        }
      );

      // Create the temperature readout.
      const temperatureReadout = new NumberDisplay( temperatureValueProperty, new Range( 0, 999 ), {
        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE ),
        backgroundStroke: Color.BLACK,
        decimalPlaces: DECIMAL_PLACES_IN_READOUT,
        noValueAlign: 'center',
        cornerRadius: 3,
        xMargin: 12,
        yMargin: 3,
        textOptions: {
          font: GreenhouseEffectConstants.CONTENT_FONT,
          maxWidth: 100
        },
        valuePattern: new PatternStringProperty(
          GreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty,
          { units: unitsStringProperty }
        ),
        phetioVisiblePropertyInstrumented: false
      } );
      this.addChild( temperatureReadout );
    }

    // mutate with layout options after the Node has been assembled
    this.mutate( options );
  }

  /**
   * Create a ComboBox item for the units combo box. The Node for the ComboBox item is a NumberDisplay showing the
   * current value of temperature in those units.
   */
  private static createComboBoxItem( unitsStringProperty: TReadOnlyProperty<string>,
                                     property: TReadOnlyProperty<number>,
                                     propertyRange: Range,
                                     propertyValue: TemperatureUnits,
                                     tandemName: string ): ComboBoxItem<TemperatureUnits> {
    return {
      value: propertyValue,
      createNode: () => new NumberDisplay( property, propertyRange, {
        backgroundStroke: null,
        decimalPlaces: DECIMAL_PLACES_IN_READOUT,
        textOptions: {
          font: GreenhouseEffectConstants.CONTENT_FONT,
          maxWidth: 120
        },
        valuePattern: new PatternStringProperty(
          GreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty,
          { units: unitsStringProperty }
        ),
        phetioVisiblePropertyInstrumented: false
      } ),
      tandemName: tandemName,
      a11yName: TemperatureDescriber.getTemperatureUnitsString( propertyValue )
    };
  }

  // static values
  public static ReadoutType = ReadoutType;
}

greenhouseEffect.register( 'ThermometerAndReadout', ThermometerAndReadout );

export default ThermometerAndReadout;
