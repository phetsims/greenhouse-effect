// Copyright 2021-2024, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that causes a molecule to rotate after absorbing a photon, and re-emit the photon after
 * some length of time.  This is to be inherited by the general PhotonAbsorptionStrategy class.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Molecule from './Molecule.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

// random boolean generator
const RAND = {
  nextBoolean: (): boolean => dotRandom.nextDouble() < 0.50
};

class RotationStrategy extends PhotonHoldStrategy {

  /**
   * Constructor for a rotation strategy.
   */
  public constructor( molecule: Molecule ) {
    // Supertype constructor
    super( molecule );
  }

  /**
   * Handle when a photon is absorbed.  Set the molecule to a rotating state
   * and set the direction of rotation to a random direction.
   */
  public override photonAbsorbed(): void {
    this.molecule.rotationDirectionClockwiseProperty.set( RAND.nextBoolean() );
    this.molecule.rotatingProperty.set( true );
  }

  /**
   * Re-emit the absorbed photon.  Set the molecule to a non-rotating state.
   */
  protected override reemitPhoton(): void {
    super.reemitPhoton();
    this.molecule.rotatingProperty.set( false );
  }
}

greenhouseEffect.register( 'RotationStrategy', RotationStrategy );

export default RotationStrategy;