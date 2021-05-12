// Copyright 2021, University of Colorado Boulder

/**
 * The thermometer showing the surface temperature in Greenhouse Effect. Includes a ComboBox that displays the
 * numeric value for temperature and allows you to change the units.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';

class SurfaceThermometer extends Node {

  /**
   * @param {NumberProperty} temperatureProperty
   * @param {EnumerationProperty} unitsProperty
   * @param {BooleanProperty} visibleProperty
   * @param {Node} listParentNode
   * @param {Object} [options]
   */
  constructor( temperatureProperty, unitsProperty, visibleProperty, listParentNode, options ) {
    super();

    options = merge( {

      // {Object|null} - options passed along to the ThermometerNode
      thermometerNodeOptions: {
        bulbDiameter: 40,
        tubeHeight: 150,
        tubeWidth: 20,
        backgroundFill: 'white'
      }
    }, options );

    const thermometerNode = new ThermometerNode( 0, 100, temperatureProperty, options.thermometerNodeOptions );
    this.addChild( thermometerNode );

    const comboBoxItems = [
      this.createComboBoxItem(
        greenhouseEffectStrings.temperature.units.kelvin, temperatureProperty, temperatureProperty.range, GreenhouseEffectModel.TemperatureUnits.KELVIN, {
          valuePattern: greenhouseEffectStrings.temperature.units.valueKelvinPattern
        } ),
      this.createComboBoxItem( greenhouseEffectStrings.temperature.units.celcius, temperatureProperty, temperatureProperty.range, GreenhouseEffectModel.TemperatureUnits.CELSIUS ),
      this.createComboBoxItem( greenhouseEffectStrings.temperature.units.fahrenheit, temperatureProperty, temperatureProperty.range, GreenhouseEffectModel.TemperatureUnits.FAHRENHEIT )
    ];

    this.comboBox = new ComboBox( comboBoxItems, unitsProperty, listParentNode, {
      yMargin: 4,
      xMargin: 4
    } );
    this.addChild( this.comboBox );

    // layout
    this.comboBox.centerTop = thermometerNode.centerBottom.plusXY( 0, 15 );

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
   * @param {Range} propertyRange
   * @param {Enumeration} propertyValue
   * @param {Object} [options]
   * @returns {ComboBoxItem}
   */
  createComboBoxItem( unitsString, property, propertyRange, propertyValue, options ) {
    options = merge( {

      // options for the NumberDisplay
      numberDisplayOptions: {
        backgroundStroke: null,
        textOptions: {
          font: GreenhouseEffectConstants.CONTENT_FONT
        }
      },

      // the pattern for the value in the NumberDisplay - not passed directly to the NumberDisplay
      valuePattern: greenhouseEffectStrings.temperature.units.valueDegreesUnitsPattern
    }, options );
    assert && assert( options.numberDisplayOptions.valuePattern === undefined );

    const valuePattern = StringUtils.fillIn( options.valuePattern, {
      degrees: MathSymbols.DEGREES,
      units: unitsString
    } );

    options.numberDisplayOptions.valuePattern = valuePattern;

    return new ComboBoxItem( new NumberDisplay( property, propertyRange, options.numberDisplayOptions ), propertyValue );
  }
}

greenhouseEffect.register( 'SurfaceThermometer', SurfaceThermometer );
export default SurfaceThermometer;
