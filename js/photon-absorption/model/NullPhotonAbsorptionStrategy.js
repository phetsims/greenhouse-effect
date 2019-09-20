// Copyright 2014-2019, University of Colorado Boulder

/**
 * Photon absorption strategy that does nothing, meaning that it will never cause a photon to be absorbed.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const PhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionStrategy' );

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

  return inherit( PhotonAbsorptionStrategy, NullPhotonAbsorptionStrategy, {

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
} );
