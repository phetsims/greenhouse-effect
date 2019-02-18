// Copyright 2014-2019, University of Colorado Boulder

/**
 * Photon targets for a photon absorption model.  The photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );

  // strings
  var controlPanelCarbonDioxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.CarbonDioxide' );
  var controlPanelCarbonMonoxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.CarbonMonoxide' );
  var controlPanelMethaneString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Methane' );
  var controlPanelNitrogenDioxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.NitrogenDioxide' );
  var controlPanelNitrogenString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Nitrogen' );
  var controlPanelOxygenString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Oxygen' );
  var controlPanelOzoneString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Ozone' );
  var controlPanelWaterString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Water' );

  return moleculesAndLight.register( 'PhotonTarget', new Enumeration( [
    'SINGLE_CO_MOLECULE',
    'SINGLE_N2_MOLECULE',
    'SINGLE_O2_MOLECULE',
    'SINGLE_CO2_MOLECULE',
    'SINGLE_CH4_MOLECULE',
    'SINGLE_H2O_MOLECULE',
    'SINGLE_NO2_MOLECULE',
    'SINGLE_O3_MOLECULE'
  ], function( enumeration ) {

    /**
     * maps photon target to translatable string
     * @param {PhotonTarget} photonTarget
     * @returns {string} - the control panel molecule name
     */
    enumeration.getMoleculeName = function( photonTarget ) {
      return photonTarget === enumeration.SINGLE_CO_MOLECULE ? controlPanelCarbonMonoxideString :
             photonTarget === enumeration.SINGLE_N2_MOLECULE ? controlPanelNitrogenString :
             photonTarget === enumeration.SINGLE_O2_MOLECULE ? controlPanelOxygenString :
             photonTarget === enumeration.SINGLE_CO2_MOLECULE ? controlPanelCarbonDioxideString :
             photonTarget === enumeration.SINGLE_NO2_MOLECULE ? controlPanelNitrogenDioxideString :
             photonTarget === enumeration.SINGLE_H2O_MOLECULE ? controlPanelWaterString :
             photonTarget === enumeration.SINGLE_O3_MOLECULE ? controlPanelOzoneString :
             photonTarget === enumeration.SINGLE_CH4_MOLECULE ? controlPanelMethaneString :
             assert && assert( false, 'unknown' );
    };
  } ) );
} );