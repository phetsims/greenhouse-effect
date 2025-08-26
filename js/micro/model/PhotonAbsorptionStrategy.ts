// Copyright 2021-2025, University of Colorado Boulder

/**
 * This is common code which will be used to define the photon absorption strategy for molecules in simulations like
 * "Greenhouse Gas" and "Molecules and Light".  This is the base model for the strategies that define how a molecule
 * reacts to a given photon.  It is responsible for the following:
 * - Whether a given photon should be absorbed.
 * - How the molecule reacts to the absorption, i.e. whether it vibrates, rotates, breaks apart, etc.
 * - Maintenance of any counters or timers associated with the reaction to the absorption, such as those related to
 *    re-emission of an absorbed photon.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import MicroPhoton from './MicroPhoton.js';
import Molecule from './Molecule.js';

// photon hold time range, chosen so that there are generally no other photons over the molecule when re-emission occurs
const MIN_PHOTON_HOLD_TIME = 1.1; // seconds
const MAX_PHOTON_HOLD_TIME = 1.3; // seconds

class PhotonAbsorptionStrategy {

  // Property that contains the probability that a given photon will be absorbed.
  private readonly photonAbsorptionProbabilityProperty: TProperty<number>;

  protected readonly molecule: Molecule;

  // variables involved in the holding and re-emitting of photons
  protected isPhotonAbsorbed: boolean;
  protected photonHoldCountdownTime: number; // seconds

  /**
   * Constructor for photon absorption strategy.
   *
   * @param molecule - The molecule which will use this strategy.
   */
  public constructor( molecule: Molecule ) {
    this.photonAbsorptionProbabilityProperty = new Property( 0.5 );
    this.molecule = molecule;
    this.isPhotonAbsorbed = false;
    this.photonHoldCountdownTime = 0;
  }


  /**
   * Reset the strategy.
   */
  public reset(): void {
    this.isPhotonAbsorbed = false;
    this.photonHoldCountdownTime = 0;
  }

  /**
   * Decide whether the provided photon should be absorbed.  By design, a given photon should only be requested once,
   * not multiple times.
   *
   * @returns boolean absorbed
   */
  public queryAndAbsorbPhoton( photon: MicroPhoton ): boolean {

    // All circumstances are correct for photon absorption, so now we decide probabilistically whether or not to
    // actually do it.  This essentially simulates the quantum nature of the absorption.
    const absorbed = ( !this.isPhotonAbsorbed ) && ( dotRandom.nextDouble() < this.photonAbsorptionProbabilityProperty.get() );
    if ( absorbed ) {
      this.isPhotonAbsorbed = true;
      this.photonHoldCountdownTime = MIN_PHOTON_HOLD_TIME +
                                     dotRandom.nextDouble() * ( MAX_PHOTON_HOLD_TIME - MIN_PHOTON_HOLD_TIME );
    }
    return absorbed;
  }

  public step(): void {
    throw new Error( 'step should be implemented in descendant photon absorption strategies.' );
  }
}

greenhouseEffect.register( 'PhotonAbsorptionStrategy', PhotonAbsorptionStrategy );

export default PhotonAbsorptionStrategy;