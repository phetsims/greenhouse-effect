// Copyright 2002-2015, University of Colorado Boulder

/**
 * Photon absorption strategy that does nothing, meaning that it will never cause a photon to be absorbed.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionStrategy' );

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
     * @return {boolean}
     */
    queryAndAbsorbPhoton: function( photon ) {
      return false;
    }
  } );
} );
