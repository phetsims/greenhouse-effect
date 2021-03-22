// Copyright 2021, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import wavesScreenMockup from '../../../images/waves-screen-mockup_png.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import CloudsCheckbox from './CloudsCheckbox.js';
import SurfaceTemperatureCheckbox from './SurfaceTemperatureCheckbox.js';
import WavesNode from './WavesNode.js';

class WavesScreenView extends GreenhouseEffectScreenView {
  constructor( model, tandem ) {
    super( model, tandem );

    // @private {WavesNode}
    this.wavesNode = new WavesNode( model, GreenhouseEffectScreenView.OBSERVATION_WINDOW_SIZE );
    this.observationWindow.addChild( this.wavesNode );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox( model.surfaceThermometerVisibleProperty );
    const surfaceTemperatureCheckbox = new SurfaceTemperatureCheckbox( model.surfaceTemperatureVisibleProperty );
    const cloudsCheckbox = new CloudsCheckbox( model.cloudsVisibleProperty );

    // The mockup is an image that represents the design, and is useful for positioning elements during the early
    // implementation process. TODO - remove prior to publication, see https://github.com/phetsims/greenhouse-effect/issues/16.
    const mockup = new Image( wavesScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // layout code
    const visibilityBox = new VBox( {
      children: [ surfaceThermometerCheckbox, surfaceTemperatureCheckbox ],
      spacing: 5,
      align: 'left'
    } );
    visibilityBox.left = this.observationWindow.left + 5;
    visibilityBox.centerY = this.timeControlNode.centerY;

    cloudsCheckbox.leftBottom = this.observationWindow.rightBottom.plusXY( GreenhouseEffectScreenView.OBSERVATION_WINDOW_RIGHT_SPACING, 0 );

    this.addChild( visibilityBox );
    this.addChild( cloudsCheckbox );
    this.addChild( mockup );
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