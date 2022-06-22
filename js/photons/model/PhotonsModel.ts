// Copyright 2020-2022, University of Colorado Boulder

/**
 * main model for the "Photons" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import PhotonCollection from '../../common/model/PhotonCollection.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

  readonly photonCollection: PhotonCollection;

  public constructor( tandem: Tandem ) {
    super( tandem, { fluxMeterPresent: true } );

    // the collection of visible and IR photons that move around and interact with the ground and atmosphere
    this.photonCollection = new PhotonCollection( this.sunEnergySource, this.groundLayer, this.atmosphereLayers, {
      photonAbsorbingEmittingLayerOptions: {
        photonAbsorptionTime: 0,
        photonMaxLateralJumpProportion: 0,
        absorbanceMultiplier: 10 // empirically determined to give us the desired visual behavior, adjust as needed
      },
      tandem: tandem.createTandem( 'photonCollection' )
    } );

    // TODO: tandem is documented readonly (though not with TypeScript) - is this correct?
    this.tandem = tandem;
  }

  /**
   * Step forward in time. Create new photons if it is time to do so, remove old photons, and animate existing ones.
   */
  public override stepModel( dt: number ): void {
    this.photonCollection.step( dt );
    super.stepModel( dt );
  }

  public override reset(): void {
    this.photonCollection.reset();
    super.reset();
  }
}

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;