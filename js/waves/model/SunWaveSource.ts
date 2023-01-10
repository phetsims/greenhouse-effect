// Copyright 2021-2023, University of Colorado Boulder

/**
 * SunWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the sun.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import LayersModel from '../../common/model/LayersModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource, { EMWaveSourceOptions } from '../../waves/model/EMWaveSource.js';
import Wave, { WaveCreatorArguments } from './Wave.js';
import WaveSourceSpec from './WaveSourceSpec.js';

type SelfOptions = EmptySelfOptions;
export type SunWaveSourceOptions = SelfOptions & EMWaveSourceOptions;

class SunWaveSource extends EMWaveSource {

  public constructor( wavesInModel: PhetioGroup<Wave, WaveCreatorArguments>,
                      waveProductionEnabledProperty: Property<boolean>,
                      waveStartAltitude: number,
                      waveEndAltitude: number,
                      providedOptions?: SunWaveSourceOptions ) {

    const options = optionize<SunWaveSourceOptions, SelfOptions, EMWaveSourceOptions>()( {

      // The sun generally just shines with a fixed intensity.
      waveIntensityProperty: new NumberProperty( 0.5 )

    }, providedOptions );

    super(
      wavesInModel,
      waveProductionEnabledProperty,
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      waveStartAltitude,
      waveEndAltitude,
      [

        // leftmost wave
        new WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN.width * 0.15,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        ),

        // rightmost wave
        new WaveSourceSpec(
          LayersModel.SUNLIGHT_SPAN.width * 0.20,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        )
      ],
      options
    );
  }
}

greenhouseEffect.register( 'SunWaveSource', SunWaveSource );
export default SunWaveSource;