// Copyright 2021, University of Colorado Boulder

/**
 * SunEnergySource is used to produce energy at a constant rate.  The amount of energy produced is based on what the
 * real sun would be delivering to the Earth for the provide surface area.
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

// constants

// Energy produced the sun in Watts per square meter.  This value is pretty realistic, and was adjusted so that it is
// the value that gets to the desired blackbody temperature of the Earth when using the Stefan-Boltzmann equation.
const OUTPUT_ENERGY_RATE = 240;

class SunEnergySource extends PhetioObject {

  /**
   * @param {number} surfaceAreaOfIncidentLight - surface area onto which the sun is shining
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {Tandem} tandem
   */
  constructor( surfaceAreaOfIncidentLight, emEnergyPackets, tandem ) {

    super( {
      tandem: tandem,
      phetioType: SunEnergySource.SunEnergySourceIO
    } );

    // @public - controls whether the sun is shining
    this.isShiningProperty = new BooleanProperty( GreenhouseEffectQueryParameters.initiallyStarted, {
      tandem: tandem.createTandem( 'isShiningProperty' )
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
  produceEnergy( dt ) {
    if ( this.isShiningProperty.value ) {
      const energyToProduce = OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight * dt;
      this.outputEnergyRateTracker.addEnergyInfo( energyToProduce, dt );
      this.emEnergyPackets.push( new EMEnergyPacket(
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        energyToProduce,
        LayersModel.HEIGHT_OF_ATMOSPHERE,
        EnergyDirection.DOWN
      ) );
    }
  }

  /**
   * @public
   */
  reset() {
    this.outputEnergyRateTracker.reset();
    this.isShiningProperty.reset();
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
}

/**
 * @public
 * SunEnergySourceIO handles PhET-iO serialization of the SunEnergySource. Because serialization involves accessing
 * private members, it delegates to SunEnergySource. The methods that SunEnergySourceIO overrides are typical of
 * 'Dynamic element serialization', as described in the Serialization section of
 * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
 */
SunEnergySource.SunEnergySourceIO = IOType.fromCoreType( 'SunEnergySourceIO', SunEnergySource );

// statics
SunEnergySource.OUTPUT_ENERGY_RATE = OUTPUT_ENERGY_RATE;

greenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;