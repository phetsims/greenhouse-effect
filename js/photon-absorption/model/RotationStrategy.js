// Copyright 2014-2020, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to rotate after absorbing a photon, and re-emit the photon after
 * some length of time.  This is to be inherited by the general PhotonAbsorptionStrategy class.
 */

import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

// random boolean generator
const RAND = {
  nextBoolean: () => phet.joist.random.nextDouble() < 0.50
};

class RotationStrategy extends PhotonHoldStrategy {

  /**
   * Constructor for a rotation strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   */
  constructor( molecule ) {

    // Supertype constructor
    super( molecule );
  }


  /**
   * Handle when a photon is absorbed.  Set the molecule to a rotating state
   * and set the direction of rotation to a random direction.
   * @public
   */
  photonAbsorbed() {
    this.molecule.rotationDirectionClockwiseProperty.set( RAND.nextBoolean() );
    this.molecule.rotatingProperty.set( true );
  }

  /**
   * Re-emit the absorbed photon.  Set the molecule to a non-rotating state.
   * @protected
   */
  reemitPhoton() {
    super.reemitPhoton();
    this.molecule.rotatingProperty.set( false );
  }
}

moleculesAndLight.register( 'RotationStrategy', RotationStrategy );

export default RotationStrategy;