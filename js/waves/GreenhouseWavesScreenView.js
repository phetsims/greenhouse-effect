// Copyright 2020, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import greenhouseEffect from '../greenhouseEffect.js';
import WavesNode from './WavesNode.js';

class GreenhouseWavesScreenView extends ScreenView {
  constructor( model ) {
    super();

    this.timeProperty = new NumberProperty( 0 );
    const amplitudeProperty = new NumberProperty( 100, {
      range: new Range( 1, 200 )
    } );
    const kProperty = new NumberProperty( 0.07, {
      range: new Range( 0.01, 0.2 )
    } );
    const wProperty = new NumberProperty( 6.9, {
      range: new Range( 0.1, 20 )
    } );
    const resolutionProperty = new NumberProperty( 2, {
      range: new Range( 2, 10 )
    } );
    const strokeProperty = new NumberProperty( 4, {
      range: new Range( 1, 10 )
    } );

    const initializeWavesNode = () => {
      if ( this.hasChild( this.wavesNode ) ) {
        this.removeChild( this.wavesNode );
      }
      this.wavesNode = new WavesNode( this.timeProperty, amplitudeProperty, kProperty, wProperty, resolutionProperty, strokeProperty, this.layoutBounds );
      this.addChild( this.wavesNode );
    };

    initializeWavesNode();

    // Enable hot module replacement for fast iteration
    module && module.hot && module.hot.accept( './WavesNode.js', initializeWavesNode );
  }

  step( dt ) {
    this.timeProperty.value += dt;
    this.wavesNode.step( dt );
  }
}

greenhouseEffect.register( 'GreenhouseWavesScreenView', GreenhouseWavesScreenView );

export default GreenhouseWavesScreenView;