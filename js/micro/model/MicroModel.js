// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonAbsorptionModel from './PhotonAbsorptionModel.js';
import PhotonTarget from './PhotonTarget.js';

/**
 * @constructor
 */
class MicroModel extends PhotonAbsorptionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( PhotonTarget.SINGLE_CO_MOLECULE, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

greenhouseEffect.register( 'MicroModel', MicroModel );
export default MicroModel;