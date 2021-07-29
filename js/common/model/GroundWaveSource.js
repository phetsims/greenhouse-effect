// Copyright 2021, University of Colorado Boulder

/**
 * GroundWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the ground when it gets hot.
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource from '../../waves/model/EMWaveSource.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import LayersModel from './LayersModel.js';

// constants
const MINIMUM_WAVE_INTENSITY = 0.01;
const MIN_WAVE_PRODUCTION_TEMPERATURE = 245; // min temperature at which the ground will produce IR waves, in Kelvin
const MAX_EXPECTED_TEMPERATURE = 295; // the max temperature that the model is expected to reach, in Kelvin

class GroundWaveSource extends EMWaveSource {

  constructor( wavesInModel, waveStartAltitude, waveEndAltitude, groundTemperatureProperty ) {

    // derived Property that controls when IR waves can be produced
    const produceIRWavesProperty = new DerivedProperty(
      [ groundTemperatureProperty ],
      temperature => temperature > MIN_WAVE_PRODUCTION_TEMPERATURE + 1 // just higher than the minimum
    );


    // derived Property that maps temperature to the intensity of the IR waves
    const waveIntensityProperty = new DerivedProperty(
      [ groundTemperatureProperty ],
      temperature => Utils.clamp(
        // min intensity at the lowest temperature, max at highest
        ( temperature - MIN_WAVE_PRODUCTION_TEMPERATURE ) / ( MAX_EXPECTED_TEMPERATURE - MIN_WAVE_PRODUCTION_TEMPERATURE ),
        MINIMUM_WAVE_INTENSITY,
        1
      )
    );

    super(
      wavesInModel,
      produceIRWavesProperty,
      GreenhouseEffectConstants.INFRARED_WAVELENGTH,
      waveStartAltitude,
      waveEndAltitude,
      [

        // leftmost waves
        new EMWaveSource.WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.32,
          -LayersModel.SUNLIGHT_SPAN * 0.27,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.12 )
        ),

        // center-ish waves
        new EMWaveSource.WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.1,
          -LayersModel.SUNLIGHT_SPAN * 0.05,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.15 )
        ),

        // rightmost waves
        new EMWaveSource.WaveSourceSpec(
          LayersModel.SUNLIGHT_SPAN * 0.38,
          LayersModel.SUNLIGHT_SPAN * 0.43,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.15 )
        )
      ],
      { waveIntensityProperty: waveIntensityProperty }
    );
  }
}

greenhouseEffect.register( 'GroundWaveSource', GroundWaveSource );
export default GroundWaveSource;