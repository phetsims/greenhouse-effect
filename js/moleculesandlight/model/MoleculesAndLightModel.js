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

      // Clear all photons to avoid cases where photons of the previous wavelength
      // could be absorbed after new wavelength was selected. Some users interpreted
      // absorption of the previous wavelength as absorption of the selected wavelength
      this.photonWavelengthProperty.link( () => {
        this.resetPhotons();
      } );
    }
  }

  return moleculesAndLight.register( 'MoleculesAndLightModel', MoleculesAndLightModel );
} );
