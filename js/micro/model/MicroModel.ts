// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonAbsorptionModel from './PhotonAbsorptionModel.js';
import PhotonTarget from './PhotonTarget.js';

class MicroModel extends PhotonAbsorptionModel {
  public constructor( tandem: Tandem ) {
    super( PhotonTarget.SINGLE_CO_MOLECULE, tandem );
  }
}

greenhouseEffect.register( 'MicroModel', MicroModel );
export default MicroModel;