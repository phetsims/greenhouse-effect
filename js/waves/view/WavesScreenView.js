// Copyright 2020-2021, University of Colorado Boulder

/**
 * Main view class for the Waves screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import wavesScreenMockup from '../../../images/waves-screen-mockup_png.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationControlPanel from '../../common/view/ConcentrationControlPanel.js';
import EnergyLegend from '../../common/view/EnergyLegend.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import SurfaceThermometerCheckbox from '../../common/view/SurfaceThermometerCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import CloudCheckbox from './CloudCheckbox.js';
import SurfaceTemperatureCheckbox from './SurfaceTemperatureCheckbox.js';

class WavesScreenView extends GreenhouseEffectScreenView {

  /**
   * @param {WavesModel} model
   * @param {tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, {
      energyLegendOptions: {
        energyRepresentation: EnergyLegend.EnergyRepresentation.WAVE
      },

      observationWindowOptions: {

        // {boolean} - do not include a flux meter in the observation window
        includeFluxMeter: false,

        visibilityControlsOptions: {

          // do not include a checkbox to control visibility of the flux meter in visibility controls
          includeFluxMeter: false
        }
      },

      // phet-io
      tandem: tandem,

      // pdom
      screenSummaryContent: new Node( {
        children: [
          new Node( { tagName: 'p', innerContent: greenhouseEffectStrings.a11y.waves.screenSummary.playAreaDescription } ),
          new Node( { tagName: 'p', innerContent: greenhouseEffectStrings.a11y.waves.screenSummary.controlAreaDescription } ),
          new Node( { tagName: 'p', innerContent: greenhouseEffectStrings.a11y.startSunlightHint } )
        ]
      } )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox( model.surfaceThermometerVisibleProperty, tandem.createTandem( 'surfaceThermometerCheckbox' ) );
    const surfaceTemperatureCheckbox = new SurfaceTemperatureCheckbox( model.surfaceTemperatureVisibleProperty, tandem.createTandem( 'surfaceTemperatureCheckbox' ) );
    const cloudCheckbox = new CloudCheckbox( model.numberOfActiveCloudsProperty, tandem.createTandem( 'cloudCheckbox' ) );

    const concentrationControls = new ConcentrationControlPanel(
      this.energyLegend.width,
      model, {

        // phet-io
        tandem: tandem.createTandem( 'concentrationControlPanel' )
      }
    );
    this.addChild( concentrationControls );

    // cloud checkbox
    cloudCheckbox.leftBottom = this.observationWindow.rightBottom.plusXY(
      GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING,
      0
    );
    this.addChild( cloudCheckbox );

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

    concentrationControls.leftTop = this.energyLegend.leftBottom.plusXY( 0, 10 );

    this.addChild( visibilityBox );
    this.addChild( mockup );

    // pdom - override the pdomOrders for the supertype to insert subtype components
    this.pdomPlayAreaNode.pdomOrder = [
      this.energyLegend,
      this.observationWindow,
      concentrationControls,
      cloudCheckbox
    ];
    this.pdomControlAreaNode.pdomOrder = [
      visibilityBox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  /**
   * @param dt
   * @public
   */
  step( dt ) {
    this.observationWindow.step( dt );
  }

  /**
   * Reset view components.
   * @protected
   * @override
   */
  reset() {
    super.reset();
    this.observationWindow.reset();
  }
}

greenhouseEffect.register( 'WavesScreenView', WavesScreenView );

export default WavesScreenView;