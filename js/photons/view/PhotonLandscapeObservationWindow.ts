// Copyright 2021-2022, University of Colorado Boulder

/**
 * PhotonLandscapeObservationWindow adds the ability to depict photons to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import PhotonsModel from '../model/PhotonsModel.js';
import merge from '../../../../phet-core/js/merge.js';
import PhotonSprites from '../../common/PhotonSprites.js';
import AtmosphericPhotonsSoundGenerator from '../../common/view/AtmosphericPhotonsSoundGenerator.js';

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {
  private readonly photonsNode: PhotonSprites;

  constructor( model: PhotonsModel, providedOptions?: LandscapeObservationWindowOptions ) {

    const options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions ) as Required<LandscapeObservationWindowOptions>;

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // sound generation
    soundManager.addSoundGenerator( new AtmosphericPhotonsSoundGenerator( model.photonCollection ) );
  }

  override step( dt: number ) {
    this.photonsNode.update();
    super.step( dt );
  }
}

greenhouseEffect.register( 'PhotonLandscapeObservationWindow', PhotonLandscapeObservationWindow );
export default PhotonLandscapeObservationWindow;