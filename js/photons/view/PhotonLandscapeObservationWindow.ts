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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import FluxSensorAltitudeDescriptionProperty from '../../common/view/describers/FluxSensorAltitudeDescriptionProperty.js';
import TinyEmitter from '../../../../axon/js/TinyEmitter.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;
export type PhotonLandscapeObservationWindowOptions =
  SelfOptions &
  PickRequired<LandscapeObservationWindowOptions, 'tandem'>;

class PhotonLandscapeObservationWindow extends LandscapeObservationWindow {
  private readonly photonsNode: PhotonSprites;
  private readonly energyFluxAlerter: EnergyFluxAlerter;

  public constructor( model: PhotonsModel, providedOptions?: PhotonLandscapeObservationWindowOptions ) {
    assert && assert( model.cloud, 'The cloud should exist for the Photons observation window.' );
    const cloudModel = model.cloud!;

    assert && assert( model.fluxMeter, 'The flux meter should exist for the Photons observation window.' );
    const fluxSensor = model.fluxMeter!.fluxSensor;

    // Create a description of the relationship between the flux sensor and the cloud.  If the cloud is not enabled the
    // description will be an empty string.
    const fluxSensorAndCloudDescriptionProperty = new DerivedProperty(
      [ cloudModel.enabledProperty, fluxSensor.altitudeProperty ],
      ( cloudEnabled, sensorAltitude ) => {
        let description = '';
        if ( cloudEnabled ) {
          if ( sensorAltitude > cloudModel.position.y ) {
            description = GreenhouseEffectStrings.a11y.aboveCloudStringProperty.value;
          }
          else {
            description = GreenhouseEffectStrings.a11y.belowCloudStringProperty.value;
          }
        }
        return description;
      }
    );

    // Create description of the flux meter sensor's altitude.
    const sensorAltitudeDescriptionProperty = new FluxSensorAltitudeDescriptionProperty( fluxSensor.altitudeProperty );

    const options = optionize<PhotonLandscapeObservationWindowOptions, SelfOptions, LandscapeObservationWindowOptions>()( {
      energyRepresentation: EnergyRepresentation.PHOTON,
      fluxMeterNodeOptions: {
        fluxSensorNodeOptions: {
          a11yCreateAriaValueText: () => `${sensorAltitudeDescriptionProperty.value} ${fluxSensorAndCloudDescriptionProperty.value}`,
          a11yDependencies: [ fluxSensorAndCloudDescriptionProperty ]
        }
      }
    }, providedOptions );

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // Create an emitter that will be used to trigger alerts in the energyFluxAlerter under some circumstances.
    const triggerEnergyFluxAlertEmitter = new TinyEmitter<[boolean]>();
    Multilink.multilink( [ model.concentrationControlModeProperty, model.dateProperty ], () => {
      triggerEnergyFluxAlertEmitter.emit( true );
    } );

    // alerter for energy flux
    this.energyFluxAlerter = new EnergyFluxAlerter( model, {
      descriptionAlertNode: this,
      enabledProperty: new DisplayedProperty( this ),
      motivateEnergyFluxAlertEmitter: triggerEnergyFluxAlertEmitter
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