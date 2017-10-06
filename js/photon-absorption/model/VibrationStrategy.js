// Copyright 2014-2017, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to vibrate after absorbing a photon, and re-emit the photon after
 * some length of time. This is to be inherited by the general PhotonAbsorptionStrategy class.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var PhotonHoldStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonHoldStrategy' );

  /**
   * Constructor for the break apart strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   * @constructor
   */
  function VibrationStrategy( molecule ) {

    // Supertype constructor
    PhotonHoldStrategy.call( this, molecule );

  }

  moleculesAndLight.register( 'VibrationStrategy', VibrationStrategy );

  return inherit( PhotonHoldStrategy, VibrationStrategy, {

    /**
     * Set this molecule to a vibrating state when a photon is absorbed.
     */
    photonAbsorbed: function() {
      this.molecule.vibratingProperty.set( true );
    },

    /**
     * Re-emit the absorbed photon and stop the molecule from vibrating.
     */
    reemitPhoton: function() {

      PhotonHoldStrategy.prototype.reemitPhoton.call( this );
      this.molecule.vibratingProperty.set( false );
      this.molecule.setVibration( 0 );
    }

  } );
} );
