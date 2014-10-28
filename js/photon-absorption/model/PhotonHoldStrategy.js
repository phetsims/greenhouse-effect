// Copyright 2002-2014, University of Colorado

/**
 * Photon absorption strategy that defines behavior for a molecule holding on to a photon.  The molecule will hold the
 * photon and then after some amount of time re-emit it. This is to be inherited by the general PhotonAbsorptionStrategy class.
 *
 * @author Jesse Greenberg
 **/

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionStrategy' );
  var NullPhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/NullPhotonAbsorptionStrategy' );

  /**
   * Constructor for the photon hold strategy.
   *
   * @param { Molecule } molecule - The molecule which will use this strategy.
   * @constructor
   */
  function PhotonHoldStrategy( molecule ) {

    // Supertype constructor
    PhotonAbsorptionStrategy.call( this, molecule );

  }

  return inherit( PhotonAbsorptionStrategy, PhotonHoldStrategy, {

    /**
     * The time step function for the photon holding strategy. Holds on to the photon until the countdown time is zero
     * and the re-emits the photon.
     *
     * @param {Number} dt - The incremental time step.
     */
    step: function( dt ) {

      this.photonHoldCountdownTime -= dt;
      if ( this.photonHoldCountdownTime <= 0 ) {
        this.reemitPhoton();
      }
    },

    /**
     * Re-emit the absorbed photon and set the molecules absorption strategy to a Null strategy.
     **/
    reemitPhoton: function() {

      this.getMolecule().emitNewPhoton( this.absorbedWavelength );
      this.getMolecule().setActiveStrategy( new NullPhotonAbsorptionStrategy( this.getMolecule() ) );
      this.isPhotonAbsorbed = false;

    },

    /**
     * Determine if a particular photon should be absorbed and set this absorbed wavelength to the wavelength of the
     * photon.
     *
     * @param {Photon} photon
     * @return {Boolean} absorbed
     **/
    queryAndAbsorbPhoton: function( photon ) {

      var absorbed = PhotonAbsorptionStrategy.prototype.queryAndAbsorbPhoton.call( this, photon );
      if ( absorbed ) {
        this.absorbedWavelength = photon.getWavelength();
        this.photonAbsorbed();
      }
      return absorbed;
    },

    photonAbsorbed: function() {
      console.error( "Error: photonAbsorbed function should be implemented by descendant absorption strategies.");
    }

  } );
} );