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
import EnergyTransferInterface from './EnergyTransferInterface.js';

// constants
const STARTING_TEMPERATURE = 245; // in degrees Kelvin

// enum for the direction in which a layer can radiate energy
const LayerRadiationDirection = Enumeration.byKeys( [ 'DOWN_ONLY', 'UP_ONLY', 'UP_AND_DOWN' ] );

// The various substances that this layer can model.  Density is in kg/m^3, specific heat capacity is in J/kg°K
const Substance = Enumeration.byMap( {
  GLASS: { density: 2500, specificHeatCapacity: 840, radiationDirection: LayerRadiationDirection.UP_AND_DOWN },
  EARTH: { density: 1250, specificHeatCapacity: 1250, radiationDirection: LayerRadiationDirection.UP_ONLY }
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

class EnergyAbsorbingEmittingLayer {

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

    // @public (read-only) - altitude in meters where this layer resides
    this.altitude = altitude;

    // @public (read-only) - The temperature of this layer in degrees Kelvin.  We model it at absolute zero by default
    // so that it isn't radiating anything, and produce a compensated temperature that produces values more reasonable
    // to the surface of the Earth and its atmosphere.
    this.temperatureProperty = new NumberProperty( STARTING_TEMPERATURE );

    // @public - The proportion of energy coming into this layer that is absorbed and thus contributes to an increase
    // in temperature.  Non-absorbed energy is simply based from the input to the output.
    this.energyAbsorptionProportionProperty = new NumberProperty( options.initialEnergyAbsorptionProportion );

    // @public - The energy that is coming out of this layer in this step.  Other layers will use the values contained
    // in this object as their input energy.
    this.energyOutput = new EnergyTransferInterface();

    // @private {NumberProperty[]} - A set of zero or more Properties that contain numerical values representing energy
    // that is coming in to this layer in the downward direction in the current step.  This layer will absorb some or
    // all of the energy and will transfer what it doesn't absorb to its own downward output.
    this.sourcesOfDownwardMovingEnergy = [];

    // @private {NumberProperty[]} - A set of zero or more Properties that contain numerical values representing energy
    // that is coming in to this layer in the upward direction in the current step.  This layer will absorb some or all
    // of the energy and will transfer what it doesn't absorb to its own upward output.
    this.sourcesOfUpwardMovingEnergy = [];

    // @private
    this.substance = options.substance;
    this.mass = VOLUME * options.substance.density;
    this.specificHeatCapacity = options.substance.specificHeatCapacity;
  }

  /**
   * Add a source of energy that is coming in from below and moving in the upward direction.
   * @param {EnergyTransferInterface} energyTransferObject
   * @public
   */
  addSourceOfUpwardMovingEnergy( energyTransferObject ) {
    this.sourcesOfUpwardMovingEnergy.push( energyTransferObject.outputEnergyUpProperty );
  }

  /**
   * Add a source of energy that is coming in from above and moving in the downward direction.
   * @param {EnergyTransferInterface} energyTransferObject
   * @public
   */
  addSourceOfDownwardMovingEnergy( energyTransferObject ) {
    this.sourcesOfDownwardMovingEnergy.push( energyTransferObject.outputEnergyDownProperty );
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

    // Determine the amount of energy that is absorbed and passed through in each direction, and clear the sources.
    const absorptionProportion = this.energyAbsorptionProportionProperty.value;
    let absorbedEnergy = 0;
    let energyPassingThroughTopToBottom = 0;
    let energyPassingThroughBottomToTop = 0;
    this.sourcesOfDownwardMovingEnergy.forEach( energySource => {
      absorbedEnergy += energySource.value * absorptionProportion;
      energyPassingThroughTopToBottom += energySource.value * ( 1 - absorptionProportion );
      energySource.set( 0 );
    } );
    this.sourcesOfUpwardMovingEnergy.forEach( energySource => {
      absorbedEnergy += energySource.value * absorptionProportion;
      energyPassingThroughBottomToTop += energySource.value * ( 1 - absorptionProportion );
      energySource.set( 0 );
    } );

    if ( phet.jbDebug ) {
      console.log( `${this.jbId} absorbedEnergy = ${absorbedEnergy}` );
    }

    // Calculate the temperature change that would occur due to the incoming energy using the specific heat formula.
    const temperatureChangeDueToIncomingEnergy = absorbedEnergy / ( this.mass * this.specificHeatCapacity );

    // Calculate the temperature change that would occur due to the radiated energy.
    const temperatureChangeDueToRadiatedEnergy = -radiatedEnergy / ( this.mass * this.specificHeatCapacity );

    // Calculate the new temperature using the previous temperature and the changes due to energy absorption and
    // emission.
    this.temperatureProperty.set( this.temperatureProperty.value +
                                  temperatureChangeDueToIncomingEnergy +
                                  temperatureChangeDueToRadiatedEnergy );

    // Assign the radiated energy to the outputs based on the direction in which this layer is set to radiate.
    if ( this.substance.radiationDirection === LayerRadiationDirection.UP_ONLY ) {
      this.energyOutput.outputEnergyUpProperty.value += radiatedEnergy;
    }
    else if ( this.substance.radiationDirection === LayerRadiationDirection.DOWN_ONLY ) {
      this.energyOutput.outputEnergyDownProperty.value += radiatedEnergy;
    }
    else {

      // Split the radiated energy into the up and down directions.
      this.energyOutput.outputEnergyUpProperty.value += radiatedEnergy / 2;
      this.energyOutput.outputEnergyDownProperty.value += radiatedEnergy / 2;
    }

    // Add any energy that is just passing through to the output energy for this step.
    this.energyOutput.outputEnergyUpProperty.value += energyPassingThroughBottomToTop;
    this.energyOutput.outputEnergyDownProperty.value += energyPassingThroughTopToBottom;
  }

  /**
   * @public
   */
  reset() {
    this.temperatureProperty.reset();
  }
}

// statics
EnergyAbsorbingEmittingLayer.WIDTH = SURFACE_DIMENSIONS.width;
EnergyAbsorbingEmittingLayer.SURFACE_AREA = SURFACE_AREA;
EnergyAbsorbingEmittingLayer.Substance = Substance;

greenhouseEffect.register( 'EnergyAbsorbingEmittingLayer', EnergyAbsorbingEmittingLayer );
export default EnergyAbsorbingEmittingLayer;
