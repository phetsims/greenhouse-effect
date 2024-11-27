// Copyright 2021-2024, University of Colorado Boulder

/**
 * ThermometerAndReadout is a Scenery Node that depicts a thermometer and a numerical readout indicating the
 * temperature.  Based on configuration options, the readout can either be a combo box from which the user can select
 * different units (e.g. Fahrenheit or Celsius), or a simple readout that simply displays the temperature.  Options can
 * be used to adjust the size and appearance.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ThermometerNode, { ThermometerNodeOptions } from '../../../../scenery-phet/js/ThermometerNode.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
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
import TemperatureReadout from './TemperatureReadout.js';

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
          'kelvinItem'
        ),
        ThermometerAndReadout.createComboBoxItem(
          celsiusUnitsStringProperty,
          temperatureInCelsiusProperty,
          celsiusRange,
          TemperatureUnits.CELSIUS,
          'celsiusItem'
        ),
        ThermometerAndReadout.createComboBoxItem(
          fahrenheitUnitsStringProperty,
          temperatureInFahrenheitProperty,
          fahrenheitRange,
          TemperatureUnits.FAHRENHEIT,
          'fahrenheitItem'
        )
      ];

      // A Node that wraps the comboBox with additional markup to match the requested heading levels. There is an h3
      // for the label so that the button itself is an h4 under it.
      const comboBoxWrapper = new Node( {
        tagName: 'div',
        labelTagName: 'h3',
        accessibleName: GreenhouseEffectStrings.a11y.temperatureOptionsLabelStringProperty
      } );

      const comboBox = new ComboBox( unitsProperty, comboBoxItems, options.listParentNode || this, {
        align: 'right',
        listPosition: 'above',
        yMargin: 4,
        xMargin: 4,
        buttonTouchAreaXDilation: 5,
        buttonTouchAreaYDilation: 5,

        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE ),

        // pdom
        accessibleName: GreenhouseEffectStrings.a11y.temperatureUnitsLabelStringProperty,
        helpText: GreenhouseEffectStrings.a11y.temperatureUnitsHelpTextStringProperty,
        buttonLabelTagName: 'h4',

        // phet-io
        tandem: options.tandem.createTandem( 'comboBox' )
      } );

      comboBoxWrapper.addChild( comboBox );
      this.addChild( comboBoxWrapper );

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

      // Create a non-interactive temperature readout.
      const temperatureReadout = new TemperatureReadout( temperatureInKelvinProperty, unitsProperty, {
        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE )
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
      accessibleName: TemperatureDescriber.getTemperatureUnitsString( propertyValue )
    };
  }

  // static values
  public static ReadoutType = ReadoutType;
}

greenhouseEffect.register( 'ThermometerAndReadout', ThermometerAndReadout );

export default ThermometerAndReadout;