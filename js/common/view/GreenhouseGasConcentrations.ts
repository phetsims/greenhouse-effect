// Copyright 2023-2025, University of Colorado Boulder

/**
 * GreenhouseGasConcentrations contains a set of properties that represent the concentrations of a set of greenhouse
 * gases based on a provided date.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import { ConcentrationDate } from '../model/ConcentrationModel.js';

// gas concentration maps - all values in Parts Per Million (PPM)
const CARBON_DIOXIDE_CONCENTRATION_DATA = new Map( [
  [ ConcentrationDate.YEAR_2020, 413 ],
  [ ConcentrationDate.YEAR_1950, 311 ],
  [ ConcentrationDate.YEAR_1750, 277 ],
  [ ConcentrationDate.ICE_AGE, 180 ]
] );
const METHANE_CONCENTRATION_DATA = new Map( [
  [ ConcentrationDate.YEAR_2020, 1.889 ],
  [ ConcentrationDate.YEAR_1950, 1.116 ],
  [ ConcentrationDate.YEAR_1750, 0.694 ],
  [ ConcentrationDate.ICE_AGE, 0.380 ]
] );
const NITROUS_OXIDE_CONCENTRATION_DATA = new Map( [
  [ ConcentrationDate.YEAR_2020, 0.333 ],
  [ ConcentrationDate.YEAR_1950, 0.288 ],
  [ ConcentrationDate.YEAR_1750, 0.271 ],
  [ ConcentrationDate.ICE_AGE, 0.215 ]
] );

class GreenhouseGasConcentrations {

  // concentration of carbon dioxide in Parts per Million (ppm)
  public readonly carbonDioxideConcentrationProperty: TReadOnlyProperty<number>;

  // concentration of carbon dioxide in Parts per Billion (ppb)
  public readonly methaneConcentrationProperty: TReadOnlyProperty<number>;

  // concentration of carbon dioxide in Parts per Billion (ppb)
  public readonly nitrousOxideConcentrationProperty: TReadOnlyProperty<number>;

  public constructor( dateProperty: EnumerationProperty<ConcentrationDate> ) {

    this.carbonDioxideConcentrationProperty = new DerivedProperty(
      [ dateProperty ],
      date => {
        assert && assert( CARBON_DIOXIDE_CONCENTRATION_DATA.has( date ), 'no concentration data for date' );
        return CARBON_DIOXIDE_CONCENTRATION_DATA.get( date )!;
      }
    );
    this.methaneConcentrationProperty = new DerivedProperty(
      [ dateProperty ],
      date => {
        assert && assert( CARBON_DIOXIDE_CONCENTRATION_DATA.has( date ), 'no concentration data for date' );
        return METHANE_CONCENTRATION_DATA.get( date )! * 1000;
      }
    );
    this.nitrousOxideConcentrationProperty = new DerivedProperty(
      [ dateProperty ],
      date => {
        assert && assert( CARBON_DIOXIDE_CONCENTRATION_DATA.has( date ), 'no concentration data for date' );
        return NITROUS_OXIDE_CONCENTRATION_DATA.get( date )! * 1000;
      }
    );
  }
}

greenhouseEffect.register( 'GreenhouseGasConcentrations', GreenhouseGasConcentrations );
export default GreenhouseGasConcentrations;