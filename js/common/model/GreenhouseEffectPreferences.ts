// Copyright 2023-2024, University of Colorado Boulder

/**
 * GreenhouseEffectPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import TemperatureUnits from './TemperatureUnits.js';

// map used to set the default temperature units based on the value of a query parameter
const mapLetterToTemperatureUnits = new Map<string, TemperatureUnits>( [
  [ 'K', TemperatureUnits.KELVIN ],
  [ 'C', TemperatureUnits.CELSIUS ],
  [ 'F', TemperatureUnits.FAHRENHEIT ]
] );

const defaultTemperatureUnitsString = GreenhouseEffectQueryParameters.defaultTemperatureUnits || 'K';
const defaultTemperatureUnits = mapLetterToTemperatureUnits.get( defaultTemperatureUnitsString ) || TemperatureUnits.KELVIN;

const GreenhouseEffectPreferences = {

  defaultTemperatureUnitsProperty: new EnumerationProperty( defaultTemperatureUnits, {
    tandem: Tandem.PREFERENCES.createTandem( 'defaultTemperatureUnitsProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'The units in which temperature values are displayed by default.'
  } ),

  cueingArrowsEnabledProperty: new BooleanProperty( GreenhouseEffectQueryParameters.cueingArrowsEnabled, {
    tandem: Tandem.PREFERENCES.createTandem( 'cueingArrowsEnabledProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'shows cueing arrows on draggable elements'
  } )
};

greenhouseEffect.register( 'GreenhouseEffectPreferences', GreenhouseEffectPreferences );
export default GreenhouseEffectPreferences;