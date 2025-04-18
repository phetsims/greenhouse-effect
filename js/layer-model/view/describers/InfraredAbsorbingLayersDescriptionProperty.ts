// Copyright 2023-2025, University of Colorado Boulder

/**
 * InfraredAbsorbingLayersDescriptionProperty is a Property<string> that describes the current number of the IR-
 * absorbing layers in the atmosphere.  For example, one possible value is "2 infrared absorbing layers in atmosphere".
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import greenhouseEffect from '../../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';

class InfraredAbsorbingLayersDescriptionProperty extends StringProperty {
  public constructor( numberOfActiveAtmosphereLayersProperty: TRangedProperty ) {
    super( '' );

    // Monitor the intensity Property and update the value of the string.
    Multilink.multilink( [ numberOfActiveAtmosphereLayersProperty ], numberOfActiveAtmosphereLayers => {

        // parameter checking
        assert && assert(
          numberOfActiveAtmosphereLayers >= 0,
          `numberOfActiveAtmosphereLayers must be positive, got ${numberOfActiveAtmosphereLayers}`
        );

        this.value = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.numberOfAbsorbingLayersPatternStringProperty,
          {
            number: numberOfActiveAtmosphereLayers > 0 ?
                    numberOfActiveAtmosphereLayers :
                    GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.noStringProperty, // say 'no' for zero
            s: numberOfActiveAtmosphereLayers === 1 ? '' : 's' // use plural except for a single layer
          }
        );
      }
    );
  }
}

greenhouseEffect.register( 'InfraredAbsorbingLayersDescriptionProperty', InfraredAbsorbingLayersDescriptionProperty );
export default InfraredAbsorbingLayersDescriptionProperty;