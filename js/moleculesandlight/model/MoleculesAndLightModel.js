// Copyright 2020, University of Colorado Boulder

/**
 * The model for MoleculesAndLight.
 *
 * @author Jesse Greenberg
 */

import MoleculesAndLightQueryParameters from '../../common/MoleculesAndLightQueryParameters.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonAbsorptionModel from '../../photon-absorption/model/PhotonAbsorptionModel.js';
import PhotonTarget from '../../photon-absorption/model/PhotonTarget.js';

/**
 * @public
 */
class MoleculesAndLightModel extends PhotonAbsorptionModel {
  constructor( tandem ) {

    const initialTarget = MoleculesAndLightQueryParameters.openSciEd ? PhotonTarget.SINGLE_N2_MOLECULE : PhotonTarget.SINGLE_CO_MOLECULE;
    super( initialTarget, tandem );

    // Clear all photons to avoid cases where photons of the previous wavelength
    // could be absorbed after new wavelength was selected. Some users interpreted
    // absorption of the previous wavelength as absorption of the selected wavelength
    this.photonWavelengthProperty.lazyLink( () => {
      this.resetPhotons();

      // after clearing, next photon should be emitted right away
      if ( this.photonEmitterOnProperty.get() ) {
        this.setEmissionTimerToInitialCountdown();
      }
    } );
  }
}

moleculesAndLight.register( 'MoleculesAndLightModel', MoleculesAndLightModel );
export default MoleculesAndLightModel;