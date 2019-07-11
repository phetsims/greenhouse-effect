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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Photon} photon
   * @param {string} phetioID
   * @constructor
   */
  function PhotonIO( photon, phetioID ) {
    ObjectIO.call( this, photon, phetioID );
  }

  phetioInherit( ObjectIO, 'PhotonIO', PhotonIO, {}, {
    documentation: 'A Photon',
    validator: { isValidValue: v => v instanceof phet.moleculesAndLight.Photon },

    toStateObject: function( photon ) {
      validate( photon, this.validator );
      return {
        vx: NumberIO.toStateObject( photon.vx ),
        vy: NumberIO.toStateObject( photon.vy ),
        wavelength: NumberIO.toStateObject( photon.wavelength )
      };
    },
    fromStateObject: function( stateObject ) {
      return {
        vx: NumberIO.fromStateObject( stateObject.vx ),
        vy: NumberIO.fromStateObject( stateObject.vy ),
        wavelength: NumberIO.fromStateObject( stateObject.wavelength )
      };
    }
  } );

  moleculesAndLight.register( 'PhotonIO', PhotonIO );

  return PhotonIO;
} );

