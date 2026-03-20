// Copyright 2020-2026, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonAbsorptionModel from './PhotonAbsorptionModel.js';
import PhotonTarget from './PhotonTarget.js';

class MicroModel extends PhotonAbsorptionModel {
  public constructor( tandem: Tandem ) {
    super( PhotonTarget.SINGLE_CO_MOLECULE, tandem );
  }
}

export default MicroModel;
