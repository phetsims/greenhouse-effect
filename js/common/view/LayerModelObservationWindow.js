// Copyright 2021, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Color from '../../../../scenery/js/util/Color.js';
import ColorProperty from '../../../../scenery/js/util/ColorProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import FluxMeterNode from './FluxMeterNode.js';
import GreenhouseEffectObservationWindow from './GreenhouseEffectObservationWindow.js';
import InstrumentVisibilityControls from './InstrumentVisibilityControls.js';

// constants
const WINDOW_FRAME_SPACING = 10;

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {

  /**
   * @param {LayersModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem ) {

    super( model, tandem, { groundBaseColorProperty: new ColorProperty( Color.GRAY ) } );

    // flux meter
    if ( model.fluxMeterVisibleProperty ) {

      const fluxMeterNode = new FluxMeterNode(
        model.fluxMeter,
        model.fluxMeterVisibleProperty,
        this.modelViewTransform,
        this.windowFrame.bounds,
        tandem.createTandem( 'fluxMeterNode' )
      );
      fluxMeterNode.fluxPanel.rightTop = this.windowFrame.rightTop.minusXY( WINDOW_FRAME_SPACING, -WINDOW_FRAME_SPACING );

      // set the position of the wire to attach to the flux panel
      model.fluxMeter.wireMeterAttachmentPositionProperty.set(
        this.modelViewTransform.viewToModelPosition( fluxMeterNode.fluxPanel.leftTop.plusXY( 0, 50 ) )
      );

      this.foregroundLayer.addChild( fluxMeterNode );
    }

    // controls for the energy balance indicator and the flux meter, if used in this model
    const instrumentVisibilityControls = new InstrumentVisibilityControls( model, {
      tandem: tandem.createTandem( 'instrumentVisibilityControls' )
    } );
    instrumentVisibilityControls.rightBottom = this.windowFrame.rightBottom.minusXY( WINDOW_FRAME_SPACING, WINDOW_FRAME_SPACING );

    // Add the nodes to the layers provided by the parent class.
    this.controlsLayer.addChild( instrumentVisibilityControls );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindow', LayerModelObservationWindow );
export default LayerModelObservationWindow;