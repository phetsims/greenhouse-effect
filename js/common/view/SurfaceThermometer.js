// Copyright 2021, University of Colorado Boulder

/**
 * The thermometer showing the surface temperature in Greenhouse Effect. Includes a ComboBox that displays the
 * numeric value for temperature and allows you to change the units.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import LayersModel from '../model/LayersModel.js';

// constants
const kelvinUnitsString = greenhouseEffectStrings.temperature.units.kelvin;
const celsiusUnitsString = greenhouseEffectStrings.temperature.units.celsius;
const fahrenheitUnitsString = greenhouseEffectStrings.temperature.units.fahrenheit;

class SurfaceThermometer extends Node {

  /**
   * @param {GreenhouseEffectModel} model
   * @param {Node} listParentNode
   * @param {Object} [options]
   */
  constructor( model, listParentNode, options ) {

    options = merge( {

      // {Object|null} - options passed along to the ThermometerNode
      thermometerNodeOptions: {
        bulbDiameter: 40,
        tubeHeight: 150,
        tubeWidth: 20,
        backgroundFill: 'white'
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // options passed to the supertype later in mutate
    super();

    // visibility
    model.surfaceThermometerVisibleProperty.linkAttribute( this, 'visible' );

    // thermometer - range chosen empirically to make it look reasonable in the sim
    const thermometerNode = new ThermometerNode( 240, 300, model.surfaceTemperatureKelvinProperty, options.thermometerNodeOptions );
    this.addChild( thermometerNode );

    // ranges for each temperature Property, so the NumberDisplay can determine space needed for each readout
    const kelvinRange = model.surfaceTemperatureKelvinProperty.range;
    const celsiusRange = new Range( GreenhouseEffectUtils.kelvinToCelsius( kelvinRange.min ), GreenhouseEffectUtils.kelvinToCelsius( kelvinRange.max ) );
    const fahrenheitRange = new Range( GreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange.min ), GreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange.max ) );

    const comboBoxItems = [
      this.createComboBoxItem(
        kelvinUnitsString,
        model.surfaceTemperatureKelvinProperty,
        model.surfaceTemperatureKelvinProperty.range,
        LayersModel.TemperatureUnits.KELVIN, {
          tandemName: 'kelvinItem'
        }
      ),
      this.createComboBoxItem(
        celsiusUnitsString,
        model.surfaceTemperatureCelsiusProperty,
        celsiusRange,
        LayersModel.TemperatureUnits.CELSIUS, {
          tandemName: 'celsiusItem'
        }
      ),
      this.createComboBoxItem(
        fahrenheitUnitsString,
        model.surfaceTemperatureFahrenheitProperty,
        fahrenheitRange,
        LayersModel.TemperatureUnits.FAHRENHEIT, {
          tandemName: 'fahrenheitItem'
        }
      )
    ];

    const comboBox = new ComboBox( comboBoxItems, model.temperatureUnitsProperty, listParentNode, {
      align: 'right',
      listPosition: 'above',
      yMargin: 4,
      xMargin: 4,

      // phet-io
      tandem: options.tandem.createTandem( 'comboBox' )
    } );
    this.addChild( comboBox );

    // layout
    comboBox.centerTop = thermometerNode.centerBottom.plusXY( 0, 15 );

    // mutate with layout options after the Node has been assembled
    this.mutate();
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
        decimalPlaces: 1,
        textOptions: {
          font: GreenhouseEffectConstants.CONTENT_FONT,
          maxWidth: 120
        }
      }
    }, options );
    assert && assert( options.numberDisplayOptions.valuePattern === undefined );

    options.numberDisplayOptions.valuePattern = StringUtils.fillIn( greenhouseEffectStrings.temperature.units.valueUnitsPattern, {
      units: unitsString
    } );

    return new ComboBoxItem( new NumberDisplay( property, propertyRange, options.numberDisplayOptions ), propertyValue, options );
  }
}

greenhouseEffect.register( 'SurfaceThermometer', SurfaceThermometer );
export default SurfaceThermometer;
