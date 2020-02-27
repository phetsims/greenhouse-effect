// Copyright 2014-2019, University of Colorado Boulder

/**
 * Photon absorption strategy that does nothing, meaning that it will never cause a photon to be absorbed.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

/**
 * Constructor for the null absorption strategy.  This strategy does nothing.
 *
 * @param {Molecule} molecule - The molecule which will use this strategy.
 * @constructor
 */
function NullPhotonAbsorptionStrategy( molecule ) {

  // Supertype constructor
  PhotonAbsorptionStrategy.call( this, molecule );

}

moleculesAndLight.register( 'NullPhotonAbsorptionStrategy', NullPhotonAbsorptionStrategy );

export default inherit( PhotonAbsorptionStrategy, NullPhotonAbsorptionStrategy, {

  /**
   * Step method for the null absorption strategy.  This does nothing.
   *
   * @param {number} dt - The incremental time step.
   */
  step: function( dt ) {
    // Does nothing.
  },

  /**
   * This strategy never absorbs.
   *
   * @param {Photon} photon - The photon being queried for absorption.
   * @returns {boolean}
   */
  queryAndAbsorbPhoton: function( photon ) {
    return false;
  }
} );