// Copyright 2021-2022, University of Colorado Boulder

/**
 * GroundWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the ground when it gets hot.
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import GroundLayer from '../../common/model/GroundLayer.js';
import LayersModel from '../../common/model/LayersModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave, { WaveCreatorArguments } from '../../waves/model/Wave.js';
import EMWaveSource, { EMWaveSourceOptions } from './EMWaveSource.js';
import WaveSourceSpec from './WaveSourceSpec.js';

// constants
const MINIMUM_WAVE_INTENSITY = 0.01;
const MIN_WAVE_PRODUCTION_TEMPERATURE = GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE; // min temperature at which the ground will produce IR waves
const MAX_EXPECTED_TEMPERATURE = 295; // the max temperature that the model is expected to reach, in Kelvin

type SelfOptions = EmptySelfOptions;
export type GroundWaveSourceOptions = SelfOptions & EMWaveSourceOptions;

class GroundWaveSource extends EMWaveSource {

  public constructor( wavesInModel: PhetioGroup<Wave, WaveCreatorArguments>,
                      waveStartAltitude: number,
                      waveEndAltitude: number,
                      groundTemperatureProperty: TProperty<number>,
                      providedOptions?: GroundWaveSourceOptions ) {

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

    const options = optionize<GroundWaveSourceOptions, SelfOptions, EMWaveSourceOptions>()( {
      waveIntensityProperty: waveIntensityProperty
    }, providedOptions );

    // derived Property that controls when IR waves can be produced
    const produceIRWavesProperty = new DerivedProperty(
      [ groundTemperatureProperty ],
      temperature => temperature > MIN_WAVE_PRODUCTION_TEMPERATURE + 1 // just higher than the minimum
    );

    super(
      wavesInModel,
      produceIRWavesProperty as TReadOnlyProperty<boolean>,
      GreenhouseEffectConstants.INFRARED_WAVELENGTH,
      waveStartAltitude,
      waveEndAltitude,
      [

        // leftmost wave
        new WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN.width * 0.3,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.08 )
        ),

        // center-ish wave
        new WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN.width * 0.1,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.1 )
        ),

        // rightmost wave
        new WaveSourceSpec(
          LayersModel.SUNLIGHT_SPAN.width * 0.47,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.075 )
        )
      ],
      options
    );
  }
}

greenhouseEffect.register( 'GroundWaveSource', GroundWaveSource );
export default GroundWaveSource;