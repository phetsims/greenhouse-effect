// Copyright 2014-2020, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to break apart after absorbing a photon.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import NullPhotonAbsorptionStrategy from './NullPhotonAbsorptionStrategy.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

/**
 * Constructor for the break apart strategy.
 *
 * @param {Molecule} molecule - The molecule which will use this strategy.
 * @constructor
 */
function BreakApartStrategy( molecule ) {

  // Supertype constructor
  PhotonAbsorptionStrategy.call( this, molecule );

}

moleculesAndLight.register( 'BreakApartStrategy', BreakApartStrategy );

export default inherit( PhotonAbsorptionStrategy, BreakApartStrategy, {

  /**
   * The step method for the break apart strategy.  This function instructs the molecule to break apart and then reset
   * the photon absorption strategy.
   *
   */
  step: function() {
    // Basically, all this strategy does is to instruct the molecule to break apart, then reset the strategy.
    this.molecule.breakApart();
    this.molecule.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this.molecule );
  }

} );