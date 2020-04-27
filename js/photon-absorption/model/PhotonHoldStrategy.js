// Copyright 2014-2020, University of Colorado Boulder

/**
 * Photon absorption strategy that defines behavior for a molecule holding on to a photon.  The molecule will hold the
 * photon and then after some amount of time re-emit it. This is to be inherited by the general PhotonAbsorptionStrategy
 * class.
 *
 * @author Jesse Greenberg
 **/


import inherit from '../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import NullPhotonAbsorptionStrategy from './NullPhotonAbsorptionStrategy.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

/**
 * Constructor for the photon hold strategy.
 *
 * @param {Molecule} molecule - The molecule which will use this strategy.
 * @constructor
 */
function PhotonHoldStrategy( molecule ) {

  // Supertype constructor
  PhotonAbsorptionStrategy.call( this, molecule );
}

moleculesAndLight.register( 'PhotonHoldStrategy', PhotonHoldStrategy );

export default inherit( PhotonAbsorptionStrategy, PhotonHoldStrategy, {

  /**
   * The time step function for the photon holding strategy. Holds on to the photon until the countdown time is zero
   * and then re-emits the photon.
   *
   * @param {number} dt - The incremental time step.
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

    this.molecule.emitPhoton( this.absorbedWavelength );
    this.molecule.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this.molecule );
    this.isPhotonAbsorbed = false;

  },

  /**
   * Determine if a particular photon should be absorbed and set this absorbed wavelength to the wavelength of the
   * photon.
   *
   * @param {Photon} photon
   * @returns {boolean} absorbed
   **/
  queryAndAbsorbPhoton: function( photon ) {

    const absorbed = PhotonAbsorptionStrategy.prototype.queryAndAbsorbPhoton.call( this, photon );
    if ( absorbed ) {
      this.absorbedWavelength = photon.wavelength;
      this.photonAbsorbed();
    }
    return absorbed;
  },

  photonAbsorbed: function() {
    console.error( 'Error: photonAbsorbed function should be implemented by descendant absorption strategies.' );
  }

} );