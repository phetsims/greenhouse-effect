// Copyright 2021, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import wavesScreenMockup from '../../../images/waves-screen-mockup_png.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesNode from './WavesNode.js';

// constants
const OBSERVATION_WINDOW_SIZE = new Dimension2( 780, 525 );

class WavesScreenView extends ScreenView {
  constructor( model, tandem ) {
    super();

    // This rectangle is a temporary placeholder for the observation window.
    const observationWindow = Rectangle.dimension( OBSERVATION_WINDOW_SIZE, {
      lineWidth: 2,
      stroke: 'black',
      left: 5,
      top: 10
    } );
    this.addChild( observationWindow );

    this.wavesNode = new WavesNode( model, OBSERVATION_WINDOW_SIZE );
    observationWindow.addChild( this.wavesNode );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.wavesNode.reset();
      },
      right: this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // The mockup is an image that represents the design, and is useful for positioning elements during the early
    // implementation process. TODO - remove prior to publication, see https://github.com/phetsims/greenhouse-effect/issues/16.
    const mockup = new Image( wavesScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );
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