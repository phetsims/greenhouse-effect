// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveLandscapeObservationWindow adds the ability to depict electromagnetic waves to its parent class.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import LandscapeObservationWindow, { LandscapeObservationWindowOptions } from '../../common/view/LandscapeObservationWindow.js';
import WavesCanvasNode from './WavesCanvasNode.js';
import WavesModel from '../model/WavesModel.js';
import WaveLandscapeObservationWindowPDOMNode from '../../common/view/WaveLandscapeObservationWindowPDOMNode.js';
import GreenhouseEffectObservationWindow from '../../common/view/GreenhouseEffectObservationWindow.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = Pick<LandscapeObservationWindow, 'tandem'>;
type WaveLandscapeObservationWindowOptions = SelfOptions & WithRequired<LandscapeObservationWindowOptions, 'tandem'>;

class WaveLandscapeObservationWindow extends LandscapeObservationWindow {

  public constructor( model: WavesModel, options: WaveLandscapeObservationWindowOptions ) {

    super( model, options );

    const wavesCanvasNode = new WavesCanvasNode( model, this.modelViewTransform, {
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
    this.pdomOrder = [ this.focusableHeadingNode, this.startSunlightButton, greenhouseEffectObservationWindowPDOMNode, this.energyBalancePanel ];
  }
}

greenhouseEffect.register( 'WaveLandscapeObservationWindow', WaveLandscapeObservationWindow );
export default WaveLandscapeObservationWindow;