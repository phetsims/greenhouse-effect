// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Photon
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';

const PhotonIO = new IOType( 'PhotonIO', {
  isValidValue: v => v instanceof phet.moleculesAndLight.Photon,
  toStateObject: photon => ( {
    vx: NumberIO.toStateObject( photon.vx ),
    vy: NumberIO.toStateObject( photon.vy ),
    wavelength: NumberIO.toStateObject( photon.wavelength ),
    phetioID: photon.tandem.phetioID
  } ),

  /**
   * This is sometimes data-type and sometimes reference-type serialization, if the photon has already be created,
   * then use it.
   * @public
   * @override
   *
   * @param {Object} stateObject
   * @returns {Photon}
   */
  fromStateObject( stateObject ) {
    let photon;
    if ( phet.phetio.phetioEngine.hasPhetioObject( stateObject.phetioID ) ) {
      photon = phet.phetio.phetioEngine.getPhetioObject( stateObject.phetioID );
    }
    else {
      photon = new phet.moleculesAndLight.Photon( NumberIO.fromStateObject( stateObject.wavelength ),
        Tandem.createFromPhetioID( stateObject.phetioID ) );
    }

    photon.wavelength = NumberIO.fromStateObject( stateObject.wavelength );
    photon.setVelocity( NumberIO.fromStateObject( stateObject.vx ), NumberIO.fromStateObject( stateObject.vy ) );

    return photon;
  }
} );
moleculesAndLight.register( 'PhotonIO', PhotonIO );
export default PhotonIO;