// Copyright 2021-2024, University of Colorado Boulder

/**
 * WaveLandscapeObservationWindow is a specialization class that adds the ability to depict electromagnetic waves to its
 * parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EnergyRepresentation from '../../common/view/EnergyRepresentation.js';
import GreenhouseEffectObservationWindow from '../../common/view/GreenhouseEffectObservationWindow.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../model/WavesModel.js';
import WaveLandscapeObservationWindowPDOMNode from './WaveLandscapeObservationWindowPDOMNode.js';
import WavesCanvasNode from './WavesCanvasNode.js';

type SelfOptions = EmptySelfOptions;
type WaveLandscapeObservationWindowOptions =
  SelfOptions &
  PickRequired<LandscapeObservationWindowOptions, 'tandem'>;

class WaveLandscapeObservationWindow extends LandscapeObservationWindow {

  public constructor( model: WavesModel, providedOptions?: WaveLandscapeObservationWindowOptions ) {

    const options = optionize<WaveLandscapeObservationWindowOptions, SelfOptions, LandscapeObservationWindowOptions>()( {
      energyRepresentation: EnergyRepresentation.WAVE
    }, providedOptions );

    super( model, options );

    const wavesCanvasNode = new WavesCanvasNode( model.waveGroup, this.modelViewTransform, {
      canvasBounds: GreenhouseEffectObservationWindow.SIZE.toBounds(),
      tandem: options.tandem.createTandem( 'wavesCanvasNode' )
    } );
    this.presentationLayer.addChild( wavesCanvasNode );

    // Move the waves canvas to the back so that it is behind the haze.
    wavesCanvasNode.moveToBack();

    // Update the view when changes occur to the modelled waves.
    model.wavesChangedEmitter.addListener( () => {
      wavesCanvasNode.invalidatePaint();
    } );

    // pdom - manages descriptions for the observation window
    const greenhouseEffectObservationWindowPDOMNode = new WaveLandscapeObservationWindowPDOMNode( model );
    this.addChild( greenhouseEffectObservationWindowPDOMNode );

    // pdom - order of contents in the PDOM for traversal and screen readers
    this.pdomOrder = [
      this.focusableHeadingNode,
      this.startSunlightButton,
      greenhouseEffectObservationWindowPDOMNode,
      this.energyBalancePanel
    ];
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindow', WaveLandscapeObservationWindow );
export default WaveLandscapeObservationWindow;