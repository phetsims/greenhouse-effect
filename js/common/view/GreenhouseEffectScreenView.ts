// Copyright 2021-2023, University of Colorado Boulder

/**
 * The base ScreenView for Greenhouse Effect, views for individual screens will extend this.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { Path, VBox } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectColors from '../GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';
import EnergyLegend, { EnergyLegendOptions } from './EnergyLegend.js';
import GreenhouseEffectObservationWindow from './GreenhouseEffectObservationWindow.js';

const FRAME_WIDTH = 12; // in screen coords, empirically determined to do the job

type SelfOptions = {

  // controls whether to put the clipping frame around the observation window
  useClippingFrame?: boolean;

  // passed along to the EnergyLegend
  energyLegendOptions?: EnergyLegendOptions;
};
export type GreenhouseEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

class GreenhouseEffectScreenView extends ScreenView {
  protected readonly model: GreenhouseEffectModel;
  protected readonly observationWindow: GreenhouseEffectObservationWindow;
  protected readonly energyLegend: EnergyLegend;
  protected readonly legendAndControlsVBox: VBox;
  protected readonly timeControlNode: TimeControlNode;
  protected readonly resetAllButton: ResetAllButton;

  /**
   * @param model
   * @param observationWindow
   * @param timeControlNode - The TimeControlNode may have screen-specific functionality.
   * @param providedOptions
   */
  protected constructor( model: GreenhouseEffectModel,
                         observationWindow: GreenhouseEffectObservationWindow,
                         timeControlNode: TimeControlNode,
                         providedOptions: GreenhouseEffectScreenViewOptions ) {

    const options = optionize<GreenhouseEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      isDisposable: false,
      useClippingFrame: false,
      energyLegendOptions: { tandem: providedOptions.tandem.createTandem( 'energyLegend' ) }
    }, providedOptions );

    super( options );

    // model instance that will be displayed in this view
    this.model = model;

    // Add the observation window to the view.  This is generally provided by the subclass.
    this.observationWindow = observationWindow;
    this.addChild( this.observationWindow );

    // In some cases, the rendering in the observation window can't be clipped using a clip area.  As of this writing,
    // the primary case where this occurs is when rendering photons, since they use WebGL.  In those cases, a frame can
    // be added around the observation window.  When this frame matches the background color of the screen view, the
    // contents of the window stays within its bounds.
    if ( options.useClippingFrame ) {
      const observationWindowBounds = this.observationWindow.getBounds();
      const clippingFramePath = Shape.bounds( observationWindowBounds.dilated( FRAME_WIDTH ) );
      clippingFramePath.moveTo( observationWindowBounds.minX, observationWindowBounds.minY );
      clippingFramePath.lineTo( observationWindowBounds.minX, observationWindowBounds.maxY );
      clippingFramePath.lineTo( observationWindowBounds.maxX, observationWindowBounds.maxY );
      clippingFramePath.lineTo( observationWindowBounds.maxX, observationWindowBounds.minY );
      clippingFramePath.close();

      const clippingFrame = new Path( clippingFramePath, {
        fill: GreenhouseEffectColors.screenBackgroundColorProperty
      } );
      this.addChild( clippingFrame );
    }

    // area between right edge of ScreenView and observation window
    const rightWidth = this.layoutBounds.right - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN -
                       this.observationWindow.right - GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING;

    // energy legend, accessible in subtypes for layout purposes
    this.energyLegend = new EnergyLegend( rightWidth, combineOptions<EnergyLegendOptions>( {
      tandem: options.tandem.createTandem( 'energyLegend' )
    }, options.energyLegendOptions ) );

    // The parent node on the right side of the view where legends and controls are placed.  A VBox
    // is used to support dynamic layout in conjunction with phet-io.
    this.legendAndControlsVBox = new VBox( {
      children: [ this.energyLegend ],
      align: 'left',
      spacing: 10
    } );
    this.addChild( this.legendAndControlsVBox );

    this.timeControlNode = timeControlNode;
    this.addChild( this.timeControlNode );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        this.reset();
      },
      right: this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    // layout code
    // height of area between bottom of the screen view and bottom of the observation window
    const bottomHeight = this.layoutBounds.height - this.observationWindow.bottom;

    // Several controls have layout relative to the TimeControlNode.
    this.timeControlNode.center = new Vector2(
      this.observationWindow.centerX,
      this.observationWindow.bottom + bottomHeight / 2
    );

    // The legends and controls are to the right of the observation window.
    this.legendAndControlsVBox.leftTop = this.observationWindow.rightTop.plusXY(
      GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING,
      0
    );

    // Position the Reset All button.
    this.resetAllButton.right = this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN;
    this.resetAllButton.centerY = this.timeControlNode.centerY;

    // pdom - order and assign components to their sections in the PDOM, for default components but can
    // be overridden by subtypes
    this.pdomPlayAreaNode.pdomOrder = [
      this.energyLegend,
      this.observationWindow
    ];
    this.pdomControlAreaNode.pdomOrder = [
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  public override step( dt: number ): void {

    // Step the observation window.
    this.observationWindow.step( dt );
    this.observationWindow.stepAlerters( dt );
  }

  /**
   * Resets view components.
   */
  protected reset(): void {

    // The order here is important - the model must be reset before the observation window.
    this.model.reset();
    this.observationWindow.reset();
  }
}

greenhouseEffect.register( 'GreenhouseEffectScreenView', GreenhouseEffectScreenView );
export default GreenhouseEffectScreenView;
