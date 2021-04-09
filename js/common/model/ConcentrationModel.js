// Copyright 2021, University of Colorado Boulder

/**
 * A GreenhouseEffectModel that includes setting concentration of greenhouse gasses in the atmosphere. Also
 * includes clouds for photon-cloud interactions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
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

class ConcentrationModel extends GreenhouseEffectModel {
  constructor() {
    super();

    // @public {Boolean} - whether or not a graphic displaying the net balance of energy is visible
    this.energyBalanceVisibleProperty = new BooleanProperty( true );

    // @public {ObservableArray.<Cloud>} - observable list of Clouds in the simulation that may interact with photons
    this.clouds = createObservableArray();

    // @public {NumberProperty} - numeric value for greenhouse gas concentration
    // NOTE: This will likely move to a model for Atmosphere with other responsibilities. Range is arbitrary for now.
    const concentrationRange = new Range( 0, 100 );
    this.concentrationProperty = new NumberProperty( 0, { range: concentrationRange } );

    // @public {EnumerationProperty} - how the concentration can be changed, either by directly modifying
    // the value or by selecting a value for Earth's greenhouse gas concentration at a particular date
    this.concentrationControlProperty = new EnumerationProperty( CONCENTRATION_CONTROL, CONCENTRATION_CONTROL.DATE );

    // @public {EnumerationProperty} - selected date which will select a value for concentration
    this.dateProperty = new EnumerationProperty( CONCENTRATION_DATE, CONCENTRATION_DATE.SEVENTEEN_FIFTY );

    // the dateProperty directly controls the concentration, though this is just a temporary listener to test some of
    // the UI components
    this.dateProperty.link( date => {
      if ( date === CONCENTRATION_DATE.ICE_AGE ) {
        this.concentrationProperty.set( concentrationRange.min );
      }
      else if ( date === CONCENTRATION_DATE.SEVENTEEN_FIFTY ) {
        this.concentrationProperty.set( concentrationRange.min + concentrationRange.getLength() / 14 );
      }
      else if ( date === CONCENTRATION_DATE.NINETEEN_FIFTY ) {
        this.concentrationProperty.set( concentrationRange.min + concentrationRange.getLength() / 5 );
      }
      else {
        this.concentrationProperty.set( concentrationRange.max );
      }
    } );
  }

  /**
   * Resets all aspects of the model.
   *
   * @override
   * @public
   */
  reset() {
    this.energyBalanceVisibleProperty.reset();
    this.clouds.reset();
    this.concentrationProperty.reset();
    this.concentrationControlProperty.reset();
    this.dateProperty.reset();

    // The concentrationProperty is dependent on the dateProperty. Resetting both while the dateProperty doesn't
    // change from reset can result in value of concentration value being incorrect b. Find another way to do this.
    this.dateProperty.notifyListenersStatic();

    super.reset();
  }
}

ConcentrationModel.CONCENTRATION_CONTROL = CONCENTRATION_CONTROL;
ConcentrationModel.CONCENTRATION_DATE = CONCENTRATION_DATE;

greenhouseEffect.register( 'ConcentrationModel', ConcentrationModel );
export default ConcentrationModel;
