// Copyright 2021, University of Colorado Boulder

/**
 * EnergySource is a base class for objects that can provide energy to other objects.  Its main purpose is to provide a
 * consistent interface for connecting objects that provide energy to those that consume it.
 *
 * Note that saying something is an "energy source" does not necessarily mean that it produces that energy - it may be
 * getting it from somewhere else and making some sort of conversion or simply passing it on.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import EnergyDirection from './EnergyDirection.js';

class EnergySource {

  constructor() {

    // @private {Array.<Property.<Number>>} - Properties to which energy leaving this energy source in the upward
    // direction a provided.
    this.upwardMovingEnergyConnectionPointProperties = [];

    // @private {Array.<Property.<Number>>} - Properties to which energy leaving this energy source in the downward
    // direction a provided.
    this.downwardMovingEnergyConnectionPointProperties = [];
  }

  /**
   * Connect the output for the specified direction to the provided connection point.
   * @param {EnergyDirection} direction - the direction of the energy output to connect, either up or down
   * @param {Property.<Number>} connectionPointProperty - the place where the sourced energy will be sent
   * @public
   */
  connectOutput( direction, connectionPointProperty ) {

    // parameter checking
    assert && assert(
      direction === EnergyDirection.UP || direction === EnergyDirection.DOWN,
      'unsupported energy direction'
    );

    if ( direction === EnergyDirection.UP ) {
      this.upwardMovingEnergyConnectionPointProperties.push( connectionPointProperty );
    }
    else {
      this.downwardMovingEnergyConnectionPointProperties.push( connectionPointProperty );
    }
  }

  /**
   * @param {number} dt - delta time, in seconds
   * @public
   */
  step( dt ) {

    // In the descendent classes the energy should be sent to the connection points in the step function.
    assert && assert( false, 'step must be implemented in descendant classes' );
  }

  /**
   * The word 'output' is meant as a verb in this method name, and the method outputs the provided energy to any
   * connection points that are registered for the specified direction.  This is intended to be used by descendent
   * classes.
   * @param {EnergyDirection} direction
   * @param {number} energy - amount of energy in joules
   * @protected
   */
  outputEnergy( direction, energy ) {

    // parameter checking
    assert && assert(
      direction === EnergyDirection.UP || direction === EnergyDirection.DOWN,
      'unsupported energy direction'
    );

    // Get the Properties to which the energy will be sent.
    const energyConnectionPointProperties = direction === EnergyDirection.UP ?
                                            this.upwardMovingEnergyConnectionPointProperties :
                                            this.downwardMovingEnergyConnectionPointProperties;

    // Make sure that something is connected to receive this energy.
    assert && assert( energyConnectionPointProperties.length > 0, 'the provided energy has nowhere to go' );

    // Output the energy.
    energyConnectionPointProperties.forEach( energyConnectionPointProperty => {
      energyConnectionPointProperty.value += energy;
    } );
  }
}

greenhouseEffect.register( 'EnergySource', EnergySource );
export default EnergySource;
