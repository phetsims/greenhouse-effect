// Copyright 2022-2025, University of Colorado Boulder

/**
 * A reusable checkbox that controls whether all simulated photons are shown in the view.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';

class MorePhotonsCheckbox extends GreenhouseEffectCheckbox {

  public constructor( property: Property<boolean>, tandem: Tandem ) {

    super( property, GreenhouseEffectStrings.morePhotonsStringProperty, {

      touchAreaXDilation: 5,
      touchAreaYDilation: 4,

      // pdom
      accessibleHelpText: GreenhouseEffectStrings.a11y.morePhotonsHelpTextStringProperty,
      accessibleContextResponseChecked: GreenhouseEffectStrings.a11y.morePhotonsCheckedAlertStringProperty,
      accessibleContextResponseUnchecked: GreenhouseEffectStrings.a11y.morePhotonsUncheckedAlertStringProperty,

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'MorePhotonsCheckbox', MorePhotonsCheckbox );
export default MorePhotonsCheckbox;