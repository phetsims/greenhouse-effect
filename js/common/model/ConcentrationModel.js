// Copyright 2021, University of Colorado Boulder

/**
 * A GreenhouseEffectModel that includes setting concentration of greenhouse gasses in the atmosphere. Also
 * includes clouds for photon-cloud interactions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectModel from './GreenhouseEffectModel.js';

// constants
const SCALE_HEIGHT_OF_ATMOSPHERE = 8400; // in meters, taken from a Wikipedia article

// values for how concentration can be controlled, either by direct value or by selecting a value for Earth's
// concentration at a particular date
const CONCENTRATION_CONTROL_MODE = Enumeration.byKeys( [ 'BY_VALUE', 'BY_DATE' ] );

// dates with recorded values of greenhouse concentration
const CONCENTRATION_DATE = Enumeration.byKeys( [ 'ICE_AGE', 'SEVENTEEN_FIFTY', 'NINETEEN_FIFTY', 'TWO_THOUSAND_NINETEEN' ] );

// maps the date to the modelled concentration, map values are not based on realistic values and are only temporary
// to get the UI components working
const CONCENTRATION_RANGE = new Range( 0, 1 );
const DATE_TO_CONCENTRATION_MAP = new Map( [
  [ CONCENTRATION_DATE.ICE_AGE, 0.5 ],
  [ CONCENTRATION_DATE.SEVENTEEN_FIFTY, 0.7 ],
  [ CONCENTRATION_DATE.NINETEEN_FIFTY, 0.8 ],
  [ CONCENTRATION_DATE.TWO_THOUSAND_NINETEEN, 0.83 ]
] );

class ConcentrationModel extends GreenhouseEffectModel {
  constructor() {
    super();

    // @public {ObservableArray.<Cloud>} - observable list of Clouds in the simulation that may interact with photons
    this.clouds = createObservableArray();

    // @public {EnumerationProperty} - selected date which will select a value for concentration
    this.dateProperty = new EnumerationProperty( CONCENTRATION_DATE, CONCENTRATION_DATE.SEVENTEEN_FIFTY );

    // @public {NumberProperty} - Property for the concentration, when the concentration is controlled directly by value
    this.manuallyControlledConcentrationProperty = new NumberProperty( 0.5, {
      range: CONCENTRATION_RANGE
    } );

    // @public {EnumerationProperty} - how the concentration can be changed, either by directly modifying
    // the value or by selecting a value for Earth's greenhouse gas concentration at a particular date
    this.concentrationControlModeProperty = new EnumerationProperty(
      CONCENTRATION_CONTROL_MODE,
      CONCENTRATION_CONTROL_MODE.BY_VALUE
    );

    // @public {DerivedProperty.<number>} - The actual value of concentration for the model, depending on how the
    // concentration is to be controlled.
    this.concentrationProperty = new DerivedProperty(
      [ this.dateProperty, this.manuallyControlledConcentrationProperty, this.concentrationControlModeProperty ],
      ( date, manuallyControlledConcentration, concentrationControl ) => {
        return concentrationControl === CONCENTRATION_CONTROL_MODE.BY_VALUE ?
               manuallyControlledConcentration :
               DATE_TO_CONCENTRATION_MAP.get( date );
      } );

    // Hook up the concentration to the layers created in the parent class.
    this.concentrationProperty.link( concentration => {

      // Map the normalized concentration to a value for the layer absorption proportion.  The higher layers absorb
      // less.  This numerical mapping is very important to the correct operation of the simulation with respect to
      // temperature, and was empirically adjusted to make the concentration slider correspond to the temperatures in a
      // linear fashion.
      this.atmospherLayers.forEach( atmosphereLayer => {
        const proportionToAbsorbAtSeaLevel = 0.59 * concentration; // multiplier empirically determined to get the desired behavior
        const altitudeProportionFactor = Math.exp( -atmosphereLayer.altitude / SCALE_HEIGHT_OF_ATMOSPHERE );
        atmosphereLayer.energyAbsorptionProportionProperty.set( proportionToAbsorbAtSeaLevel * altitudeProportionFactor );
      } );
    } );
  }

  /**
   * Resets all aspects of the model.
   *
   * @override
   * @public
   */
  reset() {
    this.clouds.reset();
    this.concentrationControlModeProperty.reset();
    this.dateProperty.reset();
    this.manuallyControlledConcentrationProperty.reset();
    super.reset();
  }
}

// @public @static
ConcentrationModel.CONCENTRATION_CONTROL_MODE = CONCENTRATION_CONTROL_MODE;
ConcentrationModel.CONCENTRATION_DATE = CONCENTRATION_DATE;
ConcentrationModel.CONCENTRATION_RANGE = CONCENTRATION_RANGE;
ConcentrationModel.DATE_CONCENTRATION_RANGE = new Range(
  Array.from( DATE_TO_CONCENTRATION_MAP.values() ).reduce(
    ( minSoFar, currentValue ) => Math.min( minSoFar, currentValue ),
    Number.POSITIVE_INFINITY
  ),
  Array.from( DATE_TO_CONCENTRATION_MAP.values() ).reduce(
    ( maxSoFar, currentValue ) => Math.max( maxSoFar, currentValue ),
    Number.NEGATIVE_INFINITY
  )
);

greenhouseEffect.register( 'ConcentrationModel', ConcentrationModel );
export default ConcentrationModel;
