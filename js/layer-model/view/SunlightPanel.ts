// Copyright 2021-2023, University of Colorado Boulder

/**
 * Controls for the output level of the sun and the albedo (i.e. reflection level) of the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import SolarIntensityControl from './SolarIntensityControl.js';
import SurfaceAlbedoControl from './SurfaceAlbedoControl.js';

// constants
const PANEL_MARGIN = 5;

export default class SunlightPanel extends Panel {

  public constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center' as const,
      fill: GreenhouseEffectColors.controlPanelBackgroundColorProperty,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.infraredStringProperty,

      // phet-io
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    };

    // Title text for the panel.
    const titleText = new Text( GreenhouseEffectStrings.sunlightStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2
    } );

    // track size for the sliders, based in part on the provided width
    const sliderTrackSize = new Dimension2( width * 0.75, 1 );

    const solarIntensityControl = new SolarIntensityControl(
      layersModel.sunEnergySource.proportionateOutputRateProperty,
      sliderTrackSize, options.tandem.createTandem( 'solarIntensityControl' ) );

    const surfaceAlbedoControl = new SurfaceAlbedoControl(
      layersModel.groundLayer.albedoProperty,
      sliderTrackSize, options.tandem.createTandem( 'surfaceAlbedoControl' )
    );

    const content = new VBox( {
      children: [ titleText, solarIntensityControl, surfaceAlbedoControl ],
      spacing: 24
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'SunlightPanel', SunlightPanel );