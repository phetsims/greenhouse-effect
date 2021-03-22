// Copyright 2021, University of Colorado Boulder

/**
 * The base ScreenView for Greenhouse Effect, views for individual screens will extend this.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

const OBSERVATION_WINDOW_SIZE = new Dimension2( 780, 525 );

// spacing between observation window and UI components to its right
const OBSERVATION_WINDOW_RIGHT_SPACING = 10;

class GreenhouseEffectScreenView extends ScreenView {

  /**
   * @param {GreenhouseEffectModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super();

    // @private {GreenhouseEffectModel}
    this.model = model;

    // @public {Rectangle} - This rectangle is a temporary placeholder for the observation window.
    // Public for layout purposes in subtypes.
    this.observationWindow = Rectangle.dimension( OBSERVATION_WINDOW_SIZE, {
      lineWidth: 2,
      stroke: 'black',
      left: 5,
      top: 10
    } );
    this.addChild( this.observationWindow );

    // @public {TimeControlNode} - for layout in subtypes
    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepModel( 1 / 60 ) // assuming 60 fps
        }
      }

    } );
    this.addChild( this.timeControlNode );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        this.reset();
      },
      right: this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // layout code
    // height of area between bottom of the screen view and bottom of the observation window
    const bottomHeight = this.layoutBounds.height - this.observationWindow.bottom;

    // several controls have layout relative to the TimeControlNode
    this.timeControlNode.center = new Vector2( this.observationWindow.centerX, this.observationWindow.bottom + bottomHeight / 2 );

    resetAllButton.right = this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.centerY = this.timeControlNode.centerY;
  }

  /**
   * Resets view components.
   * @protected
   */
  reset() {
    this.model.reset();
  }
}

GreenhouseEffectScreenView.OBSERVATION_WINDOW_SIZE = OBSERVATION_WINDOW_SIZE;
GreenhouseEffectScreenView.OBSERVATION_WINDOW_RIGHT_SPACING = OBSERVATION_WINDOW_RIGHT_SPACING;

greenhouseEffect.register( 'GreenhouseEffectScreenView', GreenhouseEffectScreenView );
export default GreenhouseEffectScreenView;
