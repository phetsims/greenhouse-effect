// Copyright 2021-2023, University of Colorado Boulder

/**
 * PhotonLandscapeObservationWindow adds the ability to depict photons to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PhotonSprites from '../../common/PhotonSprites.js';
import AtmosphericPhotonsSoundGenerator from '../../common/view/AtmosphericPhotonsSoundGenerator.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonsModel from '../model/PhotonsModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
export type PhotonLandscapeObservationWindowOptions =
  SelfOptions &
  WithRequired<LandscapeObservationWindowOptions, 'tandem'>;

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {
  private readonly photonsNode: PhotonSprites;

  public constructor( model: PhotonsModel, options: PhotonLandscapeObservationWindowOptions ) {

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // sound generation
    soundManager.addSoundGenerator( new AtmosphericPhotonsSoundGenerator( model.photonCollection ) );
  }

  public override step( dt: number ): void {
    this.photonsNode.update();
    super.step( dt );
  }
}

greenhouseEffect.register( 'PhotonLandscapeObservationWindow', PhotonLandscapeObservationWindow );
export default PhotonLandscapeObservationWindow;