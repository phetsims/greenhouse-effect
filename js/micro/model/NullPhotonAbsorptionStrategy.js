// Copyright 2014-2020, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that does nothing, meaning that it will never cause a photon to be absorbed.
 *
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

class NullPhotonAbsorptionStrategy extends PhotonAbsorptionStrategy {

  /**
   * Constructor for the null absorption strategy.  This strategy does nothing.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   */
  constructor( molecule ) {

    // Supertype constructor
    super( molecule );

  }

  /**
   * Step method for the null absorption strategy.  This does nothing.
   * @public
   *
   * @param {number} dt - The incremental time step.
   */
  step( dt ) {
    // Does nothing.
  }

  /**
   * This strategy never absorbs.
   * @public
   *
   * @param {MicroPhoton} photon - The photon being queried for absorption.
   * @returns {boolean}
   */
  queryAndAbsorbPhoton( photon ) {
    return false;
  }
}

greenhouseEffect.register( 'NullPhotonAbsorptionStrategy', NullPhotonAbsorptionStrategy );

export default NullPhotonAbsorptionStrategy;