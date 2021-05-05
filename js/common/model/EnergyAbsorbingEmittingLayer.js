// Copyright 2021, University of Colorado Boulder

/**
 * A model of a horizontal layer of a material that absorbs energy, heats up, and then radiates energy.  This is modeled
 * as a black body.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import EnergySource from './EnergySource.js';

// constants
const STARTING_TEMPERATURE = 245; // in degrees Kelvin

// The various substances that this layer can model.  Density is in kg/m^3, specific heat capacity is in J/kg°K
const Substance = Enumeration.byMap( {
  // GLASS: { density: 2500, specificHeatCapacity: 840, radiationDirections: [ EnergyDirection.UP, EnergyDirection.DOWN ] },
  GLASS: { density: 2500, specificHeatCapacity: 0.84, radiationDirections: [ EnergyDirection.UP, EnergyDirection.DOWN ] },
  // EARTH: { density: 1250, specificHeatCapacity: 1250, radiationDirections: [ EnergyDirection.UP ] }
  EARTH: { density: 1250, specificHeatCapacity: 1.25, radiationDirections: [ EnergyDirection.UP ] }
} );

// The size of the energy absorbing layers are all the same in the Greenhouse Effect sim and are not parameterized.
// The layer is modeled as a 1 meter wide strip that spans the width of the simulated sunlight.  Picture it like a
// sidewalk.  The dimensions are in meters.
const SURFACE_DIMENSIONS = new Dimension2( GreenhouseEffectConstants.SUNLIGHT_SPAN, 1 );
const SURFACE_AREA = SURFACE_DIMENSIONS.width * SURFACE_DIMENSIONS.height;

// The depth of the layer is primarily used in volume calculations which are then used in the specific heat formula.
const LAYER_DEPTH = 0.01; // in meters

const VOLUME = SURFACE_DIMENSIONS.width * SURFACE_DIMENSIONS.height * LAYER_DEPTH;
const STEFAN_BOLTZMANN_CONSTANT = 5.670374419E-8;

class EnergyAbsorbingEmittingLayer extends EnergySource {

  /**
   * @param {number} altitude
   * @param {Object} [options]
   */
  constructor( altitude, options ) {

    options = merge( {

      // {Substance} - default to glass
      substance: Substance.GLASS,

      // {number} - initial setting for the absorption proportion, must be from 0 to 1 inclusive
      initialEnergyAbsorptionProportion: 1

    }, options );

    super();

    // @public (read-only) - altitude in meters where this layer resides
    this.altitude = altitude;

    // @public (read-only) - The temperature of this layer in degrees Kelvin.  We model it at absolute zero by default
    // so that it isn't radiating anything, and produce a compensated temperature that produces values more reasonable
    // to the surface of the Earth and its atmosphere.
    this.temperatureProperty = new NumberProperty( STARTING_TEMPERATURE );

    // @public - The proportion of energy coming into this layer that is absorbed and thus contributes to an increase
    // in temperature.  Non-absorbed energy is simply based from the input to the output.
    this.energyAbsorptionProportionProperty = new NumberProperty( options.initialEnergyAbsorptionProportion );

    // @public {read-only} - Energy coming in that is moving in the downward direction, so coming from above.
    this.incomingDownwardMovingEnergyProperty = new NumberProperty( 0 );

    // @public {read-only} - Energy coming in that is moving in the upward direction, so coming from underneath.
    this.incomingUpwardMovingEnergyProperty = new NumberProperty( 0 );

    // @public {read-only} - energy rate tracking for incoming downward-moving energy, used for debugging
    this.incomingDownwardMovingEnergyRateTracker = new EnergyRateTracker();

    // @public {read-only} - energy rate tracking for incoming upward-moving energy, used for debugging
    this.incomingUpwardMovingEnergyRateTracker = new EnergyRateTracker();

    // @private
    this.substance = options.substance;
    this.mass = VOLUME * options.substance.density;
    this.specificHeatCapacity = options.substance.specificHeatCapacity;
  }

  /**
   * @param {number} dt - time, in seconds
   * @public
   */
  step( dt ) {

    // Calculate the amount of energy that this layer will radiate at its current temperature using the Stefan-Boltzmann
    // equation.  This calculation doesn't allow the energy to radiate if it is below the initial temperature, which is
    // not real physics, but is needed for the desired behavior of the sim.
    let radiatedEnergy = 0;
    if ( this.temperatureProperty.value > STARTING_TEMPERATURE ) {
      radiatedEnergy = Math.pow( this.temperatureProperty.value, 4 ) * STEFAN_BOLTZMANN_CONSTANT * SURFACE_AREA * dt;
    }

    // Update the energy rate trackers.
    this.incomingDownwardMovingEnergyRateTracker.logEnergy( this.incomingDownwardMovingEnergyProperty.value, dt );
    this.incomingUpwardMovingEnergyRateTracker.logEnergy( this.incomingUpwardMovingEnergyProperty.value, dt );

    // Determine the amount of energy that is absorbed and passed through in each direction.
    const absorptionProportion = this.energyAbsorptionProportionProperty.value;
    let absorbedEnergy = 0;
    let energyPassingThroughTopToBottom = 0;
    let energyPassingThroughBottomToTop = 0;
    absorbedEnergy += this.incomingDownwardMovingEnergyProperty.value * absorptionProportion;
    energyPassingThroughTopToBottom += this.incomingDownwardMovingEnergyProperty.value * ( 1 - absorptionProportion );
    this.incomingDownwardMovingEnergyProperty.reset();
    absorbedEnergy += this.incomingUpwardMovingEnergyProperty.value * absorptionProportion;
    energyPassingThroughBottomToTop += this.incomingUpwardMovingEnergyProperty.value * ( 1 - absorptionProportion );
    this.incomingUpwardMovingEnergyProperty.reset();

    // Calculate the temperature change that would occur due to the incoming energy using the specific heat formula.
    const temperatureChangeDueToIncomingEnergy = absorbedEnergy / ( this.mass * this.specificHeatCapacity );

    // Calculate the temperature change that would occur due to the radiated energy.
    const temperatureChangeDueToRadiatedEnergy = -radiatedEnergy / ( this.mass * this.specificHeatCapacity );

    // Calculate the new temperature using the previous temperature and the changes due to energy absorption and
    // emission.
    this.temperatureProperty.set( this.temperatureProperty.value +
                                  temperatureChangeDueToIncomingEnergy +
                                  temperatureChangeDueToRadiatedEnergy );

    // Send out the radiated energy.
    if ( this.substance.radiationDirections.includes( EnergyDirection.DOWN ) ) {
      this.outputEnergy( EnergyDirection.DOWN, radiatedEnergy + energyPassingThroughTopToBottom );
    }
    if ( this.substance.radiationDirections.includes( EnergyDirection.UP ) ) {
      this.outputEnergy( EnergyDirection.UP, radiatedEnergy + energyPassingThroughBottomToTop );
    }
  }

  /**
   * @public
   */
  reset() {
    this.temperatureProperty.reset();
    this.incomingDownwardMovingEnergyRateTracker.reset();
    this.incomingUpwardMovingEnergyRateTracker.reset();
  }
}

// statics
EnergyAbsorbingEmittingLayer.WIDTH = SURFACE_DIMENSIONS.width;
EnergyAbsorbingEmittingLayer.SURFACE_AREA = SURFACE_AREA;
EnergyAbsorbingEmittingLayer.Substance = Substance;

greenhouseEffect.register( 'EnergyAbsorbingEmittingLayer', EnergyAbsorbingEmittingLayer );
export default EnergyAbsorbingEmittingLayer;
