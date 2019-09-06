// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Photon
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var validate = require( 'AXON/validate' );

  class PhotonIO extends ObjectIO {
    static toStateObject( photon ) {
      validate( photon, this.validator );
      return {
        vx: NumberIO.toStateObject( photon.vx ),
        vy: NumberIO.toStateObject( photon.vy ),
        wavelength: NumberIO.toStateObject( photon.wavelength )
      };
    }

    static fromStateObject( stateObject ) {
      return {
        vx: NumberIO.fromStateObject( stateObject.vx ),
        vy: NumberIO.fromStateObject( stateObject.vy ),
        wavelength: NumberIO.fromStateObject( stateObject.wavelength )
      };
    }
  }

  PhotonIO.documentation = 'A Photon';
  PhotonIO.validator = { isValidValue: v => v instanceof phet.moleculesAndLight.Photon };
  PhotonIO.typeName = 'PhotonIO';
  ObjectIO.validateSubtype( PhotonIO );

  return moleculesAndLight.register( 'PhotonIO', PhotonIO );
} );

