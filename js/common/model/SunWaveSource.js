// Copyright 2021, University of Colorado Boulder

/**
 * SunWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the sun.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource from '../../waves/model/EMWaveSource.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import LayersModel from './LayersModel.js';

class SunWaveSource extends EMWaveSource {

  constructor( wavesInModel, waveProductionEnabledProperty, waveStartAltitude, waveEndAltitude ) {
    super(
      wavesInModel,
      waveProductionEnabledProperty,
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      waveStartAltitude,
      waveEndAltitude,
      [

        // leftmost waves
        new EMWaveSource.WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.23,
          -LayersModel.SUNLIGHT_SPAN * 0.13,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        ),

        // rightmost waves
        new EMWaveSource.WaveSourceSpec(
          LayersModel.SUNLIGHT_SPAN * 0.25,
          LayersModel.SUNLIGHT_SPAN * 0.35,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        )
      ],
      { waveIntensityProperty: new NumberProperty( 0.5 ) }
    );
  }
}

greenhouseEffect.register( 'SunWaveSource', SunWaveSource );
export default SunWaveSource;