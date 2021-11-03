// Copyright 2021, University of Colorado Boulder

/**
 * The base ScreenView for Greenhouse Effect, views for individual screens will extend this.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyLegend, { EnergyLegendOptions } from './EnergyLegend.js';
import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';

type GreenhouseEffectScreenViewOptions = {
  energyLegendOptions: EnergyLegendOptions,
  observationWindowOptions: GreenhouseEffectObservationWindowOptions,
} & ScreenViewOptions;

class GreenhouseEffectScreenView extends ScreenView {
  private readonly model: GreenhouseEffectModel;
  protected readonly observationWindow: GreenhouseEffectObservationWindow;
  protected readonly energyLegend: EnergyLegend;
  protected readonly legendAndControlsVBox: VBox;
  protected readonly timeControlNode: TimeControlNode;
  protected readonly resetAllButton: ResetAllButton;

  /**
   * @param {GreenhouseEffectModel} model
   * @param {Node} observationWindow
   * @param {GreenhouseEffectScreenViewOptions} [providedOptions]
   */
  constructor( model: GreenhouseEffectModel,
               observationWindow: GreenhouseEffectObservationWindow,
               providedOptions: GreenhouseEffectScreenViewOptions ) {

    const options: GreenhouseEffectScreenViewOptions = merge( {

      // passed along to the EnergyLegend
      energyLegendOptions: null,

      // {Object|null} - options passed to the GreenhouseEffectObservationWindow
      observationWindowOptions: null,

      tandem: Tandem.REQUIRED
    }, providedOptions ) as GreenhouseEffectScreenViewOptions;

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
    this.energyLegend = new EnergyLegend( rightWidth, merge( {
      tandem: options.tandem.createTandem( 'energyLegend' )
    }, options.energyLegendOptions ) as EnergyLegendOptions );

    // @protected {VBox} - The parent node on the right side of the view where legends and controls are placed.  A VBox
    // is used to support dynamic layout in conjunction with phet-io.
    this.legendAndControlsVBox = new VBox( {
      children: [ this.energyLegend ],
      align: 'left',
      spacing: 10
    } );
    this.addChild( this.legendAndControlsVBox );

    // @public {TimeControlNode} - for layout in subtypes
    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepModel( 1 / 60 ) // assuming 60 fps
        }
      },

      // phet-io
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );
    this.addChild( this.timeControlNode );

    // @protected {ResetAllButton}
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

    this.resetAllButton.right = this.layoutBounds.maxX - GreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN;
    this.resetAllButton.centerY = this.timeControlNode.centerY;

    // pdom - order and assign components to their sections in the PDOM, for default components but can
    // be overridden by subtypes
    // @ts-ignore
    this.pdomPlayAreaNode.pdomOrder = [
      this.energyLegend,
      this.observationWindow
    ];
    // @ts-ignore
    this.pdomControlAreaNode.pdomOrder = [
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  /**
   * Resets view components.
   * @protected
   */
  protected reset() {
    this.model.reset();
  }
}

greenhouseEffect.register( 'GreenhouseEffectScreenView', GreenhouseEffectScreenView );
export default GreenhouseEffectScreenView;
