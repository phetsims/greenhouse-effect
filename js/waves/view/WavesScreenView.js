// Copyright 2021, University of Colorado Boulder

/**
 * Prototype for greenhouse waves.  It's a prototype, enter at your own risk
 *
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
import CloudsCheckbox from './CloudsCheckbox.js';
import SurfaceTemperatureCheckbox from './SurfaceTemperatureCheckbox.js';

class WavesScreenView extends GreenhouseEffectScreenView {

  constructor( model, tandem ) {

    super( model, tandem, {
      energyLegendOptions: {
        energyRepresentation: EnergyLegend.EnergyRepresentation.WAVE
      },

      observationWindowOptions: {
        visibilityControlsOptions: {
          includeFluxMeter: false
        }
      },

      // pdom
      screenSummaryContent: new Node( {
        children: [
          new Node( { tagName: 'p', innerContent: greenhouseEffectStrings.a11y.waves.screenSummary.playAreaDescription } ),
          new Node( { tagName: 'p', innerContent: greenhouseEffectStrings.a11y.waves.screenSummary.controlAreaDescription } ),
          new Node( { tagName: 'p', innerContent: greenhouseEffectStrings.a11y.startSunlightHint } )
        ]
      } )
    } );

    const surfaceThermometerCheckbox = new SurfaceThermometerCheckbox( model.surfaceThermometerVisibleProperty );
    const surfaceTemperatureCheckbox = new SurfaceTemperatureCheckbox( model.surfaceTemperatureVisibleProperty );
    const cloudsCheckbox = new CloudsCheckbox( model.cloudsVisibleProperty );

    const concentrationControls = new ConcentrationControlPanel(
      this.energyLegend.width,
      model.concentrationProperty,
      model.concentrationControlProperty,
      model.dateProperty
    );
    this.pdomPlayAreaNode.addChild( concentrationControls );

    // clouds checkbox
    cloudsCheckbox.leftBottom = this.observationWindow.rightBottom.plusXY( GreenhouseEffectConstants.OBSERVATION_WINDOW_RIGHT_SPACING, 0 );
    this.pdomPlayAreaNode.addChild( cloudsCheckbox );

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

    this.pdomControlAreaNode.addChild( visibilityBox );
    this.pdomControlAreaNode.addChild( mockup );

    // tab order (a11y)
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