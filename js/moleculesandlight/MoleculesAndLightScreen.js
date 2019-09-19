// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Molecules and Light' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightScreenView = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/MoleculesAndLightScreenView' );
  const PhotonAbsorptionModel = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionModel' );
  const PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculesAndLightScreen( tandem ) {
    Screen.call( this,
      function() { return new PhotonAbsorptionModel( PhotonTarget.SINGLE_CO_MOLECULE, tandem.createTandem( 'model' ) ); },
      function( model ) { return new MoleculesAndLightScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColorProperty: new Property( '#C5D6E8' ),
        tandem: tandem
      }
    );
  }

  moleculesAndLight.register( 'MoleculesAndLightScreen', MoleculesAndLightScreen );

  return inherit( Screen, MoleculesAndLightScreen );
} );
