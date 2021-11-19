// Copyright 2021, University of Colorado Boulder

/**
 * PhotonAbsorbingEmittingLayer is a model element that is responsible for absorbing and re-emitting individual photons
 * at the altitude where an AtmosphereLayer exists.  It does this based on the absorbance of the atmosphere layer.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants

type PhotonAbsorbingEmittingLayerOptions = {
  photonMaxLateralJumpProportion: number;
  photonAbsorptionTime: number;
};

class PhotonAbsorbingEmittingLayer {
  private readonly photonMaxLateralJumpProportion: number;
  private readonly photonAbsorptionTime: number;

  constructor( providedOptions?: PhotonAbsorbingEmittingLayerOptions ) {

    const options = merge( {

      // This value represents the maximum lateral distance, expressed in proportion of the total layer width, between
      // where a photon is absorbed in a layer to where it is re-emitted.
      photonMaxLateralJumpProportion: 0.01,

      // the time that a photon is absorbed into a layer before being re-emitted
      photonAbsorptionTime: 0.1

    }, providedOptions ) as Required<PhotonAbsorbingEmittingLayerOptions>;

    this.photonMaxLateralJumpProportion = options.photonMaxLateralJumpProportion;
    this.photonAbsorptionTime = options.photonAbsorptionTime;
  }
}

export { PhotonAbsorbingEmittingLayerOptions };

greenhouseEffect.register( 'PhotonAbsorbingEmittingLayer', PhotonAbsorbingEmittingLayer );
export default PhotonAbsorbingEmittingLayer;