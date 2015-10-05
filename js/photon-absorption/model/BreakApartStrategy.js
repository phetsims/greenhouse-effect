// Copyright 2002-2015, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to break apart after absorbing a photon.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionStrategy' );
  var NullPhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/NullPhotonAbsorptionStrategy' );

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

  return inherit( PhotonAbsorptionStrategy, BreakApartStrategy, {

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
} );