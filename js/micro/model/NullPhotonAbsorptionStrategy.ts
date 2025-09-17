// Copyright 2021-2025, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that does nothing, meaning that it will never cause a photon to be absorbed.
 *
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import MicroPhoton from './MicroPhoton.js';
import Molecule from './Molecule.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

class NullPhotonAbsorptionStrategy extends PhotonAbsorptionStrategy {

  /**
   * Constructor for the null absorption strategy.  This strategy does nothing.
   */
  public constructor( molecule: Molecule ) {

    // Supertype constructor
    super( molecule );

  }

  /**
   * Step method for the null absorption strategy. This does nothing.
   *
   * @param dt - The incremental time step.
   */
  public override step( dt: number ): void {
    // Does nothing.
  }

  /**
   * This strategy never absorbs.
   *
   * @param photon - The photon being queried for absorption.
   */
  public override queryAndAbsorbPhoton( photon: MicroPhoton ): boolean {
    return false;
  }
}

greenhouseEffect.register( 'NullPhotonAbsorptionStrategy', NullPhotonAbsorptionStrategy );

export default NullPhotonAbsorptionStrategy;