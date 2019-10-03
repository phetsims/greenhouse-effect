// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Photon
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const Tandem = require( 'TANDEM/Tandem' );
  const validate = require( 'AXON/validate' );

  // ifphetio
  const phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

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
      if ( phetioEngine.hasPhetioObject( stateObject.phetioID ) ) {
        photon = phetioEngine.getPhetioObject( stateObject.phetioID );
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

  return moleculesAndLight.register( 'PhotonIO', PhotonIO );
} );

