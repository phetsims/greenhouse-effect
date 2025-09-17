// Copyright 2021-2025, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that defines behavior for a molecule holding on to a photon.  The molecule will hold the
 * photon and then after some amount of time re-emit it. This is to be inherited by the general PhotonAbsorptionStrategy
 * class.
 *
 * @author Jesse Greenberg
 **/


import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import MicroPhoton from './MicroPhoton.js';
import Molecule from './Molecule.js';
import NullPhotonAbsorptionStrategy from './NullPhotonAbsorptionStrategy.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

class PhotonHoldStrategy extends PhotonAbsorptionStrategy {

  // Wavelength of a photon to hold - null until the strategy absorbs a photon.
  private absorbedWavelength: number | null = null;

  /**
   * Constructor for the photon hold strategy.
   *
   * @param molecule - The molecule which will use this strategy.
   */
  public constructor( molecule: Molecule ) {

    // Supertype constructor
    super( molecule );
  }

  /**
   * The time step function for the photon holding strategy. Holds on to the photon until the countdown time is zero
   * and then re-emits the photon.
   *
   * @param dt - The incremental time step.
   */
  public override step( dt: number ): void {

    this.photonHoldCountdownTime -= dt;
    if ( this.photonHoldCountdownTime <= 0 ) {
      this.reemitPhoton();
    }
  }

  /**
   * Re-emit the absorbed photon and set the molecules absorption strategy to a Null strategy.
   **/
  protected reemitPhoton(): void {
    affirm( this.absorbedWavelength !== null, 'Error: reemitPhoton should only be called after a photon has been absorbed.' );
    this.molecule.emitPhoton( this.absorbedWavelength );
    this.molecule.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this.molecule );
    this.isPhotonAbsorbed = false;

  }

  /**
   * Determine if a particular photon should be absorbed and set this absorbed wavelength to the wavelength of the
   * photon.
   **/
  public override queryAndAbsorbPhoton( photon: MicroPhoton ): boolean {

    const absorbed = super.queryAndAbsorbPhoton( photon );
    if ( absorbed ) {
      this.absorbedWavelength = photon.wavelength;
      this.photonAbsorbed();
    }
    return absorbed;
  }

  /**
   * Should be overridden by descendant strategies that need additional behaviour when a photon is absorbed.
   */
  protected photonAbsorbed(): void {
    console.error( 'Error: photonAbsorbed function should be implemented by descendant absorption strategies.' );
  }
}

greenhouseEffect.register( 'PhotonHoldStrategy', PhotonHoldStrategy );

export default PhotonHoldStrategy;