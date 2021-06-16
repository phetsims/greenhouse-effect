// Copyright 2021, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that causes a molecule to enter an exited state after absorbing a photon, and then re-emit
 * the photon after some length of time.  The "excited state" is depicted in the view as a glow that surrounds the
 * molecule.
 *
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

class ExcitationStrategy extends PhotonHoldStrategy {

  /**
   * Constructor for the excitation strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   */
  constructor( molecule ) {

    // Supertype constructor
    super( molecule );
  }

  /**
   * @protected
   */
  photonAbsorbed() {
    this.molecule.highElectronicEnergyStateProperty.set( true );
  }

  /**
   * @protected
   */
  reemitPhoton() {
    super.reemitPhoton();
    this.molecule.highElectronicEnergyStateProperty.set( false );
  }
}

greenhouseEffect.register( 'ExcitationStrategy', ExcitationStrategy );

export default ExcitationStrategy;