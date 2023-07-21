// Copyright 2021-2023, University of Colorado Boulder

/**
 * A model of a horizontal layer of a material that absorbs energy, heats up, and then radiates energy as a black body.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import energyPacketCrossedAltitude from './energyPacketCrossedAltitude.js';

// constants

// A value used when determining whether this layer is in energy equilibrium.  It is in Watts per square meter, and
// when the difference between the incoming energy and the outgoing energy is less than this, that is considered to be
// at equilibrium.  This was empirically determined, see https://github.com/phetsims/greenhouse-effect/issues/137.
const AT_EQUILIBRIUM_THRESHOLD = 0.004;

// This constant defines the amount of time that the incoming and outgoing energies have to be equal (within a
// threshold) before deciding that the layer is at thermal equilibrium.  This is in seconds, and was empirically
// determined, see https://github.com/phetsims/greenhouse-effect/issues/137.
const EQUILIBRATION_TIME = 2.0;

// The various substances that this layer can model.
class Substance extends EnumerationValue {

  // In kg/m^3
  public readonly density: number;

  // In J/kg°K
  public readonly specificHeatCapacity: number;

  public readonly radiationDirections: EnergyDirection[];

  public constructor( density: number, specificHeatCapacity: number, radiationDirections: EnergyDirection[] ) {
    super();

    this.density = density;
    this.specificHeatCapacity = specificHeatCapacity;
    this.radiationDirections = radiationDirections;
  }

  public static readonly GLASS = new Substance( 2500, 840, [ EnergyDirection.UP, EnergyDirection.DOWN ] );
  public static readonly EARTH = new Substance( 1250, 1250, [ EnergyDirection.UP ] );

  public static readonly enumeration = new Enumeration( Substance );
}

// The size of the energy absorbing layers are all the same in the Greenhouse Effect sim and are not parameterized.
// The layer is modeled as a 1-meter wide strip that spans the width of the simulated sunlight.  Picture it like a
// sidewalk.  The dimensions are in meters.
const SURFACE_DIMENSIONS = GreenhouseEffectConstants.SUNLIGHT_SPAN;
const SURFACE_AREA = SURFACE_DIMENSIONS.width * SURFACE_DIMENSIONS.height;

// The thickness of the layer is primarily used in volume calculations which are then used in the specific heat formula.
// The value used here is in meters, and it is ridiculously small.  This is done so that the layers change temperature
// very quickly in response to incoming energy.  This is the main place where adjustments should be made to increase or
// decrease the rates at which temperatures change in the sim.
const LAYER_THICKNESS = 0.0000003;

const VOLUME = SURFACE_DIMENSIONS.width * SURFACE_DIMENSIONS.height * LAYER_THICKNESS;

type SelfOptions = {
  substance?: Substance;
  initialEnergyAbsorptionProportion?: number;
  minimumTemperature?: number;
};
export type EnergyAbsorbingEmittingLayerOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

class EnergyAbsorbingEmittingLayer extends PhetioObject {

  // The altitude in meters where this layer exists,
  public readonly altitude: number;

  // The temperature of this layer in degrees Kelvin.  We model it at absolute zero by default so that it isn't
  // radiating anything, and produce a compensated temperature that produces values more reasonable to the surface of
  // the Earth and its atmosphere.
  public readonly temperatureProperty: NumberProperty;

  // The proportion of energy coming into this layer that is absorbed and thus contributes to an increase in
  // temperature.  Non-absorbed energy is simply passed from the input to the output.
  public readonly energyAbsorptionProportionProperty: NumberProperty;

  // Other fields whose meaning should be reasonably obvious.
  private readonly substance: Substance;
  private readonly mass: number;
  private readonly specificHeatCapacity: number;
  public readonly minimumTemperature: number;
  public readonly atEquilibriumProperty: BooleanProperty;
  private atEquilibriumTime: number;

  protected constructor( altitude: number, providedOptions?: EnergyAbsorbingEmittingLayerOptions ) {

    const options = optionize<EnergyAbsorbingEmittingLayerOptions, SelfOptions, PhetioObjectOptions>()( {

      // default to glass
      substance: Substance.GLASS,

      // initial setting for the absorption proportion, must be from 0 to 1 inclusive
      initialEnergyAbsorptionProportion: 1,

      // The minimum temperature that this layer can get to, in degrees Kelvin.  This will also be the temperature at
      // which it is originally set to.  When at this temperature, the layer will radiate no energy.  This is a bit of
      // a violation of the actual physics, since anything that is above absolute zero radiates some energy, but was a
      // necessary simplification to have the Earth at a stable initial temperature that is reasonable (i.e. not
      // absolute zero).
      minimumTemperature: 0,

      // phet-io
      phetioReadOnly: true,
      phetioState: false,

      // To date there hasn't been a need to dispose instances of this class, so disposal is currently unsupported.
      isDisposable: false
    }, providedOptions );

    super( options );

    this.altitude = altitude;

    this.temperatureProperty = new NumberProperty( options.minimumTemperature, {
      units: 'K',
      tandem: options.tandem.createTandem( 'temperatureProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioHighFrequency: true
    } );

    this.energyAbsorptionProportionProperty = new NumberProperty( options.initialEnergyAbsorptionProportion, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'energyAbsorptionProportionProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Proportion, from 0 to 1, of light energy absorbed for interacting wavelengths.'
    } );

    // A property that is true when this layer is in equilibrium, meaning that the amount of energy coming in is equal
    // to or at least very close to the amount of energy going out.
    this.atEquilibriumProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'atEquilibriumProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'True when the amount of energy being absorbed is roughly equal to the amount being radiated.'
    } );

    this.substance = options.substance;
    this.mass = VOLUME * options.substance.density;
    this.specificHeatCapacity = options.substance.specificHeatCapacity;
    this.minimumTemperature = options.minimumTemperature!;
    this.atEquilibriumTime = 0;
  }

  /**
   * Interact with the provided energy packets.  This behavior varies depending on the nature of the layer, and must
   * therefore be overridden in descendant classes.
   */
  protected interactWithEnergyPackets( emEnergyPackets: EMEnergyPacket[] ): number {
    assert && assert( false, 'this method must be overridden in descendant classes' );
    return 0;
  }

  /**
   * Returns true if the provided energy packet crossed over this layer during its latest step.
   */
  protected energyPacketCrossedThisLayer( energyPacket: EMEnergyPacket ): boolean {
    return energyPacketCrossedAltitude( energyPacket, this.altitude );
  }

  /**
   * Interact with the provided energy.  Energy may be reflected, absorbed, or ignored.
   */
  public interactWithEnergy( emEnergyPackets: EMEnergyPacket[], dt: number ): void {

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
    const radiatedEnergyPerUnitSurfaceArea = Math.pow( this.temperatureProperty.value, 4 ) *
                                             GreenhouseEffectConstants.STEFAN_BOLTZMANN_CONSTANT * dt;

    // The total radiated energy depends on whether this layer is radiating in one direction or two.
    const numberOfRadiatingSurfaces = this.substance.radiationDirections.length;
    assert && assert( numberOfRadiatingSurfaces === 1 || numberOfRadiatingSurfaces === 2 );
    let totalRadiatedEnergyThisStep = radiatedEnergyPerUnitSurfaceArea * SURFACE_AREA * numberOfRadiatingSurfaces;

    // Calculate the temperature change that would occur due to the radiated energy.
    const temperatureChangeDueToRadiatedEnergy = -totalRadiatedEnergyThisStep / ( this.mass * this.specificHeatCapacity );

    // Total the two temperature change values.
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

    // Update the state of the at-equilibrium indicator.  Being at equilibrium in this model requires that the incoming
    // and outgoing energy values are equal for a certain amount of time.
    if ( Math.abs( absorbedEnergy - totalRadiatedEnergyThisStep ) / SURFACE_AREA / dt < AT_EQUILIBRIUM_THRESHOLD ) {
      this.atEquilibriumTime = Math.min( this.atEquilibriumTime + dt, EQUILIBRATION_TIME );
      if ( this.atEquilibriumTime >= EQUILIBRATION_TIME && !this.atEquilibriumProperty.value ) {
        this.atEquilibriumProperty.set( true );
      }
    }
    else {
      this.atEquilibriumTime = 0;
      if ( this.atEquilibriumProperty.value ) {
        this.atEquilibriumProperty.set( false );
      }
    }

    // Send out the radiated energy by adding new EM energy packets.
    if ( totalRadiatedEnergyThisStep > 0 ) {
      if ( this.substance.radiationDirections.includes( EnergyDirection.DOWN ) ) {
        emEnergyPackets.push( new EMEnergyPacket(
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          totalRadiatedEnergyThisStep / numberOfRadiatingSurfaces,
          this.altitude,
          EnergyDirection.DOWN
        ) );
      }
      if ( this.substance.radiationDirections.includes( EnergyDirection.UP ) ) {
        emEnergyPackets.push( new EMEnergyPacket(
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          totalRadiatedEnergyThisStep / numberOfRadiatingSurfaces,
          this.altitude,
          EnergyDirection.UP
        ) );
      }
    }
  }

  /**
   * restore initial state
   */
  public reset(): void {
    this.temperatureProperty.reset();
    this.atEquilibriumProperty.reset();
  }

  // statics
  public static readonly WIDTH = SURFACE_DIMENSIONS.width;
  public static readonly SURFACE_AREA = SURFACE_AREA;
  public static readonly Substance = Substance;
}

greenhouseEffect.register( 'EnergyAbsorbingEmittingLayer', EnergyAbsorbingEmittingLayer );
export default EnergyAbsorbingEmittingLayer;