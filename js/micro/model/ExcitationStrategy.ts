// Copyright 2021, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that causes a molecule to enter an exited state after absorbing a photon, and then re-emit
 * the photon after some length of time.  The "excited state" is depicted in the view as a glow that surrounds the
 * molecule.
 *
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Molecule from './Molecule.js';
import PhotonHoldStrategy from './PhotonHoldStrategy.js';

class ExcitationStrategy extends PhotonHoldStrategy {

  public constructor( molecule: Molecule ) {
    super( molecule );
  }

  protected override photonAbsorbed(): void {
    this.molecule.highElectronicEnergyStateProperty.set( true );
  }

  protected override reemitPhoton(): void {
    super.reemitPhoton();
    this.molecule.highElectronicEnergyStateProperty.set( false );
  }
}

greenhouseEffect.register( 'ExcitationStrategy', ExcitationStrategy );

export default ExcitationStrategy;