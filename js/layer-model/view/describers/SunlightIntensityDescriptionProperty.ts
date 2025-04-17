// Copyright 2023-2024, University of Colorado Boulder

/**
 * An observable string that will describe the value of sunlight intensity. This description is relative to
 * our sun, and will return something like
 *
 * "same as our sun" or
 * "50% of our sun"
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';

class SunlightIntensityDescriptionProperty extends StringProperty {
  public constructor( intensityProperty: TRangedProperty ) {
    super( '' );

    // Monitor the intensity Property and update the value of the string.
    Multilink.multilink( [ intensityProperty ], intensity => {
      const describedIntensityPercentage = Utils.toFixedNumber( intensity, 2 ) * 100;

      if ( describedIntensityPercentage === 100 ) {
        this.value = GreenhouseEffectStrings.a11y.layerModel.sameAsOurSunStringProperty.value;
      }
      else {
        this.value = StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.percentOfOurSunPatternStringProperty, {
          value: describedIntensityPercentage
        } );
      }
    } );
  }
}

greenhouseEffect.register( 'SunlightIntensityDescriptionProperty', SunlightIntensityDescriptionProperty );
export default SunlightIntensityDescriptionProperty;