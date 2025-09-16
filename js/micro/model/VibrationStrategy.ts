// Copyright 2021, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that causes a molecule to vibrate after absorbing a photon, and re-emit the photon after
 * some length of time. This is to be inherited by the general PhotonAbsorptionStrategy class.
 *
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Molecule from './Molecule.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

class VibrationStrategy extends PhotonHoldStrategy {

  /**
   * Constructor for the break apart strategy.
   */
  public constructor( molecule: Molecule ) {

    // Supertype constructor
    super( molecule );

  }

  /**
   * Set this molecule to a vibrating state when a photon is absorbed.
   */
  public override photonAbsorbed(): void {
    this.molecule.vibratingProperty.set( true );
  }

  /**
   * Re-emit the absorbed photon and stop the molecule from vibrating.
   */
  public override reemitPhoton(): void {

    super.reemitPhoton();
    this.molecule.vibratingProperty.set( false );
    this.molecule.setVibration( 0 );
  }
}

greenhouseEffect.register( 'VibrationStrategy', VibrationStrategy );

export default VibrationStrategy;