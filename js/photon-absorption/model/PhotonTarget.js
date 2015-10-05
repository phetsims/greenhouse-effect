// Copyright 2002-2015, University of Colorado Boulder

/**
 * Photon targets for a photon absorption model.  The photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var PhotonTarget = {
    SINGLE_CO_MOLECULE: 'SINGLE_CO_MOLECULE',
    SINGLE_N2_MOLECULE: 'SINGLE_N2_MOLECULE',
    SINGLE_O2_MOLECULE: 'SINGLE_O2_MOLECULE',
    SINGLE_CO2_MOLECULE: 'SINGLE_CO2_MOLECULE',
    SINGLE_H2O_MOLECULE: 'SINGLE_H2O_MOLECULE',
    SINGLE_NO2_MOLECULE: 'SINGLE_NO2_MOLECULE',
    SINGLE_O3_MOLECULE: 'SINGLE_O3_MOLECULE'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( PhotonTarget ); }

  return PhotonTarget;
} );