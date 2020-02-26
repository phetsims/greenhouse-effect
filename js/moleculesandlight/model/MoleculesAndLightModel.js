// Copyright 2020, University of Colorado Boulder

/**
 * The model for MoleculesAndLight.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const PhotonAbsorptionModel = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionModel' );
  const PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );

  /**
   * @public
   */
  class MoleculesAndLightModel extends PhotonAbsorptionModel {
    constructor( tandem ) {
      super( PhotonTarget.SINGLE_CO_MOLECULE, tandem );

      this.photonWavelengthProperty.link( () => {
        this.resetMoleculesAndPhotons();
      } );
    }
  }

  return moleculesAndLight.register( 'MoleculesAndLightModel', MoleculesAndLightModel );
} );
