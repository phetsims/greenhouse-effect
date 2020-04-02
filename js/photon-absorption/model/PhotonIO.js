// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Photon
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';

class PhotonIO extends ObjectIO {

  /**
   * @override
   * @param {Photon} photon
   * @returns {Object}
   */
  static toStateObject( photon ) {
    validate( photon, this.validator );
    return {
      vx: NumberIO.toStateObject( photon.vx ),
      vy: NumberIO.toStateObject( photon.vy ),
      wavelength: NumberIO.toStateObject( photon.wavelength ),
      phetioID: photon.tandem.phetioID
    };
  }

  /**
   * This is sometimes data-type and sometimes reference-type serialization, if the photon has already be created,
   * then use it.
   * @override
   * @param {Object} stateObject
   * @returns {Photon}
   */
  static fromStateObject( stateObject ) {
    let photon;
    if ( phet.phetio.phetioEngine.hasPhetioObject( stateObject.phetioID ) ) {
      photon = phet.phetio.phetioEngine.getPhetioObject( stateObject.phetioID );
    }
    else {
      photon = new phet.moleculesAndLight.Photon( NumberIO.fromStateObject( stateObject.wavelength ),
        Tandem.createFromPhetioID( stateObject.phetioID ) );
    }

    validate( photon, this.validator );
    photon.wavelength = NumberIO.fromStateObject( stateObject.wavelength );
    photon.setVelocity( NumberIO.fromStateObject( stateObject.vx ), NumberIO.fromStateObject( stateObject.vy ) );

    return photon;
  }
}

PhotonIO.documentation = 'A Photon';
PhotonIO.validator = { isValidValue: v => v instanceof phet.moleculesAndLight.Photon };
PhotonIO.typeName = 'PhotonIO';
ObjectIO.validateSubtype( PhotonIO );

moleculesAndLight.register( 'PhotonIO', PhotonIO );
export default PhotonIO;