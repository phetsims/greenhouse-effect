// Copyright 2021, University of Colorado Boulder

/**
 * A GreenhouseEffectModel that includes setting concentration of greenhouse gasses in the atmosphere. Also
 * includes clouds for photon-cloud interactions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

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

    // @public {ObservableArray.<Cloud>} - observable list of Clouds in the simulation that may interact with photons
    this.clouds = createObservableArray();

    // @public {NumberProperty} - numeric value for greenhouse gas concentration
    // NOTE: This will likely move to a model for Atmosphere with other responsibilities. Range is arbitrary for now.
    const concentrationRange = new Range( 0, 1 );
    this.concentrationProperty = new NumberProperty( 0, { range: concentrationRange } );

    // @public {EnumerationProperty} - how the concentration can be changed, either by directly modifying
    // the value or by selecting a value for Earth's greenhouse gas concentration at a particular date
    this.concentrationControlProperty = new EnumerationProperty( CONCENTRATION_CONTROL, CONCENTRATION_CONTROL.VALUE );

    // @public {EnumerationProperty} - selected date which will select a value for concentration
    this.dateProperty = new EnumerationProperty( CONCENTRATION_DATE, CONCENTRATION_DATE.SEVENTEEN_FIFTY );

    // The dateProperty directly controls the concentration, though this is just a temporary listener to test some of
    // the UI components.
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

    // Hook up the concentration to the layers created in the parent class.
    this.concentrationProperty.link( concentration => {
      console.log( `concentration = ${concentration}` );
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
