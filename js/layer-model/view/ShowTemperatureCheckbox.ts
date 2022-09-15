// Copyright 2022, University of Colorado Boulder

/**
 * ShowTemperatureCheckbox is a specialized checkbox with a thermometer icon and no label.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';

type SelfOptions = EmptySelfOptions;
export type ShowTemperatureCheckboxOptions = SelfOptions & CheckboxOptions;

class ShowTemperatureCheckbox extends Checkbox {
  public constructor( property: Property<boolean>, providedOptions?: ShowTemperatureCheckboxOptions ) {

    const options = optionize<ShowTemperatureCheckboxOptions, SelfOptions, CheckboxOptions>()( {

      boxWidth: 15,

      // i18n
      maxWidth: 250,

      // phet-io
      tandem: Tandem.REQUIRED

    }, providedOptions );


    const checkboxContent = new Rectangle( 0, 0, 12, 20, { fill: 'red' } );

    super( property, checkboxContent, options );
  }
}

greenhouseEffect.register( 'ShowTemperatureCheckbox', ShowTemperatureCheckbox );
export default ShowTemperatureCheckbox;
