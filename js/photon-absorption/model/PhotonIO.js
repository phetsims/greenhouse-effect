// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function PhotonIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.moleculesAndLight.Photon );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'PhotonIO', PhotonIO, {}, {
    documentation: 'A Photon',
    fromStateObject: function( stateObject ) {
      return {
        vx: NumberIO.fromStateObject( stateObject.vx ),
        vy: NumberIO.fromStateObject( stateObject.vy ),
        wavelength: NumberIO.fromStateObject( stateObject.wavelength )
      };
    },

    toStateObject: function( value ) {
      return {
        vx: NumberIO.toStateObject( value.vx ),
        vy: NumberIO.toStateObject( value.vy ),
        wavelength: NumberIO.toStateObject( value.wavelength )
      };
    }
  } );

  moleculesAndLight.register( 'PhotonIO', PhotonIO );

  return PhotonIO;
} );

