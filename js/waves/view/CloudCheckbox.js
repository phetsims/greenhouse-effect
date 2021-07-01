// Copyright 2021, University of Colorado Boulder

/**
 * A checkbox that is linked to a count of the number of active clouds, and sets the number of clouds to either 0 or 1
 * based on the state of the checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';

class CloudCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {NumberProperty} numberOfActiveCloudsProperty - controls whether the cloud is visible by being set to zero or one
   * @param {Tandem} tandem
   */
  constructor( numberOfActiveCloudsProperty, tandem ) {

    // parameter checking
    assert && assert(
      numberOfActiveCloudsProperty.value === 0 || numberOfActiveCloudsProperty.value === 1,
      `numberOfActiveCloudsProperty has an unsupported initial value: ${numberOfActiveCloudsProperty.value}`
    );

    // temporary icon, something else will eventually be added
    const iconNode = new Rectangle( 0, 0, 15, 15, {
      fill: 'rgb(17,209,243)'
    } );

    // Create a local boolean property that will link to the number property and can be passed in to the Checkbox.
    const localBooleanProperty = new BooleanProperty( numberOfActiveCloudsProperty.value === 1 );

    // Link the local boolean to the number of active clouds.
    localBooleanProperty.lazyLink( value => {
      numberOfActiveCloudsProperty.set( value ? 1 : 0 );
    } );

    // We also need to link back the other direction to handle reset of the number of active clouds.  No unlink is
    // needed because this is never disposed.
    numberOfActiveCloudsProperty.lazyLink( numberOfActiveClouds => {
      localBooleanProperty.set( numberOfActiveClouds === 1 );
    } );

    super( greenhouseEffectStrings.cloud, localBooleanProperty, {
      iconNode: iconNode,
      helpText: greenhouseEffectStrings.a11y.cloudCheckboxHelpText,

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'CloudCheckbox', CloudCheckbox );
export default CloudCheckbox;
