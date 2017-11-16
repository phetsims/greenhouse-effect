// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var PhotonIO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonIO' );

  /**
   * Instrumented to help restore charged particles.
   * @param instance
   * @param phetioID
   * @constructor
   */
  function PhotonAbsorptionModelIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.moleculesAndLight.PhotonAbsorptionModel );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'PhotonAbsorptionModelIO', PhotonAbsorptionModelIO, {}, {
      documentation: 'The model for Photon Absorption',
      clearChildInstances: function( instance ) {
        instance.clearPhotons();
        // instance.chargedParticles.clear();
        // instance.electricFieldSensors.clear();
      },

      /**
       * Create a dynamic particle as specified by the phetioID and state.
       * @param {Object} instance
       * @param {Tandem} tandem
       * @param {Object} stateObject
       * @returns {ChargedParticle}
       */
      addChildInstance: function( instance, tandem, stateObject ) {
        var value = PhotonIO.fromStateObject( stateObject );

        var photon = new phet.moleculesAndLight.Photon( value.wavelength, tandem );
        photon.setVelocity( stateObject.vx, stateObject.vy );
        instance.photons.add( photon );
      }
    }
  );

  moleculesAndLight.register( 'PhotonAbsorptionModelIO', PhotonAbsorptionModelIO );

  return PhotonAbsorptionModelIO;
} );

