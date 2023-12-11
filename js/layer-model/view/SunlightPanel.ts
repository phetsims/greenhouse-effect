// Copyright 2021-2023, University of Colorado Boulder

/**
 * Controls for the output level of the sun and the albedo (i.e. reflection level) of the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import SolarIntensityControl from './SolarIntensityControl.js';
import SurfaceAlbedoControl from './SurfaceAlbedoControl.js';
import LayerScreenControlPanel from './LayerScreenControlPanel.js';

export default class SunlightPanel extends LayerScreenControlPanel {
  public constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    // track size for the sliders, based in part on the provided width
    const sliderTrackSize = new Dimension2( width * 0.75, 1 );

    const solarIntensityControl = new SolarIntensityControl(
      layersModel.sunEnergySource.proportionateOutputRateProperty,
      sliderTrackSize,
      layersModel.sunEnergySource.isShiningProperty,
      tandem.createTandem( 'solarIntensityControl' )
    );

    const surfaceAlbedoControl = new SurfaceAlbedoControl(
      layersModel.groundLayer.albedoProperty,
      sliderTrackSize,
      layersModel.sunEnergySource.isShiningProperty,
      tandem.createTandem( 'surfaceAlbedoControl' )
    );

    super(
      [ solarIntensityControl, surfaceAlbedoControl ],
      width,
      layersModel,
      GreenhouseEffectStrings.sunlightStringProperty,
      {
        tandem: tandem,
        labelContent: GreenhouseEffectStrings.a11y.layerModel.sunlightControlsStringProperty
      }
    );
  }
}

greenhouseEffect.register( 'SunlightPanel', SunlightPanel );