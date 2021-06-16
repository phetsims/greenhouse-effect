// Copyright 2020-2021, University of Colorado Boulder

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
}

greenhouseEffect.register( 'MicroModel', MicroModel );
export default MicroModel;