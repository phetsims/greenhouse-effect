// Copyright 2014-2019, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to enter an exited state after absorbing a photon, and then re-emit
 * the photon after some length of time.  The "excited state" is depicted in the view as a glow that surrounds the
 * molecule.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

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

moleculesAndLight.register( 'ExcitationStrategy', ExcitationStrategy );

export default inherit( PhotonHoldStrategy, ExcitationStrategy, {

  photonAbsorbed: function() {
    this.molecule.highElectronicEnergyStateProperty.set( true );
  },

  reemitPhoton: function() {
    PhotonHoldStrategy.prototype.reemitPhoton.call( this );
    this.molecule.highElectronicEnergyStateProperty.set( false );
  }
} );