// Copyright 2022, University of Colorado Boulder

/**
 * ShowTemperatureCheckbox is a specialized checkbox with a thermometer icon and no label.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import { Color } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';

type SelfOptions = EmptySelfOptions;
export type ShowTemperatureCheckboxOptions = SelfOptions & CheckboxOptions;

class ShowTemperatureCheckbox extends Checkbox {
  public constructor( property: Property<boolean>, providedOptions?: ShowTemperatureCheckboxOptions ) {

    // Create a thermometer that can be used as an icon for the checkbox.
    const thermometerIcon = new ThermometerNode( new NumberProperty( 3.5 ), 0, 10, {
      backgroundFill: Color.WHITE,
      bulbDiameter: 8,
      tubeWidth: 5,
      tubeHeight: 12,
      lineWidth: 1,
      tickSpacing: 3,
      majorTickLength: 3,
      minorTickLength: 1.5,
      glassThickness: 2
    } );

    const options = optionize<ShowTemperatureCheckboxOptions, SelfOptions, CheckboxOptions>()( {

      boxWidth: 15,

      // phet-io
      tandem: Tandem.REQUIRED

    }, providedOptions );

    super( property, thermometerIcon, options );
  }
}

greenhouseEffect.register( 'ShowTemperatureCheckbox', ShowTemperatureCheckbox );
export default ShowTemperatureCheckbox;
