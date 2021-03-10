// Copyright 2021, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import isHMR from '../../../../phet-core/js/isHMR.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import wavesScreenMockup from '../../../images/waves-screen-mockup_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesNode from './WavesNode.js';


class WavesScreenView extends ScreenView {
  constructor( model ) {
    super();

    const initializeWavesNode = () => {
      this.wavesNode && this.removeChild( this.wavesNode );
      this.wavesNode = new WavesNode( model, this.layoutBounds );
      this.addChild( this.wavesNode );
    };

    initializeWavesNode();

    const mockup = new Image( wavesScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // Enable hot module replacement for fast iteration
    isHMR && module.hot.accept( './WavesNode.js', initializeWavesNode );
  }

  /**
   * @param dt
   * @public
   */
  step( dt ) {
    this.wavesNode.step( dt );
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;