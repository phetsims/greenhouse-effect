// Copyright 2021, University of Colorado Boulder

/**
 * EnergyTransferInterface is an object through which model elements can transfer energy.  In this sim - The Greenhouse
 * Effect - this transfer generally takes place between the sun, the ground, and layers of the atmosphere, or layers of
 * glass.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class EnergyTransferInterface {

  constructor() {

    // @public - the amount of energy being output in the downward direction, i.e. towards the Earth
    this.outputEnergyDownProperty = new NumberProperty( 0 );

    // @public - the amount of energy being output in the upward direction, i.e. away from the Earth
    this.outputEnergyUpProperty = new NumberProperty( 0 );
  }

  /**
   * @public
   */
  reset() {
    this.outputEnergyDownProperty.reset();
    this.outputEnergyUpProperty.reset();
  }
}

greenhouseEffect.register( 'EnergyTransferInterface', EnergyTransferInterface );
export default EnergyTransferInterface;
