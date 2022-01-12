// Copyright 2021, University of Colorado Boulder

/**
 * WaveLandscapeObservationWindow adds the ability to depict electromagnetic waves to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LandscapeObservationWindow from '../../common/view/LandscapeObservationWindow.js';
import { GreenhouseEffectObservationWindowOptions } from '../../common/view/GreenhouseEffectObservationWindow.js';
import WavesCanvasNode from './WavesCanvasNode.js';
import WavesModel from '../model/WavesModel.js';
import WaveLandscapeObservationWindowPDOMNode from '../../common/view/WaveLandscapeObservationWindowPDOMNode.js';

class WaveLandscapeObservationWindow extends LandscapeObservationWindow {

  constructor( model: WavesModel, tandem: Tandem, providedOptions?: GreenhouseEffectObservationWindowOptions ) {

    super( model, tandem, providedOptions );

    const wavesCanvasNode = new WavesCanvasNode( model, this.modelViewTransform, {
      canvasBounds: LandscapeObservationWindow.SIZE.toBounds(),
      tandem: tandem.createTandem( 'wavesCanvasNode' )
    } );
    this.presentationLayer.addChild( wavesCanvasNode );

    // Move the waves canvas to the back so that it is behind the haze.
    wavesCanvasNode.moveToBack();

    // Update the view when changes occur to the modelled waves.
    model.wavesChangedEmitter.addListener( () => {
      // @ts-ignore
      wavesCanvasNode.invalidatePaint();
    } );

    // pdom - manages descriptions for the observation window
    const greenhouseEffectObservationWindowPDOMNode = new WaveLandscapeObservationWindowPDOMNode( model );
    this.addChild( greenhouseEffectObservationWindowPDOMNode );
    this.pdomOrder = [ greenhouseEffectObservationWindowPDOMNode, null ];
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindow', WaveLandscapeObservationWindow );
export default WaveLandscapeObservationWindow;