// Copyright 2023-2024, University of Colorado Boulder

/**
 * A derived property that describes the altitude of the flux meter's sensor in qualitative language.  This is intended
 * for use in conjunction with the description feature.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../../GreenhouseEffectFluent.js';
import LayersModel from '../../model/LayersModel.js';
import ValueToStringMapper from './ValueToStringMapper.js';

class FluxSensorAltitudeDescriptionProperty extends StringProperty {

  public constructor( altitudeProperty: TRangedProperty ) {

    const altitudeToStringMapper = new ValueToStringMapper(
      [
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.05,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.nearSurfaceStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.2,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.veryLowStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.4,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.lowStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.6,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.moderateStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.8,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.highStringProperty
        ],
        [
          altitudeProperty.rangeProperty.value.max,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.veryHighStringProperty
        ],
        [
          Number.MAX_VALUE,
          GreenhouseEffectFluent.a11y.qualitativeAltitudeDescriptions.topOfAtmosphereStringProperty
        ]
      ]
    );

    super( '' );

    // Monitor the altitude Property and update the value of the string.
    Multilink.multilink( [ altitudeProperty ],
      altitude => {
        this.value = altitudeToStringMapper.getStringForValue( altitude );
      }
    );
  }
}

greenhouseEffect.register( 'FluxSensorAltitudeDescriptionProperty', FluxSensorAltitudeDescriptionProperty );
export default FluxSensorAltitudeDescriptionProperty;