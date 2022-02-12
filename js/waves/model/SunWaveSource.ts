// Copyright 2021-2022, University of Colorado Boulder

/**
 * SunWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the sun.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource, { EMWaveSourceOptions } from '../../waves/model/EMWaveSource.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import LayersModel from '../../common/model/LayersModel.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Wave, { WaveOptions } from './Wave.js';
import Property from '../../../../axon/js/Property.js';
import WaveSourceSpec from './WaveSourceSpec.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class SunWaveSource extends EMWaveSource {

  /**
   * @param {PhetioGroup.<Wave>} wavesInModel
   * @param {Property.<boolean>} waveProductionEnabledProperty
   * @param {number} waveStartAltitude
   * @param {number} waveEndAltitude
   * @param [options]
   */
  constructor( wavesInModel: PhetioGroup<Wave, [ number, Vector2, Vector2, number, WaveOptions ]>,
               waveProductionEnabledProperty: Property<boolean>,
               waveStartAltitude: number,
               waveEndAltitude: number,
               options?: Partial<EMWaveSourceOptions> ) {

    options = merge( {

      // The sun generally just shines with a fixed intensity.
      waveIntensityProperty: new NumberProperty( 0.5 )
    }, options );

    super(
      wavesInModel,
      waveProductionEnabledProperty,
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      waveStartAltitude,
      waveEndAltitude,
      [

        // leftmost waves
        new WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.23,
          -LayersModel.SUNLIGHT_SPAN * 0.15,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        ),

        // rightmost waves
        new WaveSourceSpec(
          LayersModel.SUNLIGHT_SPAN * 0.20,
          LayersModel.SUNLIGHT_SPAN * 0.25,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        )
      ],
      options
    );
  }
}

greenhouseEffect.register( 'SunWaveSource', SunWaveSource );
export default SunWaveSource;