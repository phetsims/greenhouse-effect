// Copyright 2021-2022, University of Colorado Boulder

/**
 * ConcentrationModel is a GreenhouseEffectModel that adds in the ability to set the concentration of greenhouse gases
 * in the atmosphere and adjusts the attributes of the atmospheric layers accordingly.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayersModel, { LayersModelOptions } from './LayersModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// constants
const SCALE_HEIGHT_OF_ATMOSPHERE: number = 8400; // in meters, taken from a Wikipedia article

// values for how concentration can be controlled, either by direct value or by selecting a value for Earth's
// concentration at a particular date
const CONCENTRATION_CONTROL_MODE: EnumerationDeprecated = EnumerationDeprecated.byKeys( [ 'BY_VALUE', 'BY_DATE' ] );

// dates with recorded values of greenhouse concentration
const CONCENTRATION_DATE: EnumerationDeprecated = EnumerationDeprecated.byKeys( [ 'ICE_AGE', 'SEVENTEEN_FIFTY', 'NINETEEN_FIFTY', 'TWENTY_TWENTY' ] );

// Map of dates to concentration values.  These values were determined empirically to make the equilibrium temperature
// reached in the sim match the values specified in the design doc.
const DATE_TO_CONCENTRATION_MAP = new Map( [
  // @ts-ignore
  [ CONCENTRATION_DATE.ICE_AGE, 0.625 ],
  // @ts-ignore
  [ CONCENTRATION_DATE.SEVENTEEN_FIFTY, 0.718 ],
  // @ts-ignore
  [ CONCENTRATION_DATE.NINETEEN_FIFTY, 0.722 ],
  // @ts-ignore
  [ CONCENTRATION_DATE.TWENTY_TWENTY, 0.748 ]
] );
const CONCENTRATION_RANGE: Range = new Range( 0, 1 );

class ConcentrationModel extends LayersModel {

  public readonly dateProperty: EnumerationProperty;
  public readonly manuallyControlledConcentrationProperty: NumberProperty;
  public readonly concentrationControlModeProperty: EnumerationProperty;
  public readonly concentrationProperty: IReadOnlyProperty<number>;

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem: Tandem, options?: LayersModelOptions ) {
    super( tandem, options );

    // @public {EnumerationProperty} - selected date which will select a value for concentration
    // @ts-ignore
    this.dateProperty = new EnumerationProperty( CONCENTRATION_DATE, CONCENTRATION_DATE.SEVENTEEN_FIFTY, {
      tandem: tandem.createTandem( 'dateProperty' )
    } );

    // @public {NumberProperty} - Property for the concentration, when the concentration is controlled directly by value
    this.manuallyControlledConcentrationProperty = new NumberProperty( 0.5, {
      range: CONCENTRATION_RANGE,
      tandem: tandem.createTandem( 'manuallyControlledConcentrationProperty' ),
      phetioDocumentation: 'The concentration value as set by the slider when in \'by value\' mode.'
    } );

    // @public {EnumerationProperty} - how the concentration can be changed, either by directly modifying
    // the value or by selecting a value for Earth's greenhouse gas concentration at a particular date
    this.concentrationControlModeProperty = new EnumerationProperty(
      CONCENTRATION_CONTROL_MODE,
      // @ts-ignore
      CONCENTRATION_CONTROL_MODE.BY_VALUE, {
        tandem: tandem.createTandem( 'concentrationControlModeProperty' )
      }
    );

    // @public {DerivedProperty.<number>} - The actual value of concentration for the model, depending on how the
    // concentration is to be controlled.
    this.concentrationProperty = new DerivedProperty(
      [ this.concentrationControlModeProperty, this.dateProperty, this.manuallyControlledConcentrationProperty ],
      ( concentrationControl: EnumerationDeprecated, date: EnumerationDeprecated, manuallyControlledConcentration: number ) => {
        // @ts-ignore
        return concentrationControl === CONCENTRATION_CONTROL_MODE.BY_VALUE ?
               manuallyControlledConcentration :
               DATE_TO_CONCENTRATION_MAP.get( date )!;
      }, {
        tandem: tandem.createTandem( 'concentrationProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'The concentration value being used in the model, set via the slider or the date control.'
      }
    );

    // Hook up the concentration to the layers created in the parent class.
    this.concentrationProperty.link( concentration => {

      // Map the normalized concentration to a value for the layer absorption proportion.  The higher layers absorb
      // less.  This numerical mapping is very important to the correct operation of the simulation with respect to
      // temperature, and was empirically adjusted to make the concentration slider correspond to the temperatures in a
      // linear fashion.
      this.atmosphereLayers.forEach( atmosphereLayer => {

        // The multiplier used in this calculation was empirically determined to make the model equilibrate at the max
        // temperature value defined in the spec (295 K as of this writing).  This may need to change if the number of
        // layers is adjusted or other changes are made to the model.
        const proportionToAbsorbAtSeaLevel = 0.85 * concentration;

        // Adjust the energy absorption amounts for each of the layers based on their altitude.  The calculation uses
        // the barometric formula, see https://en.wikipedia.org/wiki/Barometric_formula.
        const altitudeProportionFactor = Math.exp( -atmosphereLayer.altitude / SCALE_HEIGHT_OF_ATMOSPHERE );
        atmosphereLayer.energyAbsorptionProportionProperty.set( proportionToAbsorbAtSeaLevel * altitudeProportionFactor );
      } );
    } );

    Property.multilink(
      [ this.dateProperty, this.concentrationControlModeProperty ],
      ( date: EnumerationDeprecated, concentrationControlMode: EnumerationDeprecated ) => {
        // @ts-ignore
        if ( date === CONCENTRATION_DATE.ICE_AGE &&
             // @ts-ignore
             concentrationControlMode === CONCENTRATION_CONTROL_MODE.BY_DATE ) {

          // This is the ice age, so the ground should reflect some light.
          this.groundLayer.albedoProperty.set( 0.02 );
        }
        else {

          // This is not the ice age, so the ground should not reflect light (in this model, obviously this doesn't
          // quite match real life).
          this.groundLayer.albedoProperty.set( 0 );
        }
      }
    );
  }

  /**
   * Resets all aspects of the model.
   *
   * @override
   * @public
   */
  reset() {
    this.concentrationControlModeProperty.reset();
    this.dateProperty.reset();
    this.manuallyControlledConcentrationProperty.reset();
    super.reset();
  }

  // statics
  public static readonly CONCENTRATION_CONTROL_MODE: EnumerationDeprecated = CONCENTRATION_CONTROL_MODE;
  public static readonly CONCENTRATION_DATE: EnumerationDeprecated = CONCENTRATION_DATE;
  public static readonly CONCENTRATION_RANGE: Range = CONCENTRATION_RANGE;
  public static readonly DATE_CONCENTRATION_RANGE: Range = new Range(
    Array.from( DATE_TO_CONCENTRATION_MAP.values() ).reduce(
      ( minSoFar, currentValue ) => Math.min( minSoFar, currentValue ),
      Number.POSITIVE_INFINITY
    ),
    Array.from( DATE_TO_CONCENTRATION_MAP.values() ).reduce(
      ( maxSoFar, currentValue ) => Math.max( maxSoFar, currentValue ),
      Number.NEGATIVE_INFINITY
    )
  );
}

export { LayersModel };

greenhouseEffect.register( 'ConcentrationModel', ConcentrationModel );
export default ConcentrationModel;
