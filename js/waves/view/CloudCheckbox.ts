// Copyright 2021, University of Colorado Boulder

/**
 * A checkbox that is linked to a count of the number of active clouds, and sets the number of clouds to either 0 or 1
 * based on the state of the checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import CloudNode from '../../common/view/CloudNode.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Shape from '../../../../kite/js/Shape.js';

// constants
const CLOUD_ICON_WIDTH = 40;

class CloudCheckbox extends GreenhouseEffectCheckbox {

  /**
   * @param {Property.<boolean>} cloudEnabledProperty - controls whether the cloud is visible
   * @param {Tandem} tandem
   */
  constructor( cloudEnabledProperty: Property<boolean>, tandem: Tandem ) {

    // Create a shape to use for the cloud icon.  The shape generation seems to only work well for some ratios of width
    // to height, so change with caution.
    const unscaledCloudShape: Shape = CloudNode.createCloudShape( Vector2.ZERO, 170, 50 );
    const cloudShapeScale: number = CLOUD_ICON_WIDTH / unscaledCloudShape.bounds.width;
    const scaledCloudShape: Shape = unscaledCloudShape.transformed( Matrix3.scale( cloudShapeScale, cloudShapeScale ) );
    const iconNode: Path = new Path( scaledCloudShape, {
      stroke: Color.BLACK,
      fill: Color.WHITE
    } );

    super( greenhouseEffectStrings.cloud, cloudEnabledProperty, {
      iconNode: iconNode,
      helpText: greenhouseEffectStrings.a11y.cloudCheckboxHelpText,

      // phet-io
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'CloudCheckbox', CloudCheckbox );
export default CloudCheckbox;