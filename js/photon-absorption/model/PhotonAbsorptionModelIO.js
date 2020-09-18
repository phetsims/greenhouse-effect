// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for PhotonAbsorptionModel
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonIO from './PhotonIO.js';

const PhotonAbsorptionModelIO = new IOType( 'PhotonAbsorptionModelIO', {
  isValidValue: v => v instanceof phet.moleculesAndLight.PhotonAbsorptionModel,

  /**
   * @public
   * @param photonAbsorptionModel
   * // TODO: https://github.com/phetsims/tandem/issues/211 is never called
   */
  clearChildInstances( photonAbsorptionModel ) {
    photonAbsorptionModel.clearPhotons();
    // instance.chargedParticles.clear();
    // instance.electricFieldSensors.clear();
  },

  /**
   * Create a dynamic particle as specified by the phetioID and state.
   * @public
   * @param {Object} photonAbsorptionModel
   * @param {Tandem} tandem
   * @param {Object} stateObject
   * @returns {ChargedParticle}
   */
  addChildElementDeprecated( photonAbsorptionModel, tandem, stateObject ) {
    const value = PhotonIO.fromStateObject( stateObject );

    const photon = new phet.moleculesAndLight.Photon( value.wavelength, tandem );
    photon.setVelocity( stateObject.vx, stateObject.vy );
    photonAbsorptionModel.photons.add( photon );
    return photon;
  }
} );

moleculesAndLight.register( 'PhotonAbsorptionModelIO', PhotonAbsorptionModelIO );
export default PhotonAbsorptionModelIO;