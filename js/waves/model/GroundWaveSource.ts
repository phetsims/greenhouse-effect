// Copyright 2021-2022, University of Colorado Boulder

/**
 * GroundWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the ground when it gets hot.
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource, { EMWaveSourceOptions } from './EMWaveSource.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import LayersModel from '../../common/model/LayersModel.js';
import Wave, { WaveOptions } from '../../waves/model/Wave.js';
import Property from '../../../../axon/js/Property.js';
import WaveSourceSpec from './WaveSourceSpec.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import GroundLayer from '../../common/model/GroundLayer.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// constants
const MINIMUM_WAVE_INTENSITY = 0.01;
const MIN_WAVE_PRODUCTION_TEMPERATURE = GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE; // min temperature at which the ground will produce IR waves
const MAX_EXPECTED_TEMPERATURE = 295; // the max temperature that the model is expected to reach, in Kelvin

class GroundWaveSource extends EMWaveSource {

  public constructor( wavesInModel: PhetioGroup<Wave, [ number, Vector2, Vector2, number, WaveOptions ]>,
                      waveStartAltitude: number,
                      waveEndAltitude: number,
                      groundTemperatureProperty: Property<number>,
                      options?: Partial<EMWaveSourceOptions> ) {

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

    options = merge( {
      waveIntensityProperty: waveIntensityProperty
    }, options );

    super(
      wavesInModel,
      produceIRWavesProperty as IReadOnlyProperty<boolean>,
      GreenhouseEffectConstants.INFRARED_WAVELENGTH,
      waveStartAltitude,
      waveEndAltitude,
      [

        // leftmost waves
        new WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.32,
          -LayersModel.SUNLIGHT_SPAN * 0.27,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.08 )
        ),

        // center-ish waves
        new WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.1,
          -LayersModel.SUNLIGHT_SPAN * 0.05,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( -Math.PI * 0.1 )
        ),

        // rightmost waves
        new WaveSourceSpec(
          LayersModel.SUNLIGHT_SPAN * 0.46,
          LayersModel.SUNLIGHT_SPAN * 0.49,
          GreenhouseEffectConstants.STRAIGHT_UP_NORMALIZED_VECTOR.rotated( Math.PI * 0.075 )
        )
      ],
      options
    );
  }
}

greenhouseEffect.register( 'GroundWaveSource', GroundWaveSource );
export default GroundWaveSource;