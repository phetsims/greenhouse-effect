// Copyright 2021, University of Colorado Boulder

/**
 * A model of a horizontal layer of a material that absorbs energy, heats up, and then radiates energy as a black body.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';

// constants

// The various substances that this layer can model.  Density is in kg/m^3, specific heat capacity is in J/kg°K
const Substance = Enumeration.byMap( {
  // @ts-ignore
  GLASS: { density: 2500, specificHeatCapacity: 840, radiationDirections: [ EnergyDirection.UP, EnergyDirection.DOWN ] },
  // @ts-ignore
  EARTH: { density: 1250, specificHeatCapacity: 1250, radiationDirections: [ EnergyDirection.UP ] }
} );

// The size of the energy absorbing layers are all the same in the Greenhouse Effect sim and are not parameterized.
// The layer is modeled as a 1 meter wide strip that spans the width of the simulated sunlight.  Picture it like a
// sidewalk.  The dimensions are in meters.
const SURFACE_DIMENSIONS = new Dimension2( GreenhouseEffectConstants.SUNLIGHT_SPAN, 1 );
const SURFACE_AREA = SURFACE_DIMENSIONS.width * SURFACE_DIMENSIONS.height;

// The thickness of the layer is primarily used in volume calculations which are then used in the specific heat formula.
// The value used here is in meters, and it is ridiculously small.  This is done so that the layers change temperature
// very quickly in response to incoming energy.  This is the main place where adjustments should be made to increase or
// decrease the rates at which temperatures change in the sim.
const LAYER_THICKNESS = 0.0000003;

const VOLUME = SURFACE_DIMENSIONS.width * SURFACE_DIMENSIONS.height * LAYER_THICKNESS;
const STEFAN_BOLTZMANN_CONSTANT = 5.670374419E-8; // This is the SI version, look it up for exact units.

type EnergyAbsorbingEmittingLayerOptions = {
  substance: any,
  initialEnergyAbsorptionProportion: number,
  minimumTemperature: number
} & PhetioObjectOptions;

class EnergyAbsorbingEmittingLayer extends PhetioObject {
  readonly altitude: number;
  readonly temperatureProperty: NumberProperty;
  readonly energyAbsorptionProportionProperty: NumberProperty;
  private readonly substance: any;
  private readonly mass: number;
  private readonly specificHeatCapacity: number;
  private readonly minimumTemperature: number;

  /**
   * @param {number} altitude
   * @param {Object} [options]
   */
  constructor( altitude: number, options?: Partial<EnergyAbsorbingEmittingLayerOptions> ) {

    options = merge( {

      // {Substance} - default to glass
      // @ts-ignore
      substance: Substance.GLASS,

      // {number} - initial setting for the absorption proportion, must be from 0 to 1 inclusive
      initialEnergyAbsorptionProportion: 1,

      // {number} - The minimum temperature that this layer can get to, in degrees Kelvin.  This will also be the
      // temperature at which it is originally set to.  When at this temperature, the layer will radiate no energy.
      // TODO: Decide whether this is really worth keeping.  It's tricky, and may not be what we really ultimately want.
      minimumTemperature: 0,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true,
      phetioState: false

    }, options ) as EnergyAbsorbingEmittingLayerOptions;

    super( options );

    // altitude in meters where this layer resides
    this.altitude = altitude;

    // The temperature of this layer in degrees Kelvin.  We model it at absolute zero by default so that it isn't
    // radiating anything, and produce a compensated temperature that produces values more reasonable to the surface of
    // the Earth and its atmosphere.
    this.temperatureProperty = new NumberProperty( options.minimumTemperature!, {
      units: 'K',
      tandem: options.tandem.createTandem( 'temperatureProperty' ),
      phetioReadOnly: true,
      phetioHighFrequency: true
    } );

    // The proportion of energy coming into this layer that is absorbed and thus contributes to an increase in
    // temperature.  Non-absorbed energy is simply based from the input to the output.
    this.energyAbsorptionProportionProperty = new NumberProperty( options.initialEnergyAbsorptionProportion!, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'energyAbsorptionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Proportion, from 0 to 1, of light energy absorbed for interacting wavelengths.'
    } );

    // @private
    this.substance = options.substance;
    this.mass = VOLUME * options.substance.density;
    this.specificHeatCapacity = options.substance.specificHeatCapacity;
    this.minimumTemperature = options.minimumTemperature!;
  }

  /**
   * Interact with the provided energy packets.  This must be overridden in descendant classes.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @returns {number}
   * @protected
   */
  interactWithEnergyPackets( emEnergyPackets: EMEnergyPacket[] ): number {
    assert && assert( false, 'this method must be overridden in descendant classes' );
    return 0;
  }

  /**
   * Returns true if the provided energy packet crossed over this layer during its latest step.
   * @param {EMEnergyPacket} energyPacket
   * @returns {boolean}
   * @protected
   */
  energyPacketCrossedThisLayer( energyPacket: EMEnergyPacket ) {
    return ( energyPacket.previousAltitude > this.altitude && energyPacket.altitude <= this.altitude ) ||
           ( energyPacket.previousAltitude < this.altitude && energyPacket.altitude >= this.altitude );
  }

  /**
   * Interact with the provided energy.  Energy may be reflected, absorbed, or ignored.
   * @param {EMEnergyPacket[]} emEnergyPackets
   * @param {number} dt - delta time, in seconds
   * @public
   */
  interactWithEnergy( emEnergyPackets: EMEnergyPacket[], dt: number ) {

    // Interact with the individual energy packets and figure out how much energy to absorb from them.  The energy
    // packets can be updated, and often are, during this step.
    const absorbedEnergy: number = this.interactWithEnergyPackets( emEnergyPackets );

    // Remove any energy packets that were fully absorbed.
    _.remove( emEnergyPackets, emEnergyPacket => emEnergyPacket.energy === 0 );

    // Calculate the temperature change that would occur due to the incoming energy using the specific heat formula.
    const temperatureChangeDueToIncomingEnergy = absorbedEnergy / ( this.mass * this.specificHeatCapacity );

    // Calculate the amount of energy that this layer will radiate per unit area at its current temperature using the
    // Stefan-Boltzmann equation.  This calculation doesn't allow the energy to radiate if it is below the initial
    // temperature, which is not real physics, but is needed for the desired behavior of the sim.
    const radiatedEnergyPerUnitSurfaceArea = Math.pow( this.temperatureProperty.value, 4 ) * STEFAN_BOLTZMANN_CONSTANT * dt;

    // The total radiated energy depends on whether this layer is radiating in one direction or two.
    const numberOfRadiatingSurfaces = this.substance.radiationDirections.length;
    assert && assert( numberOfRadiatingSurfaces === 1 || numberOfRadiatingSurfaces === 2 );
    let totalRadiatedEnergyThisStep = radiatedEnergyPerUnitSurfaceArea * SURFACE_AREA * numberOfRadiatingSurfaces;

    // Calculate the temperature change that would occur due to the radiated energy.
    const temperatureChangeDueToRadiatedEnergy = -totalRadiatedEnergyThisStep / ( this.mass * this.specificHeatCapacity );

    // Total the two temperature change values.  This may be modified.
    let netTemperatureChange = temperatureChangeDueToIncomingEnergy + temperatureChangeDueToRadiatedEnergy;

    // Check whether the calculated temperature changes would cause this layer's temperature to go below its minimum
    // value.  If so, limit the radiated energy so that this doesn't happen.  THIS IS NON-PHYSICAL, but is necessary so
    // that the layer doesn't fall below the minimum temperature.  In a real system, it would radiate until it reached
    // absolute zero.
    if ( this.temperatureProperty.value + netTemperatureChange < this.minimumTemperature ) {

      // Reduce the magnitude of the temperature change such that it will not take the temperature below the min value.
      netTemperatureChange = this.minimumTemperature - this.temperatureProperty.value;

      // Sanity check - this all only makes sense if the net change is negative.
      assert && assert( netTemperatureChange <= 0, 'unexpected negative or zero temperature change' );

      // Reduce the amount of radiated energy to match this temperature change.
      totalRadiatedEnergyThisStep = -netTemperatureChange * this.mass * this.specificHeatCapacity;
    }

    // Calculate the new temperature using the previous temperature and the changes due to energy absorption and
    // emission.
    this.temperatureProperty.set( this.temperatureProperty.value + netTemperatureChange );

    // Send out the radiated energy by adding new EM energy packets.
    if ( totalRadiatedEnergyThisStep > 0 ) {
      // @ts-ignore
      if ( this.substance.radiationDirections.includes( EnergyDirection.DOWN ) ) {
        emEnergyPackets.push( new EMEnergyPacket(
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          totalRadiatedEnergyThisStep / numberOfRadiatingSurfaces,
          this.altitude,
          // @ts-ignore
          EnergyDirection.DOWN
        ) );
      }
      // @ts-ignore
      if ( this.substance.radiationDirections.includes( EnergyDirection.UP ) ) {
        emEnergyPackets.push( new EMEnergyPacket(
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          totalRadiatedEnergyThisStep / numberOfRadiatingSurfaces,
          this.altitude,
          // @ts-ignore
          EnergyDirection.UP
        ) );
      }
    }
  }

  /**
   * @public
   */
  reset() {
    this.temperatureProperty.reset();
  }

  // statics
  static WIDTH = SURFACE_DIMENSIONS.width;
  static SURFACE_AREA = SURFACE_AREA;
  static Substance = Substance;
}

greenhouseEffect.register( 'EnergyAbsorbingEmittingLayer', EnergyAbsorbingEmittingLayer );
export default EnergyAbsorbingEmittingLayer;