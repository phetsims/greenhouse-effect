// Copyright 2024-2025, University of Colorado Boulder

/**
 * TemperatureReadout is a node for displaying temperature values with units in a consistent way.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import Color from '../../../../scenery/js/util/Color.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import GreenhouseEffectUtils from '../GreenhouseEffectUtils.js';
import TemperatureUnits from '../model/TemperatureUnits.js';

// constants
const DECIMAL_PLACES_IN_READOUT = GreenhouseEffectQueryParameters.showAdditionalTemperatureDigits ? 3 : 1;
const ALWAYS_ENABLED_PROPERTY: TReadOnlyProperty<boolean> = new BooleanProperty( true );

type SelfOptions = {
  numberDisplayEnabledProperty?: TReadOnlyProperty<boolean>;
};
type TemperatureReadoutOptions = SelfOptions & StrictOmit<NumberDisplayOptions, 'valuePattern'>;

class TemperatureReadout extends NumberDisplay {

  public constructor( temperatureInKelvinProperty: TRangedProperty,
                      unitsProperty: EnumerationProperty<TemperatureUnits>,
                      providedOptions?: TemperatureReadoutOptions ) {

    const options = optionize<TemperatureReadoutOptions, SelfOptions, NumberDisplayOptions>()( {
      backgroundStroke: Color.BLACK,
      decimalPlaces: DECIMAL_PLACES_IN_READOUT,
      minBackgroundWidth: 70, // empirically determined to fit largest number
      noValueAlign: 'center',
      cornerRadius: 3,
      numberDisplayEnabledProperty: ALWAYS_ENABLED_PROPERTY,
      textOptions: {
        font: GreenhouseEffectConstants.CONTENT_FONT,
        maxWidth: 100
      },
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Create a derived property for the temperature units.
    const unitsStringProperty = new DerivedStringProperty(
      [
        options.numberDisplayEnabledProperty,
        unitsProperty,
        GreenhouseEffectStrings.temperature.units.kelvinStringProperty,
        GreenhouseEffectStrings.temperature.units.celsiusStringProperty,
        GreenhouseEffectStrings.temperature.units.fahrenheitStringProperty
      ],
      ( numberDisplayEnabled, units, kelvinUnitsString, celsiusUnitsString, fahrenheitUnitsString ) => {
        return !numberDisplayEnabled ? '' :
               units === TemperatureUnits.KELVIN ? kelvinUnitsString :
               units === TemperatureUnits.CELSIUS ? celsiusUnitsString :
               fahrenheitUnitsString;
      }
    );

    // Set the pattern that will be used to display the value.
    options.valuePattern = new PatternStringProperty(
      GreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty,
      { units: unitsStringProperty }
    );

    // Create a derived property for the numerical value that will be displayed as the temperature.
    const temperatureValueProperty = new DerivedProperty(
      [ options.numberDisplayEnabledProperty, temperatureInKelvinProperty, unitsProperty ],
      ( numberDisplayEnabled, temperature, temperatureUnits ) =>
        !numberDisplayEnabled ? null :
        temperatureUnits === TemperatureUnits.KELVIN ? temperature :
        temperatureUnits === TemperatureUnits.CELSIUS ? GreenhouseEffectUtils.kelvinToCelsius( temperature ) :
        GreenhouseEffectUtils.kelvinToFahrenheit( temperature )
    );

    super( temperatureValueProperty, new Range( -999, 999 ), options );
  }

}

greenhouseEffect.register( 'TemperatureReadout', TemperatureReadout );

export default TemperatureReadout;