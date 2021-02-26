// Copyright 2021, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import isHMR from '../../../../phet-core/js/isHMR.js';
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