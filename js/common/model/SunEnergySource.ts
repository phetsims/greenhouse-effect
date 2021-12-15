// Copyright 2021, University of Colorado Boulder

/**
 * SunEnergySource is used to produce energy at a constant rate.  The amount of energy produced is based on what the
 * real sun would be delivering to the Earth for the provided surface area.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import LayersModel from './LayersModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

// constants
const OUTPUT_PROPORTION_RANGE = new Range( 0.5, 2 );

// Energy produced the sun in Watts per square meter.  This value is pretty realistic, and was adjusted so that it is
// the value that gets to the desired blackbody temperature of the Earth when using the Stefan-Boltzmann equation.
const OUTPUT_ENERGY_RATE = 240;

class SunEnergySource extends PhetioObject {
  public readonly isShiningProperty: BooleanProperty;
  public readonly outputEnergyRateTracker: EnergyRateTracker;
  public readonly proportionateOutputRateProperty: NumberProperty;
  private readonly surfaceAreaOfIncidentLight: number;
  private readonly emEnergyPackets: EMEnergyPacket[];

  /**
   * @param {number} surfaceAreaOfIncidentLight - surface area onto which the sun is shining
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {Tandem} tandem
   */
  constructor( surfaceAreaOfIncidentLight: number, emEnergyPackets: EMEnergyPacket[], tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioType: SunEnergySource.SunEnergySourceIO
    } );

    // @public - controls whether the sun is shining
    this.isShiningProperty = new BooleanProperty( GreenhouseEffectQueryParameters.initiallyStarted, {
      tandem: tandem.createTandem( 'isShiningProperty' )
    } );

    // value that controls the output level relative to Earth's sun
    this.proportionateOutputRateProperty = new NumberProperty( 1, {
      range: OUTPUT_PROPORTION_RANGE,
      tandem: tandem.createTandem( 'proportionateOutputRateProperty' )
    } );

    // @public - tracks the average energy output
    this.outputEnergyRateTracker = new EnergyRateTracker( {
      tandem: tandem.createTandem( 'outputEnergyRateTracker' )
    } );

    // @private {number}
    this.surfaceAreaOfIncidentLight = surfaceAreaOfIncidentLight;

    // @private {EMEnergyPacket[]} - EM energy packet group where produced energy will be put.
    this.emEnergyPackets = emEnergyPackets;
  }

  /**
   * Produce an energy packet that represents the sun shining towards the earth for the specified amount of time and
   * ass it to the group of energy packets.
   * @param {number} dt
   * @public
   */
  public produceEnergy( dt: number ) {
    if ( this.isShiningProperty.value ) {
      const energyToProduce = OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight *
                              this.proportionateOutputRateProperty.value * dt;
      this.outputEnergyRateTracker.addEnergyInfo( energyToProduce, dt );
      this.emEnergyPackets.push( new EMEnergyPacket(
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        energyToProduce,
        LayersModel.HEIGHT_OF_ATMOSPHERE,
        // @ts-ignore
        EnergyDirection.DOWN
      ) );
    }
  }

  /**
   * Get the current output energy in watts per square meter.
   */
  public getOutputEnergyRate() {
    return OUTPUT_ENERGY_RATE * this.proportionateOutputRateProperty.value;
  }

  /**
   * @public
   */
  public reset() {
    this.outputEnergyRateTracker.reset();
    this.isShiningProperty.reset();
    this.proportionateOutputRateProperty.reset();
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType.fromCoreType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  static get STATE_SCHEMA() {
    return {
      outputEnergyRateTracker: EnergyRateTracker.EnergyRateTrackerIO
    };
  }

  /**
   * @public
   * SunEnergySourceIO handles PhET-iO serialization of the SunEnergySource. Because serialization involves accessing
   * private members, it delegates to SunEnergySource. The methods that SunEnergySourceIO overrides are typical of
   * 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  static SunEnergySourceIO = IOType.fromCoreType( 'SunEnergySourceIO', SunEnergySource );

  // static values
  static OUTPUT_ENERGY_RATE = OUTPUT_ENERGY_RATE;
  static OUTPUT_PROPORTION_RANGE = OUTPUT_PROPORTION_RANGE;
}

greenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;