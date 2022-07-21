// Copyright 2021-2022, University of Colorado Boulder

/**
 * The base ScreenView for Greenhouse Effect, views for individual screens will extend this.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';
import EnergyLegend, { EnergyLegendOptions } from './EnergyLegend.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';

type SelfOptions = {

  // passed along to the EnergyLegend
  energyLegendOptions?: EnergyLegendOptions;

  // options passed to the GreenhouseEffectObservationWindow
  observationWindowOptions?: GreenhouseEffectObservationWindowOptions;
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
   * @param timeControlNode - The TimeControlNode may have screen specific functionality.
   *                                            TODO: The first three screens all use the same TimeControlNode as well
   *                                            as other components. Perhaps we need to have a subclass for these
   *                                            instead of providing the component with composition.
   * @param [providedOptions]
   */
  public constructor( model: GreenhouseEffectModel,
                      observationWindow: GreenhouseEffectObservationWindow,
                      timeControlNode: TimeControlNode,
                      providedOptions?: GreenhouseEffectScreenViewOptions ) {

    const options = optionize<GreenhouseEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      energyLegendOptions: {},
      observationWindowOptions: {},
      tandem: Tandem.REQUIRED
    }, providedOptions );

    if ( options.energyLegendOptions ) {
      assert && assert( !options.energyLegendOptions.tandem, 'EnergyLegend Tandem is set by GreenhouseEffectScreenView' );
    }

    super( options );

    // model instance that will be displayed in this view
    this.model = model;

    // Add the observation window to the view.  This is generally provided by the subclass.
    this.observationWindow = observationWindow;
    this.addChild( this.observationWindow );

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

    // Update the view then the model gets stepped.  This is needed because the observation windows may contain nodes
    // that need to be updated on model changes that don't have Property-based notifications of state changes.
    model.steppedEmitter.addListener( dt => {
      this.observationWindow.step( dt );
    } );

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
