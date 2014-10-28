// Copyright 2002-2014, University of Colorado

/**
 * Photon absorption strategy that causes a molecule to enter an exited state after absorbing a photon, and then re-emit
 * the photon after some length of time.  At the time of this writing, and "excited state" is depicted in the view as a
 * glow that surrounds the molecule.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhotonHoldStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonHoldStrategy' );

  /**
   * Constructor for the excitation strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   * @constructor
   */
  function ExcitationStrategy( molecule ) {

    // Supertype constructor
    PhotonHoldStrategy.call( this, molecule );

  }

  return inherit( PhotonHoldStrategy, ExcitationStrategy, {

    photonAbsorbed: function() {
      this.getMolecule().setHighElectronicEnergyState( true );
    },

    reemitPhoton: function() {
      PhotonHoldStrategy.prototype.reemitPhoton.call( this );
      this.getMolecule().setHighElectronicEnergyState( false );
    }
  } );
} );