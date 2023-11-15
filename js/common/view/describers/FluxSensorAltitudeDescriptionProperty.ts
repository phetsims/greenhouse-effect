// Copyright 2023, University of Colorado Boulder

/**
 * A derived property that describes the altitude of the flux meter's sensor in qualitative language.  This is intended
 * for use in conjunction with the description feature.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';
import LayersModel from '../../model/LayersModel.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import ValueToStringMapper from './ValueToStringMapper.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';

class FluxSensorAltitudeDescriptionProperty extends StringProperty {

  public constructor( altitudeProperty: TRangedProperty ) {

    const altitudeToStringMapper = new ValueToStringMapper(
      [
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.05,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.nearSurfaceStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.2,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.veryLowStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.4,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.lowStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.6,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.moderateStringProperty
        ],
        [
          LayersModel.HEIGHT_OF_ATMOSPHERE * 0.8,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.highStringProperty
        ],
        [
          altitudeProperty.rangeProperty.value.max,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.veryHighStringProperty
        ],
        [
          Number.MAX_VALUE,
          GreenhouseEffectStrings.a11y.qualitativeAltitudeDescriptions.topOfAtmosphereStringProperty
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
