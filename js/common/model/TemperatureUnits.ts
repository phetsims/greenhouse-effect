// Copyright 2022-2023, University of Colorado Boulder

/**
 * units of temperature used by Greenhouse Effect simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class TemperatureUnits extends EnumerationValue {
  public static readonly KELVIN = new TemperatureUnits();
  public static readonly CELSIUS = new TemperatureUnits();
  public static readonly FAHRENHEIT = new TemperatureUnits();

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( TemperatureUnits, {
    phetioDocumentation: 'The units in which the temperature values are presented.'
  } );
}

greenhouseEffect.register( 'TemperatureUnits', TemperatureUnits );
export default TemperatureUnits;