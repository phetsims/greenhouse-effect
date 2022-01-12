// Copyright 2021-2022, University of Colorado Boulder

/**
 * ThermometerAndReadout is a Scenery Node that depicts a thermometer and a numerical readout that indicates the
 * temperature.  Based on configuration options, the readout can either be a combo box from which the user can select
 * different units (e.g. Fahrenheit or Celsius), or a simple readout that just shows the temperature.  Options can be
 * used to adjust the size and appearance.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import LayersModel from '../model/LayersModel.js';
import Property from '../../../../axon/js/Property.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GroundLayer from '../model/GroundLayer.js';

// constants
const THERMOMETER_TO_READOUT_DISTANCE = 15; // in screen coordinates
const DECIMAL_PLACES_IN_READOUT = 1;
const kelvinUnitsString = greenhouseEffectStrings.temperature.units.kelvin;
const celsiusUnitsString = greenhouseEffectStrings.temperature.units.celsius;
const fahrenheitUnitsString = greenhouseEffectStrings.temperature.units.fahrenheit;
const surfaceTemperatureString = greenhouseEffectStrings.a11y.surfaceTemperature;

const ReadoutType = EnumerationDeprecated.byKeys( [ 'SELECTABLE', 'FIXED' ] );

type ThermometerAndReadoutOptions = {
  minTemperature?: number,
  maxTemperature?: number,
  readoutType?: any,
  listParentNode?: Node | null,
  thermometerNodeOptions?: ThermometerNodeOptions
} & NodeOptions;

class ThermometerAndReadout extends Node {

  /**
   * @param {LayersModel} model
   * @param {ThermometerAndReadoutOptions} [providedOptions]
   */
  constructor( model: LayersModel, providedOptions?: ThermometerAndReadoutOptions ) {

    const options = merge( {

      minTemperature: GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE,
      maxTemperature: 300,

      // readout type that will be shown below the thermometer, either SELECTABLE (i.e. a combo box) or fixed
      // @ts-ignore
      readoutType: ReadoutType.SELECTABLE,

      // parent node used for the combo box list, only used for SELECTABLE readout
      listParent: null,

      // options passed along to the ThermometerNode
      thermometerNodeOptions: {
        bulbDiameter: 40,
        tubeHeight: 150,
        tubeWidth: 20,
        backgroundFill: 'white'
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions ) as Required<ThermometerAndReadoutOptions>;

    // options passed to the supertype later in mutate
    super();

    // visibility
    model.surfaceThermometerVisibleProperty.linkAttribute( this, 'visible' );

    // thermometer - range chosen empirically to make it look reasonable in the sim
    const thermometerNode = new ThermometerNode(
      options.minTemperature,
      options.maxTemperature,
      model.surfaceTemperatureKelvinProperty,
      options.thermometerNodeOptions
    );
    this.addChild( thermometerNode );

    // ranges for each temperature Property, so the NumberDisplay can determine space needed for each readout
    const kelvinRange = model.surfaceTemperatureKelvinProperty.range;
    const celsiusRange = new Range(
      GreenhouseEffectUtils.kelvinToCelsius( kelvinRange!.min ),
      GreenhouseEffectUtils.kelvinToCelsius( kelvinRange!.max )
    );
    const fahrenheitRange = new Range(
      GreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange!.min ),
      GreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange!.max )
    );

    // @ts-ignore
    if ( options.readoutType === ReadoutType.SELECTABLE ) {

      const comboBoxItems = [
        ThermometerAndReadout.createComboBoxItem(
          kelvinUnitsString,
          model.surfaceTemperatureKelvinProperty,
          model.surfaceTemperatureKelvinProperty.range!,
          // @ts-ignore
          LayersModel.TemperatureUnits.KELVIN,
          'kelvinItem'
        ),
        ThermometerAndReadout.createComboBoxItem(
          celsiusUnitsString,
          model.surfaceTemperatureCelsiusProperty,
          celsiusRange,
          // @ts-ignore
          LayersModel.TemperatureUnits.CELSIUS,
          'celsiusItem'
        ),
        ThermometerAndReadout.createComboBoxItem(
          fahrenheitUnitsString,
          model.surfaceTemperatureFahrenheitProperty,
          fahrenheitRange,
          // @ts-ignore
          LayersModel.TemperatureUnits.FAHRENHEIT,
          'fahrenheitItem'
        )
      ];

      const comboBox = new ComboBox( comboBoxItems, model.temperatureUnitsProperty, options.listParentNode || this, {
        align: 'right',
        listPosition: 'above',
        yMargin: 4,
        xMargin: 4,
        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE ),

        // pdom
        accessibleName: surfaceTemperatureString,

        // phet-io
        tandem: options.tandem.createTandem( 'comboBox' )
      } );
      this.addChild( comboBox );
    }
    else {

      const temperatureInKelvinReadout = ThermometerAndReadout.createTemperatureReadout(
        kelvinUnitsString,
        model.surfaceTemperatureKelvinProperty,
        model.surfaceTemperatureKelvinProperty.range!
      );
      temperatureInKelvinReadout.centerTop = thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE );

      this.addChild( temperatureInKelvinReadout );
    }

    // mutate with layout options after the Node has been assembled
    this.mutate( options );
  }

  /**
   * Create a ComboBox item for the units combo box. The Node for the ComboBox item is a NumberDisplay showing the
   * current value of temperature in those units.
   * @private
   *
   * @param {string} unitsString
   * @param {NumberProperty} property
   * @param {../../../../dot/js/Range} propertyRange
   * @param {EnumerationDeprecated} propertyValue
   * @param {string} tandemName
   * @returns {ComboBoxItem}
   */
  private static createComboBoxItem( unitsString: string,
                                     property: IReadOnlyProperty<number>,
                                     propertyRange: Range,
                                     propertyValue: EnumerationDeprecated,
                                     tandemName: string ) {

    const numberDisplayOptions = {
      backgroundStroke: null,
      decimalPlaces: DECIMAL_PLACES_IN_READOUT,
      textOptions: {
        font: GreenhouseEffectConstants.CONTENT_FONT,
        maxWidth: 120
      },
      valuePattern: StringUtils.fillIn( greenhouseEffectStrings.temperature.units.valueUnitsPattern, {
        units: unitsString
      } )
    };

    return new ComboBoxItem(
      new NumberDisplay( property, propertyRange, numberDisplayOptions ),
      propertyValue,
      { tandemName: tandemName }
    );
  }

  /**
   * Create a readout for a Property that represents a temperature.
   * @param unitsString
   * @param property
   * @param propertyRange
   * @private
   */
  private static createTemperatureReadout( unitsString: string,
                                           property: Property<number>,
                                           propertyRange: Range ) {

    const numberDisplayOptions = {
      decimalPlaces: DECIMAL_PLACES_IN_READOUT,
      textOptions: {
        font: GreenhouseEffectConstants.CONTENT_FONT,
        maxWidth: 120
      },
      valuePattern: StringUtils.fillIn( greenhouseEffectStrings.temperature.units.valueUnitsPattern, {
        units: unitsString
      } ),
      xMargin: 12,
      yMargin: 5,
      cornerRadius: 4
    };

    return new NumberDisplay( property, propertyRange, numberDisplayOptions );
  }

  // static values
  static ReadoutType = ReadoutType;
}

greenhouseEffect.register( 'ThermometerAndReadout', ThermometerAndReadout );
export default ThermometerAndReadout;
