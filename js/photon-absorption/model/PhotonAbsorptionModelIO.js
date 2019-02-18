// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for PhotonAbsorptionModel
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var PhotonIO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonIO' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );

  /**
   * Instrumented to help restore charged particles.
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {string} phetioID
   * @constructor
   */
  function PhotonAbsorptionModelIO( photonAbsorptionModel, phetioID ) {
    assert && assertInstanceOf( photonAbsorptionModel, phet.moleculesAndLight.PhotonAbsorptionModel );
    ObjectIO.call( this, photonAbsorptionModel, phetioID );
  }

  phetioInherit( ObjectIO, 'PhotonAbsorptionModelIO', PhotonAbsorptionModelIO, {}, {
      documentation: 'The model for Photon Absorption',
      clearChildInstances: function( photonAbsorptionModel ) {
        assert && assertInstanceOf( photonAbsorptionModel, phet.moleculesAndLight.PhotonAbsorptionModel );
        photonAbsorptionModel.clearPhotons();
        // instance.chargedParticles.clear();
        // instance.electricFieldSensors.clear();
      },

      /**
       * Create a dynamic particle as specified by the phetioID and state.
       * @param {Object} photonAbsorptionModel
       * @param {Tandem} tandem
       * @param {Object} stateObject
       * @returns {ChargedParticle}
       */
      addChildInstance: function( photonAbsorptionModel, tandem, stateObject ) {
        assert && assertInstanceOf( photonAbsorptionModel, phet.moleculesAndLight.PhotonAbsorptionModel );
        var value = PhotonIO.fromStateObject( stateObject );

        var photon = new phet.moleculesAndLight.Photon( value.wavelength, tandem );
        photon.setVelocity( stateObject.vx, stateObject.vy );
        photonAbsorptionModel.photons.add( photon );
      }
    }
  );

  moleculesAndLight.register( 'PhotonAbsorptionModelIO', PhotonAbsorptionModelIO );

  return PhotonAbsorptionModelIO;
} );

