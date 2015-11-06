// Copyright 2002-2015, University of Colorado Boulder

/**
 * The 'Molecules and Light' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhotonAbsorptionModel = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionModel' );
  var MoleculesAndLightScreenView = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/MoleculesAndLightScreenView' );
  var PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var moleculesAndLightTitleString = require( 'string!MOLECULES_AND_LIGHT/molecules-and-light.title' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculesAndLightScreen( tandem ) {
    Screen.call( this, moleculesAndLightTitleString, null /* no icon, single-screen sim */,
      function() { return new PhotonAbsorptionModel( PhotonTarget.SINGLE_CO_MOLECULE, tandem ); },
      function( model ) { return new MoleculesAndLightScreenView( model, tandem ); },
      { backgroundColor: '#C5D6E8' }
    );
  }

  return inherit( Screen, MoleculesAndLightScreen );
} );