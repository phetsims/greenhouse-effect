// Copyright 2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import photonsScreenMockup from '../../../images/photons-screen-mockup_png.js';

class PhotonsScreenView extends ScreenView {

  /**
   * @param {LayersModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    const mockup = new Image( photonsScreenMockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

greenhouseEffect.register( 'PhotonsScreenView', PhotonsScreenView );
export default PhotonsScreenView;