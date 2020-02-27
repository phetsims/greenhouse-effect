// Copyright 2014-2019, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to rotate after absorbing a photon, and re-emit the photon after
 * some length of time.  This is to be inherited by the general PhotonAbsorptionStrategy class.
 */

import inherit from '../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

//Random boolean generator.
const RAND = {
  nextBoolean: function() {
    return phet.joist.random.nextDouble() < 0.50;
  }
};

/**
 * Constructor for a rotation strategy.
 *
 * @param {Molecule} molecule - The molecule which will use this strategy.
 * @constructor
 */
function RotationStrategy( molecule ) {

  // Supertype constructor
  PhotonHoldStrategy.call( this, molecule );

}

moleculesAndLight.register( 'RotationStrategy', RotationStrategy );

export default inherit( PhotonHoldStrategy, RotationStrategy, {

  /**
   * Handle when a photon is absorbed.  Set the molecule to a rotating state
   * and set the direction of rotation to a random direction.
   */
  photonAbsorbed: function() {
    this.molecule.rotationDirectionClockwiseProperty.set( RAND.nextBoolean() );
    this.molecule.rotatingProperty.set( true );
  },

  /**
   * Re-emit the absorbed photon.  Set the molecule to a non-rotating state.
   */
  reemitPhoton: function() {
    PhotonHoldStrategy.prototype.reemitPhoton.call( this );
    this.molecule.rotatingProperty.set( false );
  }

} );