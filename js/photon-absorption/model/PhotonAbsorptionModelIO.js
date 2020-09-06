// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for PhotonAbsorptionModel
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonIO from './PhotonIO.js';

class PhotonAbsorptionModelIO extends ObjectIO {

  /**
   * @public
   * @param photonAbsorptionModel
   */
  static clearChildInstances( photonAbsorptionModel ) {
    validate( photonAbsorptionModel, this.validator );
    photonAbsorptionModel.clearPhotons();
    // instance.chargedParticles.clear();
    // instance.electricFieldSensors.clear();
  }

  /**
   * Create a dynamic particle as specified by the phetioID and state.
   * @public
   * @param {Object} photonAbsorptionModel
   * @param {Tandem} tandem
   * @param {Object} stateObject
   * @returns {ChargedParticle}
   */
  static addChildElementDeprecated( photonAbsorptionModel, tandem, stateObject ) {
    validate( photonAbsorptionModel, this.validator );
    const value = PhotonIO.fromStateObject( stateObject );

    const photon = new phet.moleculesAndLight.Photon( value.wavelength, tandem );
    photon.setVelocity( stateObject.vx, stateObject.vy );
    photonAbsorptionModel.photons.add( photon );
    return photon;
  }
}

PhotonAbsorptionModelIO.documentation = 'The model for Photon Absorption';
PhotonAbsorptionModelIO.validator = { isValidValue: v => v instanceof phet.moleculesAndLight.PhotonAbsorptionModel };
PhotonAbsorptionModelIO.typeName = 'PhotonAbsorptionModelIO';
ObjectIO.validateIOType( PhotonAbsorptionModelIO );

moleculesAndLight.register( 'PhotonAbsorptionModelIO', PhotonAbsorptionModelIO );
export default PhotonAbsorptionModelIO;