// Copyright 2014-2020, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that causes a molecule to break apart after absorbing a photon.
 *
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import NullPhotonAbsorptionStrategy from './NullPhotonAbsorptionStrategy.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

class BreakApartStrategy extends PhotonAbsorptionStrategy {

  /**
   * Constructor for the break apart strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   */
  constructor( molecule ) {

    // Supertype constructor
    super( molecule );

  }


  /**
   * The step method for the break apart strategy.  This function instructs the molecule to break apart and then reset
   * the photon absorption strategy.
   * @public
   */
  step() {
    // Basically, all this strategy does is to instruct the molecule to break apart, then reset the strategy.
    this.molecule.breakApart();
    this.molecule.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this.molecule );
  }
}

greenhouseEffect.register( 'BreakApartStrategy', BreakApartStrategy );

export default BreakApartStrategy;