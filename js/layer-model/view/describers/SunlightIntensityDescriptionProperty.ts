// Copyright 2021, University of Colorado Boulder

/**
 * An observable string that will describe the value of sunlight intensity. This description is relative to
 * our sun, and will return something like
 *
 * "same as our sun" or
 * "50% of our sun"
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
import greenhouseEffect from '../../../greenhouseEffect.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import Utils from '../../../../../dot/js/Utils.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';

class SunlightIntensityDescriptionProperty extends StringProperty {
  public constructor( intensityProperty: TRangedProperty ) {
    super( '' );

    // Monitor the intensity Property and update the value of the string.
    Multilink.multilink( [ intensityProperty ], intensity => {
      const describedIntensityPercentage = Utils.toFixedNumber( intensity, 2 ) * 100;

      if ( describedIntensityPercentage === 100 ) {
        this.value = 'same as our sun';
      }
      else {
        this.value = `${describedIntensityPercentage}% of our sun`;
      }
    } );
  }
}

greenhouseEffect.register( 'SunlightIntensityDescriptionProperty', SunlightIntensityDescriptionProperty );
export default SunlightIntensityDescriptionProperty;