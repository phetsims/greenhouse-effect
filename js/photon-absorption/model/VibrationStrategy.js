// Copyright 2014-2020, University of Colorado Boulder

/**
 * Photon absorption strategy that causes a molecule to vibrate after absorbing a photon, and re-emit the photon after
 * some length of time. This is to be inherited by the general PhotonAbsorptionStrategy class.
 *
 * @author Jesse Greenberg
 */

import inherit from '../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

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

export default inherit( PhotonHoldStrategy, VibrationStrategy, {

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