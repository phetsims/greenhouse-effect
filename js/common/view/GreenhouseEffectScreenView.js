// Copyright 2021, University of Colorado Boulder

/**
 * The base ScreenView for Greenhouse Effect, views for individual screens will extend this.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyLegend from './EnergyLegend.js';
import ObservationWindow from './ObservationWindow.js';

const OBSERVATION_WINDOW_SIZE = new Dimension2( 780, 525 );

class GreenhouseEffectScreenView extends ScreenView {

  /**
   * @param {GreenhouseEffectModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem, options ) {

    options = merge( {

      // passed along to the EnergyLegend
      energyLegendOptions: null
    }, options );

    super();

    // @private {GreenhouseEffectModel}
    this.model = model;

    // @protected (read-only) - The observation window where the ground, sky, waves, photons, and such will appear. This
    // is protected for layout purposes in subtypes.
    this.observationWindow = new ObservationWindow( model, tandem );
    this.pdomPlayAreaNode.addChild( this.observationWindow );

    // @public {TimeControlNode} - for layout in subtypes
    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepModel( 1 / 60 ) // assuming 60 fps
        }
      }

    } );
    this.pdomControlAreaNode.addChild( this.timeControlNode );

    // area between right edge of ScreenView and observation window
    const rightWidth = this.layoutBounds.right - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN -
                       this.observationWindow.right - GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING;

    // @protected {EnergyLegend} - for layout in subtypes
    this.energyLegend = new EnergyLegend( rightWidth, options.energyLegendOptions );
    this.pdomControlAreaNode.addChild( this.energyLegend );

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
    this.pdomControlAreaNode.addChild( resetAllButton );

    // layout code
    // height of area between bottom of the screen view and bottom of the observation window
    const bottomHeight = this.layoutBounds.height - this.observationWindow.bottom;

    // several controls have layout relative to the TimeControlNode
    this.timeControlNode.center = new Vector2( this.observationWindow.centerX, this.observationWindow.bottom + bottomHeight / 2 );

    this.energyLegend.leftTop = this.observationWindow.rightTop.plusXY( GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING, 0 );

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

greenhouseEffect.register( 'GreenhouseEffectScreenView', GreenhouseEffectScreenView );
export default GreenhouseEffectScreenView;
