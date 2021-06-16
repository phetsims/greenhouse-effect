// Copyright 2021, University of Colorado Boulder

/**
 * MicroPhoton absorption strategy that defines behavior for a molecule holding on to a photon.  The molecule will hold the
 * photon and then after some amount of time re-emit it. This is to be inherited by the general PhotonAbsorptionStrategy
 * class.
 *
 * @author Jesse Greenberg
 **/


import greenhouseEffect from '../../greenhouseEffect.js';
import NullPhotonAbsorptionStrategy from './NullPhotonAbsorptionStrategy.js';
import PhotonAbsorptionStrategy from './PhotonAbsorptionStrategy.js';

class PhotonHoldStrategy extends PhotonAbsorptionStrategy {

  /**
   * Constructor for the photon hold strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   */
  constructor( molecule ) {

    // Supertype constructor
    super( molecule );
  }

  /**
   * The time step function for the photon holding strategy. Holds on to the photon until the countdown time is zero
   * and then re-emits the photon.
   * @public
   *
   * @param {number} dt - The incremental time step.
   */
  step( dt ) {

    this.photonHoldCountdownTime -= dt;
    if ( this.photonHoldCountdownTime <= 0 ) {
      this.reemitPhoton();
    }
  }

  /**
   * Re-emit the absorbed photon and set the molecules absorption strategy to a Null strategy.
   * @public
   **/
  reemitPhoton() {

    this.molecule.emitPhoton( this.absorbedWavelength );
    this.molecule.activePhotonAbsorptionStrategy = new NullPhotonAbsorptionStrategy( this.molecule );
    this.isPhotonAbsorbed = false;

  }

  /**
   * Determine if a particular photon should be absorbed and set this absorbed wavelength to the wavelength of the
   * photon.
   * @public
   *
   * @param {Photon} photon
   * @returns {boolean} absorbed
   **/
  queryAndAbsorbPhoton( photon ) {

    const absorbed = super.queryAndAbsorbPhoton( photon );
    if ( absorbed ) {
      this.absorbedWavelength = photon.wavelength;
      this.photonAbsorbed();
    }
    return absorbed;
  }

  /**
   * @public
   * @abstract
   */
  photonAbsorbed() {
    console.error( 'Error: photonAbsorbed function should be implemented by descendant absorption strategies.' );
  }
}

greenhouseEffect.register( 'PhotonHoldStrategy', PhotonHoldStrategy );

export default PhotonHoldStrategy;