// Copyright 2021, University of Colorado Boulder

/**
 * SunWaveSource acts as a source of the modeled electromagnetic (EM) waves produced by the sun.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import EMWaveSource from '../../waves/model/EMWaveSource.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import LayersModel from './LayersModel.js';

class SunWaveSource extends EMWaveSource {

  /**
   * TODO: docs
   * @param wavesInModel
   * @param waveProductionEnabledProperty
   * @param waveStartAltitude
   * @param waveEndAltitude
   * @param options
   */
  constructor( wavesInModel, waveProductionEnabledProperty, waveStartAltitude, waveEndAltitude, options ) {

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
        new EMWaveSource.WaveSourceSpec(
          -LayersModel.SUNLIGHT_SPAN * 0.23,
          -LayersModel.SUNLIGHT_SPAN * 0.15,
          GreenhouseEffectConstants.STRAIGHT_DOWN_NORMALIZED_VECTOR
        ),

        // rightmost waves
        new EMWaveSource.WaveSourceSpec(
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