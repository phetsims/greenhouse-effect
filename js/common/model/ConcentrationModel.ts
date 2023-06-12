// Copyright 2021-2023, University of Colorado Boulder

/**
 * ConcentrationModel is a GreenhouseEffectModel that adds in the ability to set the concentration of greenhouse gases
 * in the atmosphere and adjusts the attributes of the atmospheric layers accordingly.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Cloud from './Cloud.js';
import GroundLayer from './GroundLayer.js';
import LayersModel, { LayersModelOptions, LayersModelStateObject } from './LayersModel.js';
import Property from '../../../../axon/js/Property.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

// constants
const SCALE_HEIGHT_OF_ATMOSPHERE = 8400; // in meters, taken from a Wikipedia article
const CLOUD_WIDTH = 18000; // in meters, empirically determined to look good

// In the 1/19/2022 design meeting, we decided that when the cloud is on, the total amount of reflected light should go
// up by 10%.  Note that this DOESN'T mean that we can just use 0.1 as the total target reflectance, because when it is
// on it reduces the amount of light reaching the ground, so the calculation is more complex than that.  The following
// calculation assumes that the ground with no clouds reflects 20% of incident light.
const CLOUD_VISIBLE_REFLECTIVITY = 0.125 * LayersModel.SUNLIGHT_SPAN.width / CLOUD_WIDTH;
assert && assert(
  CLOUD_VISIBLE_REFLECTIVITY <= 1,
  `invalid reflectivity value for cloud: ${CLOUD_VISIBLE_REFLECTIVITY}`
);

// An enumeration for how concentration can be controlled, either by direct value or by selecting a value for Earth's
// concentration at a particular date.
class ConcentrationControlMode extends EnumerationValue {
  public static readonly BY_VALUE = new ConcentrationControlMode();
  public static readonly BY_DATE = new ConcentrationControlMode();

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( ConcentrationControlMode, {
    phetioDocumentation: 'Describes the mode by which concentration is controlled, either by date or by value.'
  } );
}

// dates with recorded values of greenhouse concentration
class ConcentrationDate extends EnumerationValue {
  public static readonly ICE_AGE = new ConcentrationDate();
  public static readonly YEAR_1750 = new ConcentrationDate();
  public static readonly YEAR_1950 = new ConcentrationDate();
  public static readonly YEAR_2020 = new ConcentrationDate();

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( ConcentrationDate, {
    phetioDocumentation: 'Various time periods or years that can be chosen to set a value for greenhouse gas concentrations'
  } );
}

// Map of dates to concentration values.  These values were determined empirically to make the equilibrium temperature
// reached in the sim match the values specified in the design doc.
const DATE_TO_CONCENTRATION_MAP = new Map<ConcentrationDate, number>( [
  [ ConcentrationDate.ICE_AGE, 0.625 ],
  [ ConcentrationDate.YEAR_1750, 0.7147 ],
  [ ConcentrationDate.YEAR_1950, 0.7182 ],
  [ ConcentrationDate.YEAR_2020, 0.7446 ]
] );
const CONCENTRATION_RANGE: Range = new Range( 0, 1 );

class ConcentrationModel extends LayersModel {

  // How the concentration can be changed, either by directly modifying the value or by selecting a value for Earth's
  // greenhouse gas concentration at a particular date.
  public readonly concentrationControlModeProperty: EnumerationProperty<ConcentrationControlMode>;

  // selected date that, depending on the mode, may define the value used for greenhouse gas concentration
  public readonly dateProperty: EnumerationProperty<ConcentrationDate>;

  // Property for the concentration when the concentration is controlled directly by value
  public readonly manuallyControlledConcentrationProperty: NumberProperty;

  // The actual value of concentration for the model, depending on how the concentration is to be controlled.
  public readonly concentrationProperty: TReadOnlyProperty<number>;

  // A property that determines whether the reflective cloud is enabled when manually controlling gas concentrations.
  public readonly cloudEnabledInManualConcentrationModeProperty: Property<boolean>;

  public constructor( options: LayersModelOptions ) {
    super( options );

    const concentrationTandem = options.tandem.createTandem( 'concentration' );

    this.dateProperty = new EnumerationProperty( ConcentrationDate.YEAR_1750, {
      tandem: concentrationTandem.createTandem( 'dateProperty' )
    } );
    this.manuallyControlledConcentrationProperty = new NumberProperty( 0.5, {
      range: CONCENTRATION_RANGE,
      tandem: concentrationTandem.createTandem( 'manuallyControlledConcentrationProperty' ),
      phetioDocumentation: 'The concentration value as set by the slider when in \'by value\' mode.'
    } );
    this.concentrationControlModeProperty = new EnumerationProperty(
      ConcentrationControlMode.BY_VALUE,
      { tandem: concentrationTandem.createTandem( 'concentrationControlModeProperty' ) }
    );
    this.concentrationProperty = new DerivedProperty(
      [ this.concentrationControlModeProperty, this.dateProperty, this.manuallyControlledConcentrationProperty ],
      ( concentrationControl, date, manuallyControlledConcentration ) => {
        return concentrationControl === ConcentrationControlMode.BY_VALUE ?
               manuallyControlledConcentration :
               DATE_TO_CONCENTRATION_MAP.get( date )!;
      },
      {
        tandem: concentrationTandem.createTandem( 'concentrationProperty' ),
        phetioValueType: NumberIO,
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

    Multilink.multilink(
      [ this.dateProperty, this.concentrationControlModeProperty ],
      ( date, concentrationControlMode ) => {
        if ( date === ConcentrationDate.ICE_AGE && concentrationControlMode === ConcentrationControlMode.BY_DATE ) {

          // Set the albedo to correspond to the ice age.
          this.groundLayer.albedoProperty.set( GroundLayer.PARTIALLY_GLACIATED_LAND_ALBEDO );
        }
        else {

          // Set the albedo to a non-ice-age value.
          this.groundLayer.albedoProperty.set( GroundLayer.GREEN_MEADOW_ALBEDO );
        }
      }
    );

    const cloudTandem = options.tandem.createTandem( 'cloud' );

    this.cloudEnabledInManualConcentrationModeProperty = new BooleanProperty( true, {
      tandem: cloudTandem.createTandem( 'cloudEnabledInManualConcentrationModeProperty' ),
      phetioDocumentation: 'Controls whether the cloud is enabled in the model when manually controlling the concentration.'
    } );

    // Create a derived property that determines whether the cloud is enabled in the model.  We do not allow users to
    // disable the cloud in the "by date" mode because the model is calibrated to assume the correct amount of incident
    // sunlight reaching the ground, and disabling the cloud would mess that up.
    const cloudEnabledProperty = new DerivedProperty(
      [ this.concentrationControlModeProperty, this.cloudEnabledInManualConcentrationModeProperty ],
      ( concentrationControlMode, cloudEnabledInManualConcentrationMode ) =>
        concentrationControlMode === ConcentrationControlMode.BY_DATE || cloudEnabledInManualConcentrationMode,
      {
        tandem: cloudTandem.createTandem( 'cloudEnabledProperty' ),
        phetioValueType: BooleanIO,
        phetioDocumentation: 'When true, the cloud will reflect some of the incoming sunlight back into space.'
      }
    );

    // Create the one cloud that can be shown.  The position and size of the cloud were chosen to look good in the view
    // and can be adjusted as needed.
    this.cloud = new Cloud( new Vector2( -16000, 20000 ), CLOUD_WIDTH, 4000, cloudEnabledProperty, {
      topVisibleLightReflectivity: CLOUD_VISIBLE_REFLECTIVITY,

      // phetio
      tandem: cloudTandem
    } );
  }

  /**
   * Resets all aspects of the model.
   */
  public override reset(): void {
    this.concentrationControlModeProperty.reset();
    this.dateProperty.reset();
    this.manuallyControlledConcentrationProperty.reset();
    super.reset();
  }

  // statics
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

  public static getConcentrationForDate( date: ConcentrationDate ): number {
    assert && assert( DATE_TO_CONCENTRATION_MAP.has( date ), 'no concentration for the provided date' );
    const concentration = DATE_TO_CONCENTRATION_MAP.get( date );
    return concentration === undefined ? 0 : concentration;
  }

  /**
   * ConcentrationModelIO would generally handle PhET-iO serialization of the ConcentrationModel.  However, since this
   * level of the class hierarchy only adds standard Property fields, its serialization is automatic.  So, this is
   * essentially stubbed, but exists so that the IOType hierarchy matches the class hierarchy.
   */
  public static readonly ConcentrationModelIO: IOType =
    new IOType<ConcentrationModel, ConcentrationModelStateObject>( 'ConcentrationModelIO', {
      valueType: ConcentrationModel,
      supertype: LayersModel.LayersModelIO
    } );
}

type ConcentrationModelStateObject = {

  // This state object is empty since the serialization is entirely automatic.  It exists so that the IOType hierarchy
  // matches the class hierarchy.

} & LayersModelStateObject;

export type { ConcentrationModelStateObject };

export { ConcentrationControlMode };
export { ConcentrationDate };

greenhouseEffect.register( 'ConcentrationModel', ConcentrationModel );
export default ConcentrationModel;