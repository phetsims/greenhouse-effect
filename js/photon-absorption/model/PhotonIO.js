// Copyright 2017-2018, University of Colorado Boulder

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

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Photon} photon
   * @param {string} phetioID
   * @constructor
   */
  function PhotonIO( photon, phetioID ) {
    assert && assertInstanceOf( photon, phet.moleculesAndLight.Photon );
    ObjectIO.call( this, photon, phetioID );
  }

  phetioInherit( ObjectIO, 'PhotonIO', PhotonIO, {}, {
    documentation: 'A Photon',

    toStateObject: function( photon ) {
      assert && assertInstanceOf( photon, phet.moleculesAndLight.Photon );
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

