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

class WaveLandscapeObservationWindow extends LandscapeObservationWindow {

  constructor( model: WavesModel, tandem: Tandem, providedOptions?: GreenhouseEffectObservationWindowOptions ) {

    super( model, tandem, providedOptions );

    const wavesCanvasNode = new WavesCanvasNode( model, this.modelViewTransform, {
      canvasBounds: LandscapeObservationWindow.SIZE.toBounds(),
      tandem: tandem.createTandem( 'wavesCanvasNode' )
    } );
    this.presentationLayer.addChild( wavesCanvasNode );

    // Update the view when changes occur to the modelled waves.
    model.wavesChangedEmitter.addListener( () => {
      // @ts-ignore
      wavesCanvasNode.invalidatePaint();
    } );
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindow', WaveLandscapeObservationWindow );
export default WaveLandscapeObservationWindow;