// Copyright 2021-2023, University of Colorado Boulder

/**
 * PhotonLandscapeObservationWindow adds the ability to depict photons to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PhotonSprites from '../../common/PhotonSprites.js';
import AtmosphericPhotonsSoundGenerator from '../../common/view/AtmosphericPhotonsSoundGenerator.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import PhotonsModel from '../model/PhotonsModel.js';
import PhotonsLandscapeObservationWindowPDOMNode from './PhotonsLandscapeObservationWindowPDOMNode.js';
import EnergyRepresentation from '../../common/view/EnergyRepresentation.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EnergyFluxAlerter from '../../common/view/EnergyFluxAlerter.js';
import { DisplayedProperty } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;
export type PhotonLandscapeObservationWindowOptions =
  SelfOptions &
  PickRequired<LandscapeObservationWindowOptions, 'tandem'>;

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {
  private readonly photonsNode: PhotonSprites;
  private readonly energyFluxAlerter: EnergyFluxAlerter;

  public constructor( model: PhotonsModel, providedOptions?: PhotonLandscapeObservationWindowOptions ) {

    const options = optionize<PhotonLandscapeObservationWindowOptions, SelfOptions, LandscapeObservationWindowOptions>()( {
      energyRepresentation: EnergyRepresentation.PHOTON
    }, providedOptions );

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // alerter for energy flux
    this.energyFluxAlerter = new EnergyFluxAlerter( model, {
      descriptionAlertNode: this,
      enabledProperty: new DisplayedProperty( this )
    } );

    // pdom - manages descriptions for the observation window
    const observationWindowPDOMNode = new PhotonsLandscapeObservationWindowPDOMNode( model );
    this.addChild( observationWindowPDOMNode );

    // pdom - order of contents in the PDOM for traversal and screen readers
    this.pdomOrder = [
      this.focusableHeadingNode,
      this.startSunlightButton,
      observationWindowPDOMNode,
      this.energyBalancePanel,
      this.fluxMeterNode
    ];

    // sound generation
    soundManager.addSoundGenerator( new AtmosphericPhotonsSoundGenerator( model.photonCollection ) );
  }

  public override step( dt: number ): void {
    this.photonsNode.update();
    super.step( dt );
  }

  /**
   * Step our alerter(s).  See docs in parent class for more info.
   */
  public override stepAlerters( dt: number ): void {
    this.energyFluxAlerter.step();
    super.stepAlerters( dt );
  }
}

greenhouseEffect.register( 'PhotonLandscapeObservationWindow', PhotonLandscapeObservationWindow );
export default PhotonLandscapeObservationWindow;