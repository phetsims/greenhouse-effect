// Copyright 2014-2015, University of Colorado Boulder

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
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculesAndLightScreen( tandem ) {
    Screen.call( this,
      function() { return new PhotonAbsorptionModel( PhotonTarget.SINGLE_CO_MOLECULE, tandem.createTandem( 'model' ) ); },
      function( model ) { return new MoleculesAndLightScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColorProperty: new Property( Color.toColor( '#C5D6E8' ) ),
        tandem: tandem
      }
    );
  }

  moleculesAndLight.register( 'MoleculesAndLightScreen', MoleculesAndLightScreen );

  return inherit( Screen, MoleculesAndLightScreen );
} );