// Copyright 2021-2023, University of Colorado Boulder

/**
 * GreenhouseGasConcentrations contains a set of properties that represent the concentrations of a set of greenhouse
 * gases based on a provided date.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { ConcentrationDate } from '../model/ConcentrationModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

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

  // TODO: See if other devs can help me (jbphet) make DerivedProperty and TReadOnlyProperty work.  See https://github.com/phetsims/greenhouse-effect/issues/368.
  // public readonly carbonDioxideConcentrationProperty: TReadOnlyProperty<number>;

  // concentration of carbon dioxide in Parts per Million (ppm)
  public readonly carbonDioxideConcentrationProperty: NumberProperty;

  // concentration of carbon dioxide in Parts per Billion (ppb)
  public readonly methaneConcentrationProperty: NumberProperty;

  // concentration of carbon dioxide in Parts per Billion (ppb)
  public readonly nitrousOxideConcentrationProperty: NumberProperty;

  public constructor( dateProperty: EnumerationProperty<ConcentrationDate> ) {

    // this.carbonDioxideConcentrationProperty = new DerivedProperty(
    //   [ dateProperty ],
    //   date => {
    //     assert && assert( CARBON_DIOXIDE_CONCENTRATION_DATA.has( date ), 'no concentration data for date' );
    //     return CARBON_DIOXIDE_CONCENTRATION_DATA.get( date );
    //   }
    // );
    this.carbonDioxideConcentrationProperty = new NumberProperty( 0 );
    this.methaneConcentrationProperty = new NumberProperty( 0 );
    this.nitrousOxideConcentrationProperty = new NumberProperty( 0 );
    dateProperty.link( date => {
      assert && assert( CARBON_DIOXIDE_CONCENTRATION_DATA.has( date ), 'no concentration data for provided date' );
      this.carbonDioxideConcentrationProperty.set( CARBON_DIOXIDE_CONCENTRATION_DATA.get( date )! );
      assert && assert( METHANE_CONCENTRATION_DATA.has( date ), 'no concentration data for provided date' );
      this.methaneConcentrationProperty.set( METHANE_CONCENTRATION_DATA.get( date )! * 1000 );
      assert && assert( NITROUS_OXIDE_CONCENTRATION_DATA.has( date ), 'no concentration data for provided date' );
      this.nitrousOxideConcentrationProperty.set( NITROUS_OXIDE_CONCENTRATION_DATA.get( date )! * 1000 );
    } );
  }
}

greenhouseEffect.register( 'GreenhouseGasConcentrations', GreenhouseGasConcentrations );
export default GreenhouseGasConcentrations;
