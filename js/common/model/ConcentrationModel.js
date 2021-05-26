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
// values for how concentration can be controlled, either by direct value or by selecting a value for Earth's
// concentration at a particular date
const CONCENTRATION_CONTROL = Enumeration.byKeys( [ 'VALUE', 'DATE' ] );

// dates with recorded values of greenhouse concentration
const CONCENTRATION_DATE = Enumeration.byKeys( [ 'ICE_AGE', 'SEVENTEEN_FIFTY', 'NINETEEN_FIFTY', 'TWO_THOUSAND_NINETEEN' ] );

// maps the date to the modelled concentration, map values are not based on realistic values and are only temporary
// to get the UI components working
const CONCENTRATION_RANGE = new Range( 0, 1 );
const DATE_TO_CONCENTRATION_MAP = new Map( [
  [ CONCENTRATION_DATE.ICE_AGE, CONCENTRATION_RANGE.min ],
  [ CONCENTRATION_DATE.SEVENTEEN_FIFTY, CONCENTRATION_RANGE.min + CONCENTRATION_RANGE.getLength() / 14 ],
  [ CONCENTRATION_DATE.NINETEEN_FIFTY, CONCENTRATION_RANGE.min + CONCENTRATION_RANGE.getLength() / 5 ],
  [ CONCENTRATION_DATE.TWO_THOUSAND_NINETEEN, CONCENTRATION_RANGE.max ]
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
    this.concentrationControlProperty = new EnumerationProperty( CONCENTRATION_CONTROL, CONCENTRATION_CONTROL.VALUE );

    // @public {DerivedProperty.<number>} - The actual value of concentration for the model, depending on how the
    // concentration is to be controlled.
    this.concentrationProperty = new DerivedProperty(
      [ this.dateProperty, this.manuallyControlledConcentrationProperty, this.concentrationControlProperty ],
      ( date, manuallyControlledConcentration, concentrationControl ) => {
        return concentrationControl === CONCENTRATION_CONTROL.VALUE ?
               manuallyControlledConcentration :
               DATE_TO_CONCENTRATION_MAP.get( date );
      } );

    // Hook up the concentration to the layers created in the parent class.
    this.concentrationProperty.link( concentration => {
      this.lowerAtmosphereLayer.energyAbsorptionProportionProperty.set( concentration );
      this.upperAtmosphereLayer.energyAbsorptionProportionProperty.set( concentration );
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
    this.concentrationControlProperty.reset();
    this.dateProperty.reset();
    this.manuallyControlledConcentrationProperty.reset();

    super.reset();
  }
}

// @public @static
ConcentrationModel.CONCENTRATION_CONTROL = CONCENTRATION_CONTROL;
ConcentrationModel.CONCENTRATION_DATE = CONCENTRATION_DATE;
ConcentrationModel.CONCENTRATION_RANGE = CONCENTRATION_RANGE;

greenhouseEffect.register( 'ConcentrationModel', ConcentrationModel );
export default ConcentrationModel;
